import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const FROM = Deno.env.get("TWILIO_WHATSAPP_FROM");
    const TO = Deno.env.get("ADMIN_WHATSAPP_NUMBER");

    if (!LOVABLE_API_KEY || !TWILIO_API_KEY || !FROM || !TO) {
      return new Response(
        JSON.stringify({ error: "Missing Twilio configuration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const senderName: string = body.senderName || "A customer";
    const requestTitle: string = body.requestTitle || "Sourcing request";
    const messagePreview: string = body.messagePreview || "";

    const text =
      `New Equilinq message\n` +
      `From: ${senderName}\n` +
      `Request: ${requestTitle}\n\n` +
      `${messagePreview}`;

    const norm = (n: string) => {
      const t = n.trim().replace(/\s+/g, "");
      return t.startsWith("whatsapp:") ? t : `whatsapp:${t}`;
    };

    const params = new URLSearchParams({
      To: norm(TO),
      From: norm(FROM),
      Body: text,
    });

    const resp = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error("Twilio error", resp.status, data);
      return new Response(
        JSON.stringify({ error: "Twilio send failed", status: resp.status, data }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, sid: data.sid }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("notify-admin-whatsapp error", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});