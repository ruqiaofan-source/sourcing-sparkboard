import { useEffect, forwardRef } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://equilinq.eu";
const OG_IMAGE = "https://equilinq.eu/og-image.jpg";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  keywords?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  jsonLd?: Record<string, unknown>;
}

export function SEOHead({ title, description, canonical, ogType = "website", ogImage, keywords, noindex, breadcrumbs, jsonLd }: SEOHeadProps) {
  const { pathname } = useLocation();
  const canonicalUrl = canonical || `${BASE_URL}${pathname}`;
  const imageUrl = ogImage || OG_IMAGE;

  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:site_name", "Equilinq", "property");
    setMeta("og:image", imageUrl, "property");
    setMeta("og:locale", "en_US", "property");
    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", title, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:image", imageUrl, "name");

    if (keywords) setMeta("keywords", keywords);
    if (noindex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    }

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    // Organization JSON-LD (always present)
    const orgId = "equilinq-org-jsonld";
    let orgScript = document.getElementById(orgId) as HTMLScriptElement | null;
    if (!orgScript) {
      orgScript = document.createElement("script");
      orgScript.id = orgId;
      orgScript.type = "application/ld+json";
      document.head.appendChild(orgScript);
    }
    orgScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Equilinq",
      url: BASE_URL,
      logo: `${BASE_URL}/brand/equilinq-logo-dark.png`,
      description: "End-to-end sourcing, QC, customization and logistics from China for European SMEs.",
      email: "contact@equilinq.eu",
      foundingDate: "2024",
      areaServed: "Europe",
      sameAs: [
        "https://www.linkedin.com/company/equilinq/",
        "https://www.tiktok.com/@equilinq",
        "https://www.instagram.com/equilinq.eu/",
      ],
    });

    // WebPage JSON-LD (always present)
    const wpId = "equilinq-webpage-jsonld";
    let wpScript = document.getElementById(wpId) as HTMLScriptElement | null;
    if (!wpScript) {
      wpScript = document.createElement("script");
      wpScript.id = wpId;
      wpScript.type = "application/ld+json";
      document.head.appendChild(wpScript);
    }
    wpScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: description,
      url: canonicalUrl,
      inLanguage: "en",
      isPartOf: {
        "@type": "WebSite",
        name: "Equilinq",
        url: BASE_URL,
      },
    });

    // Breadcrumb JSON-LD
    const bcId = "equilinq-breadcrumb-jsonld";
    let bcScript = document.getElementById(bcId) as HTMLScriptElement | null;
    if (breadcrumbs && breadcrumbs.length > 0) {
      if (!bcScript) {
        bcScript = document.createElement("script");
        bcScript.id = bcId;
        bcScript.type = "application/ld+json";
        document.head.appendChild(bcScript);
      }
      bcScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      });
    } else if (bcScript) {
      bcScript.remove();
    }

    // Custom JSON-LD
    const customId = "equilinq-custom-jsonld";
    let customScript = document.getElementById(customId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!customScript) {
        customScript = document.createElement("script");
        customScript.id = customId;
        customScript.type = "application/ld+json";
        document.head.appendChild(customScript);
      }
      customScript.textContent = JSON.stringify({ "@context": "https://schema.org", ...jsonLd });
    } else if (customScript) {
      customScript.remove();
    }

    return () => {
      document.title = "Equilinq - Sourcing from China for European SMEs";
    };
  }, [title, description, canonical, canonicalUrl, ogType, imageUrl, keywords, noindex, breadcrumbs, jsonLd]);

  return null;
}
