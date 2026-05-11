import { useEffect } from "react";
import { Bell } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function NotificationBell({ collapsed }: { collapsed?: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      .channel(`notifications-realtime-${user.id}-${Math.random().toString(36).slice(2)}`)
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

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="relative w-full">
      <button
        onClick={() => navigate("/alerts")}
        className="group flex flex-col items-center justify-center gap-1.5 w-full rounded-xl py-2.5 px-1 transition-all text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/40 relative"
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
  );
}
