import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://equilinq.eu";
const OG_IMAGE = "https://equilinq.eu/og-image.png";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  keywords?: string;
  noindex?: boolean;
}

export function SEOHead({ title, description, canonical, ogType = "website", ogImage, keywords, noindex }: SEOHeadProps) {
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

    return () => {
      document.title = "Equilinq - Sourcing from China for European SMEs";
    };
  }, [title, description, canonical, canonicalUrl, ogType]);

  return null;
}
