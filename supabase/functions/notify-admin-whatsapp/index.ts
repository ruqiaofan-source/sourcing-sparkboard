import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Require an authenticated caller. This function is only meant to be
    // invoked from the app (e.g. when a customer sends a message), never
    // by anonymous internet traffic.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
    // Hard cap caller-supplied strings to limit abuse / Twilio cost.
    const clip = (v: unknown, max: number) =>
      typeof v === "string" ? v.slice(0, max) : "";
    const senderName: string = clip(body.senderName, 80) || "A customer";
    const requestTitle: string = clip(body.requestTitle, 120) || "Sourcing request";
    const messagePreview: string = clip(body.messagePreview, 320);

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