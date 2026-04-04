import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a senior content strategist for Equilinq, a European sourcing platform that helps SMEs procure products from China.

Your task: Write a professional, engaging insight article about a current best-selling or trending product category that European SMEs are sourcing from China RIGHT NOW.

Requirements:
- Pick a SPECIFIC trending product (not generic). Examples: bamboo fiber towels, magnetic phone mounts, custom silicone kitchen utensils, biodegradable mailers, LED strip light controllers, etc.
- The article should educate European SME buyers on WHY this product is trending, market demand signals, sourcing considerations, quality benchmarks, and how Equilinq can help.
- Write in a confident editorial tone - informative but not salesy.
- Include practical sourcing advice: MOQ expectations, price ranges, key specs to request, common pitfalls.
- Content should be 800-1200 words, well-structured with clear sections.
- IMPORTANT: Each week must be a DIFFERENT product. Be creative and varied.
- Do NOT repeat products from recent weeks. Think seasonally and trend-aware.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase env not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch recent article titles to avoid repeats
    const { data: recentArticles } = await supabase
      .from("insights")
      .select("title, tag")
      .order("created_at", { ascending: false })
      .limit(12);

    const recentTitles = (recentArticles || []).map((a: any) => a.title).join(", ");
    const avoidPrompt = recentTitles
      ? `\n\nIMPORTANT: Do NOT write about any of these recent topics: ${recentTitles}. Pick something completely different.`
      : "";

    // Get current month for seasonal relevance
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    // Generate article via structured tool calling
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Write this week's trending product insight article for ${currentMonth} ${currentYear}. Consider seasonal demand, current e-commerce trends, and European market needs.${avoidPrompt}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "publish_article",
              description: "Publish a new insight article to the Equilinq platform.",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Article title, compelling and specific (50-80 chars). Do not use em dashes.",
                  },
                  excerpt: {
                    type: "string",
                    description: "1-2 sentence summary for article cards (120-160 chars)",
                  },
                  content: {
                    type: "string",
                    description: "Full article in Markdown format. Use ## for section headings. 800-1200 words.",
                  },
                  tag: {
                    type: "string",
                    description: "Article category tag",
                    enum: ["trending", "sourcing", "quality", "logistics", "sustainability", "market-analysis"],
                  },
                  meta_title: {
                    type: "string",
                    description: "SEO title under 60 chars with primary keyword",
                  },
                  meta_description: {
                    type: "string",
                    description: "SEO meta description under 160 chars",
                  },
                  slug: {
                    type: "string",
                    description: "URL-safe slug (lowercase, hyphens only, no special chars)",
                  },
                },
                required: ["title", "excerpt", "content", "tag", "meta_title", "meta_description", "slug"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "publish_article" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, will retry next week" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("AI did not return structured article data");
    }

    const article = JSON.parse(toolCall.function.arguments);

    // Ensure slug uniqueness by appending date
    const dateSlug = now.toISOString().split("T")[0];
    const uniqueSlug = `${article.slug}-${dateSlug}`;

    // Insert into insights table
    const { data: inserted, error: insertError } = await supabase.from("insights").insert({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      tag: article.tag,
      slug: uniqueSlug,
      meta_title: article.meta_title,
      meta_description: article.meta_description,
      author_name: "Equilinq Editorial",
      published: true,
      published_at: now.toISOString(),
    }).select("id, title, slug").single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`Failed to insert article: ${insertError.message}`);
    }

    console.log(`Published article: "${inserted.title}" (${inserted.slug})`);

    return new Response(
      JSON.stringify({ success: true, article: inserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-weekly-insight error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
