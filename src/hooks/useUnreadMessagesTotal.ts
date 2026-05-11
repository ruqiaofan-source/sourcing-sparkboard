import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Total unread messages across all of the user's accessible sourcing requests.
 * Uses the get_unread_message_counts() RPC, which already filters by role.
 */
export function useUnreadMessagesTotal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["unread-messages-total", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_unread_message_counts" as any);
      if (error) throw error;
      const rows = (data || []) as Array<{ unread_count: number }>;
      return rows.reduce((sum, r) => sum + (Number(r.unread_count) || 0), 0);
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Listen for new messages / read receipts in realtime.
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`unread-total-sync-${user.id}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["unread-messages-total", user.id] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "message_reads", filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["unread-messages-total", user.id] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return query.data || 0;
}
