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

const SYSTEM_PROMPT = `You are a senior content strategist for Equilinq, a European sourcing platform that helps SMEs procure products from China.

Your task: Write a professional, engaging insight article about a current best-selling or trending product category that European SMEs are sourcing from China RIGHT NOW.

Requirements:
- Pick a SPECIFIC trending product (not generic). Examples: bamboo fiber towels, magnetic phone mounts, custom silicone kitchen utensils, biodegradable mailers, LED strip light controllers, etc.
- The article should educate European SME buyers on WHY this product is trending, market demand signals, sourcing considerations, quality benchmarks, and how Equilinq can help.
- Write in a confident editorial tone - informative but not salesy.
- Include practical sourcing advice: MOQ expectations, price ranges, key specs to request, common pitfalls.
- Content should be 800-1200 words, well-structured with clear sections using ## headings.
- IMPORTANT: Each week must be a DIFFERENT product. Be creative and varied.
- Do NOT repeat products from recent weeks. Think seasonally and trend-aware.
- Do NOT use em dashes anywhere in the article.
- Use natural, keyword-rich language for SEO. Include the product name in the first paragraph.
- Include a "Key Takeaways" section at the end with 3-4 bullet points.
- Naturally weave in phrases like "sourcing from China", "European SMEs", "quality control" for SEO value.`;

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
      .limit(20);

    const recentTitles = (recentArticles || []).map((a: any) => a.title).join(", ");
    const avoidPrompt = recentTitles
      ? `\n\nIMPORTANT: Do NOT write about any of these recent topics: ${recentTitles}. Pick something completely different.`
      : "";

    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    // Step 1: Generate article content
    console.log("Generating article content...");
    const articleResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
                    description: "Article title, compelling and specific (50-80 chars). Do not use em dashes. Use colons or hyphens instead.",
                  },
                  excerpt: {
                    type: "string",
                    description: "1-2 sentence summary for article cards (120-160 chars). Include the main keyword naturally.",
                  },
                  content: {
                    type: "string",
                    description: "Full article in Markdown format. Use ## for section headings. 800-1200 words. End with a ## Key Takeaways section.",
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
          model: "google/gemini-3-pro-image-preview",
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
      tag: article.tag,
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

    console.log(`Published article: "${inserted.title}" (${inserted.slug}) with cover: ${!!inserted.cover_image_url}`);

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
