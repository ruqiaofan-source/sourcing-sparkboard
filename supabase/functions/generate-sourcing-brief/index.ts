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

    const systemPrompt = `你是 Equilinq(欧洲采购平台)的资深采购专家,精通中英文产品术语翻译。你的任务是用简体中文生成一份清晰、专业、可直接发送给中国采购/工厂团队的采购简报。

翻译规则(非常重要,必须严格遵守):
1. 必须准确翻译客户原文中的产品名称和用途。绝对不要望文生义、不要根据词形猜测、不要使用任何带有性暗示或不当含义的词汇。
2. 对每一个产品名词,首次出现时必须采用"中文译名(English original)"的格式,例如:蛋白粉摇摇杯(protein shaker)、硅胶模具(silicone mold)。
3. 如果你对某个英文术语的中文译法不完全确定,请保留英文原文,并加注"(暂未翻译,待人工确认)",而不是猜测。
4. 常见易错词参考:
   - protein shaker = 蛋白粉摇摇杯 / 健身摇杯(绝不是任何成人用品)
   - bottle = 瓶子;tumbler = 随行杯;flask = 保温瓶
   - massager(电器/按摩器)请始终默认理解为"颈部/背部按摩器"等正经按摩器具,除非客户明确说明其他用途
5. 内容必须忠于客户原始描述,不得编造规格、材质、认证等信息。
6. 所有字段使用简体中文(术语保留英文原文)。结构清晰,使用要点列表。给出合理的、向工厂询问的问题清单。`;

    const userPrompt = `请根据以下客户需求生成一份发给中国团队的采购简报内容。务必保留产品英文原名以避免歧义。

Title (原文,请勿改写含义): ${request.title}
Description (原文,请勿改写含义): ${request.description || "n/a"}
Quantity: ${request.quantity || "n/a"}
Target unit budget: ${request.budget_per_unit || "n/a"} ${request.currency || ""}
Eco-friendly required: ${request.eco_friendly ? "Yes" : "No"}
Delivery country: ${request.delivery_country || "n/a"}
Service add-ons: ${(request.service_addons || []).join(", ") || "none"}
Customer area: ${(request as any).profiles?.area_of_residence || "n/a"}

请返回 JSON,字段如下(所有值使用简体中文):
{
  "summary": "2-3 句简介",
  "product_specs": ["要点", "..."],
  "quantity_moq": "字符串",
  "target_pricing": "字符串",
  "packaging_branding": "字符串",
  "quality_compliance": ["要点", "..."],
  "logistics": "字符串",
  "questions_for_factory": ["问题", "..."],
  "internal_notes": "字符串"
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
          description: request.description,
          attachment_paths: request.attachment_paths || [],
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