/**
 * Vite plugin that injects correct SEO meta tags into the built index.html
 * for each public route at build time. This creates per-route HTML files
 * so that crawlers see the correct title, description, canonical, and OG tags
 * without needing JavaScript rendering.
 *
 * Works by copying the built index.html into route-specific directories
 * (e.g., dist/pricing/index.html) with the correct meta tags injected.
 */
import type { Plugin } from "vite";
import { routeSeoMap } from "./src/seo/routes";
import fs from "fs";
import path from "path";

const BASE_URL = "https://www.equilinq.eu";

function injectMeta(html: string, route: string, meta: { title: string; description: string; keywords?: string }): string {
  const canonicalUrl = `${BASE_URL}${route === "/" ? "" : route}`;

  // Replace title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${meta.title}</title>`
  );

  // Replace or inject meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${meta.description}">`
  );

  // Replace or inject keywords
  if (meta.keywords) {
    html = html.replace(
      /<meta name="keywords" content="[^"]*">/,
      `<meta name="keywords" content="${meta.keywords}">`
    );
  }

  // Remove any existing canonical to avoid duplicates
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>\s*\n?/g, "");

  // Inject canonical + OG/Twitter tags before </head>
  html = html.replace(
    "</head>",
    `  <link rel="canonical" href="${canonicalUrl}" />\n` +
    `  <meta property="og:title" content="${meta.title}" />\n` +
    `  <meta property="og:description" content="${meta.description}" />\n` +
    `  <meta property="og:url" content="${canonicalUrl}" />\n` +
    `  <meta name="twitter:title" content="${meta.title}" />\n` +
    `  <meta name="twitter:description" content="${meta.description}" />\n` +
    `  </head>`
  );

  return html;
}

export default function seoPrerender(): Plugin {
  return {
    name: "seo-prerender",
    apply: "build",
    enforce: "post",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexPath = path.join(distDir, "index.html");

      if (!fs.existsSync(indexPath)) {
        console.warn("[seo-prerender] dist/index.html not found, skipping.");
        return;
      }

      const baseHtml = fs.readFileSync(indexPath, "utf-8");

      // Inject correct meta for the homepage index.html
      const homeMeta = routeSeoMap["/"];
      if (homeMeta) {
        const homeHtml = injectMeta(baseHtml, "/", homeMeta);
        fs.writeFileSync(indexPath, homeHtml, "utf-8");
        console.log("[seo-prerender] Injected SEO for /");
      }

      // Create route-specific HTML files
      for (const [route, meta] of Object.entries(routeSeoMap)) {
        if (route === "/") continue;

        const routeDir = path.join(distDir, route.slice(1)); // remove leading /
        const routeIndex = path.join(routeDir, "index.html");

        // Skip if directory already has an index.html (shouldn't happen for SPA)
        fs.mkdirSync(routeDir, { recursive: true });

        const routeHtml = injectMeta(baseHtml, route, meta);
        fs.writeFileSync(routeIndex, routeHtml, "utf-8");
        console.log(`[seo-prerender] Injected SEO for ${route}`);
      }
    },
  };
}