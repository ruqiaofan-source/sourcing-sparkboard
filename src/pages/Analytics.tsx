import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { DollarSign, Users, RefreshCw, TrendingUp, FileText, ShoppingCart, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "10px",
  color: "hsl(var(--card-foreground))",
  fontFamily: "Inter, sans-serif",
  fontSize: "13px",
};

const Analytics = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      // Fetch all needed data in parallel
      const [invoicesRes, ordersRes, requestsRes, profilesRes, rolesRes] = await Promise.all([
        supabase.from("invoices").select("total_amount, created_at, currency, status, user_id"),
        supabase.from("orders").select("id, created_at, user_id, status, total_amount"),
        supabase.from("sourcing_requests").select("id, created_at, user_id, status"),
        supabase.from("profiles").select("user_id, created_at"),
        supabase.from("user_roles").select("user_id, role"),
      ]);

      const invoices = invoicesRes.data || [];
      const orders = ordersRes.data || [];
      const requests = requestsRes.data || [];
      const profiles = profilesRes.data || [];
      const roles = rolesRes.data || [];

      // Total revenue from invoices
      const totalRevenue = invoices
        .filter((i: any) => i.status !== "cancelled")
        .reduce((sum: number, i: any) => sum + (i.total_amount || 0), 0);

      // Total customers (users with customer role)
      const customerIds = new Set(roles.filter((r: any) => r.role === "customer").map((r: any) => r.user_id));
      const totalCustomers = customerIds.size;

      // Repeat customers: customers with > 1 request
      const requestsByUser: Record<string, number> = {};
      requests.forEach((r: any) => {
        if (customerIds.has(r.user_id)) {
          requestsByUser[r.user_id] = (requestsByUser[r.user_id] || 0) + 1;
        }
      });
      const repeatCustomers = Object.values(requestsByUser).filter((c) => c > 1).length;

      // Monthly revenue (last 6 months)
      const now = new Date();
      const monthlyRevenue: { month: string; revenue: number; orders: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);

        const monthInvoices = invoices.filter((inv: any) => {
          const created = new Date(inv.created_at);
          return created >= monthStart && created < monthEnd && inv.status !== "cancelled";
        });
        const monthOrders = orders.filter((o: any) => {
          const created = new Date(o.created_at);
          return created >= monthStart && created < monthEnd;
        });

        monthlyRevenue.push({
          month: monthStr,
          revenue: monthInvoices.reduce((s: number, i: any) => s + (i.total_amount || 0), 0),
          orders: monthOrders.length,
        });
      }

      // New users per month (last 6 months)
      const monthlyUsers: { month: string; newUsers: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);

        const newUsers = profiles.filter((p: any) => {
          const created = new Date(p.created_at);
          return created >= monthStart && created < monthEnd;
        });

        monthlyUsers.push({ month: monthStr, newUsers: newUsers.length });
      }

      // Request status breakdown
      const statusCounts: Record<string, number> = {};
      requests.forEach((r: any) => {
        const s = r.status || "pending";
        statusCounts[s] = (statusCounts[s] || 0) + 1;
      });

      const statusColors: Record<string, string> = {
        pending: "hsl(43, 96%, 56%)",
        in_progress: "hsl(199, 89%, 48%)",
        quoted: "hsl(262, 83%, 58%)",
        accepted: "hsl(142, 71%, 45%)",
        completed: "hsl(239, 84%, 67%)",
        cancelled: "hsl(0, 72%, 51%)",
      };

      const statusData = Object.entries(statusCounts).map(([name, value]) => ({
        name: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value,
        color: statusColors[name] || "hsl(240, 5%, 55%)",
      }));

      // Top customers by order count
      const ordersByUser: Record<string, number> = {};
      orders.forEach((o: any) => { ordersByUser[o.user_id] = (ordersByUser[o.user_id] || 0) + 1; });
      const topCustomers = Object.entries(ordersByUser)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([userId, count]) => {
          const profile = profiles.find((p: any) => p.user_id === userId);
          return { name: (profile as any)?.full_name || (profile as any)?.display_name || userId.slice(0, 8), orders: count };
        });

      return {
        totalRevenue,
        totalCustomers,
        repeatCustomers,
        totalRequests: requests.length,
        totalOrders: orders.length,
        monthlyRevenue,
        monthlyUsers,
        statusData,
        topCustomers,
      };
    },
    enabled: !!user,
  });

  const fmt = (v: number) => v >= 1000 ? `€${(v / 1000).toFixed(1)}k` : `€${v.toFixed(0)}`;

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Revenue, user growth, and order insights</p>
        </motion.div>

        {/* KPI Row */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))
          ) : (
            [
              { label: "Total Revenue", value: fmt(data?.totalRevenue || 0), icon: DollarSign, accent: "text-primary" },
              { label: "Total Customers", value: String(data?.totalCustomers || 0), icon: Users, accent: "text-primary" },
              { label: "Repeat Customers", value: String(data?.repeatCustomers || 0), icon: RefreshCw, accent: "text-emerald-500" },
              { label: "Sourcing Requests", value: String(data?.totalRequests || 0), icon: FileText, accent: "text-primary" },
              { label: "Total Orders", value: String(data?.totalOrders || 0), icon: ShoppingCart, accent: "text-amber-500" },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
                </div>
                <p className="font-heading text-2xl font-bold text-card-foreground">{kpi.value}</p>
              </div>
            ))
          )}
        </motion.div>

        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="font-heading text-lg font-semibold text-card-foreground mb-1">Monthly Revenue</h3>
          <p className="text-sm text-muted-foreground mb-6">Revenue from finalized invoices over the last 6 months</p>
          <div className="h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.monthlyRevenue || []}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => fmt(v)} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [fmt(value), ""]} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(239, 84%, 67%)" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Onboarding */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="font-heading text-lg font-semibold text-card-foreground mb-1">User Onboarding</h3>
            <p className="text-sm text-muted-foreground mb-6">New customer signups per month</p>
            <div className="h-[240px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.monthlyUsers || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="newUsers" fill="hsl(239, 84%, 67%)" radius={[6, 6, 0, 0]} barSize={28} name="New Users" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Request Status */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="font-heading text-lg font-semibold text-card-foreground mb-1">Request Pipeline</h3>
            <p className="text-sm text-muted-foreground mb-6">Breakdown by status</p>
            <div className="h-[240px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (data?.statusData || []).length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No requests yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data?.statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                      {(data?.statusData || []).map((entry: any, index: number) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend formatter={(value) => <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "11px" }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Top Customers */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="font-heading text-lg font-semibold text-card-foreground mb-1">Top Customers</h3>
            <p className="text-sm text-muted-foreground mb-6">By number of orders</p>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : (data?.topCustomers || []).length === 0 ? (
              <div className="flex items-center justify-center h-[240px] text-sm text-muted-foreground">No orders yet</div>
            ) : (
              <div className="space-y-3">
                {(data?.topCustomers || []).map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                      <span className="text-sm font-medium text-card-foreground truncate max-w-[140px]">{c.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{c.orders} order{c.orders !== 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
