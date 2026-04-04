import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Info, CheckCircle2, Zap, Search, Globe, Briefcase, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const severityConfig: Record<string, { color: string; icon: typeof AlertTriangle }> = {
  high: { color: "destructive", icon: AlertTriangle },
  medium: { color: "default", icon: Info },
  low: { color: "secondary", icon: Info },
  info: { color: "outline", icon: Info },
};

const categoryConfig: Record<string, { label: string; icon: typeof Shield }> = {
  security: { label: "Security", icon: Shield },
  performance: { label: "Performance", icon: Zap },
  seo: { label: "SEO", icon: Globe },
  operations: { label: "Operations", icon: Briefcase },
  summary: { label: "Summary", icon: Search },
};

export default function AdminAudit() {
  const queryClient = useQueryClient();

  const { data: findings = [], isLoading } = useQuery({
    queryKey: ["audit-findings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_findings")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("audit_findings")
        .update({ status: "resolved", resolved_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-findings"] });
      toast.success("Finding marked as resolved");
    },
  });

  const runAuditMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("daily-audit");
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["audit-findings"] });
      toast.success(`Audit complete: ${data.findings_count} findings`);
    },
    onError: (err) => {
      toast.error(`Audit failed: ${err.message}`);
    },
  });

  const summary = findings.find((f) => f.category === "summary");
  const issues = findings.filter((f) => f.category !== "summary");
  const highCount = issues.filter((f) => f.severity === "high").length;
  const mediumCount = issues.filter((f) => f.severity === "medium").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Security & Performance Audit</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Automated daily scan - next run at 8:00 AM CET
            </p>
          </div>
          <Button
            onClick={() => runAuditMutation.mutate()}
            disabled={runAuditMutation.isPending}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${runAuditMutation.isPending ? "animate-spin" : ""}`} />
            Run Audit Now
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-destructive">{highCount}</div>
              <p className="text-sm text-muted-foreground mt-1">High Severity</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-foreground">{mediumCount}</div>
              <p className="text-sm text-muted-foreground mt-1">Medium Severity</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-muted-foreground">{issues.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Total Findings</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Summary */}
        {summary && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                AI Summary - {format(new Date(summary.created_at), "MMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 leading-relaxed">{summary.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Findings list */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : issues.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-semibold text-foreground">All Clear</h3>
              <p className="text-sm text-muted-foreground mt-1">No open findings. Run an audit to check.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {issues.map((finding) => {
              const sev = severityConfig[finding.severity] || severityConfig.low;
              const cat = categoryConfig[finding.category] || categoryConfig.security;
              const SevIcon = sev.icon;
              const CatIcon = cat.icon;

              return (
                <Card key={finding.id} className="hover:border-border transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant={sev.color as any} className="text-[10px] uppercase tracking-wider">
                            <SevIcon className="h-3 w-3 mr-1" />
                            {finding.severity}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                            <CatIcon className="h-3 w-3 mr-1" />
                            {cat.label}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            {format(new Date(finding.created_at), "MMM d, HH:mm")}
                          </span>
                        </div>
                        <h3 className="font-heading text-sm font-semibold text-foreground">{finding.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{finding.description}</p>
                        {finding.suggestion && (
                          <div className="mt-2 text-xs text-primary bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
                            <strong>Suggested fix:</strong> {finding.suggestion}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => resolveMutation.mutate(finding.id)}
                        disabled={resolveMutation.isPending}
                        className="shrink-0"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
