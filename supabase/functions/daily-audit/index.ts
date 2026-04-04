import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const findings: Array<{
      category: string;
      severity: string;
      title: string;
      description: string;
      suggestion: string;
      metadata?: Record<string, unknown>;
    }> = [];
    const autoFixes: Array<{ action: string; details: string; count: number }> = [];

    // ════════════════════════════════════════════
    // AUDIT CHECKS
    // ════════════════════════════════════════════

    // ──── CHECK 1: Large tables ────
    for (const table of ["sourcing_requests", "orders", "invoices", "messages", "notifications"]) {
      const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
      if (count && count > 5000) {
        findings.push({
          category: "performance",
          severity: count > 20000 ? "high" : "medium",
          title: `Table "${table}" has ${count} rows`,
          description: count > 20000
            ? `This table has exceeded 20,000 rows which may cause slow queries without proper indexing.`
            : `The ${table} table has grown to ${count} rows. Consider archiving old records.`,
          suggestion: `Verify indexes exist on frequently queried columns (user_id, status, created_at).`,
          metadata: { table, row_count: count },
        });
      }
    }

    // ──── CHECK 2: Profiles with missing email ────
    const { data: emptyProfiles } = await supabase
      .from("profiles")
      .select("id, user_id, email, display_name")
      .is("email", null)
      .limit(10);

    if (emptyProfiles && emptyProfiles.length > 0) {
      findings.push({
        category: "security",
        severity: "low",
        title: `${emptyProfiles.length} profiles with missing email`,
        description: `Found profiles without email addresses. This could indicate incomplete user registration.`,
        suggestion: `Review these profiles and ensure the signup flow properly populates email.`,
        metadata: { count: emptyProfiles.length, sample_ids: emptyProfiles.slice(0, 3).map(p => p.user_id) },
      });
    }

    // ──── CHECK 3: Stale sourcing requests ────
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count: staleRequests } = await supabase
      .from("sourcing_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .lt("created_at", thirtyDaysAgo);

    if (staleRequests && staleRequests > 0) {
      findings.push({
        category: "operations",
        severity: "medium",
        title: `${staleRequests} sourcing requests pending for 30+ days`,
        description: `These requests may have been abandoned or overlooked.`,
        suggestion: `Review and either assign an agent, follow up with the customer, or close stale requests.`,
        metadata: { count: staleRequests },
      });
    }

    // ──── CHECK 4: Unpaid invoices ────
    const { count: unpaidInvoices } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "unpaid")
      .lt("created_at", thirtyDaysAgo);

    if (unpaidInvoices && unpaidInvoices > 0) {
      findings.push({
        category: "operations",
        severity: "high",
        title: `${unpaidInvoices} invoices unpaid for 30+ days`,
        description: `Outstanding invoices older than 30 days may indicate payment issues or abandoned orders.`,
        suggestion: `Send payment reminders or escalate to the relevant agent.`,
        metadata: { count: unpaidInvoices },
      });
    }

    // ──── CHECK 5: Insights without SEO metadata ────
    const { data: noSeoInsights } = await supabase
      .from("insights")
      .select("id, title, slug, excerpt")
      .eq("published", true)
      .or("meta_description.is.null,meta_description.eq.,meta_title.is.null,meta_title.eq.")
      .limit(20);

    if (noSeoInsights && noSeoInsights.length > 0) {
      findings.push({
        category: "seo",
        severity: "medium",
        title: `${noSeoInsights.length} published articles missing SEO metadata`,
        description: `Published insights without meta descriptions will perform poorly in search results.`,
        suggestion: `Auto-fix will generate SEO metadata using AI.`,
        metadata: { articles: noSeoInsights.map(a => ({ title: a.title, slug: a.slug })) },
      });
    }

    // ──── CHECK 6: Storage bucket security ────
    findings.push({
      category: "security",
      severity: "low",
      title: "Public storage buckets active",
      description: `The "insight-covers" and "email-assets" storage buckets are publicly accessible. Verify this is intentional.`,
      suggestion: `Periodically audit files in public buckets.`,
    });

    // ──── CHECK 7: Read notifications older than 90 days ────
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const { count: oldReadNotifs } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("read", true)
      .lt("created_at", ninetyDaysAgo);

    if (oldReadNotifs && oldReadNotifs > 0) {
      findings.push({
        category: "performance",
        severity: "low",
        title: `${oldReadNotifs} read notifications older than 90 days`,
        description: `Old read notifications consume storage without adding value.`,
        suggestion: `Auto-fix will clean these up.`,
        metadata: { count: oldReadNotifs },
      });
    }

    // ──── CHECK 8: Superseded audit findings older than 30 days ────
    const { count: oldSuperseded } = await supabase
      .from("audit_findings")
      .select("*", { count: "exact", head: true })
      .eq("status", "superseded")
      .lt("created_at", thirtyDaysAgo);

    if (oldSuperseded && oldSuperseded > 100) {
      findings.push({
        category: "performance",
        severity: "low",
        title: `${oldSuperseded} superseded audit findings accumulating`,
        description: `Old superseded findings are piling up in the audit_findings table.`,
        suggestion: `Auto-fix will clean up old superseded findings.`,
        metadata: { count: oldSuperseded },
      });
    }

    // ════════════════════════════════════════════
    // AUTO-FIX PHASE (data-only, never touches frontend)
    // ════════════════════════════════════════════

    // ──── AUTO-FIX 1: Generate SEO metadata for articles missing it ────
    if (noSeoInsights && noSeoInsights.length > 0) {
      try {
        const aiSeoResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "system",
                content: `You generate SEO metadata for blog articles on Equilinq, a China-to-Europe sourcing platform. For each article, produce a JSON array with objects containing: id, meta_title (under 60 chars, include keyword + "| Equilinq"), meta_description (under 155 chars, compelling, include primary keyword). Output ONLY valid JSON, no markdown fences.`,
              },
              {
                role: "user",
                content: JSON.stringify(noSeoInsights.map(a => ({ id: a.id, title: a.title, excerpt: a.excerpt?.substring(0, 200) }))),
              },
            ],
          }),
        });

        if (aiSeoResponse.ok) {
          const aiSeoData = await aiSeoResponse.json();
          const rawContent = aiSeoData.choices?.[0]?.message?.content || "";
          // Strip markdown fences if present
          const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const seoResults = JSON.parse(cleaned);
          let fixedCount = 0;

          for (const item of seoResults) {
            if (item.id && item.meta_title && item.meta_description) {
              const { error } = await supabase
                .from("insights")
                .update({
                  meta_title: item.meta_title.substring(0, 70),
                  meta_description: item.meta_description.substring(0, 160),
                })
                .eq("id", item.id);
              if (!error) fixedCount++;
            }
          }

          if (fixedCount > 0) {
            autoFixes.push({
              action: "Generated SEO metadata",
              details: `AI-generated meta_title and meta_description for ${fixedCount} published articles`,
              count: fixedCount,
            });
          }
        }
      } catch (seoErr) {
        console.error("Auto-fix SEO metadata failed (non-fatal):", seoErr);
      }
    }

    // ──── AUTO-FIX 2: Clean up old read notifications (90+ days) ────
    if (oldReadNotifs && oldReadNotifs > 0) {
      const { count: deletedNotifs } = await supabase
        .from("notifications")
        .delete({ count: "exact" })
        .eq("read", true)
        .lt("created_at", ninetyDaysAgo);

      if (deletedNotifs && deletedNotifs > 0) {
        autoFixes.push({
          action: "Cleaned old notifications",
          details: `Deleted ${deletedNotifs} read notifications older than 90 days`,
          count: deletedNotifs,
        });
      }
    }

    // ──── AUTO-FIX 3: Clean up old superseded audit findings (30+ days) ────
    if (oldSuperseded && oldSuperseded > 100) {
      const { count: deletedFindings } = await supabase
        .from("audit_findings")
        .delete({ count: "exact" })
        .eq("status", "superseded")
        .lt("created_at", thirtyDaysAgo);

      if (deletedFindings && deletedFindings > 0) {
        autoFixes.push({
          action: "Cleaned old audit findings",
          details: `Deleted ${deletedFindings} superseded findings older than 30 days`,
          count: deletedFindings,
        });
      }
    }

    // ──── AUTO-FIX 4: Clean up old DLQ email logs (30+ days) ────
    const { count: oldDlqLogs } = await supabase
      .from("email_send_log")
      .select("*", { count: "exact", head: true })
      .eq("status", "dlq")
      .lt("created_at", thirtyDaysAgo);

    if (oldDlqLogs && oldDlqLogs > 50) {
      // Keep recent ones, clean old failures
      const { count: deletedLogs } = await supabase
        .from("email_send_log")
        .delete({ count: "exact" })
        .eq("status", "dlq")
        .lt("created_at", ninetyDaysAgo);

      if (deletedLogs && deletedLogs > 0) {
        autoFixes.push({
          action: "Cleaned old failed email logs",
          details: `Deleted ${deletedLogs} DLQ email log entries older than 90 days`,
          count: deletedLogs,
        });
      }
    }

    // ──── AUTO-FIX 5: Normalize profile display names (trim whitespace) ────
    const { data: messynames } = await supabase
      .from("profiles")
      .select("id, display_name")
      .not("display_name", "is", null)
      .limit(500);

    if (messynames) {
      let trimmedCount = 0;
      for (const p of messynames) {
        const trimmed = p.display_name?.trim();
        if (trimmed && trimmed !== p.display_name) {
          await supabase.from("profiles").update({ display_name: trimmed }).eq("id", p.id);
          trimmedCount++;
        }
      }
      if (trimmedCount > 0) {
        autoFixes.push({
          action: "Trimmed profile display names",
          details: `Fixed whitespace in ${trimmedCount} display names`,
          count: trimmedCount,
        });
      }
    }

    // ════════════════════════════════════════════
    // AI SUMMARY
    // ════════════════════════════════════════════

    let aiSummary = "";
    if ((findings.length > 0 || autoFixes.length > 0) && LOVABLE_API_KEY) {
      try {
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "system",
                content: "You are a security and performance auditor for a sourcing platform. Provide a brief executive summary (3-5 sentences) of the audit findings and any auto-fixes applied. Be concise and actionable. Do not use em dashes.",
              },
              {
                role: "user",
                content: `Findings:\n${JSON.stringify(findings, null, 2)}\n\nAuto-fixes applied:\n${JSON.stringify(autoFixes, null, 2)}`,
              },
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiSummary = aiData.choices?.[0]?.message?.content || "";
        }
      } catch (aiErr) {
        console.error("AI summary generation failed (non-fatal):", aiErr);
      }
    }

    // ════════════════════════════════════════════
    // STORE FINDINGS
    // ════════════════════════════════════════════

    await supabase
      .from("audit_findings")
      .update({ status: "superseded" })
      .eq("status", "open");

    if (findings.length > 0) {
      const { error: insertError } = await supabase
        .from("audit_findings")
        .insert(findings.map(f => ({
          category: f.category,
          severity: f.severity,
          title: f.title,
          description: f.description,
          suggestion: f.suggestion,
          metadata: f.metadata || null,
          status: "open",
        })));

      if (insertError) {
        console.error("Failed to insert findings:", insertError);
      }
    }

    // Insert auto-fix results as findings
    if (autoFixes.length > 0) {
      await supabase.from("audit_findings").insert(
        autoFixes.map(fix => ({
          category: "auto-fix",
          severity: "info",
          title: fix.action,
          description: fix.details,
          suggestion: null,
          metadata: { count: fix.count },
          status: "open",
        }))
      );
    }

    // Insert summary
    if (aiSummary) {
      await supabase.from("audit_findings").insert({
        category: "summary",
        severity: "info",
        title: `Daily Audit Summary - ${new Date().toISOString().split("T")[0]}`,
        description: aiSummary,
        suggestion: null,
        status: "open",
      });
    }

    console.log(`Audit complete: ${findings.length} findings, ${autoFixes.length} auto-fixes`);

    // ════════════════════════════════════════════
    // EMAIL ALERT for high/critical findings
    // ════════════════════════════════════════════

    const criticalFindings = findings.filter(f => f.severity === "high" || f.severity === "critical");
    if (criticalFindings.length > 0) {
      try {
        const { data: adminRoles } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin");

        if (adminRoles && adminRoles.length > 0) {
          const adminUserIds = adminRoles.map(r => r.user_id);
          const { data: adminProfiles } = await supabase
            .from("profiles")
            .select("email")
            .in("user_id", adminUserIds);

          const adminEmails = (adminProfiles || [])
            .map(p => p.email)
            .filter(Boolean) as string[];

          for (const email of adminEmails) {
            const alertRes = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              },
              body: JSON.stringify({
                template_name: "audit-alert",
                recipient_email: email,
                templateData: {
                  findings: criticalFindings,
                  summary: aiSummary,
                  date: new Date().toISOString().split("T")[0],
                },
              }),
            });
            if (!alertRes.ok) {
              console.error(`Failed to send audit alert to ${email}:`, await alertRes.text());
            } else {
              console.log(`Audit alert sent to ${email}`);
            }
          }
        }
      } catch (alertErr) {
        console.error("Failed to send audit alert emails (non-fatal):", alertErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        findings_count: findings.length,
        auto_fixes_count: autoFixes.length,
        auto_fixes: autoFixes,
        summary: aiSummary,
        findings,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("daily-audit error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
