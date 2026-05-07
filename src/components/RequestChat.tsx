import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, MessageCircle, Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RequestChatProps {
  requestId: string;
  /** If true, the current user is the customer. Otherwise agent/admin. */
  isCustomer?: boolean;
}

export default function RequestChat({ requestId, isCustomer }: RequestChatProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
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
        { event: "*", schema: "public", table: "messages", filter: `sourcing_request_id=eq.${requestId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["request-messages", requestId] });
          // New message arrived while viewing — mark as read
          supabase.rpc("mark_request_read" as any, { _request_id: requestId }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["unread-message-counts"] });
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [requestId, queryClient]);

  // Mark request as read when chat is opened / messages first load
  useEffect(() => {
    if (!user || !requestId) return;
    supabase.rpc("mark_request_read" as any, { _request_id: requestId }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["unread-message-counts"] });
    });
  }, [user, requestId, messages.length, queryClient]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      const content = msg.trim();
      const { data: inserted, error } = await supabase
        .from("messages" as any)
        .insert({
          sourcing_request_id: requestId,
          sender_id: user!.id,
          content,
        } as any)
        .select("id")
        .single();
      if (error) throw error;

      // If the sender is the agent/admin (not the customer who owns the request),
      // notify the customer by email. Fire-and-forget; failures shouldn't block the chat.
      if (!isCustomer) {
        try {
          const { data: req } = await supabase
            .from("sourcing_requests")
            .select("title, user_id")
            .eq("id", requestId)
            .maybeSingle();

          if (req?.user_id && req.user_id !== user!.id) {
            // In-app notification for the customer
            const previewText =
              content.length > 120 ? content.slice(0, 120) + "..." : content;
            await supabase.from("notifications" as any).insert({
              user_id: req.user_id,
              title: "New message",
              message: `New message about "${(req as any).title}": ${previewText}`,
              type: "new_message",
              link: `/sourcing-requests/${requestId}`,
            } as any);

            const [{ data: recipient }, { data: sender }, { data: prefs }] = await Promise.all([
              supabase
                .from("profiles")
                .select("email, display_name, full_name")
                .eq("user_id", req.user_id)
                .maybeSingle(),
              supabase
                .from("profiles")
                .select("display_name, full_name")
                .eq("user_id", user!.id)
                .maybeSingle(),
              supabase
                .from("notification_preferences" as any)
                .select("message_email")
                .eq("user_id", req.user_id)
                .maybeSingle(),
            ]);

            // Default to email-on if no preferences row exists yet
            const emailAllowed = (prefs as any)?.message_email ?? true;

            if (recipient?.email && emailAllowed) {
              const preview = content.length > 240 ? content.slice(0, 240) + "..." : content;
              const senderName =
                (sender as any)?.display_name ||
                (sender as any)?.full_name ||
                "Your sourcing agent";
              const recipientName =
                (recipient as any)?.display_name || (recipient as any)?.full_name || undefined;

              await supabase.functions.invoke("send-transactional-email", {
                body: {
                  templateName: "new-message",
                  recipientEmail: (recipient as any).email,
                  idempotencyKey: `new-message-${(inserted as any).id}`,
                  templateData: {
                    recipientName,
                    senderName,
                    requestTitle: (req as any).title,
                    messagePreview: preview,
                    conversationUrl: `https://equilinq.eu/messages`,
                  },
                },
              });
            }
          }
        } catch (e) {
          // Don't fail the message send if the email notification fails.
          console.warn("New-message email notification failed", e);
        }
      }
    },
    onSuccess: () => {
      setMsg("");
      queryClient.invalidateQueries({ queryKey: ["request-messages", requestId] });
    },
  });

  const editMessage = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from("messages" as any)
        .update({ content } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setEditingId(null);
      setEditingText("");
      queryClient.invalidateQueries({ queryKey: ["request-messages", requestId] });
    },
    onError: (e: any) => toast({ title: "Could not edit message", description: e.message, variant: "destructive" }),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-messages", requestId] });
    },
    onError: (e: any) => toast({ title: "Could not delete message", description: e.message, variant: "destructive" }),
  });

  const handleSend = () => {
    if (!msg.trim() || sendMessage.isPending) return;
    sendMessage.mutate();
  };

  const startEdit = (m: any) => {
    setEditingId(m.id);
    setEditingText(m.content);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };
  const saveEdit = () => {
    if (!editingId || !editingText.trim()) return;
    editMessage.mutate({ id: editingId, content: editingText.trim() });
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
            const isEditing = editingId === m.id;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`group relative max-w-[80%] rounded-xl px-3.5 py-2.5 ${
                  isMine
                    ? "bg-primary/15 border border-primary/20 text-card-foreground"
                    : "bg-muted/40 border border-border/50 text-card-foreground"
                }`}>
                  <p className={`text-[11px] font-medium mb-0.5 ${isMine ? "text-primary" : "text-muted-foreground"}`}>
                    {isMine ? "You" : senderName}
                  </p>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={2}
                        className="bg-background border-border resize-none text-sm min-w-[220px]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                          if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                        }}
                        autoFocus
                      />
                      <div className="flex gap-1.5 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={cancelEdit}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 px-2 bg-primary text-primary-foreground hover:bg-primary/90"
                          disabled={!editingText.trim() || editMessage.isPending}
                          onClick={saveEdit}
                        >
                          {editMessage.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        {m.edited_at && <span className="ml-1 italic">(edited)</span>}
                      </p>
                      {isMine && (
                        <div className="absolute -top-2 right-2 hidden group-hover:flex gap-1 bg-card border border-border rounded-md shadow-sm px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => startEdit(m)}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Delete this message?")) deleteMessage.mutate(m.id);
                            }}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
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
