import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

function fireBrowserNotification(title: string, body: string, link?: string) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  // Only fire when the tab is hidden — otherwise the in-app toast is enough.
  if (typeof document !== "undefined" && document.visibilityState === "visible") return;
  try {
    const n = new Notification(title, { body, icon: "/favicon.ico", tag: "equilinq-msg" });
    if (link) {
      n.onclick = () => {
        window.focus();
        window.location.href = link;
      };
    }
  } catch {
    /* ignore */
  }
}

/**
 * Subscribes to realtime changes on sourcing_requests and quotes,
 * invalidating relevant queries and showing toast notifications.
 */
export function useRealtimeSync(role: "customer" | "agent" | "admin", userId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`realtime-sync-${role}-${userId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sourcing_requests" },
        (payload) => {
          // Invalidate all request-related queries
          queryClient.invalidateQueries({ queryKey: ["agent-requests"] });
          queryClient.invalidateQueries({ queryKey: ["agent-all-requests"] });
          queryClient.invalidateQueries({ queryKey: ["admin-all-requests"] });
          queryClient.invalidateQueries({ queryKey: ["admin-all-requests-list"] });
          queryClient.invalidateQueries({ queryKey: ["sourcing-requests"] });
          queryClient.invalidateQueries({ queryKey: ["customer-request-detail"] });
          queryClient.invalidateQueries({ queryKey: ["agent-request-detail"] });

          // Notify agents of new requests
          if (role === "agent" && payload.eventType === "INSERT") {
            toast({
              title: "🆕 New sourcing request",
              description: `"${(payload.new as any).title}" just came in.`,
            });
          }

          // Notify customers of status changes
          if (role === "customer" && payload.eventType === "UPDATE") {
            const newStatus = (payload.new as any).status;
            const oldStatus = (payload.old as any).status;
            if (newStatus !== oldStatus && (payload.new as any).user_id === userId) {
              const messages: Record<string, string> = {
                quoted: "You've received a new quote! Check your request.",
                confirmed: "Your order has been confirmed.",
                active: "Your request is now being sourced.",
              };
              if (messages[newStatus]) {
                toast({ title: "📦 Request updated", description: messages[newStatus] });
              }
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quotes" },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["request-quotes"] });
          queryClient.invalidateQueries({ queryKey: ["customer-request-quotes"] });
          queryClient.invalidateQueries({ queryKey: ["agent-all-quotes"] });
          queryClient.invalidateQueries({ queryKey: ["admin-all-quotes-list"] });

          // Notify customer when a quote is submitted for their request
          if (role === "customer" && payload.eventType === "INSERT") {
            toast({
              title: "💰 New quote received!",
              description: "An agent has submitted a quote for your request.",
            });
          }

          // Notify agent when their quote is accepted/rejected
          if (role === "agent" && payload.eventType === "UPDATE") {
            const newStatus = (payload.new as any).status;
            const oldStatus = (payload.old as any).status;
            if (newStatus !== oldStatus && (payload.new as any).agent_id === userId) {
              if (newStatus === "accepted") {
                toast({ title: "✅ Quote accepted!", description: "The customer accepted your quote." });
              } else if (newStatus === "rejected") {
                toast({ title: "❌ Quote rejected", description: "The customer declined your quote." });
              }
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["request-messages"] });
          queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
          queryClient.invalidateQueries({ queryKey: ["unread-messages-total"] });

          if (role === "customer" && payload.eventType === "INSERT") {
            const senderId = (payload.new as any).sender_id;
            if (senderId !== userId) {
              const link = `/sourcing-requests/${(payload.new as any).sourcing_request_id}`;
              toast({ title: "💬 New message", description: "Your agent sent you a message." });
              fireBrowserNotification(
                "New message from your sourcing agent",
                ((payload.new as any).content || "Open Equilinq to view the message.").slice(0, 140),
                link
              );
            }
          }

          if ((role === "agent" || role === "admin") && payload.eventType === "INSERT") {
            const senderId = (payload.new as any).sender_id;
            if (senderId !== userId) {
              const link = `/agent/requests/${(payload.new as any).sourcing_request_id}`;
              toast({ title: "💬 New message", description: "A customer sent a new message." });
              fireBrowserNotification(
                "New customer message",
                ((payload.new as any).content || "Open Equilinq to view the message.").slice(0, 140),
                link
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role, queryClient, toast]);
}
