import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, FileText, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import RequestChat from "@/components/RequestChat";

const AgentMessages = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    searchParams.get("request"),
  );

  useEffect(() => {
    if (!selectedRequestId) return;
    if (searchParams.get("request") !== selectedRequestId) {
      setSearchParams({ request: selectedRequestId }, { replace: true });
    }
  }, [selectedRequestId, searchParams, setSearchParams]);

  const { data: conversations = [], isLoading, refetch } = useQuery({
    queryKey: ["agent-conversations"],
    queryFn: async () => {
      const { data: requests, error } = await supabase
        .from("sourcing_requests")
        .select("id, title, status, created_at, updated_at, profiles!sourcing_requests_user_id_profiles_fkey(display_name)")
        .order("updated_at", { ascending: false });
      if (error) throw error;

      const [{ data: unreadRows }, { data: quoteRows }] = await Promise.all([
        supabase.rpc("get_unread_message_counts") as any,
        supabase
          .from("quotes")
          .select("id, sourcing_request_id, status")
          .in("sourcing_request_id", (requests || []).map((r: any) => r.id)),
      ]);
      const unreadMap = new Map<string, number>(
        ((unreadRows as any[]) || []).map((u) => [u.sourcing_request_id, Number(u.unread_count)])
      );
      const quoteMap = new Map<string, { id: string; status: string }>();
      ((quoteRows as any[]) || []).forEach((q) => {
        const existing = quoteMap.get(q.sourcing_request_id);
        if (!existing || q.status === "pending") quoteMap.set(q.sourcing_request_id, q);
      });

      const withMessages = await Promise.all(
        (requests || []).map(async (r) => {
          const { data: msgs } = await supabase
            .from("messages" as any)
            .select("content, created_at, sender_id")
            .eq("sourcing_request_id", r.id)
            .order("created_at", { ascending: false })
            .limit(1) as any;
          return {
            ...r,
            customerName: (r as any).profiles?.display_name || "Unknown",
            unreadCount: unreadMap.get(r.id) || 0,
            quote: quoteMap.get(r.id) || null,
            lastMessage: msgs?.[0] || null,
          };
        })
      );

      return withMessages.sort((a, b) => {
        if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
        if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
        const aTime = a.lastMessage?.created_at || a.created_at;
        const bTime = b.lastMessage?.created_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
    },
    enabled: !!user,
  });

  const selectedConv = conversations.find((c) => c.id === selectedRequestId);

  useEffect(() => {
    if (!selectedRequestId) return;
    supabase.rpc("mark_request_read", { _request_id: selectedRequestId }).then(() => refetch());
  }, [selectedRequestId, refetch]);

  return (
    <DashboardLayout title="Messages">
      <div className="space-y-1">
        <h1 className="font-heading text-xl font-bold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground">Chat with customers about their sourcing requests</p>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[600px] lg:min-h-[calc(100vh-140px)]">
        {/* Conversation list */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-card-foreground">All Conversations</p>
          </div>
          <div className="divide-y divide-border/50 max-h-[600px] lg:max-h-[calc(100vh-200px)] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
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
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium truncate ${
                        selectedRequestId === conv.id ? "text-primary" : "text-card-foreground"
                      }`}>
                        {conv.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{conv.customerName}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[11px] font-bold bg-primary text-primary-foreground">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  {conv.quote?.status === "pending" && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold">
                      <FileText className="h-2.5 w-2.5" /> Quote sent
                    </span>
                  )}
                  {conv.lastMessage ? (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {conv.lastMessage.sender_id === user?.id ? "You: " : "Customer: "}
                      {conv.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground/50 mt-1 italic">No messages yet</p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className="lg:col-span-2">
          {selectedRequestId && selectedConv ? (
            <motion.div key={selectedRequestId} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-3 flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{selectedConv.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConv.customerName} · {selectedConv.status} · <Link to={`/agent/requests/${selectedConv.id}`} className="text-primary hover:underline">View request →</Link>
                  </p>
                </div>
                {selectedConv.quote && (
                  <Link
                    to={`/agent/requests/${selectedConv.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold shadow-sm hover:opacity-90 transition-all"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    View quote
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
              <RequestChat requestId={selectedRequestId} isCustomer={false} />
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

export default AgentMessages;
