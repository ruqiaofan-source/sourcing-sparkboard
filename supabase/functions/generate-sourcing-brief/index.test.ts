import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";

// Regression test: ensures the protein shaker translation prompt yields the
// expected Chinese term "蛋白粉摇摇杯 (Protein Shakers)" and never produces
// the previously-seen incorrect/inappropriate translation.

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

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

Title (原文,请勿改写含义): Branded Protein Shakers (Bottles)
Description (原文,请勿改写含义): 500ml BPA-free protein shaker bottles with custom logo printing for a fitness brand. Leak-proof lid, mixing ball included.
Quantity: 500
Target unit budget: 2.5 EUR
Eco-friendly required: No
Delivery country: Germany
Service add-ons: none
Customer area: EU

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

// Forbidden substrings: any of these in the output indicates a regression to
// the previous mistranslation (adult/masturbation device).
const FORBIDDEN = ["飞机杯", "自慰", "成人用品", "情趣"];

Deno.test({
  name: "protein shaker translation contains 蛋白粉摇摇杯 and avoids inappropriate terms",
  ignore: !LOVABLE_API_KEY,
  async fn() {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    assert(resp.ok, `AI gateway returned ${resp.status}`);
    const json = await resp.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    assert(content.length > 0, "Empty AI response");

    // Expected canonical bilingual term
    assertStringIncludes(content, "蛋白粉摇摇杯");
    // Must include the English original somewhere (case-insensitive)
    assert(
      /protein\s*shaker/i.test(content),
      "Output missing English original 'Protein Shakers'",
    );

    for (const bad of FORBIDDEN) {
      assert(
        !content.includes(bad),
        `Output contains forbidden term: ${bad}`,
      );
    }
  },
});