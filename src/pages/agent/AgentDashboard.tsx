import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FileText, Clock, CheckCircle, Send, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

const AgentDashboard = () => {
  const { user } = useAuth();
  useRealtimeSync("agent", user?.id);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["agent-all-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sourcing_requests")
        .select("*, profiles!sourcing_requests_user_id_profiles_fkey(display_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ["agent-all-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quotes").select("*");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Agent";

  const kpis = [
    { label: "Total Requests", value: requests.length, sub: "All customer requests", icon: FileText, color: "text-primary" },
    { label: "Pending", value: requests.filter((r: any) => r.status === "pending").length, sub: "Awaiting your action", icon: Clock, color: "text-amber-500" },
    { label: "Quoted", value: requests.filter((r: any) => r.status === "quoted").length, sub: "Quotes sent", icon: Send, color: "text-blue-500" },
    { label: "Confirmed", value: requests.filter((r: any) => r.status === "confirmed").length, sub: "Accepted by customers", icon: CheckCircle, color: "text-emerald-500" },
    { label: "Total Quotes", value: quotes.length, sub: "Quotes submitted", icon: Users, color: "text-purple-500" },
  ];

  return (
    <DashboardLayout title="Agent Dashboard">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Welcome back, {displayName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage sourcing requests and submit quotes to customers.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <k.icon className={`h-4 w-4 ${k.color}`} />
              </div>
              <p className="font-heading text-xl sm:text-2xl font-bold text-card-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Pending requests with customer names */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-semibold text-card-foreground">Pending Requests</h3>
              <p className="text-xs text-muted-foreground">Requests awaiting quotes from you</p>
            </div>
            <Link to="/agent/requests" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {requests.filter((r: any) => r.status === "pending").length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No pending requests. All caught up!</p>
          ) : (
            <div className="space-y-3">
              {requests.filter((r: any) => r.status === "pending").slice(0, 5).map((r: any) => (
                <Link to={`/agent/requests/${r.id}`} key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors group">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-card-foreground group-hover:text-primary truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-card-foreground">{r.profiles?.display_name || "Unknown"}</span> · {r.quantity} units · {r.currency} {Number(r.budget_per_unit).toFixed(2)}/unit · {r.delivery_country}
                    </p>
                  </div>
                  <span className="ml-3 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium shrink-0 bg-amber-500/15 text-amber-500 border-amber-500/30">
                    Pending
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AgentDashboard;
