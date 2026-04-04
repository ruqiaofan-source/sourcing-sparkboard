/**
 * BuckyDrop Webhook Receiver
 *
 * Receives order status updates from BuckyDrop and updates our orders table.
 *
 * Webhook URL to give BuckyDrop:
 *   https://chmoabjmtbbqdrgigspm.supabase.co/functions/v1/buckydrop-webhook
 *
 * Requires secrets:
 *   BUCKYDROP_WEBHOOK_SECRET — Shared secret for verifying webhook authenticity
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("BUCKYDROP_WEBHOOK_SECRET") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── STATUS MAP ──────────────────────────────────────────────────
// TODO: Update these once you have BuckyDrop's actual status values
const STATUS_MAP: Record<string, string> = {
  pending: "processing",
  processing: "processing",
  purchased: "processing",
  shipped: "in_transit",
  in_transit: "in_transit",
  delivered: "delivered",
  quality_check: "qc_review",
  cancelled: "processing", // or handle cancellation differently
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ── Verify webhook authenticity ──
    // TODO: Adjust verification based on BuckyDrop's actual method
    //       (could be header signature, query param, or shared token)
    const authToken = req.headers.get("x-webhook-secret")
      ?? req.headers.get("authorization")?.replace("Bearer ", "")
      ?? new URL(req.url).searchParams.get("secret");

    if (WEBHOOK_SECRET && authToken !== WEBHOOK_SECRET) {
      console.error("Webhook auth failed");
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();

    // ── Extract data from webhook payload ──
    // TODO: Adjust field names to match BuckyDrop's actual webhook payload
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

    // ── Find order by BuckyDrop ID ──
    const { data: order, error: findErr } = await supabase
      .from("orders")
      .select("id, status")
      .eq("buckydrop_order_id", buckyOrderId)
      .single();

    if (findErr || !order) {
      // Try matching by order_number (external_order_id)
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

      // Update found order
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
