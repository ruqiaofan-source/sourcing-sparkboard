import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Globe, Eye, Clock, TrendingDown, TrendingUp, Monitor, Smartphone,
  AlertTriangle, CheckCircle, Database, FileWarning, Loader2, RefreshCw
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "10px",
  color: "hsl(var(--card-foreground))",
  fontFamily: "Inter, sans-serif",
  fontSize: "13px",
};

/* Static page-by-page analytics data structure for the admin.
   In production this would come from an analytics API; here we surface
   the data from the project analytics integration. */

interface PageMetric {
  page: string;
  views: number;
  bounceRate: number;
  avgDuration: number;
  trend: "up" | "down" | "flat";
}

interface DataQualityIssue {
  table: string;
  field: string;
  issue: string;
  severity: "error" | "warning" | "info";
  count: number;
  suggestion: string;
}

const AdminAnalytics = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("pages");

  // Fetch DB data quality metrics
  const { data: qualityData, isLoading: qualityLoading, refetch: refetchQuality } = useQuery({
    queryKey: ["admin-data-quality"],
    queryFn: async () => {
      const [
        profilesRes,
        requestsRes,
        ordersRes,
        insightsRes,
        testimonialsRes,
        contactRes,
        agentsRes,
      ] = await Promise.all([
        supabase.from("profiles").select("user_id, display_name, email, full_name, phone_number, area_of_residence"),
        supabase.from("sourcing_requests").select("id, title, description, status, user_id, budget_per_unit, delivery_country, created_at, updated_at"),
        supabase.from("orders").select("id, order_number, product_name, status, eta, total_amount, user_id"),
        supabase.from("insights").select("id, title, slug, excerpt, content, meta_title, meta_description, cover_image_url, published"),
        supabase.from("testimonials").select("id, customer_name, content, rating, is_published, company"),
        supabase.from("contact_submissions").select("id, name, email, message, reason"),
        supabase.from("agents").select("id, name, user_id, status, bio"),
      ]);

      const profiles = profilesRes.data || [];
      const requests = requestsRes.data || [];
      const orders = ordersRes.data || [];
      const insights = insightsRes.data || [];
      const testimonials = testimonialsRes.data || [];
      const contacts = contactRes.data || [];
      const agents = agentsRes.data || [];

      const issues: DataQualityIssue[] = [];

      // Profile completeness
      const missingNames = profiles.filter((p: any) => !p.full_name || p.full_name.trim() === "");
      if (missingNames.length > 0) {
        issues.push({
          table: "profiles",
          field: "full_name",
          issue: "Missing full name",
          severity: "warning",
          count: missingNames.length,
          suggestion: "Prompt users to complete their profile on next login",
        });
      }

      const missingPhone = profiles.filter((p: any) => !p.phone_number);
      if (missingPhone.length > 0) {
        issues.push({
          table: "profiles",
          field: "phone_number",
          issue: "Missing phone number",
          severity: "info",
          count: missingPhone.length,
          suggestion: "Add phone prompt to settings page",
        });
      }

      const missingArea = profiles.filter((p: any) => !p.area_of_residence);
      if (missingArea.length > 0) {
        issues.push({
          table: "profiles",
          field: "area_of_residence",
          issue: "Missing area of residence",
          severity: "info",
          count: missingArea.length,
          suggestion: "Useful for delivery estimation and regional analytics",
        });
      }

      // Insights SEO
      const missingMeta = insights.filter((i: any) => !i.meta_description || i.meta_description.trim() === "");
      if (missingMeta.length > 0) {
        issues.push({
          table: "insights",
          field: "meta_description",
          issue: "Missing SEO meta description",
          severity: "warning",
          count: missingMeta.length,
          suggestion: "Auto-generated on save, but review for quality",
        });
      }

      const missingCover = insights.filter((i: any) => !i.cover_image_url && i.published);
      if (missingCover.length > 0) {
        issues.push({
          table: "insights",
          field: "cover_image_url",
          issue: "Published articles without cover image",
          severity: "error",
          count: missingCover.length,
          suggestion: "Articles with images get 2x more engagement",
        });
      }

      const shortExcerpts = insights.filter((i: any) => i.excerpt && i.excerpt.length < 50 && i.published);
      if (shortExcerpts.length > 0) {
        issues.push({
          table: "insights",
          field: "excerpt",
          issue: "Very short excerpt (under 50 chars)",
          severity: "warning",
          count: shortExcerpts.length,
          suggestion: "Excerpts should be 120-160 chars for best SEO preview",
        });
      }

      // Orders without ETA
      const noEta = orders.filter((o: any) => !o.eta && o.status !== "delivered");
      if (noEta.length > 0) {
        issues.push({
          table: "orders",
          field: "eta",
          issue: "Active orders without estimated delivery",
          severity: "warning",
          count: noEta.length,
          suggestion: "Set ETAs to improve customer experience",
        });
      }

      // Stale requests
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const staleRequests = requests.filter(
        (r: any) => r.status === "pending" && r.updated_at < oneWeekAgo
      );
      if (staleRequests.length > 0) {
        issues.push({
          table: "sourcing_requests",
          field: "status",
          issue: "Pending requests older than 7 days",
          severity: "error",
          count: staleRequests.length,
          suggestion: "Assign agents or follow up with customers",
        });
      }

      // Testimonials without company
      const noCompany = testimonials.filter((t: any) => !t.company && t.is_published);
      if (noCompany.length > 0) {
        issues.push({
          table: "testimonials",
          field: "company",
          issue: "Published testimonials without company name",
          severity: "info",
          count: noCompany.length,
          suggestion: "Company names add credibility to social proof",
        });
      }

      // Agents without bio
      const noBio = agents.filter((a: any) => !a.bio || a.bio.trim() === "");
      if (noBio.length > 0) {
        issues.push({
          table: "agents",
          field: "bio",
          issue: "Agents without biography",
          severity: "warning",
          count: noBio.length,
          suggestion: "Agent bios help build customer trust",
        });
      }

      // Compute overall score
      const totalChecks = 10;
      const errorCount = issues.filter((i) => i.severity === "error").length;
      const warningCount = issues.filter((i) => i.severity === "warning").length;
      const score = Math.max(0, Math.round(100 - errorCount * 15 - warningCount * 5));

      return { issues, score, totalProfiles: profiles.length, totalInsights: insights.length };
    },
    enabled: !!user,
  });

  // Static page analytics (from known traffic data)
  const pageMetrics: PageMetric[] = useMemo(() => [
    { page: "/", views: 96, bounceRate: 67, avgDuration: 46, trend: "up" },
    { page: "/pricing", views: 16, bounceRate: 72, avgDuration: 38, trend: "flat" },
    { page: "/how-it-works", views: 9, bounceRate: 55, avgDuration: 85, trend: "up" },
    { page: "/insights", views: 9, bounceRate: 60, avgDuration: 62, trend: "up" },
    { page: "/contact", views: 7, bounceRate: 45, avgDuration: 95, trend: "up" },
    { page: "/auth", views: 4, bounceRate: 80, avgDuration: 22, trend: "down" },
    { page: "/customization", views: 3, bounceRate: 65, avgDuration: 50, trend: "flat" },
    { page: "/demo", views: 2, bounceRate: 40, avgDuration: 120, trend: "up" },
  ], []);

  const trafficSources = useMemo(() => [
    { name: "Direct", value: 82, color: "hsl(239, 84%, 67%)" },
    { name: "Google", value: 13, color: "hsl(142, 71%, 45%)" },
    { name: "LinkedIn", value: 4, color: "hsl(199, 89%, 48%)" },
    { name: "Bing", value: 3, color: "hsl(43, 96%, 56%)" },
    { name: "Social", value: 2, color: "hsl(340, 82%, 52%)" },
  ], []);

  const deviceData = useMemo(() => [
    { name: "Desktop", value: 75, color: "hsl(239, 84%, 67%)" },
    { name: "Mobile", value: 30, color: "hsl(142, 71%, 45%)" },
  ], []);

  const bounceRecommendations = useMemo(() => {
    const recs: { page: string; issue: string; fix: string; impact: "high" | "medium" | "low" }[] = [];
    pageMetrics.forEach((p) => {
      if (p.bounceRate > 75) {
        recs.push({
          page: p.page,
          issue: `High bounce rate (${p.bounceRate}%)`,
          fix: p.page === "/auth" ? "Add social proof or trust signals near login" : "Add engaging CTA above the fold",
          impact: "high",
        });
      }
      if (p.avgDuration < 30 && p.views > 3) {
        recs.push({
          page: p.page,
          issue: `Very short session (${p.avgDuration}s avg)`,
          fix: "Add interactive elements or video content to increase dwell time",
          impact: "medium",
        });
      }
    });
    // General recommendations
    recs.push({
      page: "All pages",
      issue: "72% overall bounce rate",
      fix: "Implemented: lazy loading, link preloading, video preload optimization",
      impact: "high",
    });
    return recs;
  }, [pageMetrics]);

  const sevIcon = (s: string) => {
    if (s === "error") return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (s === "warning") return <FileWarning className="h-4 w-4 text-amber-500" />;
    return <CheckCircle className="h-4 w-4 text-blue-500" />;
  };

  const sevBadge = (s: string) => {
    const styles: Record<string, string> = {
      error: "bg-red-500/10 text-red-500 border-red-500/20",
      warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };
    return <Badge variant="outline" className={`text-[10px] uppercase ${styles[s]}`}>{s}</Badge>;
  };

  return (
    <DashboardLayout title="Site Analytics">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-xl font-bold text-foreground">Site Analytics & Data Health</h1>
          <p className="text-sm text-muted-foreground mt-1">Page performance, bounce analysis, and data quality</p>
        </motion.div>

        {/* Top KPIs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Weekly Visitors", value: "106", icon: Globe, accent: "text-primary" },
            { label: "Pageviews", value: "189", icon: Eye, accent: "text-emerald-500" },
            { label: "Avg Session", value: "62s", icon: Clock, accent: "text-blue-500" },
            { label: "Bounce Rate", value: "72%", icon: TrendingDown, accent: "text-amber-500" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
              </div>
              <p className="font-heading text-2xl font-bold text-card-foreground">{kpi.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="bg-muted/30 border border-border">
            <TabsTrigger value="pages">Page Analytics</TabsTrigger>
            <TabsTrigger value="bounce">Bounce Fixes</TabsTrigger>
            <TabsTrigger value="quality">Data Quality</TabsTrigger>
          </TabsList>

          {/* PAGE ANALYTICS */}
          <TabsContent value="pages" className="space-y-6">
            {/* Page-by-page table */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-heading font-semibold text-card-foreground mb-4">Page Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 text-xs text-muted-foreground font-medium">Page</th>
                      <th className="pb-3 text-xs text-muted-foreground font-medium text-right">Views</th>
                      <th className="pb-3 text-xs text-muted-foreground font-medium text-right">Bounce Rate</th>
                      <th className="pb-3 text-xs text-muted-foreground font-medium text-right">Avg Duration</th>
                      <th className="pb-3 text-xs text-muted-foreground font-medium text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageMetrics.map((p) => (
                      <tr key={p.page} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="py-3 font-medium text-card-foreground">{p.page}</td>
                        <td className="py-3 text-right text-muted-foreground">{p.views}</td>
                        <td className="py-3 text-right">
                          <span className={p.bounceRate > 70 ? "text-red-500 font-medium" : p.bounceRate > 50 ? "text-amber-500" : "text-emerald-500"}>
                            {p.bounceRate}%
                          </span>
                        </td>
                        <td className="py-3 text-right text-muted-foreground">{p.avgDuration}s</td>
                        <td className="py-3 text-right">
                          {p.trend === "up" ? <TrendingUp className="h-4 w-4 text-emerald-500 ml-auto" /> :
                           p.trend === "down" ? <TrendingDown className="h-4 w-4 text-red-500 ml-auto" /> :
                           <span className="text-muted-foreground text-xs">--</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h3 className="font-heading font-semibold text-card-foreground mb-4">Traffic Sources</h3>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                        {trafficSources.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend formatter={(value) => <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "11px" }}>{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Device Split */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h3 className="font-heading font-semibold text-card-foreground mb-4">Device Breakdown</h3>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deviceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={70} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="value" name="Visitors" radius={[0, 6, 6, 0]} barSize={28}>
                        {deviceData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Monitor className="h-4 w-4" /> 71% Desktop</span>
                  <span className="flex items-center gap-1.5"><Smartphone className="h-4 w-4" /> 29% Mobile</span>
                </div>
              </motion.div>
            </div>

            {/* Top countries */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-heading font-semibold text-card-foreground mb-4">Top Countries</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { country: "US", visitors: 46, pct: 43 },
                  { country: "NL", visitors: 27, pct: 25 },
                  { country: "GB", visitors: 4, pct: 4 },
                  { country: "DE", visitors: 4, pct: 4 },
                  { country: "Other", visitors: 25, pct: 24 },
                ].map((c) => (
                  <div key={c.country} className="text-center p-4 rounded-lg bg-muted/20 border border-border/50">
                    <p className="font-heading text-lg font-bold text-card-foreground">{c.country}</p>
                    <p className="text-xs text-muted-foreground">{c.visitors} visitors ({c.pct}%)</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* BOUNCE FIXES */}
          <TabsContent value="bounce" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="h-5 w-5 text-amber-500" />
                <h3 className="font-heading font-semibold text-card-foreground">Bounce Rate Analysis & Fixes</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Automated analysis of pages with high bounce rates, plus implemented and recommended optimizations.
              </p>

              {/* Implemented fixes */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Implemented Optimizations
                </h4>
                <div className="space-y-2">
                  {[
                    "Lazy loading for all below-fold sections on landing page",
                    "Video preload link injection on /demo for faster mobile playback",
                    "Code-split routes with Suspense boundaries",
                    "Image lazy loading with loading='lazy' on non-critical images",
                    "Preconnect hints for external resources",
                    "SEO meta tags injected at build time via prerender plugin",
                  ].map((fix, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/20">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-card-foreground">{fix}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <h4 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Active Recommendations
              </h4>
              <div className="space-y-2">
                {bounceRecommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase shrink-0 mt-0.5 ${
                        rec.impact === "high" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        rec.impact === "medium" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}
                    >
                      {rec.impact}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-card-foreground">{rec.page}: {rec.issue}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bounce by page chart */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-heading font-semibold text-card-foreground mb-4">Bounce Rate by Page</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="page" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, "Bounce Rate"]} />
                    <Bar dataKey="bounceRate" name="Bounce Rate" radius={[6, 6, 0, 0]} barSize={32}>
                      {pageMetrics.map((entry, i) => (
                        <Cell key={i} fill={entry.bounceRate > 70 ? "hsl(0, 72%, 51%)" : entry.bounceRate > 50 ? "hsl(43, 96%, 56%)" : "hsl(142, 71%, 45%)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </TabsContent>

          {/* DATA QUALITY */}
          <TabsContent value="quality" className="space-y-6">
            {/* Score card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="font-heading font-semibold text-card-foreground">Data Quality Score</h3>
                </div>
                <button onClick={() => refetchQuality()} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
              </div>

              {qualityLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      <svg className="h-24 w-24" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke={
                            (qualityData?.score || 0) >= 80 ? "hsl(142, 71%, 45%)" :
                            (qualityData?.score || 0) >= 60 ? "hsl(43, 96%, 56%)" :
                            "hsl(0, 72%, 51%)"
                          }
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${((qualityData?.score || 0) / 100) * 264} 264`}
                          transform="rotate(-90 50 50)"
                        />
                        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
                          className="fill-card-foreground font-heading text-xl font-bold" fontSize="22">
                          {qualityData?.score || 0}
                        </text>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {qualityData?.issues.filter((i) => i.severity === "error").length || 0} errors,{" "}
                        {qualityData?.issues.filter((i) => i.severity === "warning").length || 0} warnings,{" "}
                        {qualityData?.issues.filter((i) => i.severity === "info").length || 0} info
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Across {qualityData?.totalProfiles || 0} profiles and {qualityData?.totalInsights || 0} articles
                      </p>
                    </div>
                  </div>

                  {/* Issues list */}
                  <div className="space-y-2">
                    {(qualityData?.issues || []).map((issue, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                        {sevIcon(issue.severity)}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-card-foreground">{issue.issue}</span>
                            {sevBadge(issue.severity)}
                            <Badge variant="outline" className="text-[10px] bg-muted/50">{issue.count} records</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">{issue.table}.{issue.field}</span> - {issue.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(qualityData?.issues || []).length === 0 && (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        All data quality checks passed!
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;