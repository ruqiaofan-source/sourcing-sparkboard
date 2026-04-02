import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Clock, CheckCircle, AlertCircle, Send, Package, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

type StatusPhase = "sourcing" | "ordered" | "delivered";

const statusConfig: Record<string, { label: string; style: string; phase: StatusPhase }> = {
  pending: { label: "Under Review", style: "bg-amber-500/15 text-amber-500 border-amber-500/30", phase: "sourcing" },
  active: { label: "Sourcing", style: "bg-blue-500/15 text-blue-500 border-blue-500/30", phase: "sourcing" },
  quoted: { label: "Quote Ready", style: "bg-purple-500/15 text-purple-500 border-purple-500/30", phase: "sourcing" },
  confirmed: { label: "Awaiting Payment", style: "bg-amber-500/15 text-amber-500 border-amber-500/30", phase: "ordered" },
  cancelled: { label: "Cancelled", style: "bg-red-500/15 text-red-500 border-red-500/30", phase: "sourcing" },
  processing: { label: "In Production", style: "bg-blue-500/15 text-blue-400 border-blue-500/30", phase: "ordered" },
  qc_review: { label: "QC Review", style: "bg-purple-500/15 text-purple-400 border-purple-500/30", phase: "ordered" },
  in_transit: { label: "Shipped", style: "bg-blue-500/15 text-blue-400 border-blue-500/30", phase: "ordered" },
  delivered: { label: "Delivered", style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", phase: "delivered" },
};

const tabs = [
  { key: "all", label: "All", icon: Package },
  { key: "sourcing", label: "Sourcing", icon: Search },
  { key: "ordered", label: "Ordered", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const SourcingRequests = () => {
  const { user } = useAuth();
  useRealtimeSync("customer", user?.id);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: requests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["sourcing-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sourcing_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((r: any) => ({ ...r, _type: "request" as const }));
    },
    enabled: !!user,
  });

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, suppliers(name)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((o: any) => ({ ...o, _type: "order" as const }));
    },
    enabled: !!user,
  });

  const isLoading = loadingRequests || loadingOrders;

  // Combine into a unified timeline
  const allItems = [...requests, ...orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const filtered = allItems.filter((item: any) => {
    const sc = statusConfig[item.status];
    const phase = sc?.phase || "sourcing";

    if (activeTab !== "all" && phase !== activeTab) return false;

    const searchText = search.toLowerCase();
    if (searchText) {
      const title = item._type === "request" ? item.title : item.product_name;
      const id = item._type === "order" ? item.order_number : "";
      if (!title?.toLowerCase().includes(searchText) && !id?.toLowerCase().includes(searchText)) return false;
    }
    return true;
  });

  const counts = {
    all: allItems.length,
    sourcing: allItems.filter((i: any) => (statusConfig[i.status]?.phase || "sourcing") === "sourcing").length,
    ordered: allItems.filter((i: any) => statusConfig[i.status]?.phase === "ordered").length,
    delivered: allItems.filter((i: any) => statusConfig[i.status]?.phase === "delivered").length,
  };

  return (
    <DashboardLayout title="My Requests">
      <div className="space-y-6">
        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className={`ml-1 text-xs rounded-full px-1.5 py-0.5 ${
                  activeTab === tab.key ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {counts[tab.key as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
            </div>
            <Link to="/new-request">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                <Plus className="h-4 w-4 mr-1" /> New
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Unified List */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell">Details</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j} className="p-4"><Skeleton className="h-4 w-24" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground text-sm">
                      {allItems.length === 0 ? (
                        <div className="space-y-3">
                          <p>No requests yet. Start sourcing products from China.</p>
                          <Link to="/new-request">
                            <Button size="sm" className="bg-primary text-primary-foreground">
                              <Plus className="h-4 w-4 mr-1" /> Create Your First Request
                            </Button>
                          </Link>
                        </div>
                      ) : "No items match your search."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item: any) => {
                    const isRequest = item._type === "request";
                    const title = isRequest ? item.title : item.product_name;
                    const subtitle = isRequest
                      ? `${item.quantity?.toLocaleString()} units · ${item.currency} ${Number(item.budget_per_unit).toFixed(2)}/unit`
                      : `${item.order_number} · $${item.total_amount?.toLocaleString()}`;
                    const sc = statusConfig[item.status] || statusConfig.pending;
                    const href = isRequest ? `/sourcing-requests/${item.id}` : undefined;

                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors ${href ? "cursor-pointer" : ""}`}
                        onClick={() => href && (window.location.href = href)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`shrink-0 h-2 w-2 rounded-full ${isRequest ? "bg-primary" : "bg-emerald-500"}`} />
                            <div>
                              <p className="text-sm font-medium text-card-foreground">{title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{isRequest ? "Sourcing Request" : "Order"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{subtitle}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${sc.style}`}>
                            {sc.label}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">
                          {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SourcingRequests;
