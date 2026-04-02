import { Bell, Check, FileText, CreditCard, Send, CheckCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";

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

export default function Alerts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications" as any)
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user,
  });

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
    if (n.link) navigate(n.link);
  };

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <DashboardLayout title="Alerts">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Alerts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead.mutate()}
              className="rounded-full text-xs"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Mark all read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-border/40 bg-card/30">
            <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n: any, i: number) => {
              const Icon = typeIcons[n.type] || Bell;
              const colorClass = typeColors[n.type] || "bg-muted text-muted-foreground";

              return (
                <motion.button
                  key={n.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left rounded-xl border p-4 flex gap-3.5 items-start transition-all duration-200 hover:border-primary/30 cursor-pointer ${
                    !n.read
                      ? "border-primary/20 bg-primary/[0.04]"
                      : "border-border/40 bg-card/30"
                  }`}
                >
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-muted-foreground/60">{timeAgo(n.created_at)}</span>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
