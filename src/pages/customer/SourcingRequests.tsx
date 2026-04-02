import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, CheckCircle, Package, Truck, Clock, ArrowRight, DollarSign, MapPin, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

type StatusPhase = "sourcing" | "ordered" | "delivered";

const statusConfig: Record<string, { label: string; style: string; phase: StatusPhase; icon: typeof Clock; accent: string }> = {
  pending: { label: "Under Review", style: "bg-amber-500/15 text-amber-500 border-amber-500/30", phase: "sourcing", icon: Clock, accent: "border-l-amber-500" },
  active: { label: "Sourcing", style: "bg-blue-500/15 text-blue-500 border-blue-500/30", phase: "sourcing", icon: Search, accent: "border-l-blue-500" },
  quoted: { label: "Quote Ready", style: "bg-purple-500/15 text-purple-500 border-purple-500/30", phase: "sourcing", icon: FileText, accent: "border-l-purple-500" },
  confirmed: { label: "Awaiting Payment", style: "bg-amber-500/15 text-amber-500 border-amber-500/30", phase: "ordered", icon: DollarSign, accent: "border-l-amber-500" },
  cancelled: { label: "Cancelled", style: "bg-red-500/15 text-red-500 border-red-500/30", phase: "sourcing", icon: Clock, accent: "border-l-red-500" },
  processing: { label: "In Production", style: "bg-blue-500/15 text-blue-400 border-blue-500/30", phase: "ordered", icon: Package, accent: "border-l-blue-500" },
  qc_review: { label: "QC Review", style: "bg-purple-500/15 text-purple-400 border-purple-500/30", phase: "ordered", icon: CheckCircle, accent: "border-l-purple-500" },
  in_transit: { label: "Shipped", style: "bg-blue-500/15 text-blue-400 border-blue-500/30", phase: "ordered", icon: Truck, accent: "border-l-blue-500" },
  delivered: { label: "Delivered", style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", phase: "delivered", icon: CheckCircle, accent: "border-l-emerald-500" },
};

const tabs = [
  { key: "all", label: "All", icon: Package },
  { key: "sourcing", label: "Sourcing", icon: Search },
  { key: "ordered", label: "Orders", icon: Truck },
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
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-1 p-1 rounded-xl bg-muted/40 border border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 ${
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
              <Input placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
            </div>
            <Link to="/new-request">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                <Plus className="h-4 w-4 mr-1" /> New
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-12 text-center">
            {allItems.length === 0 ? (
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                  <Package className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground mb-1">No requests yet</p>
                  <p className="text-sm text-muted-foreground">Start sourcing products from verified Chinese factories.</p>
                </div>
                <Link to="/new-request">
                  <Button className="bg-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-1" /> Create Your First Request
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No items match your search.</p>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((item: any, i: number) => {
              const isRequest = item._type === "request";
              const title = isRequest ? item.title : item.product_name;
              const sc = statusConfig[item.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              const href = isRequest ? `/sourcing-requests/${item.id}` : undefined;
              const dateStr = new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={href || "#"}
                    className={`group block rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 border-l-[3px] ${sc.accent}`}
                  >
                    <div className="p-5">
                      {/* Top: status + date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${sc.style}`}>
                          <StatusIcon className="h-3 w-3" />
                          {sc.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{dateStr}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading font-semibold text-foreground text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                      </h3>

                      {/* Description snippet for requests */}
                      {isRequest && item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                      )}

                      {/* Meta row */}
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
                        {isRequest ? (
                          <>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Package className="h-3 w-3" />
                              <span>{item.quantity?.toLocaleString()} units</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <DollarSign className="h-3 w-3" />
                              <span>{item.currency} {Number(item.budget_per_unit).toFixed(2)}/unit</span>
                            </div>
                            {item.delivery_country && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[80px]">{item.delivery_country}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="text-xs text-muted-foreground font-mono">{item.order_number}</div>
                            <div className="text-xs font-medium text-foreground ml-auto">${item.total_amount?.toLocaleString()}</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action hint */}
                    {isRequest && item.status === "quoted" && (
                      <div className="px-5 py-2.5 bg-purple-500/[0.06] border-t border-purple-500/20 flex items-center justify-between">
                        <span className="text-xs font-medium text-purple-500">Quote ready to review</span>
                        <ArrowRight className="h-3.5 w-3.5 text-purple-500" />
                      </div>
                    )}
                    {isRequest && item.status === "confirmed" && (
                      <div className="px-5 py-2.5 bg-amber-500/[0.06] border-t border-amber-500/20 flex items-center justify-between">
                        <span className="text-xs font-medium text-amber-500">Complete your payment</span>
                        <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SourcingRequests;
