import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SOURCING_SYSTEM_PROMPT = `You are a senior content strategist and market researcher for Equilinq, a European sourcing platform that helps SMEs procure products from China.

Your task: Write a professional, data-rich, and engaging insight article about a current best-selling or trending product category that European SMEs are sourcing from China RIGHT NOW.

RESEARCH & DATA REQUIREMENTS (critical - this is what sets our content apart):
- Include CONCRETE numbers throughout: market size (e.g. "$4.2 billion global market in 2025"), growth rates (e.g. "growing at 12.3% CAGR"), search volume trends, unit volumes sold.
- Reference specific data points: Amazon Best Seller rankings, Google Trends data, import/export statistics, industry report findings.
- Include realistic price breakdowns: factory FOB price ranges (e.g. "$1.20-$2.80/unit"), retail prices in Europe (e.g. "EUR 12.99-24.99"), margin potential as a percentage.
- Cite MOQ figures from real supplier ranges (e.g. "typical MOQ: 200-500 units for custom branding, 50-100 for stock items").
- Mention specific certifications or compliance standards with numbers (e.g. "CE marking required, EN 71 for toys, REACH compliance for chemicals").
- Include shipping cost estimates (e.g. "approximately $3.50-5.00/kg by sea, 25-35 days transit to Rotterdam").
- When discussing demand, use specifics: "averaging 45,000 monthly searches on Google EU" or "over 2 million units sold on Amazon DE in Q1 2025".

WRITING STYLE:
- Write for busy European business owners: clear, scannable, jargon-free.
- Lead with the most compelling statistic or data point.
- Every claim should be backed by a number or concrete reference.
- Keep sentences short and punchy. Avoid filler phrases.
- The tone should feel like a smart friend sharing insider market intelligence.

Requirements:
- Pick a SPECIFIC trending product (not generic). Examples: bamboo fiber towels, magnetic phone mounts, custom silicone kitchen utensils, biodegradable mailers, LED strip light controllers, etc.
- The article should educate European SME buyers on WHY this product is trending, market demand signals, sourcing considerations, quality benchmarks, and how Equilinq can help.
- Include practical sourcing advice: MOQ expectations, price ranges, key specs to request, common pitfalls.
- Content should be 1000-1400 words, well-structured with clear sections using ## headings.
- IMPORTANT: Each week must be a DIFFERENT product. Be creative and varied.
- Do NOT repeat products from recent weeks. Think seasonally and trend-aware.
- Do NOT use em dashes anywhere in the article.
- Use natural, keyword-rich language for SEO. Include the product name in the first paragraph.
- Include a "Market Snapshot" section with 4-6 key statistics as bullet points.
- Include a "Key Takeaways" section at the end with 3-4 bullet points, each containing at least one number.
- Naturally weave in phrases like "sourcing from China", "European SMEs", "quality control" for SEO value.

CRITICAL FORMATTING RULES (follow these exactly for consistent rendering):
- Use ## for all section headings (never # or ###).
- Use **bold** for emphasis, never ALL CAPS.
- Use bullet lists with - prefix. Never use numbered sub-lists inside bullet lists.
- Keep paragraphs to 2-4 sentences each.
- Separate every section with a blank line before and after the ## heading.
- Do NOT mix list styles within a section.
- Do NOT use tables - use bullet lists instead.
- Do NOT use inline HTML or special characters.
- Write clean, standard Markdown only.`;

const TIKTOK_SYSTEM_PROMPT = `You are a senior content strategist, trend researcher, and data analyst for Equilinq, a European sourcing platform that helps SMEs procure products from China.

Your task: Write a comprehensive, data-driven article about the TOP 10 BEST-SELLING PRODUCTS currently trending on TikTok Shop and TikTok-driven e-commerce, and analyze why each is trending.

RESEARCH & DATA REQUIREMENTS (critical - every product must have concrete data):
- For EACH of the 10 products, include at minimum:
  - Estimated units sold or revenue on TikTok (e.g. "over 500,000 units sold in the last 30 days")
  - TikTok view counts for the product hashtag (e.g. "#CloudSlides has 2.1 billion views")
  - Retail price range (e.g. "$14.99-$29.99")
  - Estimated factory/sourcing price from China (e.g. "$2.50-$5.00 FOB Shenzhen")
  - Margin potential as a percentage (e.g. "65-75% gross margin potential")
- Include overall TikTok commerce statistics in the intro (e.g. "TikTok Shop generated $33.2 billion in GMV in 2024, up 113% year-over-year").
- Reference Google Trends data, Amazon cross-selling data, or social commerce reports where relevant.
- Mention specific supplier regions in China for each product (e.g. "Yiwu for accessories, Shenzhen for electronics, Guangzhou for apparel").

WRITING STYLE:
- Write for busy European business owners: clear, scannable, jargon-free.
- Lead each product with its most impressive statistic.
- Every product entry should feel like actionable market intelligence, not just a description.
- Keep sentences short and punchy. Use numbers to create urgency and credibility.
- The tone should feel like a smart friend sharing insider market intelligence.

Requirements:
- Research and identify 10 specific products (not categories) that are currently viral or top-selling on TikTok.
- For EACH product, explain: what it is, why it is trending on TikTok, the target audience, estimated price range, sourcing price, and sourcing potential from China.
- Connect each product to a sourcing opportunity for European SMEs.
- Content should be 1400-2000 words, well-structured.
- Use ## for the main title of the list section, then use **Product Name** in bold as sub-items within a numbered list.
- IMPORTANT: Each week must feature DIFFERENT products. Do NOT repeat from recent weeks.
- Do NOT use em dashes anywhere in the article.
- Use natural, keyword-rich language for SEO. Include phrases like "TikTok trending products", "viral products", "sourcing from China", "European SMEs" in the first paragraph.
- Include a "TikTok Commerce by the Numbers" section with 4-6 platform-level statistics.
- Include a "Why This Matters for European Sellers" section explaining the TikTok-to-commerce pipeline with data.
- Include a "Key Takeaways" section at the end with 4-5 bullet points, each containing at least one number.
- Naturally weave in sourcing advice and Equilinq's value proposition.

CRITICAL FORMATTING RULES (follow these exactly for consistent rendering):
- Use ## for all section headings (never # or ###).
- Use **bold** for emphasis and product names, never ALL CAPS.
- Use numbered lists (1. 2. 3.) for the top 10 products.
- Use bullet lists with - prefix for details under each product.
- Keep paragraphs to 2-4 sentences each.
- Separate every section with a blank line before and after the ## heading.
- Do NOT mix list styles within a section.
- Do NOT use tables - use bullet lists instead.
- Do NOT use inline HTML or special characters.
- Write clean, standard Markdown only.`;

const LINKEDIN_SYSTEM_PROMPT = `You are a senior supply chain strategist and thought leader for Equilinq, a European sourcing platform helping SMEs source from China.

Your task: Write a professional, insightful thought-leadership article about a current supply chain topic relevant to European SMEs sourcing from China. This content style mirrors what performs well on LinkedIn for B2B audiences.

TOPIC CATEGORIES (rotate between these):
- Cross-border e-commerce trends and buyer behavior shifts
- Quality control challenges and solutions in China sourcing
- Communication gaps between European buyers and Chinese manufacturers
- Supply chain disruption and resilience strategies
- Regulatory changes affecting EU-China trade (tariffs, compliance, sustainability)
- Logistics optimization and cost reduction
- Cultural differences in business negotiations
- Factory verification and supplier relationship management
- Packaging, branding, and private label considerations
- Payment terms, financial risk, and trade finance

WRITING STYLE:
- Authoritative but accessible. Like a LinkedIn thought leader, not a textbook.
- Lead with a provocative statement, surprising statistic, or contrarian take.
- Use real-world examples and anecdotes where possible.
- Short paragraphs (2-3 sentences). Scannable with clear section breaks.
- Include actionable advice, not just observations.
- Reference specific data points, percentages, or case studies.
- The tone should challenge assumptions and provide genuine insight.

Requirements:
- Content should be 800-1200 words, well-structured with ## headings.
- Include a strong opening hook that would make someone stop scrolling.
- End with a clear, practical conclusion or call to reflection.
- Do NOT use em dashes anywhere.
- Use natural, keyword-rich language for SEO targeting "China sourcing", "European SME", "supply chain", etc.
- Include 3-5 concrete, actionable recommendations.

CRITICAL FORMATTING RULES:
- Use ## for all section headings (never # or ###).
- Use **bold** for emphasis, never ALL CAPS.
- Use bullet lists with - prefix for lists.
- Keep paragraphs to 2-3 sentences each.
- Separate every section with a blank line before and after the ## heading.
- Do NOT use tables, inline HTML, or special characters.
- Write clean, standard Markdown only.`;

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

    // Auth: only the service role (pg_cron) or an admin user may trigger this.
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const isServiceRole = !!token && token === SUPABASE_SERVICE_ROLE_KEY;
    if (!isServiceRole) {
      const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userRes } = await userClient.auth.getUser();
      if (!userRes?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const adminProbe = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { data: roles } = await adminProbe
        .from("user_roles").select("role").eq("user_id", userRes.user.id);
      if (!(roles ?? []).some((r: { role: string }) => r.role === "admin")) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Determine article type from request body
    let articleType = "sourcing"; // default Monday post
    try {
      const body = await req.json();
      if (body?.type === "tiktok") {
        articleType = "tiktok";
      } else if (body?.type === "linkedin") {
        articleType = "linkedin";
      }
    } catch {
      // No body or invalid JSON, default to sourcing
    }

    const isLinkedIn = articleType === "linkedin";
    const isTikTok = articleType === "tiktok";
    const systemPrompt = isLinkedIn ? LINKEDIN_SYSTEM_PROMPT : isTikTok ? TIKTOK_SYSTEM_PROMPT : SOURCING_SYSTEM_PROMPT;

    console.log(`Generating ${articleType} article...`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch recent article titles to avoid repeats
    const { data: recentArticles } = await supabase
      .from("insights")
      .select("title, tag")
      .order("created_at", { ascending: false })
      .limit(20);

    const recentTitles = (recentArticles || []).map((a: any) => a.title).join(", ");
    const avoidPrompt = recentTitles
      ? `\n\nIMPORTANT: Do NOT write about any of these recent topics: ${recentTitles}. Pick something completely different.`
      : "";

    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    const userMessage = isLinkedIn
      ? `Write a thought-leadership article about a current supply chain challenge or trend relevant to European SMEs sourcing from China in ${currentMonth} ${currentYear}. Lead with a provocative hook. Include concrete data, real examples, and actionable recommendations. The article should position Equilinq as an authority in EU-China sourcing.${avoidPrompt}`
      : isTikTok
      ? `Write this week's Top 10 TikTok Trending Products article for ${currentMonth} ${currentYear}. Research the most viral and best-selling products on TikTok right now. For each product, include concrete sales numbers, TikTok hashtag view counts, retail vs sourcing price comparison, and margin potential. Make every data point specific and credible.${avoidPrompt}`
      : `Write this week's trending product insight article for ${currentMonth} ${currentYear}. Include concrete market data: market size, growth rate, search volumes, FOB prices, retail prices, margin potential, MOQ ranges, and compliance requirements. Every claim needs a number. Consider seasonal demand, current e-commerce trends, and European market needs.${avoidPrompt}`;

    const defaultTag = isLinkedIn ? "Supply Chain" : isTikTok ? "trending" : "sourcing";

    // Step 1: Generate article content
    console.log("Generating article content...");
    const articleResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
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
                    description: "Article title, compelling and specific (50-80 chars). Do not use em dashes. Use colons or hyphens instead.",
                  },
                  excerpt: {
                    type: "string",
                    description: "1-2 sentence summary for article cards (120-160 chars). Include a compelling number or statistic.",
                  },
                  content: {
                    type: "string",
                    description: "Full article in clean Markdown format. Use ## for section headings only. 1000-2000 words. Must include concrete numbers and statistics throughout. End with a ## Key Takeaways section. No tables, no HTML, no ### headings.",
                  },
                  tag: {
                    type: "string",
                    description: "Article category tag",
                    enum: ["trending", "sourcing", "quality", "logistics", "sustainability", "market-analysis"],
                  },
                  meta_title: {
                    type: "string",
                    description: "SEO title under 60 chars with primary keyword. Format: 'Primary Keyword - Equilinq Insights'",
                  },
                  meta_description: {
                    type: "string",
                    description: "SEO meta description, 140-160 chars, includes primary keyword and a call-to-action or value prop.",
                  },
                  slug: {
                    type: "string",
                    description: "URL-safe slug (lowercase, hyphens only, no special chars, 3-6 words)",
                  },
                  cover_image_prompt: {
                    type: "string",
                    description: "A detailed prompt for generating a professional, editorial-quality cover image for this article. Describe the product in a clean, modern studio setting with soft lighting. Never include text in the image.",
                  },
                  seo_keywords: {
                    type: "string",
                    description: "5-8 comma-separated SEO keywords/phrases relevant to this article",
                  },
                },
                required: ["title", "excerpt", "content", "tag", "meta_title", "meta_description", "slug", "cover_image_prompt", "seo_keywords"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "publish_article" } },
      }),
    });

    if (!articleResponse.ok) {
      const errText = await articleResponse.text();
      console.error("AI gateway error:", articleResponse.status, errText);
      if (articleResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, will retry next week" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (articleResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway returned ${articleResponse.status}`);
    }

    const articleData = await articleResponse.json();
    const toolCall = articleData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI did not return structured article data");

    const article = JSON.parse(toolCall.function.arguments);
    console.log(`Article generated: "${article.title}"`);

    // Step 2: Generate cover image
    let coverImageUrl: string | null = null;
    try {
      console.log("Starting cover image generation...");
      console.log("Image prompt:", article.cover_image_prompt?.substring(0, 100));
      
      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: `Create a professional, editorial-quality product photograph. ${article.cover_image_prompt}. Style: clean modern studio photography, soft directional lighting, shallow depth of field, neutral or gradient background. No text, no logos, no watermarks. High-end commercial product photography aesthetic.`,
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      console.log("Image API response status:", imageResponse.status);

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        const base64Image = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        console.log("Got base64 image:", !!base64Image, "length:", base64Image?.length || 0);

        if (base64Image) {
          const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
          const imageBytes = base64ToUint8Array(base64Data);
          console.log("Decoded image bytes:", imageBytes.length);

          const dateSlug = now.toISOString().split("T")[0];
          const imagePath = `${article.slug}-${dateSlug}.png`;

          const { error: uploadError } = await supabase.storage
            .from("insight-covers")
            .upload(imagePath, imageBytes, {
              contentType: "image/png",
              upsert: true,
            });

          if (uploadError) {
            console.error("Image upload error:", JSON.stringify(uploadError));
          } else {
            const { data: publicUrlData } = supabase.storage
              .from("insight-covers")
              .getPublicUrl(imagePath);
            coverImageUrl = publicUrlData.publicUrl;
            console.log("Cover image uploaded:", coverImageUrl);
          }
        } else {
          console.log("No image in AI response. Full response keys:", JSON.stringify(Object.keys(imageData)));
        }
      } else {
        const errBody = await imageResponse.text();
        console.error("Image generation failed:", imageResponse.status, errBody.substring(0, 300));
      }
    } catch (imgErr) {
      console.error("Image generation error (non-fatal):", String(imgErr));
    }

    // Step 3: Insert article
    const dateSlug = now.toISOString().split("T")[0];
    const uniqueSlug = `${article.slug}-${dateSlug}`;

    const { data: inserted, error: insertError } = await supabase.from("insights").insert({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      tag: article.tag || defaultTag,
      slug: uniqueSlug,
      meta_title: article.meta_title,
      meta_description: article.meta_description,
      author_name: "Equilinq Editorial",
      published: true,
      published_at: now.toISOString(),
      cover_image_url: coverImageUrl,
    }).select("id, title, slug, cover_image_url").single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`Failed to insert article: ${insertError.message}`);
    }

    console.log(`Published ${articleType} article: "${inserted.title}" (${inserted.slug}) with cover: ${!!inserted.cover_image_url}`);

    return new Response(
      JSON.stringify({ success: true, type: articleType, article: inserted }),
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
