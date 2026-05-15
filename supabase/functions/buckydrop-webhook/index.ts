/**
 * BuckyDrop Webhook Receiver
 *
 * Receives order status updates from BuckyDrop and updates our orders table.
 *
 * Webhook URL to give BuckyDrop:
 *   https://chmoabjmtbbqdrgigspm.supabase.co/functions/v1/buckydrop-webhook
 *
 * Requires secrets:
 *   BUCKYDROP_WEBHOOK_SECRET -- Shared secret for verifying webhook authenticity
 *
 * ============================================================================
 * EXAMPLE REQUEST / RESPONSE SHAPES
 * ============================================================================
 *
 * --- INCOMING WEBHOOK (from BuckyDrop to us) ---
 *
 * BuckyDrop will POST to this URL when an order status changes.
 *
 * Headers (pick whichever BuckyDrop actually sends):
 *   x-webhook-secret: "<shared_secret>"
 *   -- OR --
 *   Authorization: "Bearer <shared_secret>"
 *   -- OR --
 *   Query param: ?secret=<shared_secret>
 *
 * Example payload -- Order shipped:
 *   {
 *     "event": "order.status_changed",
 *     "order_id": "BD-88001",
 *     "external_order_id": "EQ-20240315-001",
 *     "status": "shipped",
 *     "tracking_number": "SF1234567890",
 *     "carrier": "SF Express",
 *     "estimated_delivery": "2024-04-02T00:00:00Z",
 *     "updated_at": "2024-03-25T14:22:00Z"
 *   }
 *
 * Example payload -- Order delivered:
 *   {
 *     "event": "order.status_changed",
 *     "order_id": "BD-88001",
 *     "external_order_id": "EQ-20240315-001",
 *     "status": "delivered",
 *     "tracking_number": "SF1234567890",
 *     "carrier": "SF Express",
 *     "delivered_at": "2024-04-01T09:15:00Z"
 *   }
 *
 * Example payload -- Quality check:
 *   {
 *     "event": "order.status_changed",
 *     "order_id": "BD-88001",
 *     "status": "quality_check",
 *     "qc_notes": "Passed visual inspection, 2 units rejected",
 *     "qc_pass_rate": 0.996
 *   }
 *
 * --- RESPONSES FROM THIS FUNCTION ---
 *
 * Success:
 *   HTTP 200
 *   { "success": true }
 *
 * Missing order_id:
 *   HTTP 400
 *   { "error": "Missing order_id in webhook payload" }
 *
 * Order not found:
 *   HTTP 404
 *   { "error": "Order not found" }
 *
 * Auth failed:
 *   HTTP 403
 *   { "error": "Forbidden" }
 *
 * ============================================================================
 * STATUS MAPPING
 * ============================================================================
 *
 * BuckyDrop status   -> Equilinq status
 * -----------------     ----------------
 * pending            -> processing
 * processing         -> processing
 * purchased          -> processing
 * shipped            -> in_transit
 * in_transit         -> in_transit
 * delivered          -> delivered
 * quality_check      -> qc_review
 * cancelled          -> processing      (TODO: decide on cancellation handling)
 *
 * ============================================================================
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("BUCKYDROP_WEBHOOK_SECRET") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- STATUS MAP -------------------------------------------------------------
// TODO: Update these once you have BuckyDrop's confirmed status values
const STATUS_MAP: Record<string, string> = {
  pending: "processing",
  processing: "processing",
  purchased: "processing",
  shipped: "in_transit",
  in_transit: "in_transit",
  delivered: "delivered",
  quality_check: "qc_review",
  cancelled: "processing",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // -- Verify webhook authenticity --
    // BuckyDrop may send the secret via header or query param.
    // TODO: Confirm which method BuckyDrop uses and remove the others.
    const authToken = req.headers.get("x-webhook-secret")
      ?? req.headers.get("authorization")?.replace("Bearer ", "")
      ?? new URL(req.url).searchParams.get("secret");

    // Fail CLOSED: if the shared secret isn't configured, reject every request
    // rather than silently allowing anonymous webhook posts.
    if (!WEBHOOK_SECRET) {
      console.error("BUCKYDROP_WEBHOOK_SECRET is not configured; refusing all webhook requests");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (authToken !== WEBHOOK_SECRET) {
      console.error("Webhook auth failed");
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // -- Parse incoming webhook payload --
    // Expected shape (see examples in header comment):
    //   { order_id, status, tracking_number?, carrier?, estimated_delivery? }
    const payload = await req.json();

    const buckyOrderId = payload.order_id ?? payload.external_order_id ?? payload.data?.order_id;
    const buckyStatus = payload.status ?? payload.data?.status;
    const trackingNumber = payload.tracking_number ?? payload.data?.tracking_number;
    const eta = payload.estimated_delivery ?? payload.data?.estimated_delivery;

    if (!buckyOrderId) {
      return new Response(
        JSON.stringify({ error: "Missing order_id in webhook payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // -- Find order by BuckyDrop ID --
    const { data: order, error: findErr } = await supabase
      .from("orders")
      .select("id, status")
      .eq("buckydrop_order_id", buckyOrderId)
      .single();

    if (findErr || !order) {
      // Fallback: try matching by order_number (external_order_id)
      const { data: orderByNum, error: findErr2 } = await supabase
        .from("orders")
        .select("id, status")
        .eq("order_number", buckyOrderId)
        .single();

      if (findErr2 || !orderByNum) {
        console.error(`Order not found for BuckyDrop ID: ${buckyOrderId}`);
        return new Response(
          JSON.stringify({ error: "Order not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await updateOrder(orderByNum.id, buckyOrderId, buckyStatus, trackingNumber, eta);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await updateOrder(order.id, buckyOrderId, buckyStatus, trackingNumber, eta);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function updateOrder(
  orderId: string,
  buckyOrderId: string,
  buckyStatus: string | undefined,
  trackingNumber: string | undefined,
  eta: string | undefined
) {
  const mappedStatus = buckyStatus ? STATUS_MAP[buckyStatus] : undefined;

  const updateData: Record<string, unknown> = {
    buckydrop_synced_at: new Date().toISOString(),
  };

  if (buckyStatus) updateData.buckydrop_status = buckyStatus;
  if (buckyOrderId) updateData.buckydrop_order_id = buckyOrderId;
  if (mappedStatus) updateData.status = mappedStatus;
  if (trackingNumber) updateData.buckydrop_tracking_number = trackingNumber;
  if (eta) updateData.eta = eta;

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) {
    console.error(`Failed to update order ${orderId}:`, error);
    throw error;
  }

  console.log(`Order ${orderId} updated: status=${mappedStatus}, tracking=${trackingNumber}`);
}
