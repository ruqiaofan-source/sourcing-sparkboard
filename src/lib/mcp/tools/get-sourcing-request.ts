import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_sourcing_request",
  title: "Get sourcing request",
  description: "Get one sourcing request with its quotes and recent messages.",
  inputSchema: { request_id: z.string().describe("The sourcing request id (uuid).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ request_id }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data: request, error } = await supabase
      .from("sourcing_requests")
      .select("*")
      .eq("id", request_id)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!request) return { content: [{ type: "text", text: "Request not found or not accessible" }], isError: true };

    const [{ data: quotes }, { data: messages }] = await Promise.all([
      supabase
        .from("quotes")
        .select("id,factory_name,total_cost,currency,moq,delivery_time_days,status,created_at")
        .eq("sourcing_request_id", request_id)
        .order("created_at", { ascending: false }),
      supabase
        .from("messages")
        .select("id,content,sender_id,message_type,created_at")
        .eq("sourcing_request_id", request_id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    const payload = { request, quotes: quotes ?? [], recent_messages: messages ?? [] };
    return { content: [{ type: "text", text: JSON.stringify(payload) }], structuredContent: payload };
  },
});
