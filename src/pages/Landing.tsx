import { useState, useEffect, useRef, useCallback, lazy, Suspense, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, DollarSign, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { useTheme } from "@/hooks/useTheme";

import logoSoleRunning from "@/assets/logos/sole-running.webp";
import logoLKK from "@/assets/logos/lkk.webp";
import logoIMMO from "@/assets/logos/immo.webp";
import logoBuckyDrop from "@/assets/logos/buckydrop.webp";
import dashboardPreview from "@/assets/dashboard-preview-real.png";

/* ── Lazy-loaded below-fold sections ── */
const LandingBenefits = lazy(() => import("@/components/landing/LandingBenefits"));
const LandingTrending = lazy(() => import("@/components/landing/LandingTrending"));
const LandingFounder = lazy(() => import("@/components/landing/LandingFounder"));
const LandingInsights = lazy(() => import("@/components/landing/LandingInsights"));
const LandingFAQ = lazy(() => import("@/components/landing/LandingFAQ"));
const LandingCTA = lazy(() => import("@/components/landing/LandingCTA"));
const LandingFeatureTabs = lazy(() => import("@/components/landing/LandingFeatureTabs"));

/* ──────────────────── DATA ──────────────────── */

/* ──────────────────── SHARED COMPONENTS ──────────────────── */

function AnimatedGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.16) 0%, hsl(var(--primary) / 0.07) 42%, transparent 72%)",
          top: "-25%", right: "-15%",
        }}
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.05, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--chart-2) / 0.08) 0%, hsl(var(--primary) / 0.05) 45%, transparent 72%)",
          bottom: "-15%", left: "-10%",
        }}
        animate={{ x: [0, -40, 30, 0], y: [0, 30, -40, 0], scale: [1, 0.95, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(30 80% 55% / 0.04) 0%, transparent 60%)", top: "30%", left: "50%" }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, transparent 20%, hsl(var(--primary) / 0.07) 45%, hsl(var(--chart-2) / 0.05) 55%, transparent 80%)" }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3) * 2}px`, height: `${2 + (i % 3) * 2}px`,
            left: `${5 + i * 6}%`, top: `${10 + (i % 5) * 18}%`,
            background: i % 3 === 0 ? "hsl(var(--primary) / 0.4)" : i % 3 === 1 ? "hsl(var(--chart-2) / 0.3)" : "hsl(var(--primary) / 0.2)",
          }}
          animate={{ y: [0, -(30 + i * 5), 0], x: [0, (i % 2 === 0 ? 20 : -20), 0], opacity: [0.1, 0.6, 0.1], scale: [1, 1.8, 1] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </div>
  );
}

function Marquee({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) {
  return (
    <div className="group/marquee overflow-hidden w-full" style={{ minHeight: 64 }}>
      <div
        className="flex w-max gap-8 sm:gap-12"
        style={{ animation: `marquee ${speed}s linear infinite` }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const [displayed, setDisplayed] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const numericPart = value.replace(/[^0-9.]/g, "");
  const prefix = value.match(/^[^0-9]*/)?.[0] || "";
  const suffix = value.match(/[^0-9.]*$/)?.[0] || "";

  useEffect(() => {
    if (!isInView) return;
    const target = parseFloat(numericPart);
    const duration = 2000;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayed(`${prefix}${Math.round(eased * target)}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, numericPart, prefix, suffix]);

  return (
    <motion.div ref={ref} whileHover={{ scale: 1.05, y: -2 }} transition={{ type: "spring", stiffness: 300 }} className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm px-4 py-4 sm:px-5 sm:py-5 text-center">
      <p className="font-heading text-3xl sm:text-4xl font-bold text-foreground">{displayed}</p>
      <p className="mt-1 text-sm sm:text-base text-muted-foreground">{label}</p>
    </motion.div>
  );
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

function RevealHeading({ children, className = "", as: Tag = "h2" }: { children: string; className?: string; as?: "h1" | "h2" | "h3" }) {
  const words = children.split(" ");
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span className="inline-block" initial={{ y: "100%", opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}>
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }, [x, y]);
  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ x: springX, y: springY }} whileTap={{ scale: 0.97 }} className={className}>
      {children}
    </motion.div>
  );
}

/* ──────────────────── SOCIAL PROOF (kept inline -- above fold for SEO) ──────────────────── */

function SocialProofSection({ trustpilotStats }: { trustpilotStats?: { review_count: number; average_rating: number } | null }) {
  const tpRating = trustpilotStats?.average_rating ?? 4.0;
  const tpCount = trustpilotStats?.review_count ?? 5;
  const tpFullStars = Math.floor(tpRating);
  const tpHasHalf = tpRating - tpFullStars >= 0.3;
  const tpEmptyStars = 5 - tpFullStars - (tpHasHalf ? 1 : 0);

  const fadeUp = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
      <section className="py-16 px-4 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="text-center mb-10">
          <motion.span initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3 }} className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4 block">Trusted by SMEs</motion.span>

          <RevealHeading className="font-heading text-3xl sm:text-4xl font-bold text-foreground">What Our Clients Say</RevealHeading>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="flex items-center justify-center gap-3 mb-10">
          <a href="https://www.trustpilot.com/review/equilinq.eu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-2xl font-bold text-foreground">{tpRating.toFixed(1)}</span>
              <div className="flex gap-0.5">
                {[...Array(tpFullStars)].map((_, s) => (
                  <svg key={`full-${s}`} className="h-5 w-5 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
                {tpHasHalf && (
                  <svg className="h-5 w-5 text-[#00b67a]" viewBox="0 0 20 20">
                    <defs><linearGradient id="tp-half"><stop offset="50%" stopColor="currentColor" /><stop offset="50%" stopColor="hsl(var(--muted-foreground) / 0.3)" /></linearGradient></defs>
                    <path fill="url(#tp-half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
                {[...Array(tpEmptyStars)].map((_, s) => (
                  <svg key={`empty-${s}`} className="h-5 w-5 text-muted-foreground/30" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">on Trustpilot ({tpCount} review{tpCount !== 1 ? "s" : ""})</span>
          </a>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { quote: "Service was good! Equilinq got us a good factory and the per unit price was lower than our original supplier. Also was nice they are also based in Amsterdam and were able to reply quickly.", name: "AR Glasses Buyer", stars: 5, title: "AR glasses" },
            { quote: "They helped me source the products I needed, and it was much cheaper than other platforms. Their inspection service was really helpful, they checked every package and identified defects beforehand.", name: "Verified Buyer", stars: 5, title: "Great sourcing experience" },
            { quote: "We weren't sure how complicated sourcing from China would be, but they explained everything clearly. There were no surprise fees and they showed us different factory options instead of pushing just one.", name: "Ari", stars: 5, title: "Sustainable Yoga Mats" },
          ].map((t) => (
            <motion.div key={t.title} variants={fadeUp} whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 60px -15px hsl(239 100% 60% / 0.2)" }} className="relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-7 transition-all duration-300 overflow-hidden group">
              <motion.div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--chart-2) / 0.1), hsl(var(--primary) / 0.08))" }} />
              <div className="relative z-10">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, s) => (
                    <svg key={s} className="h-4 w-4 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{t.title}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#00b67a]/20 flex items-center justify-center text-xs font-bold text-[#00b67a]">{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">via Trustpilot</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <a href="https://www.trustpilot.com/review/equilinq.eu" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-medium">
            Read all reviews on Trustpilot →
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-wrap items-center justify-center gap-6">
          {[
            { label: "Vetted Factories", icon: ShieldCheck },
            { label: "Transparent Pricing", icon: DollarSign },
            { label: "Multi-Stage QC", icon: CheckCircle2 },
            { label: "200+ Countries Shipped", icon: Globe },
          ].map((badge) => (
            <motion.div key={badge.label} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 rounded-full border border-border/40 bg-card/30 px-4 py-2">
              <badge.icon className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground/80">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────── MAIN PAGE ──────────────────── */

export default function Landing() {
  const heroRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  // Defer non-critical query until after page load to keep it out of the critical request chain
  const [deferredQueriesEnabled, setDeferredQueriesEnabled] = useState(false);
  useEffect(() => {
    const idle = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1));
    const handle = idle(() => setDeferredQueriesEnabled(true));
    return () => {
      const cancel = (window as any).cancelIdleCallback || clearTimeout;
      cancel(handle);
    };
  }, []);

  const { data: trustpilotStats } = useQuery({
    queryKey: ["trustpilot-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trustpilot_stats").select("review_count, average_rating").eq("id", 1).single();
      if (error) throw error;
      return data as { review_count: number; average_rating: number };
    },
    staleTime: 1000 * 60 * 60,
    enabled: deferredQueriesEnabled,
  });

  const faqs = [
    { q: "What is the minimum order quantity (MOQ) and how does pricing work?", a: "For most standard products, our MOQ starts at just 10 units per SKU. We operate on a zero-markup pricing model with transparent cost breakdowns." },
    { q: "How long does shipping take?", a: "Standard shipping takes ~15-25 days, express ~7-14 days, premium ~5-10 days. All shipments include real-time tracking." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Equilinq - Sourcing from China for European SMEs"
        description="End-to-end sourcing, QC, customization and logistics from China. Transparent pricing, low MOQs, and dedicated support for European SMEs."
        keywords="sourcing from China, European SME sourcing, China manufacturing, quality control, private label, transparent pricing, low MOQ, China logistics"
        breadcrumbs={[{ name: "Home", url: "https://equilinq.eu/" }]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization", name: "Equilinq", url: "https://equilinq.eu",
                logo: "https://equilinq.eu/og-image.jpg",
                description: "Managed sourcing infrastructure for European SMEs.",
                foundingDate: "2024",
                areaServed: { "@type": "Place", name: "Europe" },
                serviceType: "Product Sourcing and Procurement",
                sameAs: ["https://www.linkedin.com/company/equilinq"],
                contactPoint: { "@type": "ContactPoint", contactType: "customer service", url: "https://equilinq.eu/contact", availableLanguage: ["English", "Dutch", "Chinese"] },
              },
              {
                "@type": "Service", name: "China Sourcing for European SMEs",
                provider: { "@type": "Organization", name: "Equilinq" },
                description: "End-to-end sourcing, quality control, customization and logistics from China with transparent pricing and low MOQs starting from 10 units.",
                areaServed: "Europe", serviceType: "Product Sourcing",
                offers: { "@type": "Offer", description: "Service fee from 4-6% based on order value", priceCurrency: "EUR" },
                hasOfferCatalog: {
                  "@type": "OfferCatalog", name: "Sourcing Services",
                  itemListElement: [
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Factory Sourcing & Verification" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Quality Control & Inspection" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Private Label & Customization" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Logistics & Fulfillment" } },
                  ],
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
              },
              {
                "@type": "WebSite", name: "Equilinq", url: "https://equilinq.eu",
                potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: "https://equilinq.eu/insights?q={search_term_string}" }, "query-input": "required name=search_term_string" },
              },
              {
                "@type": "SiteNavigationElement", name: "Main Navigation",
                hasPart: [
                  { "@type": "SiteNavigationElement", name: "How It Works", url: "https://equilinq.eu/how-it-works" },
                  { "@type": "SiteNavigationElement", name: "Pricing", url: "https://equilinq.eu/pricing" },
                  { "@type": "SiteNavigationElement", name: "Customization", url: "https://equilinq.eu/customization" },
                  { "@type": "SiteNavigationElement", name: "Quality Control", url: "https://equilinq.eu/quality-control" },
                  { "@type": "SiteNavigationElement", name: "OEM / ODM", url: "https://equilinq.eu/oem-odm" },
                  { "@type": "SiteNavigationElement", name: "Insights", url: "https://equilinq.eu/insights" },
                  { "@type": "SiteNavigationElement", name: "Contact", url: "https://equilinq.eu/contact" },
                  { "@type": "SiteNavigationElement", name: "Sign In", url: "https://equilinq.eu/auth" },
                ],
              },
              {
                "@type": "VideoObject",
                name: "Equilinq Platform Demo",
                description: "A quick walkthrough of the Equilinq sourcing platform showing how European SMEs can source products from China with transparent pricing and quality control.",
                thumbnailUrl: "https://equilinq.eu/og-image.jpg",
                uploadDate: "2026-04-14T00:00:00+02:00",
                contentUrl: "https://equilinq.eu/videos/area-demo.mp4",
                embedUrl: "https://equilinq.eu/",
                duration: "PT1M",
              },
            ],
          }),
        }}
      />

      <PublicNavbar />
      <main>

      {/* ───── HERO ───── */}
      <section ref={heroRef} className="relative pt-28 sm:pt-36 pb-16 px-4">
        <div className="absolute inset-0">
          <img src="/hero-bg.jpg" alt="Equilinq sourcing from China for European SMEs - warehouse and shipping operations" className="w-full h-full object-cover" width={1920} height={1080} fetchPriority="high" />
          <div className="absolute inset-0 bg-background/75" />
        </div>
        <AnimatedGlow />
        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-14">
            <motion.div initial={{ opacity: 0, scale: 0.8, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 250 }} className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6">
              <motion.span className="h-2 w-2 rounded-full bg-primary" animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide">Incorporated with one of Tencent's founders</span>
            </motion.div>

            <motion.h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <motion.span className="inline-block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                Unsexy Sourcing
              </motion.span>
              <br />
              <motion.span
                className="bg-clip-text text-transparent inline-block"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1, backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{
                  opacity: { duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                  backgroundPosition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
                }}
                style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(260 80% 68%) 50%, hsl(var(--primary)) 100%)", backgroundSize: "200% 200%" }}
              >
                Made Sexy.
              </motion.span>
            </motion.h1>

            <motion.p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
              Sourcing, customization, QC, and logistics from China.{" "}<br className="hidden sm:block" />One platform to rule them all.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?signup=true">
                <MagneticButton>
                  <Button size="sm" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-6 h-10 text-sm font-semibold shadow-[0_0_50px_-8px_hsl(239,100%,50%/0.6)] border border-primary/20 uppercase tracking-wider">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </MagneticButton>
              </Link>
              <a href="https://calendly.com/admin-equilinq/30min" target="_blank" rel="noopener noreferrer">
                <MagneticButton>
                  <Button variant="outline" size="sm" className="rounded-full bg-white text-background border-white/80 hover:bg-white/90 px-6 h-10 text-sm font-semibold uppercase tracking-wider">Book a Demo</Button>
                </MagneticButton>
              </a>
            </div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div whileHover={{ scale: 1.015, y: -6 }} transition={{ type: "spring", stiffness: 200, damping: 25 }} className="relative rounded-2xl border border-border/30 overflow-hidden shadow-2xl shadow-black/50 hover:shadow-[0_20px_80px_-20px_hsl(var(--primary)/0.3)] transition-shadow duration-700">
              <motion.div className="absolute -inset-[2px] rounded-2xl pointer-events-none z-20" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.3), transparent 40%, transparent 60%, hsl(260 80% 68% / 0.2))" }} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
              <img
                src={dashboardPreview}
                alt="Equilinq sourcing platform dashboard showing sourcing requests and order management"
                width={1920}
                height={1080}
                className="w-full h-auto object-cover block rounded-2xl"
                fetchPriority="high"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background/40 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background/40 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background/30 to-transparent" />
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.2 }} className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-md border border-border/40 px-3 py-1.5">
                <motion.span className="h-2 w-2 rounded-full bg-[hsl(142_71%_45%)]" animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="text-[11px] text-muted-foreground font-medium">Platform Preview</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── STATS ───── */}
      <section className="py-14 px-4 relative border-y border-border/10">
        <FloatingParticles />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-3 block">By the Numbers</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Why SMEs Trust Equilinq</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <AnimatedCounter value="200+" label="Countries Shipped" />
            <AnimatedCounter value="500+" label="Vetted Factories" />
            <AnimatedCounter value="10" label="Units Min. Order" />
            <AnimatedCounter value="<2%" label="Defect Rate" />
          </motion.div>
        </div>
      </section>

      {/* ───── PARTNER LOGOS ───── */}
      <section className="py-14 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="relative z-10 text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-border/50" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/60">Trusted by leading brands</span>
            <span className="h-px w-8 bg-border/50" />
          </div>
        </motion.div>
        <div className="relative z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 z-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 z-20 bg-gradient-to-l from-background to-transparent" />
          <Marquee speed={45}>
            {[
              { src: logoLKK, alt: "LKK Design", url: "https://www.lkkerscm.com/", hasBackground: true, isSquare: false },
              { src: logoBuckyDrop, alt: "BuckyDrop", url: "https://buckydrop.com/", hasBackground: true, isSquare: false },
              { src: logoSoleRunning, alt: "Sole Running", url: "https://www.sole-running.com/", hasBackground: true, isSquare: false },
              { src: logoIMMO, alt: "Stichting iMMO", url: "https://stichtingimmo.nl/en/", hasBackground: false, isSquare: true },
            ].map((logo) => {
              const isTransparent = !logo.hasBackground;
              const isDark = theme === "dark";
              return (
                <a key={logo.alt} href={logo.url} target="_blank" rel="noopener noreferrer" className="group flex shrink-0 items-center justify-center gap-2.5 px-5 sm:px-8 transition-all duration-500">
                  <img
                    src={logo.src} alt={logo.alt} loading="lazy"
                    width={logo.isSquare ? 44 : 140} height={logo.isSquare ? 44 : 48}
                    className={`object-contain transition-all duration-500 group-hover:scale-105 ${logo.isSquare ? "h-8 w-8 sm:h-10 sm:w-10" : "h-8 sm:h-10 w-auto max-w-[100px] sm:max-w-[130px]"}`}
                    style={{
                      filter: isTransparent
                        ? isDark ? "grayscale(100%) brightness(0.6) invert(1)" : "grayscale(100%) opacity(0.4)"
                        : isDark ? "grayscale(100%) brightness(0.8) invert(0.15)" : "grayscale(100%) opacity(0.45)",
                      transition: "filter 0.5s, transform 0.3s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.filter = "none"; }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = isTransparent
                        ? isDark ? "grayscale(100%) brightness(0.6) invert(1)" : "grayscale(100%) opacity(0.4)"
                        : isDark ? "grayscale(100%) brightness(0.8) invert(0.15)" : "grayscale(100%) opacity(0.45)";
                    }}
                  />
                  {logo.isSquare && (
                    <span className={`text-xs font-medium whitespace-nowrap transition-all duration-500 ${isDark ? "text-muted-foreground/60 group-hover:text-foreground" : "text-muted-foreground/50 group-hover:text-foreground"}`}>
                      {logo.alt === "Stichting iMMO" ? "iMMO" : logo.alt}
                    </span>
                  )}
                </a>
              );
            })}
          </Marquee>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <Suspense fallback={<div className="py-20" />}>
        <LandingFeatureTabs />
      </Suspense>

      {/* ───── PRICING CTA ───── */}
      <section className="py-14 px-4 relative">
        <FloatingParticles />
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="max-w-3xl mx-auto text-center relative z-10">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4 block">Pricing</span>
          <RevealHeading className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">Transparent Pricing, Tailored to Your Order</RevealHeading>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Every quote is fully itemized. Submit a request and see exactly where every euro goes.</p>
          <Link to="/pricing">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
                View Pricing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* ───── SOCIAL PROOF ───── */}
      <SocialProofSection trustpilotStats={trustpilotStats} />

      {/* ───── LAZY-LOADED BELOW-FOLD SECTIONS ───── */}
      <Suspense fallback={<div className="py-20" />}>
        <LandingTrending />
      </Suspense>
      <Suspense fallback={<div className="py-20" />}>
        <LandingBenefits />
      </Suspense>
      <Suspense fallback={<div className="py-20" />}>
        <LandingFounder />
      </Suspense>
      <Suspense fallback={<div className="py-20" />}>
        <LandingInsights />
      </Suspense>
      <Suspense fallback={<div className="py-20" />}>
        <LandingFAQ />
      </Suspense>
      <Suspense fallback={<div className="py-20" />}>
        <LandingCTA />
      </Suspense>

      </main>
      <PublicFooter />
    </div>
  );
}
