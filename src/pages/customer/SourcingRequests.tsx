import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, CheckCircle, Package, Truck, Clock, ArrowRight, DollarSign, MapPin, FileText, Factory, Eye } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

type StatusPhase = "sourcing" | "ordered" | "delivered";

const statusConfig: Record<string, { label: string; style: string; phase: StatusPhase; icon: typeof Clock; accent: string; step: number }> = {
  pending:    { label: "Under Review",     style: "bg-amber-500/15 text-amber-500 border-amber-500/30",     phase: "sourcing",   icon: Clock,       accent: "border-l-amber-500",   step: 1 },
  active:     { label: "Sourcing",         style: "bg-blue-500/15 text-blue-500 border-blue-500/30",        phase: "sourcing",   icon: Search,      accent: "border-l-blue-500",    step: 2 },
  quoted:     { label: "Quote Ready",      style: "bg-purple-500/15 text-purple-500 border-purple-500/30",  phase: "sourcing",   icon: FileText,    accent: "border-l-purple-500",  step: 3 },
  confirmed:  { label: "Awaiting Payment", style: "bg-amber-500/15 text-amber-500 border-amber-500/30",    phase: "ordered",    icon: DollarSign,  accent: "border-l-amber-500",   step: 4 },
  cancelled:  { label: "Cancelled",        style: "bg-red-500/15 text-red-500 border-red-500/30",           phase: "sourcing",   icon: Clock,       accent: "border-l-red-500",     step: 0 },
  processing: { label: "In Production",    style: "bg-blue-500/15 text-blue-400 border-blue-500/30",        phase: "ordered",    icon: Factory,     accent: "border-l-blue-500",    step: 5 },
  qc_review:  { label: "QC Review",        style: "bg-purple-500/15 text-purple-400 border-purple-500/30",  phase: "ordered",    icon: Eye,         accent: "border-l-purple-500",  step: 6 },
  in_transit: { label: "Shipped",          style: "bg-blue-500/15 text-blue-400 border-blue-500/30",        phase: "ordered",    icon: Truck,       accent: "border-l-blue-500",    step: 7 },
  delivered:  { label: "Delivered",         style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", phase: "delivered", icon: CheckCircle, accent: "border-l-emerald-500", step: 8 },
};

const tabs = [
  { key: "all", label: "All", icon: Package },
  { key: "sourcing", label: "Sourcing", icon: Search },
  { key: "ordered", label: "Orders", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const progressSteps = [
  { key: "pending", label: "Submitted" },
  { key: "active", label: "Sourcing" },
  { key: "quoted", label: "Quoted" },
  { key: "confirmed", label: "Payment" },
  { key: "processing", label: "Production" },
  { key: "qc_review", label: "QC" },
  { key: "in_transit", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

interface UnifiedItem {
  id: string;
  requestId: string;
  title: string;
  description?: string;
  status: string;
  phase: StatusPhase;
  quantity: number;
  budgetPerUnit: number;
  currency: string;
  deliveryCountry: string;
  createdAt: string;
  orderNumber?: string;
  totalAmount?: number;
  eta?: string;
  supplierName?: string;
}

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
      return data;
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
      return data;
    },
    enabled: !!user,
  });

  // Unread message counts per sourcing request
  const { data: unreadRows = [] } = useQuery({
    queryKey: ["unread-message-counts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_unread_message_counts" as any);
      if (error) throw error;
      return (data || []) as Array<{ sourcing_request_id: string; unread_count: number }>;
    },
    enabled: !!user,
  });
  const unreadByRequest = new Map<string, number>();
  for (const row of unreadRows) {
    unreadByRequest.set(row.sourcing_request_id, Number(row.unread_count) || 0);
  }

  const isLoading = loadingRequests || loadingOrders;

  // Build a map of sourcing_request_id -> order (pick the latest/most advanced order)
  const orderByRequestId = new Map<string, any>();
  for (const o of orders) {
    if (o.sourcing_request_id) {
      const existing = orderByRequestId.get(o.sourcing_request_id);
      if (!existing || (statusConfig[o.status]?.step || 0) > (statusConfig[existing.status]?.step || 0)) {
        orderByRequestId.set(o.sourcing_request_id, o);
      }
    }
  }

  // Build unified items: one per sourcing request, merging order status when it exists
  const unifiedItems: UnifiedItem[] = requests.map((r: any) => {
    const linkedOrder = orderByRequestId.get(r.id);
    // Use order status if it exists and is more advanced than the request status
    const effectiveStatus = linkedOrder
      ? ((statusConfig[linkedOrder.status]?.step || 0) >= (statusConfig[r.status]?.step || 0) ? linkedOrder.status : r.status)
      : r.status;

    return {
      id: r.id,
      requestId: r.id,
      title: r.title,
      description: r.description,
      status: effectiveStatus,
      phase: statusConfig[effectiveStatus]?.phase || "sourcing",
      quantity: r.quantity,
      budgetPerUnit: r.budget_per_unit,
      currency: r.currency,
      deliveryCountry: r.delivery_country,
      createdAt: r.created_at,
      orderNumber: linkedOrder?.order_number,
      totalAmount: linkedOrder?.total_amount,
      eta: linkedOrder?.eta,
      supplierName: (linkedOrder?.suppliers as any)?.name,
    };
  });

  // Also include orders that have no sourcing_request_id (orphan orders)
  const linkedRequestIds = new Set(orders.filter((o: any) => o.sourcing_request_id).map((o: any) => o.sourcing_request_id));
  const orphanOrders: UnifiedItem[] = orders
    .filter((o: any) => !o.sourcing_request_id)
    .map((o: any) => ({
      id: o.id,
      requestId: o.id,
      title: o.product_name,
      status: o.status,
      phase: statusConfig[o.status]?.phase || "ordered",
      quantity: parseInt(o.quantity) || 0,
      budgetPerUnit: 0,
      currency: "USD",
      deliveryCountry: "",
      createdAt: o.created_at,
      orderNumber: o.order_number,
      totalAmount: o.total_amount,
      eta: o.eta,
      supplierName: (o.suppliers as any)?.name,
    }));

  const allItems = [...unifiedItems, ...orphanOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filtered = allItems.filter((item) => {
    if (activeTab !== "all" && item.phase !== activeTab) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!item.title?.toLowerCase().includes(s) && !item.orderNumber?.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const counts = {
    all: allItems.length,
    sourcing: allItems.filter((i) => i.phase === "sourcing").length,
    ordered: allItems.filter((i) => i.phase === "ordered").length,
    delivered: allItems.filter((i) => i.phase === "delivered").length,
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

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item, i) => {
              const sc = statusConfig[item.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              const dateStr = new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const currentStep = sc.step;
              const unread = unreadByRequest.get(item.requestId) || 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={`/sourcing-requests/${item.requestId}`}
                    className={`group relative block rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 border-l-[3px] ${sc.accent} ${unread > 0 ? "ring-1 ring-primary/40" : ""}`}
                  >
                    <div className="p-5">
                      {/* Top: status + date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${sc.style}`}>
                          <StatusIcon className="h-3 w-3" />
                          {sc.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {unread > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                              <MessageCircle className="h-3 w-3" />
                              {unread} new
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground">{dateStr}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading font-semibold text-foreground text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>

                      {/* Description snippet */}
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                      )}

                      {/* Progress tracker - compact dots */}
                      {currentStep > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          {progressSteps.map((ps, idx) => {
                            const stepNum = statusConfig[ps.key]?.step || 0;
                            const isCompleted = currentStep > stepNum;
                            const isCurrent = currentStep === stepNum;
                            return (
                              <div key={ps.key} className="flex items-center gap-1 flex-1">
                                <div
                                  className={`h-1.5 rounded-full flex-1 transition-colors ${
                                    isCompleted ? "bg-primary" : isCurrent ? "bg-primary/60" : "bg-border"
                                  }`}
                                  title={ps.label}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Meta row */}
                      <div className="flex items-center gap-3 pt-3 border-t border-border/50 flex-wrap">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Package className="h-3 w-3" />
                          <span>{item.quantity?.toLocaleString()} units</span>
                        </div>
                        {item.totalAmount ? (
                          <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                            <DollarSign className="h-3 w-3" />
                            <span>${item.totalAmount.toLocaleString()}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <DollarSign className="h-3 w-3" />
                            <span>€{Number(item.budgetPerUnit).toFixed(2)}/unit</span>
                          </div>
                        )}
                        {item.orderNumber && (
                          <div className="text-xs text-muted-foreground font-mono ml-auto">{item.orderNumber}</div>
                        )}
                        {!item.orderNumber && item.deliveryCountry && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[80px]">{item.deliveryCountry}</span>
                          </div>
                        )}
                      </div>

                      {/* ETA if available */}
                      {item.eta && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                          <Truck className="h-3 w-3" />
                          <span>ETA: {new Date(item.eta).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </div>
                      )}
                    </div>

                    {/* Action hints */}
                    {item.status === "quoted" && (
                      <div className="px-5 py-2.5 bg-purple-500/[0.06] border-t border-purple-500/20 flex items-center justify-between">
                        <span className="text-xs font-medium text-purple-500">Quote ready to review</span>
                        <ArrowRight className="h-3.5 w-3.5 text-purple-500" />
                      </div>
                    )}
                    {item.status === "confirmed" && (
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
