import { useState, useEffect, useRef, useCallback, lazy, Suspense, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, DollarSign, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { useTheme } from "@/hooks/useTheme";

import logoSoleRunning from "@/assets/logos/sole-running-cutout.png";
import logoLKK from "@/assets/logos/lkk-cutout.png";
import logoIMMO from "@/assets/logos/immo-cutout.png";
import logoPorsche from "@/assets/logos/porsche-cutout.png";
import logoBuckyDrop from "@/assets/logos/buckydrop-cutout.png";
const dashboardPreviewWebp = "/dashboard-preview-real.webp";
const dashboardPreview1024 = "/dashboard-preview-real-1024.webp";

/* ── Lazy-loaded below-fold sections ── */
const LandingBenefits = lazy(() => import("@/components/landing/LandingBenefits"));
const LandingFounder = lazy(() => import("@/components/landing/LandingFounder"));
const LandingInsights = lazy(() => import("@/components/landing/LandingInsights"));
const LandingFAQ = lazy(() => import("@/components/landing/LandingFAQ"));
const LandingCTA = lazy(() => import("@/components/landing/LandingCTA"));
const LandingFeatureTabs = lazy(() => import("@/components/landing/LandingFeatureTabs"));

/* ──────────────────── DATA ──────────────────── */

/* ──────────────────── SHARED COMPONENTS ──────────────────── */

function AnimatedGlow() {
  return null;
}

function FloatingParticles() {
  return null;
}

function Marquee({ children }: { children: React.ReactNode; speed?: number }) {
  return <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 w-full">{children}</div>;
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4 sm:px-5 sm:py-5 text-center">
      <p className="font-heading text-3xl sm:text-4xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm sm:text-base text-body-ink">{label}</p>
    </div>
  );
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

function RevealHeading({ children, className = "", as: Tag = "h2" }: { children: string; className?: string; as?: "h1" | "h2" | "h3" }) {
  return <Tag className={className}>{children}</Tag>;
}

function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

/* ──────────────────── SOCIAL PROOF (kept inline -- above fold for SEO) ──────────────────── */

const testimonials = [
  {
    name: "Hammad Ahmed",
    role: "CEO Longlive",
    quote: "I worked with Equilinq Team on the potential procurement of a vascular Doppler. Through out the process , Team spent time to understand our requirement and matched us to the right manufacturers. The process was efficient and transparent at each step.",
  },
  {
    name: "Marian Leenman",
    role: "NGO Strategic Buyer",
    quote: "I enjoyed the service from Equilinq. They helped me source the products I needed, and it was much cheaper than other platforms. They also assisted with communication in Chinese. When one of the products was out of stock, they immediately found another supplier who sold the same item. Their inspection service was also really helpful, they checked every package and identified defects beforehand, so I didn't have to worry about quality issues. Lastly, their delivery was efficient. They designed the optimal route and delivered directly to my house. It was a nice experience.",
  },
  {
    name: "Sultan Tuleugali",
    role: "Porsche Strategic Buyer",
    quote: "We had issues with defective units in the past when ordering from Alibaba directly.\n\nThis time they did inspection before shipment and found a small issue with stitching on about 8% of the batch. It was corrected before shipping.\n\nThat alone saved us a lot of headache. Not perfect but much more reliable.",
  },
  {
    name: "Henry",
    role: "Amazon Reseller",
    quote: "Service was good! We had some problems with tech things sourcing from oher countries and also china ourselves. Regarding Ar glasses its always a hard one to do because some components were always made very cheaply. Equilinq was helpful becuase they got us a good factory and the per unit price was lower than our orginial supplier. Also was nice they are also based in Amsterdam and were able to reply qucikly. Would recommend",
  },
  {
    name: "Ari",
    role: "Sustainable Yoga Mats",
    quote: "We worked with Equilinq to source sustainable yoga mats and honestly it went much smoother then we expected.\n\nAt first we weren't sure how complicated sourcing from China would be, but they explained everything very clearly and broke down the costs in a way that actually made sense. The communication was fast and they always replied when we had questions (even small ones).\n\nWhat we really liked was the transparancy. There were no \"surprise\" fees and they showed us different factory options instead of pushing just one. That made us feel more in control of the decision.\n\nShipping and coordination also went well and overall it just felt structured and professional, but still personal.\n\nWould definitely consider working with them again.",
  },
];

function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);
  const t = testimonials[index];

  return (
    <div className="relative mb-8">
      <motion.div
        key={t.name}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-7 sm:p-9 overflow-hidden max-w-3xl mx-auto"
      >
        <div className="flex gap-0.5 mb-4">
          {[...Array(5)].map((_, s) => (
            <svg key={s} className="h-4 w-4 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          ))}
        </div>
        <p className="text-sm sm:text-[15px] text-foreground/80 leading-relaxed mb-6 whitespace-pre-line">"{t.quote}"</p>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#00b67a]/20 flex items-center justify-center text-xs font-bold text-[#00b67a]">{t.name.charAt(0)}</div>
          <div>
            <p className="text-sm font-semibold text-foreground">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role} · via Trustpilot</p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={() => go(-1)} aria-label="Previous testimonial" className="h-9 w-9 rounded-full border border-border/50 bg-card/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((item, i) => (
            <button
              key={item.name}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial from ${item.name}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-2 bg-border"}`}
            />
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next testimonial" className="h-9 w-9 rounded-full border border-border/50 bg-card/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}


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

        <TestimonialCarousel />


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
            <motion.div key={badge.label} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 rounded-full border border-border/40 bg-card/30 px-4 py-2 overflow-hidden">
              <motion.div
                animate={badge.label === "200+ Countries Shipped" ? { rotate: [0, 360] } : undefined}
                transition={badge.label === "200+ Countries Shipped" ? { duration: 20, repeat: Infinity, ease: "linear" } : undefined}
              >
                <badge.icon className="h-4 w-4 text-primary" />
              </motion.div>
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
              <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide">Backed by one of the founding shareholders of Tencent Holdings.</span>
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
          <motion.div initial={{ opacity: 1, y: 0, scale: 1 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div whileHover={{ scale: 1.015, y: -6 }} transition={{ type: "spring", stiffness: 200, damping: 25 }} className="relative rounded-2xl border border-border/30 overflow-hidden shadow-2xl shadow-black/50 hover:shadow-[0_20px_80px_-20px_hsl(var(--primary)/0.3)] transition-shadow duration-700">
              <motion.div className="absolute -inset-[2px] rounded-2xl pointer-events-none z-20" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.3), transparent 40%, transparent 60%, hsl(260 80% 68% / 0.2))" }} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
              <video
                src="/videos/area-demo.mp4"
                poster={dashboardPreviewWebp}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-label="Equilinq sourcing platform dashboard walkthrough"
                className="w-full h-auto object-cover object-top block rounded-2xl"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background/40 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background/40 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background/30 to-transparent" />
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.2 }} className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-md border border-border/40 px-3 py-1.5">
                <motion.span className="h-2 w-2 rounded-full bg-[hsl(142_71%_45%)]" animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="text-[11px] text-muted-foreground font-medium">Live Platform Preview</span>
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
            <AnimatedCounter value="10" label="Minimum MOQ" />
            <AnimatedCounter value="98%" label="QC Pass Rate" />
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
              { src: logoPorsche, alt: "Porsche", url: "https://www.porsche.com/" },
              { src: logoLKK, alt: "LKK Design", url: "https://www.lkkerscm.com/" },
              { src: logoBuckyDrop, alt: "BuckyDrop", url: "https://buckydrop.com/" },
              { src: logoPorsche, alt: "Porsche", url: "https://www.porsche.com/" },
              { src: logoSoleRunning, alt: "Sole Running", url: "https://www.sole-running.com/" },
              { src: logoIMMO, alt: "Stichting iMMO", url: "https://stichtingimmo.nl/en/" },
            ].map((logo, i) => (
              <a key={`${logo.alt}-${i}`} href={logo.url} target="_blank" rel="noopener noreferrer" className="group flex shrink-0 items-center justify-center px-6 sm:px-10">
                <img
                  src={logo.src} alt={logo.alt} loading="lazy"
                  className="h-10 sm:h-12 w-auto max-w-[160px] object-contain opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
                />
              </a>
            ))}
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
