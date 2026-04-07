import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TRUSTPILOT_URL = "https://www.trustpilot.com/review/equilinq.eu";

    console.log("Fetching Trustpilot page...");
    const response = await fetch(TRUSTPILOT_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Trustpilot: ${response.status}`);
    }

    const html = await response.text();

    // Extract review count from the page
    // Trustpilot shows review count in various patterns
    let reviewCount: number | null = null;
    let averageRating: number | null = null;

    // Try JSON-LD structured data first (most reliable)
    const jsonLdMatch = html.match(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    );
    if (jsonLdMatch) {
      for (const match of jsonLdMatch) {
        const jsonContent = match.replace(
          /<script[^>]*>|<\/script>/gi,
          ""
        );
        try {
          const data = JSON.parse(jsonContent);
          if (data.aggregateRating) {
            reviewCount = parseInt(data.aggregateRating.reviewCount, 10);
            averageRating = parseFloat(data.aggregateRating.ratingValue);
            console.log(
              `Found via JSON-LD: ${reviewCount} reviews, ${averageRating} rating`
            );
            break;
          }
          // Sometimes it's nested in @graph
          if (data["@graph"]) {
            for (const item of data["@graph"]) {
              if (item.aggregateRating) {
                reviewCount = parseInt(
                  item.aggregateRating.reviewCount,
                  10
                );
                averageRating = parseFloat(
                  item.aggregateRating.ratingValue
                );
                console.log(
                  `Found via JSON-LD @graph: ${reviewCount} reviews, ${averageRating} rating`
                );
                break;
              }
            }
          }
        } catch {
          // not valid JSON, skip
        }
      }
    }

    // Fallback: regex patterns from HTML content
    if (reviewCount === null) {
      // Pattern: "X total" or "X reviews"
      const countMatch = html.match(
        /(\d+)\s*(?:total|reviews?)\b/i
      );
      if (countMatch) {
        reviewCount = parseInt(countMatch[1], 10);
        console.log(`Found review count via regex: ${reviewCount}`);
      }
    }

    if (averageRating === null) {
      // Pattern: "TrustScore X.X" or rating value in meta/data attributes
      const ratingMatch = html.match(
        /TrustScore\s*(\d+(?:\.\d+)?)/i
      );
      if (ratingMatch) {
        averageRating = parseFloat(ratingMatch[1]);
        console.log(`Found rating via regex: ${averageRating}`);
      }
    }

    if (reviewCount === null || averageRating === null) {
      console.warn(
        `Could not parse Trustpilot data fully. Count: ${reviewCount}, Rating: ${averageRating}`
      );
      // Don't update DB if we couldn't parse
      if (reviewCount === null && averageRating === null) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Could not parse Trustpilot data",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Update the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (reviewCount !== null) updateData.review_count = reviewCount;
    if (averageRating !== null) updateData.average_rating = averageRating;

    const { error } = await supabase
      .from("trustpilot_stats")
      .update(updateData)
      .eq("id", 1);

    if (error) {
      throw new Error(`DB update failed: ${error.message}`);
    }

    console.log(
      `Trustpilot stats updated: ${reviewCount} reviews, ${averageRating} rating`
    );

    return new Response(
      JSON.stringify({
        success: true,
        review_count: reviewCount,
        average_rating: averageRating,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error syncing Trustpilot:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
