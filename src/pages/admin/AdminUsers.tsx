import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, UserCheck, Search, Loader2, ChevronDown, ChevronUp, Mail, MapPin, Package, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const roleConfig: Record<string, { label: string; color: string; icon: typeof Users }> = {
  customer: { label: "Customer", color: "bg-primary/15 text-primary border-primary/30", icon: Users },
  agent: { label: "Agent", color: "bg-amber-500/15 text-amber-500 border-amber-500/30", icon: UserCheck },
  admin: { label: "Admin", color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30", icon: Shield },
};

const AdminUsers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Fetch profiles
  const { data: usersWithRoles = [], isLoading } = useQuery({
    queryKey: ["admin-users-with-roles"],
    queryFn: async () => {
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("user_id, display_name, full_name, phone_number, area_of_residence, delivery_address, email, created_at")
        .order("created_at", { ascending: false });
      if (pErr) throw pErr;

      const { data: roles, error: rErr } = await supabase
        .from("user_roles")
        .select("user_id, role, id");
      if (rErr) throw rErr;

      // Count sourcing requests per user
      const { data: requests, error: srErr } = await supabase
        .from("sourcing_requests")
        .select("user_id");
      if (srErr) throw srErr;

      // Count orders per user
      const { data: orders, error: oErr } = await supabase
        .from("orders")
        .select("user_id");
      if (oErr) throw oErr;

      const requestCounts: Record<string, number> = {};
      (requests || []).forEach((r: any) => {
        requestCounts[r.user_id] = (requestCounts[r.user_id] || 0) + 1;
      });

      const orderCounts: Record<string, number> = {};
      (orders || []).forEach((o: any) => {
        orderCounts[o.user_id] = (orderCounts[o.user_id] || 0) + 1;
      });

      return (profiles || []).map((p: any) => ({
        ...p,
        roles: (roles || []).filter((r: any) => r.user_id === p.user_id),
        primaryRole: (roles || []).find((r: any) => r.user_id === p.user_id)?.role || "customer",
        requestCount: requestCounts[p.user_id] || 0,
        orderCount: orderCounts[p.user_id] || 0,
      }));
    },
    enabled: !!user,
  });

  const changeRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error: delErr } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);
      if (delErr) throw delErr;

      const { error: insErr } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole } as any);
      if (insErr) throw insErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-with-roles"] });
      toast({ title: "Role updated", description: "User role has been changed successfully." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const filtered = usersWithRoles.filter((u: any) => {
    const matchSearch =
      (u.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.user_id || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All" || u.primaryRole === filterRole;
    return matchSearch && matchRole;
  });

  const roleCounts = {
    customer: usersWithRoles.filter((u: any) => u.primaryRole === "customer").length,
    agent: usersWithRoles.filter((u: any) => u.primaryRole === "agent").length,
    admin: usersWithRoles.filter((u: any) => u.primaryRole === "admin").length,
  };

  const totalRequests = usersWithRoles.reduce((sum: number, u: any) => sum + u.requestCount, 0);
  const totalOrders = usersWithRoles.reduce((sum: number, u: any) => sum + u.orderCount, 0);

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage user roles across the platform</p>
        </motion.div>

        {/* Summary cards */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total users */}
          <div className="rounded-xl border border-border bg-card p-4 text-center col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-foreground/10 mb-2">
              <Users className="h-5 w-5 text-foreground" />
            </div>
            <p className="font-heading text-2xl font-bold text-card-foreground">{usersWithRoles.length}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
          {/* Per-role */}
          {(["customer", "agent", "admin"] as const).map((role) => {
            const rc = roleConfig[role];
            return (
              <div key={role} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${rc.color.split(" ")[0]} mb-2`}>
                  <rc.icon className={`h-5 w-5 ${rc.color.split(" ")[1]}`} />
                </div>
                <p className="font-heading text-2xl font-bold text-card-foreground">{roleCounts[role]}</p>
                <p className="text-xs text-muted-foreground">{rc.label}s</p>
              </div>
            );
          })}
          {/* Requests & Orders totals */}
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <p className="font-heading text-2xl font-bold text-card-foreground">{totalRequests}</p>
            <p className="text-xs text-muted-foreground">Requests</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-amber-500/10 mb-2">
              <Package className="h-5 w-5 text-amber-500" />
            </div>
            <p className="font-heading text-2xl font-bold text-card-foreground">{totalOrders}</p>
            <p className="text-xs text-muted-foreground">Orders</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {["All", "customer", "agent", "admin"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterRole(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  filterRole === f ? "bg-primary/15 text-primary border-primary/30" : "bg-card text-muted-foreground border-border hover:border-primary/20"
                }`}
              >
                {f === "All" ? `All (${usersWithRoles.length})` : `${roleConfig[f]?.label || f} (${roleCounts[f as keyof typeof roleCounts]})`}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
          </div>
        </motion.div>

        {/* Users table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 w-8"></th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">User</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell">Email</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">Phone</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell">Requests</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell">Orders</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">Joined</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Role</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Change Role</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className="p-4"><Skeleton className="h-4 w-16" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground text-sm">No users found.</td>
                  </tr>
                ) : (
                  filtered.map((u: any) => {
                    const rc = roleConfig[u.primaryRole] || roleConfig.customer;
                    const isCurrentUser = u.user_id === user?.id;
                    const isExpanded = expandedUser === u.user_id;
                    return (
                      <>
                        <tr
                          key={u.user_id}
                          className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                          onClick={() => setExpandedUser(isExpanded ? null : u.user_id)}
                        >
                          <td className="p-4 w-8">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </td>
                          <td className="p-4">
                            <p className="text-sm font-medium text-card-foreground">{u.full_name || u.display_name || "-"}</p>
                            {u.full_name && u.display_name && u.full_name !== u.display_name && (
                              <p className="text-xs text-muted-foreground">{u.display_name}</p>
                            )}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{u.email || "-"}</td>
                          <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{u.phone_number || "-"}</td>
                          <td className="p-4 text-sm text-card-foreground hidden lg:table-cell font-medium">{u.requestCount}</td>
                          <td className="p-4 text-sm text-card-foreground hidden lg:table-cell font-medium">{u.orderCount}</td>
                          <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                            {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${rc.color}`}>
                              {rc.label}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            {isCurrentUser ? (
                              <span className="text-xs text-muted-foreground italic">You</span>
                            ) : (
                              <div className="flex gap-1.5">
                                {(["customer", "agent", "admin"] as const).filter(r => r !== u.primaryRole).map((role) => (
                                  <Button
                                    key={role}
                                    size="sm"
                                    variant="outline"
                                    disabled={changeRole.isPending}
                                    onClick={() => changeRole.mutate({ userId: u.user_id, newRole: role })}
                                    className="text-xs h-7 px-2.5"
                                  >
                                    {changeRole.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : roleConfig[role].label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                        {/* Expanded details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <tr key={`${u.user_id}-detail`}>
                              <td colSpan={9} className="p-0">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-6 py-4 bg-muted/10 border-b border-border/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Mail className="h-3.5 w-3.5" /> Email
                                      </div>
                                      <p className="text-sm text-card-foreground">{u.email || "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5" /> Area of Residence
                                      </div>
                                      <p className="text-sm text-card-foreground">{u.area_of_residence || "-"}</p>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5" /> Delivery Address
                                      </div>
                                      <p className="text-sm text-card-foreground whitespace-pre-line">{u.delivery_address || "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <FileText className="h-3.5 w-3.5" /> Sourcing Requests
                                      </div>
                                      <p className="text-sm font-medium text-card-foreground">{u.requestCount}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Package className="h-3.5 w-3.5" /> Orders
                                      </div>
                                      <p className="text-sm font-medium text-card-foreground">{u.orderCount}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        User ID
                                      </div>
                                      <p className="text-xs text-muted-foreground font-mono truncate">{u.user_id}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </>
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

export default AdminUsers;
