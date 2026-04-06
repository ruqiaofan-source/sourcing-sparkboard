import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const statusStyles: Record<string, string> = {
  "in_transit": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "processing": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "delivered": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "qc_review": "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const statusLabel: Record<string, string> = {
  "in_transit": "In Transit",
  "processing": "Processing",
  "delivered": "Delivered",
  "qc_review": "QC Review",
};

const statusFilters = ["All", "in_transit", "processing", "delivered", "qc_review"];

const Orders = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, suppliers(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = orders.filter((o) => {
    const matchesSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.product_name.toLowerCase().includes(search.toLowerCase()) ||
      (o.suppliers as any)?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || o.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    total: orders.length,
    in_transit: orders.filter((o) => o.status === "in_transit").length,
    processing: orders.filter((o) => o.status === "processing").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <DashboardLayout title="Orders">
      <div className="space-y-6">
        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: String(counts.total), sub: "All time" },
            { label: "In Transit", value: String(counts.in_transit), sub: "Active shipments" },
            { label: "Processing", value: String(counts.processing), sub: "Being prepared" },
            { label: "Delivered", value: String(counts.delivered), sub: "Completed" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-heading text-2xl font-bold text-card-foreground mt-1">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Filters & Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeFilter === f
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "bg-card text-muted-foreground border-border hover:border-primary/20"
                }`}
              >
                {f === "All" ? "All" : statusLabel[f]}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Order ID</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Supplier</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Product</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Quantity</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Total</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">ETA</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="p-4"><Skeleton className="h-4 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">
                      {orders.length === 0 ? "No orders yet. Orders will appear here once created." : "No orders matching your criteria."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-sm font-medium text-primary">
                        <Link to={`/orders/${order.id}`} className="hover:underline">{order.order_number}</Link>
                      </td>
                      <td className="p-4 text-sm text-card-foreground">{(order.suppliers as any)?.name || "-"}</td>
                      <td className="p-4 text-sm text-muted-foreground">{order.product_name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{order.quantity}</td>
                      <td className="p-4 text-sm font-medium text-card-foreground">${order.total_amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[order.status] || ""}`}>
                          {statusLabel[order.status] || order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td className="p-4 text-sm text-muted-foreground">{order.eta ? new Date(order.eta).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}</td>
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

export default Orders;
