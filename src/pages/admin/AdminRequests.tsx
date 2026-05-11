import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusConfig: Record<string, { label: string; style: string }> = {
  pending: { label: "Pending", style: "bg-amber-500/15 text-amber-500 border-amber-500/30" },
  active: { label: "Active", style: "bg-blue-500/15 text-blue-500 border-blue-500/30" },
  quoted: { label: "Quoted", style: "bg-purple-500/15 text-purple-500 border-purple-500/30" },
  confirmed: { label: "Confirmed", style: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" },
  cancelled: { label: "Cancelled", style: "bg-red-500/15 text-red-500 border-red-500/30" },
};

const AdminRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useRealtimeSync("admin", user?.id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [agentFilter, setAgentFilter] = useState("all");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-all-requests-list"],
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

  const { data: agents = [] } = useQuery({
    queryKey: ["admin-agents-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("agents").select("id, user_id, name");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: quoteCounts = {} } = useQuery({
    queryKey: ["admin-quote-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quotes").select("sourcing_request_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((q: any) => { counts[q.sourcing_request_id] = (counts[q.sourcing_request_id] || 0) + 1; });
      return counts;
    },
    enabled: !!user,
  });

  const filtered = requests.filter((r: any) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || r.status === filter;
    const matchAgent = agentFilter === "all" || r.agent_id === agentFilter || (agentFilter === "unassigned" && !r.agent_id);
    return matchSearch && matchFilter && matchAgent;
  });

  return (
    <DashboardLayout title="All Requests">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {["All", "pending", "active", "quoted", "confirmed", "cancelled"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filter === f ? "bg-primary/15 text-primary border-primary/30" : "bg-card text-muted-foreground border-border hover:border-primary/20"}`}>
                {f === "All" ? `All (${requests.length})` : `${statusConfig[f]?.label} (${requests.filter((r: any) => r.status === f).length})`}
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-[160px] bg-card border-border text-sm">
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {agents.map((a: any) => (
                  <SelectItem key={a.user_id} value={a.user_id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Request</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell">Customer</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell">Agent</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">Qty</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">Budget</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell">Quotes</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">{Array.from({ length: 8 }).map((_, j) => (<td key={j} className="p-4"><Skeleton className="h-4 w-20" /></td>))}</tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">No requests found.</td></tr>
                ) : (
                  filtered.map((r: any) => {
                    const sc = statusConfig[r.status] || statusConfig.pending;
                    const qCount = (quoteCounts as Record<string, number>)[r.id] || 0;
                    const agentName = agents.find((a: any) => a.user_id === r.agent_id)?.name;
                    return (
                      <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => navigate(`/admin/requests/${r.id}`)}>
                        <td className="p-4"><p className="text-sm font-medium text-card-foreground truncate max-w-[200px] hover:text-primary transition-colors">{r.title}</p></td>
                        <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{(r as any).profiles?.display_name || "-"}</td>
                        <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">{agentName || "-"}</td>
                        <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{r.quantity?.toLocaleString()}</td>
                        <td className="p-4 text-sm text-card-foreground hidden md:table-cell">€{Number(r.budget_per_unit).toFixed(2)}</td>
                        <td className="p-4"><span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${sc.style}`}>{sc.label}</span></td>
                        <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">{qCount} quote{qCount !== 1 ? "s" : ""}</td>
                        <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
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

export default AdminRequests;
