import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import RequestChat from "@/components/RequestChat";

const Messages = () => {
  const { user } = useAuth();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Get all requests with their latest message
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["customer-conversations", user?.id],
    queryFn: async () => {
      // Get all customer requests
      const { data: requests, error } = await supabase
        .from("sourcing_requests")
        .select("id, title, status, created_at")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;

      // For each, get message count and latest message
      const withMessages = await Promise.all(
        (requests || []).map(async (r) => {
          const { data: msgs } = await supabase
            .from("messages" as any)
            .select("content, created_at, sender_id")
            .eq("sourcing_request_id", r.id)
            .order("created_at", { ascending: false })
            .limit(1) as any;
          const { count } = await supabase
            .from("messages" as any)
            .select("*", { count: "exact", head: true })
            .eq("sourcing_request_id", r.id) as any;
          return {
            ...r,
            messageCount: count || 0,
            lastMessage: msgs?.[0] || null,
          };
        })
      );

      // Sort: requests with messages first, then by latest message time
      return withMessages.sort((a, b) => {
        if (a.messageCount > 0 && b.messageCount === 0) return -1;
        if (a.messageCount === 0 && b.messageCount > 0) return 1;
        const aTime = a.lastMessage?.created_at || a.created_at;
        const bTime = b.lastMessage?.created_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
    },
    enabled: !!user,
  });

  const selectedConv = conversations.find((c) => c.id === selectedRequestId);

  return (
    <DashboardLayout title="Messages">
      <div className="space-y-1">
        <h1 className="font-heading text-xl font-bold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground">Chat with your sourcing agents about your requests</p>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[500px]">
        {/* Conversation list */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-card-foreground">Conversations</p>
          </div>
          <div className="divide-y divide-border/50 max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground mt-1">Submit a sourcing request to start chatting with an agent</p>
                <Link to="/new-request" className="text-xs text-primary hover:underline mt-3 inline-block">
                  Create a request →
                </Link>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedRequestId(conv.id)}
                  className={`w-full text-left px-4 py-3.5 transition-colors hover:bg-muted/30 ${
                    selectedRequestId === conv.id ? "bg-primary/[0.06] border-l-2 border-l-primary" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium truncate ${
                      selectedRequestId === conv.id ? "text-primary" : "text-card-foreground"
                    }`}>
                      {conv.title}
                    </p>
                    {conv.messageCount > 0 && (
                      <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary">
                        {conv.messageCount}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage ? (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {conv.lastMessage.sender_id === user?.id ? "You: " : "Agent: "}
                      {conv.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground/50 mt-1 italic">No messages yet. Say hello!</p>
                  )}
                  <p className="text-[10px] text-muted-foreground/50 mt-1">
                    {conv.lastMessage
                      ? new Date(conv.lastMessage.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : ""}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className="lg:col-span-2">
          {selectedRequestId && selectedConv ? (
            <motion.div key={selectedRequestId} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedConv.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Status: {selectedConv.status} · <Link to={`/sourcing-requests/${selectedConv.id}`} className="text-primary hover:underline">View request details →</Link>
                  </p>
                </div>
              </div>
              <RequestChat requestId={selectedRequestId} isCustomer={true} />
            </motion.div>
          ) : (
            <div className="rounded-xl border border-border bg-card flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a conversation</p>
                <p className="text-xs text-muted-foreground mt-1">Choose a request from the left to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
