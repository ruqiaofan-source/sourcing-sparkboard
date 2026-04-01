import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://equilinq.eu";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
}

export function SEOHead({ title, description, canonical, ogType = "website" }: SEOHeadProps) {
  const { pathname } = useLocation();
  const canonicalUrl = canonical || `${BASE_URL}${pathname}`;

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
    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", title, "name");
    setMeta("twitter:description", description, "name");

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    return () => {
      document.title = "Equilinq - Sourcing from China for European SMEs";
    };
  }, [title, description, canonical, canonicalUrl, ogType]);

  return null;
}
