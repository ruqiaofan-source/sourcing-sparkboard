import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FileText, Users, ShoppingCart, CheckCircle, Clock, DollarSign, ArrowRight, TrendingUp, Package, AlertCircle, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

const AdminDashboard = () => {
  const { user } = useAuth();
  useRealtimeSync("admin", user?.id);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["admin-all-requests"],
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
    queryKey: ["admin-all-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quotes").select("*");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-all-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Admin";

  // Computed stats
  const pendingRequests = requests.filter((r: any) => r.status === "pending").length;
  const quotedRequests = requests.filter((r: any) => r.status === "quoted").length;
  const confirmedRequests = requests.filter((r: any) => r.status === "confirmed").length;
  const pendingQuotes = quotes.filter((q: any) => q.status === "pending").length;
  const acceptedQuotes = quotes.filter((q: any) => q.status === "accepted").length;
  const processingOrders = orders.filter((o: any) => o.status === "processing").length;
  const deliveredOrders = orders.filter((o: any) => o.status === "delivered").length;
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);
  const userCount = roles.length;
  const customerCount = roles.filter((r: any) => r.role === "customer").length;
  const agentCount = roles.filter((r: any) => r.role === "agent").length;

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Welcome back, {displayName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform overview at a glance.</p>
        </motion.div>

        {/* Top KPIs - key numbers */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `€${totalRevenue.toLocaleString()}`, sub: `${orders.length} orders`, icon: DollarSign, color: "text-emerald-500" },
            { label: "Active Requests", value: requests.length, sub: `${pendingRequests} pending`, icon: FileText, color: "text-primary" },
            { label: "Quotes Sent", value: quotes.length, sub: `${acceptedQuotes} accepted`, icon: Send, color: "text-blue-500" },
            { label: "Platform Users", value: userCount, sub: `${customerCount} customers · ${agentCount} agents`, icon: Users, color: "text-purple-500" },
          ].map((k) => (
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

        {/* Order Pipeline - what's done / in progress */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="font-heading font-semibold text-card-foreground mb-4">Order Pipeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Pending Requests", value: pendingRequests, color: "text-amber-500 bg-amber-500/10", icon: Clock },
              { label: "Awaiting Customer", value: quotedRequests, color: "text-purple-500 bg-purple-500/10", icon: Send },
              { label: "Confirmed", value: confirmedRequests, color: "text-emerald-500 bg-emerald-500/10", icon: CheckCircle },
              { label: "Processing", value: processingOrders, color: "text-blue-500 bg-blue-500/10", icon: Package },
              { label: "Delivered", value: deliveredOrders, color: "text-emerald-500 bg-emerald-500/10", icon: TrendingUp },
            ].map((stage) => (
              <div key={stage.label} className="text-center p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className={`inline-flex items-center justify-center h-9 w-9 rounded-full ${stage.color.split(" ")[1]} mb-2`}>
                  <stage.icon className={`h-4 w-4 ${stage.color.split(" ")[0]}`} />
                </div>
                <p className="font-heading text-2xl font-bold text-card-foreground">{stage.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stage.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Two columns: Recent Requests + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Needs Attention */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <h3 className="font-heading font-semibold text-card-foreground">Needs Attention</h3>
              </div>
              <Link to="/admin/requests" className="text-sm text-primary hover:underline flex items-center gap-1">All <ArrowRight className="h-3 w-3" /></Link>
            </div>
            {pendingRequests === 0 && pendingQuotes === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">All caught up! ✅</p>
            ) : (
              <div className="space-y-2">
                {pendingRequests > 0 && (
                  <Link to="/admin/requests" className="flex items-center justify-between p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-card-foreground">{pendingRequests} request{pendingRequests !== 1 ? "s" : ""} awaiting agent quotes</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                )}
                {pendingQuotes > 0 && (
                  <Link to="/admin/quotes" className="flex items-center justify-between p-3 rounded-lg bg-purple-500/[0.04] border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-card-foreground">{pendingQuotes} quote{pendingQuotes !== 1 ? "s" : ""} awaiting customer response</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                )}
                {processingOrders > 0 && (
                  <Link to="/orders" className="flex items-center justify-between p-3 rounded-lg bg-blue-500/[0.04] border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-card-foreground">{processingOrders} order{processingOrders !== 1 ? "s" : ""} being processed</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                )}
              </div>
            )}
          </motion.div>

          {/* Recent Orders */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-card-foreground">Recent Orders</h3>
              <Link to="/orders" className="text-sm text-primary hover:underline flex items-center gap-1">All <ArrowRight className="h-3 w-3" /></Link>
            </div>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No orders yet.</p>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 5).map((o: any) => {
                  const statusStyle: Record<string, string> = {
                    processing: "bg-amber-500/15 text-amber-500 border-amber-500/30",
                    in_transit: "bg-blue-500/15 text-blue-500 border-blue-500/30",
                    delivered: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
                    qc_review: "bg-purple-500/15 text-purple-500 border-purple-500/30",
                  };
                  return (
                    <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-card-foreground truncate">{o.product_name}</p>
                        <p className="text-xs text-muted-foreground">{o.order_number} · {o.quantity} units · €{Number(o.total_amount).toLocaleString()}</p>
                      </div>
                      <span className={`ml-3 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium shrink-0 ${statusStyle[o.status] || statusStyle.processing}`}>
                        {o.status.replace("_", " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick links to manage */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Manage Users", to: "/admin/users", icon: Users, color: "text-purple-500" },
            { label: "All Requests", to: "/admin/requests", icon: FileText, color: "text-primary" },
            { label: "All Quotes", to: "/admin/quotes", icon: Send, color: "text-blue-500" },
            { label: "All Orders", to: "/orders", icon: ShoppingCart, color: "text-emerald-500" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-muted/20 transition-all group"
            >
              <link.icon className={`h-5 w-5 ${link.color}`} />
              <span className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">{link.label}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
