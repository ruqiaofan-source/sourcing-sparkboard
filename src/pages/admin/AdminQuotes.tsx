import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

const AdminQuotes = () => {
  const { user } = useAuth();
  useRealtimeSync("admin", user?.id);

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["admin-all-quotes-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*, sourcing_requests(title, user_id, profiles!sourcing_requests_user_id_profiles_fkey(display_name))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <DashboardLayout title="All Quotes">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Factory</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell">Request</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">Factory Cost</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell">China Ops</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">Logistics</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell">Service Fee</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Total/Unit</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden xl:table-cell">Delivery</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">{Array.from({ length: 9 }).map((_, j) => (<td key={j} className="p-4"><Skeleton className="h-4 w-20" /></td>))}</tr>
                  ))
                ) : quotes.length === 0 ? (
                  <tr><td colSpan={9} className="p-8 text-center text-muted-foreground text-sm">No quotes yet.</td></tr>
                ) : (
                  quotes.map((q: any) => (
                    <tr key={q.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-medium text-card-foreground">{q.factory_name}</p>
                        <p className="text-xs text-muted-foreground">MOQ: {q.moq}</p>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell truncate max-w-[150px]">{(q as any).sourcing_requests?.title || "-"}</td>
                      <td className="p-4 text-sm text-card-foreground hidden md:table-cell">€{Number(q.factory_cost).toFixed(2)}</td>
                      <td className="p-4 text-sm text-card-foreground hidden lg:table-cell">€{Number(q.china_ops_cost).toFixed(2)}</td>
                      <td className="p-4 text-sm text-card-foreground hidden md:table-cell">€{Number(q.logistics_cost).toFixed(2)}</td>
                      <td className="p-4 text-sm text-card-foreground hidden lg:table-cell">€{Number(q.service_fee).toFixed(2)}</td>
                      <td className="p-4 text-sm font-medium text-primary">€{Number(q.total_cost).toFixed(2)}</td>
                      <td className="p-4 text-sm text-muted-foreground hidden xl:table-cell">{q.delivery_time_days} days</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          q.status === "accepted" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                          : q.status === "rejected" ? "bg-red-500/15 text-red-500 border-red-500/30"
                          : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                        }`}>{q.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminQuotes;
