import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "send_request_message",
  title: "Send message on a sourcing request",
  description: "Post a chat message to the sourcing agent on one of the signed-in user's sourcing requests.",
  inputSchema: {
    request_id: z.string().describe("The sourcing request id (uuid)."),
    content: z.string().describe("Message body to send."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ request_id, content }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const body = content.trim();
    if (!body) return { content: [{ type: "text", text: "Message content is empty" }], isError: true };
    const { data, error } = await supabaseForUser(ctx)
      .from("messages")
      .insert({ sourcing_request_id: request_id, sender_id: ctx.getUserId(), content: body })
      .select("id,created_at")
      .maybeSingle();
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { message: data } };
  },
});
