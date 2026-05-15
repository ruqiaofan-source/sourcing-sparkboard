import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

const SOURCES = [
  {
    name: "TikTok Shop",
    url: "https://shop.tiktok.com/trending",
    searchQuery: "best selling products TikTok Shop Europe 2025",
  },
  {
    name: "Amazon Movers & Shakers",
    url: "https://www.amazon.com/gp/movers-and-shakers",
    searchQuery: "Amazon best sellers new trending products Europe 2025",
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL_AUTH = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY_AUTH = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    // Auth: only the service role (pg_cron) or an admin user may trigger this.
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const isServiceRole = !!token && token === SUPABASE_SERVICE_ROLE_KEY_AUTH;
    if (!isServiceRole) {
      const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(SUPABASE_URL_AUTH, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userRes } = await userClient.auth.getUser();
      if (!userRes?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const adminProbe = createClient(SUPABASE_URL_AUTH, SUPABASE_SERVICE_ROLE_KEY_AUTH);
      const { data: roles } = await adminProbe
        .from("user_roles").select("role").eq("user_id", userRes.user.id);
      if (!(roles ?? []).some((r: { role: string }) => r.role === "admin")) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) {
      throw new Error("FIRECRAWL_API_KEY is not configured");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Use Firecrawl search to find trending products from multiple sources
    const allSearchResults: string[] = [];

    for (const source of SOURCES) {
      try {
        const searchRes = await fetch(`${FIRECRAWL_V2}/search`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: source.searchQuery,
            limit: 5,
            scrapeOptions: { formats: ["markdown"] },
          }),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          console.log(`Firecrawl response keys for ${source.name}:`, Object.keys(searchData));
          // Firecrawl v2 search returns results under "data" (array) or sometimes "web"
          const results = Array.isArray(searchData.data)
            ? searchData.data
            : Array.isArray(searchData.data?.web)
            ? searchData.data.web
            : Array.isArray(searchData.data?.results)
            ? searchData.data.results
            : [];
          for (const r of results as any[]) {
            if (r && r.markdown) {
              allSearchResults.push(
                `Source: ${source.name}\nURL: ${r.url}\n${r.markdown.substring(0, 2000)}`
              );
            } else if (r && (r.title || r.description)) {
              allSearchResults.push(
                `Source: ${source.name}\nURL: ${r.url || ""}\nTitle: ${r.title || ""}\n${r.description || ""}`
              );
            }
          }
        } else {
          const errText = await searchRes.text();
          console.error(`Firecrawl search failed for ${source.name}: ${searchRes.status} ${errText}`);
        }
      } catch (err) {
        console.error(`Error scraping ${source.name}: ${err}`);
      }
    }

    if (allSearchResults.length === 0) {
      return new Response(
        JSON.stringify({ error: "Could not fetch trending data from any source." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Use AI to extract top 10 trending products from the scraped data
    const aiPrompt = `You are an expert e-commerce analyst. Based on the following scraped data from trending product pages, extract the top 10 best-selling/trending products that would be relevant for European SMEs to source from China.

For each product, provide:
- name: Clear product name
- slug: URL-friendly lowercase slug (e.g. "portable-mini-projector")
- source: Where it's trending (TikTok Shop, Amazon, etc.)
- source_url: URL if available, otherwise null
- category: Product category
- price_range: Estimated retail price range in EUR
- trend_score: 1-10 popularity score (10 = hottest)
- description: 2-3 sentence description of why it's trending and sourcing potential
- detailed_analysis: An object with these fields:
  - why_trending: 2-3 sentences explaining the trend drivers (social media virality, seasonal demand, etc.)
  - target_audience: Who buys this product (age, interests, demographics)
  - profit_potential: Brief assessment of margins and pricing strategy for resellers
  - sourcing_tip: Practical advice for sourcing this from China (MOQ expectations, factory type, material notes)
  - competition_level: "Low", "Medium", or "High" with a brief explanation
  - recommended_platforms: Array of 2-3 best sales channels (e.g. ["TikTok Shop", "Shopify", "Amazon"])
  - estimated_moq: Estimated minimum order quantity range (e.g. "50-200 units")
  - seasonality: Whether this is seasonal or evergreen, and peak months if seasonal

Focus on products that:
1. Can be manufactured/sourced from China
2. Have low-to-medium MOQ potential
3. Are relevant for European markets
4. Have good profit margins for small sellers

Scraped data:
${allSearchResults.join("\n\n---\n\n")}`;

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You extract structured product data from web scraping results. Always return data via the tool call." },
            { role: "user", content: aiPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "save_trending_products",
                description: "Save the top 10 trending products",
                parameters: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          slug: { type: "string" },
                          source: { type: "string" },
                          source_url: { type: "string" },
                          category: { type: "string" },
                          price_range: { type: "string" },
                          trend_score: { type: "number" },
                          description: { type: "string" },
                          detailed_analysis: {
                            type: "object",
                            properties: {
                              why_trending: { type: "string" },
                              target_audience: { type: "string" },
                              profit_potential: { type: "string" },
                              sourcing_tip: { type: "string" },
                              competition_level: { type: "string" },
                              recommended_platforms: { type: "array", items: { type: "string" } },
                              estimated_moq: { type: "string" },
                              seasonality: { type: "string" },
                            },
                          },
                        },
                        required: ["name", "slug", "source", "category", "price_range", "trend_score", "description", "detailed_analysis"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["products"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "save_trending_products" } },
        }),
      }
    );

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", aiResponse.status);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("AI did not return structured product data");
    }

    const { products } = JSON.parse(toolCall.function.arguments);

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("No products extracted from AI response");
    }

    // Step 3: Deactivate old trending products and insert new ones
    await supabase
      .from("trending_products")
      .update({ is_active: false })
      .eq("is_active", true);

    const rows = products.slice(0, 10).map((p: any) => ({
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      source: p.source || "Web",
      source_url: p.source_url || null,
      category: p.category || "General",
      price_range: p.price_range || "N/A",
      trend_score: Math.min(10, Math.max(1, p.trend_score || 5)),
      description: p.description || "",
      detailed_analysis: p.detailed_analysis || {},
      is_active: true,
      scraped_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("trending_products")
      .insert(rows);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save trending products");
    }

    return new Response(
      JSON.stringify({ success: true, count: rows.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("fetch-trending-products error:", e);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});