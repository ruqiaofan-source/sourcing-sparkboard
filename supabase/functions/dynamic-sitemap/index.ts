import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const BASE_URL = "https://equilinq.eu";

const STATIC_ROUTES: Array<{ loc: string; priority: string; changefreq: string }> = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/pricing", priority: "0.9", changefreq: "monthly" },
  { loc: "/how-it-works", priority: "0.9", changefreq: "monthly" },
  { loc: "/customization", priority: "0.8", changefreq: "monthly" },
  { loc: "/quality-control", priority: "0.8", changefreq: "monthly" },
  { loc: "/oem-odm", priority: "0.8", changefreq: "monthly" },
  { loc: "/insights", priority: "0.8", changefreq: "daily" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
  { loc: "/demo", priority: "0.8", changefreq: "monthly" },
  { loc: "/sourcing-guide", priority: "0.9", changefreq: "monthly" },
  { loc: "/how-it-works/submit-sourcing-request", priority: "0.7", changefreq: "monthly" },
  { loc: "/how-it-works/source-and-vet-suppliers", priority: "0.7", changefreq: "monthly" },
  { loc: "/how-it-works/receive-your-quote", priority: "0.7", changefreq: "monthly" },
  { loc: "/how-it-works/accept-and-pay", priority: "0.7", changefreq: "monthly" },
  { loc: "/how-it-works/production-and-monitoring", priority: "0.7", changefreq: "monthly" },
  { loc: "/how-it-works/quality-control-inspection", priority: "0.7", changefreq: "monthly" },
  { loc: "/how-it-works/shipping-and-logistics", priority: "0.7", changefreq: "monthly" },
  { loc: "/how-it-works/delivery-and-support", priority: "0.7", changefreq: "monthly" },
  { loc: "/privacy", priority: "0.4", changefreq: "yearly" },
  { loc: "/cookies", priority: "0.3", changefreq: "yearly" },
];

serve(async (_req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all published articles
    const { data: articles } = await supabase
      .from("insights")
      .select("slug, updated_at, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static routes
    for (const route of STATIC_ROUTES) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${route.loc}</loc>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic article routes
    if (articles) {
      for (const article of articles) {
        const lastmod = article.updated_at
          ? new Date(article.updated_at).toISOString().split("T")[0]
          : undefined;
        xml += `  <url>\n`;
        xml += `    <loc>${BASE_URL}/insights/${article.slug}</loc>\n`;
        if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (e) {
    console.error("Sitemap generation error:", e);
    return new Response("Error generating sitemap", { status: 500 });
  }
});
