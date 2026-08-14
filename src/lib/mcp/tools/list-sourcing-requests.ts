import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_sourcing_requests",
  title: "List sourcing requests",
  description: "List the signed-in user's sourcing requests, newest first. Optionally filter by status.",
  inputSchema: {
    status: z.string().optional().describe("Filter by status, e.g. pending, quoted, accepted, completed."),
    limit: z.number().int().optional().describe("Maximum rows to return (default 20, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const take = Math.min(Math.max(limit ?? 20, 1), 100);
    let query = supabaseForUser(ctx)
      .from("sourcing_requests")
      .select("id,title,description,quantity,budget_per_unit,currency,status,delivery_country,eco_friendly,created_at")
      .order("created_at", { ascending: false })
      .limit(take);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { requests: data ?? [] } };
  },
});
