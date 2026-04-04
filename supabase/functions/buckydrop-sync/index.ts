/**
 * BuckyDrop Order Sync Edge Function
 *
 * Two modes:
 *  1. POST /buckydrop-sync { action: "push", order_id }   — Push an Equilinq order to BuckyDrop
 *  2. POST /buckydrop-sync { action: "pull" }              — Pull latest statuses from BuckyDrop
 *
 * Requires secrets:
 *   BUCKYDROP_API_KEY   — Your BuckyDrop Solution API key
 *   BUCKYDROP_API_URL   — BuckyDrop API base URL (e.g. https://api.buckydrop.com/v1)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

// ─── CONFIG ──────────────────────────────────────────────────────
const BUCKYDROP_API_URL = Deno.env.get("BUCKYDROP_API_URL") ?? "https://api.buckydrop.com/v1";
const BUCKYDROP_API_KEY = Deno.env.get("BUCKYDROP_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── HELPERS ─────────────────────────────────────────────────────

/**
 * Call the BuckyDrop API.
 * TODO: Adjust headers/auth method once you have the real API docs.
 */
async function buckyFetch(path: string, options: RequestInit = {}) {
  if (!BUCKYDROP_API_KEY) {
    throw new Error("BUCKYDROP_API_KEY is not configured. Add it via Lovable Secrets.");
  }
  const res = await fetch(`${BUCKYDROP_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // TODO: Confirm the correct auth header with BuckyDrop docs
      Authorization: `Bearer ${BUCKYDROP_API_KEY}`,
      ...(options.headers as Record<string, string> ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BuckyDrop API [${res.status}]: ${body}`);
  }
  return res.json();
}

// ─── PUSH: Create order in BuckyDrop ─────────────────────────────
async function pushOrder(orderId: string) {
  // 1. Fetch order from our DB
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, suppliers(name, contact_email)")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (order.buckydrop_order_id) {
    return { skipped: true, message: "Order already synced to BuckyDrop", buckydrop_order_id: order.buckydrop_order_id };
  }

  // 2. Map Equilinq order -> BuckyDrop payload
  //    TODO: Adjust this mapping to match BuckyDrop's actual API schema
  const payload = {
    external_order_id: order.order_number,
    product_name: order.product_name,
    quantity: parseInt(order.quantity, 10) || 1,
    total_amount: order.total_amount,
    notes: order.notes ?? "",
    // Add more fields as required by BuckyDrop:
    // shipping_address, sku, variants, etc.
  };

  // 3. POST to BuckyDrop
  //    TODO: Replace "/orders" with the correct BuckyDrop endpoint
  const result = await buckyFetch("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // 4. Store the BuckyDrop order ID back in our DB
  //    TODO: Adjust `result.order_id` to match the actual response field
  const buckyOrderId = result.order_id ?? result.id ?? result.data?.id;

  await supabase
    .from("orders")
    .update({
      buckydrop_order_id: buckyOrderId,
      buckydrop_status: "submitted",
      buckydrop_synced_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  return { success: true, buckydrop_order_id: buckyOrderId };
}

// ─── PULL: Sync statuses from BuckyDrop ──────────────────────────
async function pullStatuses() {
  // 1. Get all orders that have a BuckyDrop ID but are not yet delivered
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, buckydrop_order_id, buckydrop_status")
    .not("buckydrop_order_id", "is", null)
    .not("status", "eq", "delivered");

  if (error) throw error;
  if (!orders || orders.length === 0) return { updated: 0 };

  let updated = 0;

  for (const order of orders) {
    try {
      // TODO: Replace with actual BuckyDrop status endpoint
      const result = await buckyFetch(`/orders/${order.buckydrop_order_id}`);

      // TODO: Map BuckyDrop status to your status enum
      const buckyStatus = result.status ?? result.data?.status;
      const trackingNumber = result.tracking_number ?? result.data?.tracking_number;

      const statusMap: Record<string, string> = {
        // TODO: Map actual BuckyDrop statuses -> Equilinq statuses
        pending: "processing",
        processing: "processing",
        shipped: "in_transit",
        delivered: "delivered",
        quality_check: "qc_review",
      };

      const mappedStatus = statusMap[buckyStatus] ?? order.buckydrop_status;

      await supabase
        .from("orders")
        .update({
          buckydrop_status: buckyStatus,
          buckydrop_tracking_number: trackingNumber ?? null,
          buckydrop_synced_at: new Date().toISOString(),
          ...(mappedStatus !== order.buckydrop_status ? { status: mappedStatus } : {}),
          ...(trackingNumber ? { notes: `Tracking: ${trackingNumber}` } : {}),
        })
        .eq("id", order.id);

      updated++;
    } catch (err) {
      console.error(`Failed to sync order ${order.id}:`, err);
    }
  }

  return { updated, total: orders.length };
}

// ─── MAIN HANDLER ────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Auth check - only agents/admins should trigger syncs
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claims, error: authError } = await supabaseAuth.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, order_id } = body;

    let result;
    if (action === "push" && order_id) {
      result = await pushOrder(order_id);
    } else if (action === "pull") {
      result = await pullStatuses();
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use { action: "push", order_id } or { action: "pull" }' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("BuckyDrop sync error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
