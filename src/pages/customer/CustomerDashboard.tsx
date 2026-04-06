import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Plus, ArrowRight, FileText, MessageCircle, Package,
  ShieldCheck, Globe, Zap, CheckCircle, Sparkles
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

const CustomerDashboard = () => {
  const { user } = useAuth();
  useRealtimeSync("customer", user?.id);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["sourcing-requests-summary", user?.id],
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

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-messages-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("messages" as any)
        .select("*", { count: "exact", head: true })
        .neq("sender_id", user!.id) as any;
      return count || 0;
    },
    enabled: !!user,
  });

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "there";
  const hasRequests = requests.length > 0;
  const quotedCount = requests.filter((r: any) => r.status === "quoted").length;

  return (
    <DashboardLayout title="Home">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Hero CTA - the first and biggest thing */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <Link to="/new-request" className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-card to-card p-8 sm:p-10 hover:border-primary/40 transition-all cursor-pointer">
              {/* Glow background */}
              <div
                className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity"
                style={{ background: "radial-gradient(ellipse at 80% 20%, hsl(239 100% 60% / 0.15) 0%, transparent 60%)" }}
              />
              <div
                className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
                style={{ background: "linear-gradient(135deg, transparent 40%, hsl(262 83% 58% / 0.08) 60%, transparent 80%)" }}
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                  className="h-14 w-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/25 transition-colors"
                >
                  <Sparkles className="h-7 w-7 text-primary" />
                </motion.div>

                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
                  {hasRequests ? `Welcome back, ${displayName}` : `Hi ${displayName}, ready to source?`}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
                  {hasRequests
                    ? "Start a new sourcing request: tell us what you need and we'll find verified factories in China."
                    : "Tell us what product you need → We find verified factories → You get a transparent quote → We handle production, QC & delivery."}
                </p>

                <div className="flex items-center gap-4">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 px-8 font-semibold shadow-[0_0_25px_-5px_hsl(239_100%_65%/0.35)] group-hover:shadow-[0_0_35px_-5px_hsl(239_100%_65%/0.5)] transition-shadow">
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Request
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <div className="flex gap-8 mt-7">
                  {[
                    { icon: ShieldCheck, label: "Verified factories" },
                    { icon: Globe, label: "Door-to-door delivery" },
                    { icon: Zap, label: "From 10 units" },
                  ].map((t, i) => (
                    <motion.div
                      key={t.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <t.icon className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-medium text-muted-foreground">{t.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Quick links - secondary actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <Link to="/sourcing-requests" className="group">
            <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 hover:border-primary/30 hover:shadow-[0_0_30px_-8px_hsl(239_100%_65%/0.15)] transition-all h-full flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors text-sm">My Requests</p>
                <p className="text-xs text-muted-foreground">
                  {hasRequests ? `${requests.length} request${requests.length !== 1 ? "s" : ""}` : "No requests yet"}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </Link>

          <Link to="/order-tracking" className="group">
            <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 hover:border-primary/30 hover:shadow-[0_0_30px_-8px_hsl(239_100%_65%/0.15)] transition-all h-full flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-amber-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors text-sm">Order Tracking</p>
                <p className="text-xs text-muted-foreground">Track your orders</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </Link>

          <Link to="/messages" className="group relative">
            <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 hover:border-primary/30 hover:shadow-[0_0_30px_-8px_hsl(239_100%_65%/0.15)] transition-all h-full flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors text-sm">Messages</p>
                <p className="text-xs text-muted-foreground">Chat with your agent</p>
              </div>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[11px] font-bold bg-primary text-primary-foreground">
                  {unreadCount}
                </span>
              )}
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </Link>
        </motion.div>

        {/* Alerts - quotes needing attention */}
        {quotedCount > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
            <Link to="/sourcing-requests" className="flex items-center gap-3 p-4 rounded-xl border border-purple-500/20 bg-purple-500/[0.04] hover:bg-purple-500/[0.07] transition-colors">
              <div className="h-9 w-9 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                <CheckCircle className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{quotedCount} quote{quotedCount !== 1 ? "s" : ""} ready for review</p>
                <p className="text-xs text-muted-foreground">Review pricing and accept or request changes</p>
              </div>
              <ArrowRight className="h-4 w-4 text-purple-500 shrink-0" />
            </Link>
          </motion.div>
        )}

        {/* Recent requests */}
        {hasRequests && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-heading font-semibold text-foreground text-sm">Recent Requests</h2>
              <Link to="/sourcing-requests" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border/50">
              {requests.slice(0, 4).map((r: any, i: number) => {
                const statusMap: Record<string, { label: string; style: string }> = {
                  pending: { label: "Submitted", style: "bg-amber-500/15 text-amber-500 border-amber-500/30" },
                  active: { label: "Sourcing", style: "bg-blue-500/15 text-blue-500 border-blue-500/30" },
                  quoted: { label: "Quote Ready", style: "bg-purple-500/15 text-purple-500 border-purple-500/30" },
                  confirmed: { label: "Confirmed", style: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" },
                };
                const s = statusMap[r.status] || statusMap.pending;
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                  >
                    <Link to={`/sourcing-requests/${r.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors group">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">{r.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{r.quantity} units · {r.currency} {Number(r.budget_per_unit).toFixed(2)}/unit</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ml-3 shrink-0 ${s.style}`}>{s.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
