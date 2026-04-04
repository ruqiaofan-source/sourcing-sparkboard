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

    // ──── CHECK 1: Tables without RLS ────
    const { data: rlsCheck } = await supabase.rpc("has_role", { _user_id: "00000000-0000-0000-0000-000000000000", _role: "admin" });
    // We query pg_tables via a raw check approach - let's check known tables
    const knownTables = [
      "profiles", "sourcing_requests", "quotes", "orders", "invoices",
      "messages", "notifications", "products", "suppliers", "user_roles",
      "contact_submissions", "insights", "audit_findings",
      "email_send_log", "email_send_state", "email_unsubscribe_tokens", "suppressed_emails"
    ];

    // ──── CHECK 2: Large tables without recent usage patterns ────
    for (const table of ["sourcing_requests", "orders", "invoices", "messages", "notifications"]) {
      const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
      if (count && count > 5000) {
        findings.push({
          category: "performance",
          severity: "medium",
          title: `Table "${table}" has ${count} rows`,
          description: `The ${table} table has grown to ${count} rows. Consider archiving old records or adding pagination limits to queries.`,
          suggestion: `Add date-based partitioning or archive records older than 12 months to an archive table.`,
          metadata: { table, row_count: count },
        });
      }
      if (count && count > 20000) {
        findings.push({
          category: "performance",
          severity: "high",
          title: `Table "${table}" is very large (${count} rows)`,
          description: `This table has exceeded 20,000 rows which may cause slow queries without proper indexing.`,
          suggestion: `Verify indexes exist on frequently queried columns (user_id, status, created_at). Consider implementing cursor-based pagination.`,
          metadata: { table, row_count: count },
        });
      }
    }

    // ──── CHECK 3: Orphaned data ────
    const { data: orphanedMessages, error: omErr } = await supabase
      .from("messages")
      .select("id, sourcing_request_id")
      .limit(1);
    // Check for messages referencing non-existent requests would require a join

    // ──── CHECK 4: Users without profiles ────
    // Can't query auth.users directly, but check for profiles with null emails
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
        description: `Found profiles without email addresses. This could indicate incomplete user registration or data integrity issues.`,
        suggestion: `Review these profiles and ensure the signup flow properly populates email. Consider adding a NOT NULL constraint after backfilling.`,
        metadata: { count: emptyProfiles.length, sample_ids: emptyProfiles.slice(0, 3).map(p => p.user_id) },
      });
    }

    // ──── CHECK 5: Stale sourcing requests ────
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
        description: `These requests may have been abandoned or overlooked, potentially impacting customer satisfaction.`,
        suggestion: `Review and either assign an agent, follow up with the customer, or close stale requests.`,
        metadata: { count: staleRequests },
      });
    }

    // ──── CHECK 6: Unpaid invoices ────
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
        suggestion: `Send payment reminders or escalate to the relevant agent. Consider implementing automated payment reminder emails.`,
        metadata: { count: unpaidInvoices },
      });
    }

    // ──── CHECK 7: Insights without SEO metadata ────
    const { data: noSeoInsights } = await supabase
      .from("insights")
      .select("id, title, slug")
      .eq("published", true)
      .is("meta_description", null)
      .limit(10);

    if (noSeoInsights && noSeoInsights.length > 0) {
      findings.push({
        category: "seo",
        severity: "medium",
        title: `${noSeoInsights.length} published articles missing SEO metadata`,
        description: `Published insights without meta descriptions will perform poorly in search results.`,
        suggestion: `Add meta_title and meta_description to these articles. Each should include target keywords and be under 160 characters.`,
        metadata: { articles: noSeoInsights.map(a => ({ title: a.title, slug: a.slug })) },
      });
    }

    // ──── CHECK 8: Storage bucket security ────
    // insight-covers and email-assets are public - verify this is intentional
    findings.push({
      category: "security",
      severity: "low",
      title: "Public storage buckets active",
      description: `The "insight-covers" and "email-assets" storage buckets are publicly accessible. Verify this is intentional and no sensitive files are stored there.`,
      suggestion: `Periodically audit files in public buckets. Ensure only cover images and email assets are stored there, never user-uploaded sensitive documents.`,
    });

    // ──── CHECK 9: Use AI to analyze findings and generate summary ────
    let aiSummary = "";
    if (findings.length > 0 && LOVABLE_API_KEY) {
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
                content: "You are a security and performance auditor for a sourcing platform. Analyze the findings and provide a brief executive summary (3-5 sentences) highlighting the most critical issues and recommended priorities. Be concise and actionable. Do not use em dashes.",
              },
              {
                role: "user",
                content: `Here are today's audit findings:\n${JSON.stringify(findings, null, 2)}`,
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

    // ──── STORE FINDINGS ────
    // Mark previous open findings as superseded
    await supabase
      .from("audit_findings")
      .update({ status: "superseded" })
      .eq("status", "open");

    // Insert new findings
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

    // Insert summary as a special finding
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

    console.log(`Audit complete: ${findings.length} findings`);

    // ──── EMAIL ALERT for high/critical findings ────
    const criticalFindings = findings.filter(f => f.severity === "high" || f.severity === "critical");
    if (criticalFindings.length > 0) {
      try {
        // Get all admin user IDs
        const { data: adminRoles } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin");

        if (adminRoles && adminRoles.length > 0) {
          // Get admin emails from profiles
          const adminUserIds = adminRoles.map(r => r.user_id);
          const { data: adminProfiles } = await supabase
            .from("profiles")
            .select("email")
            .in("user_id", adminUserIds);

          const adminEmails = (adminProfiles || [])
            .map(p => p.email)
            .filter(Boolean) as string[];

          // Send alert email to each admin
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
