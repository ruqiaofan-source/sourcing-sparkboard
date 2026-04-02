import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, Check, FileText, CreditCard, Send, CheckCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const typeIcons: Record<string, typeof Bell> = {
  quote_ready: FileText,
  quote_accepted: CheckCircle,
  quote_rejected: FileText,
  payment_sent: CreditCard,
  payment_confirmed: CheckCircle,
  invoice_issued: Send,
};

const typeColors: Record<string, string> = {
  quote_ready: "bg-purple-500/15 text-purple-500",
  quote_accepted: "bg-emerald-500/15 text-emerald-500",
  quote_rejected: "bg-red-500/15 text-red-500",
  payment_sent: "bg-blue-500/15 text-blue-500",
  payment_confirmed: "bg-emerald-500/15 text-emerald-500",
  invoice_issued: "bg-amber-500/15 text-amber-500",
};

export function NotificationBell({ collapsed }: { collapsed?: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications" as any)
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Position dropdown relative to button using portal
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        setDropdownPos({
          top: rect.top,
          left: 8,
        });
      } else {
        setDropdownPos({
          top: Math.max(8, rect.bottom - 420),
          left: rect.right + 12,
        });
      }
    }
  }, [open]);

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await supabase
        .from("notifications" as any)
        .update({ read: true } as any)
        .eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      await supabase
        .from("notifications" as any)
        .update({ read: true } as any)
        .eq("user_id", user!.id)
        .eq("read", false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  const handleClick = (n: any) => {
    if (!n.read) markAsRead.mutate(n.id);
    setOpen(false);
    if (n.link) {
      // Small delay to let dropdown close
      setTimeout(() => navigate(n.link), 50);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <div className="relative w-full">
      <div className="flex w-full">
        {/* Main button navigates to alerts page */}
        <button
          ref={buttonRef}
          onClick={() => navigate("/alerts")}
          className="group flex flex-col items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5 px-1 transition-all text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/40 relative"
        >
          <div className="relative">
            <Bell className="h-6 w-6" strokeWidth={1.7} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 h-4.5 min-w-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </div>
          {!collapsed && (
            <span className="text-[13px] font-semibold leading-none text-center">Alerts</span>
          )}
        </button>
      </div>

      {open && createPortal(
        <AnimatePresence>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />

          {/* Dropdown - rendered via portal to escape sidebar overflow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] max-h-[420px] rounded-xl border border-border bg-card shadow-xl overflow-hidden"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: isMobile ? "calc(100vw - 16px)" : 320,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-heading font-semibold text-sm text-card-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); markAllRead.mutate(); }}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[360px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n: any) => {
                  const Icon = typeIcons[n.type] || Bell;
                  const colorClass = typeColors[n.type] || "bg-muted text-muted-foreground";

                  return (
                    <button
                      key={n.id}
                      onClick={(e) => { e.stopPropagation(); handleClick(n); }}
                      className={`w-full text-left px-4 py-3.5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors flex gap-3 items-start cursor-pointer ${
                        !n.read ? "bg-primary/[0.03]" : ""
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-card-foreground" : "text-muted-foreground"}`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
