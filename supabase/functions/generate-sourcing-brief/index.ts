import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { request_id } = await req.json();
    if (!request_id) throw new Error("request_id required");

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify auth
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const allowed = (roles || []).some((r: any) => r.role === "agent" || r.role === "admin");
    if (!allowed) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: request, error: rErr } = await supabase
      .from("sourcing_requests")
      .select("*, profiles!sourcing_requests_user_id_profiles_fkey(display_name, full_name, area_of_residence)")
      .eq("id", request_id)
      .single();
    if (rErr) throw rErr;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const systemPrompt = `You are a senior sourcing specialist at Equilinq, a European sourcing platform. Generate a clear, professional sourcing brief in English to send to our China sourcing team. The brief must be factual, structured, and actionable for factory outreach. Use clear headings and bullets. Do not invent specifications not present in the input. Suggest sensible questions to ask factories.`;

    const userPrompt = `Generate a sourcing brief PDF content for our China team based on this customer request.

Title: ${request.title}
Description: ${request.description || "n/a"}
Quantity: ${request.quantity || "n/a"}
Target unit budget: ${request.budget_per_unit || "n/a"} ${request.currency || ""}
Eco-friendly required: ${request.eco_friendly ? "Yes" : "No"}
Delivery country: ${request.delivery_country || "n/a"}
Service add-ons: ${(request.service_addons || []).join(", ") || "none"}
Customer area: ${(request as any).profiles?.area_of_residence || "n/a"}

Return JSON with these fields:
{
  "summary": "2-3 sentence overview",
  "product_specs": ["bullet", "..."],
  "quantity_moq": "string",
  "target_pricing": "string",
  "packaging_branding": "string",
  "quality_compliance": ["bullet", "..."],
  "logistics": "string",
  "questions_for_factory": ["question", "..."],
  "internal_notes": "string"
}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI error", aiResp.status, t);
      if (aiResp.status === 429) return new Response(JSON.stringify({ error: "Rate limit reached, try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiResp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const aiJson = await aiResp.json();
    const content = aiJson.choices?.[0]?.message?.content || "{}";
    let brief: any = {};
    try { brief = JSON.parse(content); } catch { brief = { summary: content }; }

    return new Response(
      JSON.stringify({
        brief,
        request: {
          id: request.id,
          title: request.title,
          quantity: request.quantity,
          currency: request.currency,
          budget_per_unit: request.budget_per_unit,
          delivery_country: request.delivery_country,
          eco_friendly: request.eco_friendly,
          created_at: request.created_at,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("generate-sourcing-brief error", e);
    return new Response(JSON.stringify({ error: e.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});