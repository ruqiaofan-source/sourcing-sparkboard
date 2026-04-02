import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search, Clock, FileText, Send, DollarSign, Package, MapPin, User, ArrowRight, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

const statusConfig: Record<string, { label: string; style: string; icon: typeof Clock; accent: string; actionLabel?: string }> = {
  pending: { label: "Needs Quote", style: "bg-amber-500/15 text-amber-500 border-amber-500/30", icon: Clock, accent: "border-l-amber-500", actionLabel: "Submit Quote" },
  active: { label: "Sourcing", style: "bg-blue-500/15 text-blue-500 border-blue-500/30", icon: Search, accent: "border-l-blue-500" },
  quoted: { label: "Quote Sent", style: "bg-purple-500/15 text-purple-500 border-purple-500/30", icon: Send, accent: "border-l-purple-500", actionLabel: "Awaiting customer" },
  confirmed: { label: "Awaiting Payment", style: "bg-amber-500/15 text-amber-500 border-amber-500/30", icon: CreditCard, accent: "border-l-amber-500", actionLabel: "Check payment" },
  cancelled: { label: "Cancelled", style: "bg-red-500/15 text-red-500 border-red-500/30", icon: Clock, accent: "border-l-red-500" },
};

const filterTabs = [
  { key: "All", label: "All" },
  { key: "pending", label: "Needs Quote" },
  { key: "quoted", label: "Quote Sent" },
  { key: "confirmed", label: "Awaiting Payment" },
];

const AgentRequests = () => {
  const { user } = useAuth();
  useRealtimeSync("agent", user?.id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["agent-requests"],
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

  const filtered = requests.filter((r: any) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const counts: Record<string, number> = {
    All: requests.length,
    pending: requests.filter((r: any) => r.status === "pending").length,
    quoted: requests.filter((r: any) => r.status === "quoted").length,
    confirmed: requests.filter((r: any) => r.status === "confirmed").length,
  };

  return (
    <DashboardLayout title="Customer Requests">
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-1 p-1 rounded-xl bg-muted/40 border border-border">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === tab.key
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.key === "All" ? "All" : tab.label.split(" ")[0]}</span>
                <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 ${
                  filter === tab.key ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {counts[tab.key] || 0}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
          </div>
        </motion.div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground text-sm">No requests found.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((r: any, i: number) => {
              const sc = statusConfig[r.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              const customerName = (r as any).profiles?.display_name || "Unknown";
              const dateStr = new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={`/agent/requests/${r.id}`}
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
                        {r.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{r.description}</p>

                      {/* Meta row */}
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="truncate max-w-[100px]">{customerName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Package className="h-3 w-3" />
                          <span>{r.quantity?.toLocaleString()} units</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <DollarSign className="h-3 w-3" />
                          <span>{r.currency} {Number(r.budget_per_unit).toFixed(2)}</span>
                        </div>
                        {r.delivery_country && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[80px]">{r.delivery_country}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action hint bar */}
                    {sc.actionLabel && (
                      <div className={`px-5 py-2.5 border-t flex items-center justify-between ${
                        r.status === "pending"
                          ? "bg-amber-500/[0.06] border-amber-500/20"
                          : r.status === "confirmed"
                          ? "bg-amber-500/[0.06] border-amber-500/20"
                          : "bg-purple-500/[0.06] border-purple-500/20"
                      }`}>
                        <span className={`text-xs font-medium ${
                          r.status === "pending" ? "text-amber-500" : r.status === "confirmed" ? "text-amber-500" : "text-purple-500"
                        }`}>
                          {sc.actionLabel}
                        </span>
                        <ArrowRight className={`h-3.5 w-3.5 ${
                          r.status === "pending" ? "text-amber-500" : r.status === "confirmed" ? "text-amber-500" : "text-purple-500"
                        }`} />
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

export default AgentRequests;
