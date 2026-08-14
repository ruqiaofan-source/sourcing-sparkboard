import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_sourcing_request",
  title: "Create sourcing request",
  description: "Submit a new sourcing request for the signed-in user.",
  inputSchema: {
    title: z.string().describe("Short product title."),
    description: z.string().describe("Detailed product specification and requirements."),
    quantity: z.number().int().describe("Units required."),
    budget_per_unit: z.number().optional().describe("Target price per unit."),
    currency: z.string().optional().describe("Currency code, e.g. EUR or USD. Defaults to EUR."),
    delivery_country: z.string().optional().describe("Destination country."),
    delivery_address: z.string().optional().describe("Destination address."),
    eco_friendly: z.string().optional().describe("Eco-friendly preference, e.g. yes / no / preferred."),
    notes: z.string().optional().describe("Any extra notes for the sourcing agent."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await supabaseForUser(ctx)
      .from("sourcing_requests")
      .insert({
        user_id: ctx.getUserId(),
        title: input.title,
        description: input.description,
        quantity: input.quantity,
        budget_per_unit: input.budget_per_unit ?? 0,
        currency: input.currency ?? "EUR",
        delivery_country: input.delivery_country ?? "",
        delivery_address: input.delivery_address ?? "",
        eco_friendly: input.eco_friendly ?? null,
        notes: input.notes ?? null,
      })
      .select("id,title,status,created_at")
      .maybeSingle();
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { request: data } };
  },
});
