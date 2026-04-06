/**
 * Accept Quote Edge Function
 * 
 * Moves order + invoice creation from client-side to server-side for security.
 * Called when a customer accepts a quote on their sourcing request.
 * 
 * POST /accept-quote { quote_id: string }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Parse and validate input
    const body = await req.json();
    const quoteId = body?.quote_id;
    if (!quoteId || typeof quoteId !== "string") {
      return new Response(JSON.stringify({ error: "quote_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Use service role for all DB operations
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 4. Fetch the quote
    const { data: quote, error: quoteErr } = await admin
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .single();
    if (quoteErr || !quote) {
      return new Response(JSON.stringify({ error: "Quote not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (quote.status !== "pending") {
      return new Response(JSON.stringify({ error: `Quote is already ${quote.status}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Fetch the sourcing request and verify ownership
    const { data: request, error: reqErr } = await admin
      .from("sourcing_requests")
      .select("*")
      .eq("id", quote.sourcing_request_id)
      .single();
    if (reqErr || !request) {
      return new Response(JSON.stringify({ error: "Sourcing request not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (request.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "You can only accept quotes on your own requests" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 6. Accept the quote
    await admin.from("quotes").update({ status: "accepted" }).eq("id", quoteId);

    // 7. Update request status to confirmed
    await admin.from("sourcing_requests").update({ status: "confirmed" }).eq("id", request.id);

    // 8. Create order
    const orderNumber = `EQ-${Date.now().toString(36).toUpperCase()}`;
    const totalAmount = Number(quote.total_cost) * request.quantity;
    const addonFees = quote.addon_fees || [];

    const { data: orderData } = await admin.from("orders").insert({
      user_id: user.id,
      order_number: orderNumber,
      product_name: request.title,
      quantity: String(request.quantity),
      total_amount: totalAmount,
      status: "processing",
      sourcing_request_id: request.id,
      quote_id: quoteId,
      notes: `Factory: ${quote.factory_name} - ${quote.currency} ${Number(quote.total_cost).toFixed(2)}/unit`,
    }).select("id").single();

    // 9. Create invoice
    const addonTotal = (addonFees as any[]).reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
    const invoiceTotal = (Number(quote.factory_cost) + Number(quote.service_fee) + Number(quote.logistics_cost) + addonTotal) * request.quantity;

    const { data: invoiceData } = await admin.from("invoices").insert({
      user_id: user.id,
      order_id: orderData?.id || null,
      quote_id: quoteId,
      sourcing_request_id: request.id,
      invoice_number: invoiceNumber,
      factory_cost: Number(quote.factory_cost) * request.quantity,
      china_ops_cost: 0,
      logistics_cost: Number(quote.logistics_cost) * request.quantity,
      service_fee: Number(quote.service_fee) * request.quantity,
      financial_costs: 0,
      total_amount: invoiceTotal,
      currency: quote.currency,
      quantity: request.quantity,
      product_name: request.title,
      factory_name: quote.factory_name,
      delivery_address: request.delivery_address || request.delivery_country || "",
      status: "issued",
    }).select("id").single();

    // 10. Notify the agent
    if (quote.agent_id) {
      await admin.from("notifications").insert({
        user_id: quote.agent_id,
        title: "Quote Accepted",
        message: `Customer accepted your quote for "${request.title}". Invoice issued, awaiting payment.`,
        type: "quote_accepted",
        link: `/agent/requests/${request.id}`,
      });
    }

    // 11. Send invoice email
    if (user.email) {
      const { data: profileData } = await admin
        .from("profiles")
        .select("display_name, full_name")
        .eq("user_id", user.id)
        .single();

      const customerName = profileData?.full_name || profileData?.display_name || undefined;

      try {
        await admin.functions.invoke("send-transactional-email", {
          body: {
            templateName: "invoice-issued",
            recipientEmail: user.email,
            idempotencyKey: `invoice-issued-${invoiceNumber}`,
            templateData: {
              customerName,
              invoiceNumber,
              totalAmount: invoiceTotal.toFixed(2),
              currency: quote.currency,
              productName: request.title,
              invoiceUrl: `${req.headers.get("origin") || "https://sourcing-sparkboard.lovable.app"}/invoice/${invoiceData?.id || ""}`,
            },
          },
        });
      } catch (emailErr) {
        console.error("Failed to send invoice email:", emailErr);
        // Don't fail the whole operation for email
      }
    }

    return new Response(JSON.stringify({
      success: true,
      order_id: orderData?.id,
      invoice_id: invoiceData?.id,
      order_number: orderNumber,
      invoice_number: invoiceNumber,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Accept quote error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
