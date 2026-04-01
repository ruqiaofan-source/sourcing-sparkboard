import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, MessageCircle } from "lucide-react";

interface RequestChatProps {
  requestId: string;
  /** If true, the current user is the customer. Otherwise agent/admin. */
  isCustomer?: boolean;
}

export default function RequestChat({ requestId, isCustomer }: RequestChatProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["request-messages", requestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages" as any)
        .select("*, profiles!messages_sender_id_fkey(display_name)")
        .eq("sourcing_request_id", requestId)
        .order("created_at", { ascending: true });
      if (error) {
        // Fallback without join if FK doesn't exist yet
        const { data: d2, error: e2 } = await supabase
          .from("messages" as any)
          .select("*")
          .eq("sourcing_request_id", requestId)
          .order("created_at", { ascending: true });
        if (e2) throw e2;
        return d2 as any[];
      }
      return data as any[];
    },
    enabled: !!requestId && !!user,
  });

  // Subscribe to realtime messages
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${requestId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `sourcing_request_id=eq.${requestId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["request-messages", requestId] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [requestId, queryClient]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("messages" as any).insert({
        sourcing_request_id: requestId,
        sender_id: user!.id,
        content: msg.trim(),
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      setMsg("");
      queryClient.invalidateQueries({ queryKey: ["request-messages", requestId] });
    },
  });

  const handleSend = () => {
    if (!msg.trim() || sendMessage.isPending) return;
    sendMessage.mutate();
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
        <MessageCircle className="h-4 w-4 text-primary" />
        <h3 className="font-heading font-semibold text-sm text-card-foreground">Messages</h3>
        <span className="text-xs text-muted-foreground">({messages.length})</span>
      </div>

      <div ref={scrollRef} className="h-64 overflow-y-auto px-5 py-3 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isCustomer ? "Send a message to your sourcing agent" : "Start the conversation with the customer"}
            </p>
          </div>
        ) : (
          messages.map((m: any) => {
            const isMine = m.sender_id === user?.id;
            const senderName = m.profiles?.display_name || (isMine ? "You" : isCustomer ? "Agent" : "Customer");
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${
                  isMine
                    ? "bg-primary/15 border border-primary/20 text-card-foreground"
                    : "bg-muted/40 border border-border/50 text-card-foreground"
                }`}>
                  <p className={`text-[11px] font-medium mb-0.5 ${isMine ? "text-primary" : "text-muted-foreground"}`}>
                    {isMine ? "You" : senderName}
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-5 py-3 border-t border-border flex gap-2">
        <Textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message..."
          rows={1}
          className="bg-secondary border-border resize-none min-h-[40px] text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
          }}
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!msg.trim() || sendMessage.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 h-10 w-10 p-0"
        >
          {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
