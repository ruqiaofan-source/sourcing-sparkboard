import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, MessageCircle, Pencil, Trash2, X, Check, Paperclip, FileText, Image as ImageIcon, Download, Receipt } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QuoteComposerSheet from "@/components/QuoteComposerSheet";
import QuoteMessageCard from "@/components/QuoteMessageCard";
import InvoiceMessageCard from "@/components/InvoiceMessageCard";

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
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [quoteSheetOpen, setQuoteSheetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Fetch quotes for this request so quote-type messages can render rich cards.
  const { data: requestQuotes = [] } = useQuery({
    queryKey: ["request-quotes-chat", requestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("sourcing_request_id", requestId);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!requestId && !!user,
  });
  const quoteMap = useMemo(() => {
    const m = new Map<string, any>();
    for (const q of requestQuotes as any[]) m.set(q.id, q);
    return m;
  }, [requestQuotes]);

  // Fetch invoices for this request so invoice-type messages can render rich cards.
  const { data: requestInvoices = [] } = useQuery({
    queryKey: ["request-invoices-chat", requestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices" as any)
        .select("*")
        .eq("sourcing_request_id", requestId);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!requestId && !!user,
  });
  const invoiceMap = useMemo(() => {
    const m = new Map<string, any>();
    for (const inv of requestInvoices as any[]) m.set(inv.id, inv);
    return m;
  }, [requestInvoices]);

  // Generate signed URLs for any attachments referenced in messages
  useEffect(() => {
    const allPaths: string[] = [];
    for (const m of messages as any[]) {
      const arr = (m.attachment_paths || []) as string[];
      for (const p of arr) if (p && !signedUrls[p]) allPaths.push(p);
    }
    if (allPaths.length === 0) return;
    let cancelled = false;
    (async () => {
      const updates: Record<string, string> = {};
      for (const p of allPaths) {
        const { data } = await supabase.storage
          .from("sourcing-attachments")
          .createSignedUrl(p, 3600);
        if (data?.signedUrl) updates[p] = data.signedUrl;
      }
      if (!cancelled && Object.keys(updates).length > 0) {
        setSignedUrls((prev) => ({ ...prev, ...updates }));
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quotes", filter: `sourcing_request_id=eq.${requestId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["request-quotes-chat", requestId] });
          queryClient.invalidateQueries({ queryKey: ["customer-request-quotes", requestId] });
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
      // Upload any pending files first
      const uploadedPaths: string[] = [];
      if (pendingFiles.length > 0) {
        setUploading(true);
        try {
          for (const file of pendingFiles) {
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const path = `${user!.id}/messages/${requestId}/${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}-${safeName}`;
            const { error: upErr } = await supabase.storage
              .from("sourcing-attachments")
              .upload(path, file, { contentType: file.type, upsert: false });
            if (upErr) throw upErr;
            uploadedPaths.push(path);
          }
        } finally {
          setUploading(false);
        }
      }

      const { data: inserted, error } = await supabase
        .from("messages" as any)
        .insert({
          sourcing_request_id: requestId,
          sender_id: user!.id,
          content,
          attachment_paths: uploadedPaths,
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
      } else {
        // Customer sent a message — notify admin@equilinq.eu by email.
        try {
          const { data: req } = await supabase
            .from("sourcing_requests")
            .select("title, agent_id")
            .eq("id", requestId)
            .maybeSingle();

          const { data: sender } = await supabase
            .from("profiles")
            .select("display_name, full_name, email")
            .eq("user_id", user!.id)
            .maybeSingle();

          const senderName =
            (sender as any)?.display_name ||
            (sender as any)?.full_name ||
            (sender as any)?.email ||
            "A customer";
          const preview = content.length > 240 ? content.slice(0, 240) + "..." : content;

          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "new-message",
              recipientEmail: "admin@equilinq.eu",
              idempotencyKey: `new-message-admin-${(inserted as any).id}`,
              templateData: {
                recipientName: "Admin",
                senderName,
                requestTitle: (req as any)?.title || "Sourcing request",
                messagePreview: preview,
                conversationUrl: `https://equilinq.eu/messages`,
              },
            },
          });

          // Also notify the assigned agent (if any) — in-app + email, respecting prefs.
          const agentId = (req as any)?.agent_id as string | undefined;
          if (agentId && agentId !== user!.id) {
            try {
              await supabase.from("notifications" as any).insert({
                user_id: agentId,
                title: "New customer message",
                message: `${senderName} sent a message about "${(req as any)?.title || "a request"}": ${preview.slice(0, 120)}`,
                type: "new_message",
                link: `/agent/requests/${requestId}`,
              } as any);
            } catch (e) {
              console.warn("Agent in-app notification failed", e);
            }

            const [{ data: agentProfile }, { data: agentPrefs }] = await Promise.all([
              supabase
                .from("profiles")
                .select("email, display_name, full_name")
                .eq("user_id", agentId)
                .maybeSingle(),
              supabase
                .from("notification_preferences" as any)
                .select("message_email")
                .eq("user_id", agentId)
                .maybeSingle(),
            ]);
            const agentEmailAllowed = (agentPrefs as any)?.message_email ?? true;
            if ((agentProfile as any)?.email && agentEmailAllowed) {
              await supabase.functions.invoke("send-transactional-email", {
                body: {
                  templateName: "new-message",
                  recipientEmail: (agentProfile as any).email,
                  idempotencyKey: `new-message-agent-${(inserted as any).id}`,
                  templateData: {
                    recipientName:
                      (agentProfile as any)?.display_name ||
                      (agentProfile as any)?.full_name ||
                      undefined,
                    senderName,
                    requestTitle: (req as any)?.title || "Sourcing request",
                    messagePreview: preview,
                    conversationUrl: `https://equilinq.eu/agent/requests/${requestId}`,
                  },
                },
              });
            }
          }

          // Also send WhatsApp ping to admin's phone
          supabase.functions
            .invoke("notify-admin-whatsapp", {
              body: {
                senderName,
                requestTitle: (req as any)?.title || "Sourcing request",
                messagePreview: preview,
              },
            })
            .catch((err) => console.warn("WhatsApp notify failed", err));
        } catch (e) {
          console.warn("Admin new-message email notification failed", e);
        }
      }
    },
    onSuccess: () => {
      setMsg("");
      setPendingFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["request-messages", requestId] });
    },
    onError: (e: any) =>
      toast({ title: "Could not send message", description: e.message, variant: "destructive" }),
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
    if ((!msg.trim() && pendingFiles.length === 0) || sendMessage.isPending || uploading) return;
    sendMessage.mutate();
  };

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const max = 10 * 1024 * 1024; // 10MB each
    const accepted: File[] = [];
    for (const f of files) {
      if (f.size > max) {
        toast({ title: `${f.name} is too large`, description: "Max 10MB per file.", variant: "destructive" });
        continue;
      }
      accepted.push(f);
    }
    setPendingFiles((prev) => [...prev, ...accepted].slice(0, 10));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePending = (idx: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
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

      <div ref={scrollRef} className="h-[38vh] md:h-[42vh] lg:h-[46vh] overflow-y-auto px-5 py-3 space-y-3">
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
            const isQuoteMsg = m.message_type === "quote" && m.quote_id;
            const isInvoiceMsg = m.message_type === "invoice" && m.invoice_id;
            if (isInvoiceMsg) {
              const linkedInvoice = invoiceMap.get(m.invoice_id);
              return (
                <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%]">
                    <p className={`text-[11px] font-medium mb-1 ${isMine ? "text-right text-primary" : "text-muted-foreground"}`}>
                      {isMine ? "Invoice issued" : `${senderName} issued an invoice`}
                    </p>
                    <InvoiceMessageCard invoice={linkedInvoice} />
                  </div>
                </div>
              );
            }
            if (isQuoteMsg) {
              const linkedQuote = quoteMap.get(m.quote_id) || {
                id: m.quote_id,
                status: "pending",
              };
              return (
                <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%]">
                    <p
                      className={`text-[11px] font-medium mb-1 ${
                        isMine ? "text-right text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {isMine ? "You sent a quote" : `${senderName} sent a quote`}
                    </p>
                    <QuoteMessageCard
                      quote={linkedQuote}
                      requestId={requestId}
                      isCustomer={!!isCustomer}
                    />
                  </div>
                </div>
              );
            }
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
                      {Array.isArray(m.attachment_paths) && m.attachment_paths.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {(m.attachment_paths as string[]).map((p) => {
                            const url = signedUrls[p];
                            const fileName = p.split("/").pop() || "file";
                            const isImg = /\.(png|jpe?g|gif|webp|svg|bmp|heic)$/i.test(fileName);
                            if (!url) {
                              return (
                                <div key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                                </div>
                              );
                            }
                            if (isImg) {
                              return (
                                <a key={p} href={url} target="_blank" rel="noreferrer" className="block">
                                  <img
                                    src={url}
                                    alt={fileName}
                                    className="max-h-48 rounded-lg border border-border/50 object-cover"
                                  />
                                </a>
                              );
                            }
                            return (
                              <a
                                key={p}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-background/50 border border-border/50 text-xs hover:bg-background transition-colors"
                              >
                                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span className="truncate flex-1">{fileName.replace(/^\d+-[a-z0-9]+-/, "")}</span>
                                <Download className="h-3 w-3 text-muted-foreground shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {(() => {
                          const d = new Date(m.created_at);
                          const now = new Date();
                          const sameDay = d.toDateString() === now.toDateString();
                          const yest = new Date(now); yest.setDate(now.getDate() - 1);
                          const isYest = d.toDateString() === yest.toDateString();
                          const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                          if (sameDay) return `Today, ${time}`;
                          if (isYest) return `Yesterday, ${time}`;
                          const sameYear = d.getFullYear() === now.getFullYear();
                          const datePart = d.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            ...(sameYear ? {} : { year: "numeric" }),
                          });
                          return `${datePart}, ${time}`;
                        })()}
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
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
          onChange={onFilesSelected}
          className="hidden"
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={sendMessage.isPending || uploading}
          className="shrink-0 h-10 w-10 p-0"
          title="Attach files"
        >
          <Paperclip className="h-4 w-4 text-foreground" />
        </Button>
        {!isCustomer && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setQuoteSheetOpen(true)}
            disabled={sendMessage.isPending || uploading}
            className="shrink-0 h-10 px-2.5 border-primary/40 text-primary hover:bg-primary/10"
            title="Create a quote for this request"
          >
            <Receipt className="h-4 w-4 mr-1" />
            <span className="text-xs font-semibold">Quote</span>
          </Button>
        )}
        <Textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message or attach files..."
          rows={1}
          className="bg-secondary border-border resize-none min-h-[40px] text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
          }}
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={(!msg.trim() && pendingFiles.length === 0) || sendMessage.isPending || uploading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 h-10 w-10 p-0"
        >
          {sendMessage.isPending || uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      {pendingFiles.length > 0 && (
        <div className="px-5 pb-3 -mt-1 flex flex-wrap gap-2">
          {pendingFiles.map((f, i) => {
            const isImg = f.type.startsWith("image/");
            return (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/40 border border-border/50 text-xs"
              >
                {isImg ? <ImageIcon className="h-3 w-3 text-primary" /> : <FileText className="h-3 w-3 text-primary" />}
                <span className="max-w-[140px] truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removePending(i)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {!isCustomer && (
        <QuoteComposerSheet
          open={quoteSheetOpen}
          onOpenChange={setQuoteSheetOpen}
          requestId={requestId}
        />
      )}
    </div>
  );
}
