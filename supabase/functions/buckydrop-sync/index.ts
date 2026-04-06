/**
 * BuckyDrop Order Sync Edge Function
 *
 * Two modes:
 *  1. POST /buckydrop-sync { action: "push", order_id }   -- Push an Equilinq order to BuckyDrop
 *  2. POST /buckydrop-sync { action: "pull" }              -- Pull latest statuses from BuckyDrop
 *
 * Requires secrets:
 *   BUCKYDROP_API_KEY   -- Your BuckyDrop Solution API key
 *   BUCKYDROP_API_URL   -- BuckyDrop API base URL (e.g. https://api.buckydrop.com/v1)
 *
 * ============================================================================
 * EXAMPLE REQUEST / RESPONSE SHAPES
 * ============================================================================
 *
 * --- PUSH (create order in BuckyDrop) ---
 *
 * Request to this function:
 *   POST /functions/v1/buckydrop-sync
 *   Headers: { Authorization: "Bearer <supabase-jwt>" }
 *   Body:
 *   {
 *     "action": "push",
 *     "order_id": "a1b2c3d4-5678-90ab-cdef-1234567890ab"
 *   }
 *
 * Outgoing request TO BuckyDrop API (POST /orders):
 *   {
 *     "external_order_id": "EQ-20240315-001",
 *     "product_name": "Custom Silicone Phone Case",
 *     "quantity": 500,
 *     "total_amount": 2450.00,
 *     "notes": "Pantone 186C red, matte finish",
 *     "shipping_address": {                          // TODO: add once address schema confirmed
 *       "name": "Acme GmbH",
 *       "street": "Musterstrasse 12",
 *       "city": "Berlin",
 *       "postal_code": "10115",
 *       "country": "DE"
 *     }
 *   }
 *
 * Expected BuckyDrop API response:
 *   {
 *     "order_id": "BD-88001",                        // or "id", "data.id" -- adjust below
 *     "status": "pending",
 *     "created_at": "2024-03-15T10:30:00Z"
 *   }
 *
 * Response from this function (success):
 *   { "success": true, "buckydrop_order_id": "BD-88001" }
 *
 * Response from this function (already synced):
 *   { "skipped": true, "message": "Order already synced to BuckyDrop", "buckydrop_order_id": "BD-88001" }
 *
 * --- PULL (sync statuses from BuckyDrop) ---
 *
 * Request to this function:
 *   POST /functions/v1/buckydrop-sync
 *   Headers: { Authorization: "Bearer <supabase-jwt>" }
 *   Body:
 *   { "action": "pull" }
 *
 * Outgoing request TO BuckyDrop API (GET /orders/:id):
 *   GET https://api.buckydrop.com/v1/orders/BD-88001
 *
 * Expected BuckyDrop API response for a single order:
 *   {
 *     "order_id": "BD-88001",
 *     "status": "shipped",                           // one of: pending | processing | purchased | shipped | in_transit | delivered | quality_check | cancelled
 *     "tracking_number": "SF1234567890",
 *     "carrier": "SF Express",
 *     "estimated_delivery": "2024-04-02T00:00:00Z",
 *     "updated_at": "2024-03-25T14:22:00Z"
 *   }
 *
 * Response from this function:
 *   { "updated": 3, "total": 5 }
 *
 * --- ERROR ---
 *   { "error": "BUCKYDROP_API_KEY is not configured. Add it via Lovable Secrets." }
 *   { "error": "BuckyDrop API [401]: {\"message\":\"Invalid API key\"}" }
 *
 * ============================================================================
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

// --- CONFIG -----------------------------------------------------------------
const BUCKYDROP_API_URL = Deno.env.get("BUCKYDROP_API_URL") ?? "https://api.buckydrop.com/v1";
const BUCKYDROP_API_KEY = Deno.env.get("BUCKYDROP_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- HELPERS ----------------------------------------------------------------

/**
 * Call the BuckyDrop API.
 *
 * Auth: sends `Authorization: Bearer <BUCKYDROP_API_KEY>`.
 * TODO: Confirm the correct auth header with BuckyDrop docs.
 *       Some APIs use `X-API-Key` instead -- change if needed.
 */
async function buckyFetch(path: string, options: RequestInit = {}) {
  if (!BUCKYDROP_API_KEY) {
    throw new Error("BUCKYDROP_API_KEY is not configured. Add it via Lovable Secrets.");
  }
  const res = await fetch(`${BUCKYDROP_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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

// --- PUSH: Create order in BuckyDrop ----------------------------------------

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
  //
  // Example outgoing payload:
  //   {
  //     "external_order_id": "EQ-20240315-001",
  //     "product_name": "Custom Silicone Phone Case",
  //     "quantity": 500,
  //     "total_amount": 2450.00,
  //     "notes": "Pantone 186C red, matte finish"
  //   }
  //
  // TODO: Add shipping_address, sku, variants, customs_info as needed
  const payload = {
    external_order_id: order.order_number,
    product_name: order.product_name,
    quantity: parseInt(order.quantity, 10) || 1,
    total_amount: order.total_amount,
    notes: order.notes ?? "",
  };

  // 3. POST to BuckyDrop
  //    TODO: Replace "/orders" with the correct BuckyDrop endpoint path
  //    Expected response: { "order_id": "BD-88001", "status": "pending" }
  const result = await buckyFetch("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // 4. Store the BuckyDrop order ID back in our DB
  //    Tries result.order_id, result.id, result.data.id (adjust to match actual response)
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

// --- PULL: Sync statuses from BuckyDrop -------------------------------------

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
      // GET /orders/:buckydrop_order_id
      //
      // Expected BuckyDrop response:
      //   {
      //     "order_id": "BD-88001",
      //     "status": "shipped",
      //     "tracking_number": "SF1234567890",
      //     "carrier": "SF Express",
      //     "estimated_delivery": "2024-04-02T00:00:00Z"
      //   }
      //
      // TODO: Replace with actual BuckyDrop status endpoint if different
      const result = await buckyFetch(`/orders/${order.buckydrop_order_id}`);

      const buckyStatus = result.status ?? result.data?.status;
      const trackingNumber = result.tracking_number ?? result.data?.tracking_number;

      // Map BuckyDrop statuses -> Equilinq statuses
      // TODO: Update these mappings once BuckyDrop confirms their status values
      const statusMap: Record<string, string> = {
        pending: "processing",
        processing: "processing",
        purchased: "processing",
        shipped: "in_transit",
        in_transit: "in_transit",
        delivered: "delivered",
        quality_check: "qc_review",
        cancelled: "processing",
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

// --- MAIN HANDLER -----------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Auth check -- only agents/admins should trigger syncs
    // When called by pg_cron the Authorization header carries the anon key
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
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
