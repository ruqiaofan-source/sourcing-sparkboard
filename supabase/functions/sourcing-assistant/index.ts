import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert sourcing advisor for Equilinq, a European sourcing platform that helps SMEs procure products from China.

When a user describes what they want to source, you must:
1. Suggest a clear, concise product title
2. Write a detailed product description covering materials, sizes, specifications, certifications, and finish
3. Recommend a realistic quantity range for first orders (Equilinq supports from 10 units)
4. Estimate a budget per unit in EUR based on typical China factory pricing
5. Suggest whether eco-friendly options apply (none, preferred, required, certified_only)
6. Provide 2-3 brief sourcing tips specific to this product category

Be practical, specific, and encouraging. Use your knowledge of Chinese manufacturing capabilities and pricing.
If the user's description is vague, make reasonable assumptions and note them.
Always give actionable, realistic suggestions - not generic advice.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth check ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    // --- End auth check ---

    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message too long (max 2000 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate conversationHistory
    const safeHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .filter(
            (m: { role?: string; content?: string }) =>
              m &&
              typeof m.role === "string" &&
              typeof m.content === "string" &&
              ["user", "assistant"].includes(m.role) &&
              m.content.length <= 2000
          )
          .slice(-10)
      : [];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...safeHistory,
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "sourcing_suggestion",
              description:
                "Return a structured sourcing suggestion based on the user's product description.",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Short, clear product title (e.g. 'Custom Printed Cotton Tote Bags')",
                  },
                  description: {
                    type: "string",
                    description:
                      "Detailed product description including materials, dimensions, certifications, colors, finishing",
                  },
                  quantity_min: {
                    type: "number",
                    description: "Recommended minimum order quantity",
                  },
                  quantity_recommended: {
                    type: "number",
                    description: "Recommended quantity for a first test order",
                  },
                  budget_per_unit_eur: {
                    type: "number",
                    description: "Estimated budget per unit in EUR",
                  },
                  eco_friendly: {
                    type: "string",
                    enum: ["none", "preferred", "required", "certified_only"],
                    description: "Recommended eco-friendly preference",
                  },
                  tips: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-3 actionable sourcing tips for this product",
                  },
                  reasoning: {
                    type: "string",
                    description:
                      "Brief explanation of why you suggested these values, in a friendly conversational tone",
                  },
                },
                required: [
                  "title",
                  "description",
                  "quantity_min",
                  "quantity_recommended",
                  "budget_per_unit_eur",
                  "eco_friendly",
                  "tips",
                  "reasoning",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "sourcing_suggestion" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      const content = data.choices?.[0]?.message?.content || "I couldn't generate suggestions. Please try again.";
      return new Response(
        JSON.stringify({ type: "text", content }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const suggestion = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ type: "suggestion", suggestion }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("sourcing-assistant error:", e);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
