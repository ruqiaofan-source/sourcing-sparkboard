import { useState, useEffect, useRef, useCallback } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Search, ShieldCheck, Truck, Palette, ChevronDown, ChevronRight,
  ArrowRight, Package, DollarSign, BarChart3, Users, CheckCircle2,
  TrendingUp, Globe, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { useTheme } from "@/hooks/useTheme";
import heroBg from "@/assets/hero-bg.jpg";
import logoSoleRunning from "@/assets/logos/sole-running.webp";
import logoLKK from "@/assets/logos/lkk.webp";
import logoIMMO from "@/assets/logos/immo.webp";
import logoBuckyDrop from "@/assets/logos/buckydrop.webp";
import logoUnilever from "@/assets/logos/unilever.webp";
import logoVolkswagen from "@/assets/logos/volkswagen.webp";

/* ──────────────────── DATA ──────────────────── */

const features = [
  {
    icon: Search,
    title: "Perfect Sourcing",
    subtitle: "China's best suppliers, vetted for you",
    desc: "Direct access to verified factories. No middlemen.",
    vimeoId: "1150855107",
    bullets: [
      "Verified factory network",
      "Quality and compliance screening",
      "MOQs from 10 units",
    ],
  },
  {
    icon: Palette,
    title: "Brand Customization",
    subtitle: "35+ options to make it yours",
    desc: "Private labels, custom packaging, logo integration.",
    vimeoId: "1150855094",
    bullets: [
      "Private label and OEM",
      "Custom packaging and labels",
      "Product modifications",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Quality Control",
    subtitle: "Multi-stage inspection, every order",
    desc: "On-the-ground QC with photo and video proof.",
    vimeoId: "1150855119",
    bullets: [
      "Pre-production validation",
      "In-process monitoring",
      "Final inspection before shipment",
    ],
  },
  {
    icon: Truck,
    title: "Global Shipping",
    subtitle: "200+ countries, eco-friendly options",
    desc: "Consolidated shipping, customs handling, real-time tracking.",
    vimeoId: "1150855074",
    bullets: [
      "Standard, express, and premium",
      "Customs and export docs",
      "Real-time tracking",
    ],
  },
];

const benefits = [
  { icon: DollarSign, title: "We Source It Cheaper", desc: "Direct from vetted Chinese factories at lowest prices." },
  { icon: ShieldCheck, title: "Quality Guaranteed", desc: "Factory check, warehouse QC, insured shipping." },
  { icon: Truck, title: "Deliver Anywhere", desc: "Competitive rates to 200+ countries, eco-friendly options." },
  { icon: Palette, title: "Own Your Brand", desc: "Private labels, custom packaging, 35+ branding options." },
  { icon: BarChart3, title: "Full Visibility", desc: "Real-time updates on every order, every step." },
  { icon: Users, title: "Human Agents", desc: "Real people, not AI, handling your orders." },
];



const faqs = [
  {
    q: "What is the minimum order quantity (MOQ) and how does pricing work?",
    a: "For most standard products, our MOQ starts at just 10 units per SKU, making Equilinq ideal for product testing, pilot runs, and small-batch launches. Some factories or highly customized products may require higher MOQs - in such cases, we clearly communicate the minimum requirement upfront before you commit to production.\n\nWe operate on a zero-markup pricing model. Your quote includes: factory wholesale price, a transparent Equilinq service fee covering sourcing, supplier coordination, quality control, and order management. Optional add-on services (e.g., customization, packaging adjustments, branding) are listed separately under 'Customization.' Shipping fee estimates are provided once shipment weight, volume, and destination are confirmed.\n\nThere are no hidden markups or inflated product prices. Every cost line is visible in your quote.",
  },
  {
    q: "How long does shipping take and what are the shipping costs?",
    a: "Shipping times and costs depend on the shipping method, parcel count, weight, dimensions, and destination country.\n\nWe offer multiple service levels:\n- Standard shipping: ~15-25 days\n- Express shipping: ~7-14 days\n- Premium shipping: ~5-10 days\n\nShipping costs are calculated based on total shipment weight and volume, number of parcels, and destination country and delivery type (B2B or B2C).\n\nWe work with established international logistics partners to provide competitive, transparent shipping rates. All shipments include real-time tracking, and our team handles export documentation and customs coordination. Shipping costs are always quoted before confirmation, so there are no surprises after production.",
  },
  {
    q: "What quality control measures do you have in place?",
    a: "Every order goes through a structured quality control process before shipment. We inspect products for defects, verify specifications against approved samples, and ensure proper packaging and labeling. Visual documentation is provided prior to dispatch, and our on-the-ground QC team regularly rejects products that do not meet agreed standards, preventing defective or non-compliant goods from reaching customers.",
  },
  {
    q: "Can you help with custom branding and packaging?",
    a: "When placing an order, you can choose from a range of customization options, including product branding, labeling, and packaging services. Our team reviews your selections to confirm feasibility, pricing, and timelines before production begins.",
  },
  {
    q: "How do returns and refunds work if there are issues?",
    a: "If an issue is identified that results from a verified quality control or production error, we work with the factory to arrange an appropriate resolution. This may include a replacement, partial refund, or credit, depending on the circumstances.\n\nFor customer-initiated returns, we assist in coordinating the return process and liaising with suppliers where possible. All cases are reviewed individually to ensure a fair and practical outcome.",
  },
  {
    q: "How do you handle high-value or complex products?",
    a: "For high-value, technically complex, or regulated products, Equilinq operates using a more hands-on, project-based sourcing model. These products typically require closer coordination with factory and engineering teams, more detailed specification reviews and sampling rounds, enhanced quality control and documentation, and in some cases, long-term production agreements or exclusivity arrangements.\n\nDue to this increased complexity, pricing for these projects is variable and depends on factors such as product specifications, compliance requirements, production scale, and the level of ongoing coordination involved.\n\nOur team acts as a dedicated coordination layer between you and the factory, aligning on technical requirements, production feasibility, timelines, pricing, and regulatory or quality expectations before mass production begins.",
  },
  {
    q: "How are VAT and customs duties handled?",
    a: "Equilinq acts as a sourcing and procurement service provider and does not act as the Importer of Record. This means that VAT, customs duties, and any applicable import taxes are the responsibility of the customer, in accordance with the import rules of the destination country.\n\nEquilinq supports the process by preparing and coordinating export and customs documentation, working with logistics partners to ensure smooth customs clearance, and providing cost estimates where possible so you can plan ahead.\n\nThis structure keeps pricing transparent, avoids hidden tax markups, and ensures customers remain compliant with local VAT and customs regulations.",
  },
];

/* ──────────────────── ANIMATED BACKGROUND ──────────────────── */

function AnimatedGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.16) 0%, hsl(var(--primary) / 0.07) 42%, transparent 72%)",
          top: "-25%",
          right: "-15%",
        }}
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.05, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--chart-2) / 0.08) 0%, hsl(var(--primary) / 0.05) 45%, transparent 72%)",
          bottom: "-15%",
          left: "-10%",
        }}
        animate={{ x: [0, -40, 30, 0], y: [0, 30, -40, 0], scale: [1, 0.95, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Warm accent glow (Optiverse-inspired) */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(30 80% 55% / 0.04) 0%, transparent 60%)",
          top: "30%",
          left: "50%",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, transparent 20%, hsl(var(--primary) / 0.07) 45%, hsl(var(--chart-2) / 0.05) 55%, transparent 80%)",
        }}
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
            width: `${2 + (i % 3) * 2}px`,
            height: `${2 + (i % 3) * 2}px`,
            left: `${5 + i * 6}%`,
            top: `${10 + (i % 5) * 18}%`,
            background: i % 3 === 0
              ? "hsl(var(--primary) / 0.4)"
              : i % 3 === 1
              ? "hsl(var(--chart-2) / 0.3)"
              : "hsl(var(--primary) / 0.2)",
          }}
          animate={{
            y: [0, -(30 + i * 5), 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.8, 1],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </div>
  );
}

/* Horizontal scrolling marquee */
function Marquee({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) {
  return (
    <div className="group/marquee overflow-hidden w-full" style={{ minHeight: 64 }}>
      <div
        className="flex w-max gap-8 sm:gap-12"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

/* ──────────────────── COMPONENTS ──────────────────── */

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border border-border/60 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm hover:border-primary/20 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
      >
        <span className="text-foreground font-medium text-[15px] pr-4 group-hover:text-primary transition-colors">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, type: "spring", stiffness: 200 }}>
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
      const current = Math.round(eased * target);
      setDisplayed(`${prefix}${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, numericPart, prefix, suffix]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm px-4 py-4 sm:px-5 sm:py-5 text-center"
    >
      <p className="font-heading text-3xl sm:text-4xl font-bold text-foreground">{displayed}</p>
      <p className="mt-1 text-sm sm:text-base text-muted-foreground">{label}</p>
    </motion.div>
  );
}

/* stagger container */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

/* Text reveal: words slide up from below with stagger */
function RevealHeading({ children, className = "", as: Tag = "h2" }: { children: string; className?: string; as?: "h1" | "h2" | "h3" }) {
  const words = children.split(" ");
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* Magnetic button - follows cursor within bounds */
function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────── FEATURE VIDEO CARD WITH PARALLAX ──────────────────── */

function FeatureVideoCard({ feature: f }: { feature: typeof features[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden min-h-[340px] sm:min-h-[380px] flex items-end group"
    >
      {/* Video background with parallax - lazy loaded */}
      <motion.div className="absolute inset-[-30%] " style={{ y: videoY }}>
        {isVisible && (
          <iframe
            src={`https://player.vimeo.com/video/${f.vimeoId}?muted=1&autoplay=1&autopause=0&loop=1&background=1`}
            className="absolute inset-0 w-full h-full scale-[1.4]"
            style={{ objectFit: "cover" }}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={f.title}
          />
        )}
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 w-full">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-3"
        >
          <f.icon className="h-5 w-5 text-white" />
        </motion.div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-1">
          {f.title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed mb-4">
          {f.subtitle}
        </p>
        <ul className="space-y-1.5">
          {f.bullets.map((bullet, bi) => (
            <motion.li
              key={bullet}
              className="flex items-center gap-2 text-xs sm:text-sm text-white/75"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 + bi * 0.08 }}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{bullet}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ──────────────────── MAIN PAGE ──────────────────── */

export default function Landing() {
  const heroRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Equilinq - Sourcing from China for European SMEs"
        description="End-to-end sourcing, QC, customization and logistics from China. Transparent pricing, low MOQs, and dedicated support for European SMEs."
        keywords="sourcing from China, European SME sourcing, China manufacturing, quality control, private label, transparent pricing, low MOQ, China logistics"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
        ]}
      />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "Equilinq",
                url: "https://equilinq.eu",
                logo: "https://equilinq.eu/og-image.png",
                description: "Managed sourcing infrastructure for European SMEs. End-to-end sourcing, QC, customization and logistics from China.",
                foundingDate: "2024",
                areaServed: {
                  "@type": "Place",
                  name: "Europe",
                },
                serviceType: "Product Sourcing and Procurement",
                sameAs: [
                  "https://www.linkedin.com/company/equilinq"
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  url: "https://equilinq.eu/contact",
                  availableLanguage: ["English", "Dutch", "Chinese"],
                },
              },
              {
                "@type": "Service",
                name: "China Sourcing for European SMEs",
                provider: {
                  "@type": "Organization",
                  name: "Equilinq",
                },
                description: "End-to-end sourcing, quality control, customization and logistics from China with transparent pricing and low MOQs starting from 10 units.",
                areaServed: "Europe",
                serviceType: "Product Sourcing",
                offers: {
                  "@type": "Offer",
                  description: "Service fee from 4-6% based on order value",
                  priceCurrency: "EUR",
                },
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Sourcing Services",
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
                mainEntity: faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.a,
                  },
                })),
              },
              {
                "@type": "WebSite",
                name: "Equilinq",
                url: "https://equilinq.eu",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://equilinq.eu/insights?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "SiteNavigationElement",
                name: "Main Navigation",
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
            ],
          }),
        }}
      />

      <PublicNavbar />
      <main>

      {/* ───── HERO: Centered like Airweave ───── */}
      <section
        ref={heroRef}
        className="relative pt-28 sm:pt-36 pb-16 px-4"
      >
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} fetchPriority="high" />
          <div className="absolute inset-0 bg-background/75" />
        </div>

        <AnimatedGlow />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="relative z-10 max-w-5xl mx-auto">
          {/* Centered text block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-14"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 250 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6"
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[11px] text-muted-foreground tracking-wide">
                Incorporated with one of Tencent's founders
              </span>
            </motion.div>

            <motion.h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Unsexy Sourcing
              </motion.span>
              <br />
              <motion.span
                className="bg-clip-text text-transparent inline-block"
                initial={{ opacity: 0, y: 40, filter: "blur(10px)", scale: 0.9 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1, backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ 
                  opacity: { duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                  filter: { duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                  backgroundPosition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
                }}
                style={{
                  backgroundImage: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(260 80% 68%) 50%, hsl(var(--primary)) 100%)",
                  backgroundSize: "200% 200%",
                }}
              >
                Made Sexy.
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Sourcing, customization, QC, and logistics from China.{" "}
              <br className="hidden sm:block" />
              One platform to rule them all.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?signup=true">
                <MagneticButton>
                  <Button size="sm" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-6 h-10 text-sm font-semibold shadow-[0_0_50px_-8px_hsl(239,100%,50%/0.6)] border border-primary/20 uppercase tracking-wider">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </MagneticButton>
              </Link>
              <a href="https://calendly.com/admin-equilinq/30min" target="_blank" rel="noopener noreferrer">
                <MagneticButton>
                  <Button variant="outline" size="sm" className="rounded-full border-border/60 text-foreground hover:bg-card/60 px-6 h-10 text-sm uppercase tracking-wider">
                    Book a Demo
                  </Button>
                </MagneticButton>
              </a>
            </div>
          </motion.div>

          {/* Dashboard preview below */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.92, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1200 }}
          >
            <motion.div
              whileHover={{ scale: 1.015, y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="relative rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50 hover:shadow-[0_20px_80px_-20px_hsl(239,100%,60%/0.3)] transition-shadow duration-700"
            >
              {/* Animated glow ring around video */}
              <motion.div
                className="absolute -inset-[2px] rounded-2xl pointer-events-none z-20"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary) / 0.3), transparent 40%, transparent 60%, hsl(260 80% 68% / 0.2))",
                }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute -inset-8 rounded-3xl bg-primary/8 blur-3xl pointer-events-none" />
              <div className="relative overflow-hidden rounded-2xl">
                <motion.div
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <video
                    src="/videos/area-demo.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto object-cover object-top block"
                  />
                </motion.div>
                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent" />
                {/* Subtle scan line effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: "linear-gradient(180deg, transparent 0%, hsl(var(--primary) / 0.03) 50%, transparent 100%)",
                    backgroundSize: "100% 200%",
                  }}
                  animate={{ backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              {/* Floating label */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-md border border-border/40 px-3 py-1.5"
              >
                <motion.span
                  className="h-2 w-2 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[11px] text-muted-foreground font-medium">Live Platform Preview</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── ANIMATED STATS COUNTER ───── */}
      <section className="py-20 px-4 relative border-y border-border/10">
        <FloatingParticles />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] mb-3 block" style={{ color: 'hsl(239 100% 75%)' }}>By the Numbers</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Why SMEs Trust Equilinq</h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <AnimatedCounter value="200+" label="Countries Shipped" />
            <AnimatedCounter value="500+" label="Vetted Factories" />
            <AnimatedCounter value="10" label="Minimum MOQ" />
            <AnimatedCounter value="98%" label="QC Pass Rate" />
          </motion.div>
        </div>
      </section>

      {/* ───── PARTNER LOGO CAROUSEL ───── */}
      <section className="py-12 border-y border-border/20 bg-background/90 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background: "linear-gradient(135deg, transparent 0%, hsl(var(--primary) / 0.06) 35%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative z-10 text-center mb-6 sm:mb-8"
        >
          <span className="text-sm sm:text-base font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">Trusted By</span>
        </motion.div>
        <div className="relative z-10">
        <Marquee speed={40}>
          {[
            { src: logoLKK, alt: "LKK Design", url: "https://www.lkkerscm.com/", hasBackground: true, isSquare: false },
            { src: logoBuckyDrop, alt: "BuckyDrop", url: "https://buckydrop.com/", hasBackground: true, isSquare: false },
            { src: logoSoleRunning, alt: "Sole Running", url: "https://www.sole-running.com/", hasBackground: true, isSquare: false },
            { src: logoIMMO, alt: "Stichting iMMO", url: "https://stichtingimmo.nl/en/", hasBackground: false, isSquare: true },
            { src: logoUnilever, alt: "Unilever", url: "https://www.unilever.com/", hasBackground: false, isSquare: true },
            { src: logoVolkswagen, alt: "Volkswagen", url: "https://www.volkswagen.com/", hasBackground: false, isSquare: true },
          ].map((logo) => {
            const isTransparent = !logo.hasBackground;
            const isDark = theme === "dark";
            return (
            <a
              key={logo.alt}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex shrink-0 items-center justify-center gap-2 h-10 sm:h-14 transition-all duration-500 px-3"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.isSquare ? 48 : 140}
                height={logo.isSquare ? 48 : 56}
                className={`object-contain transition-all duration-500 ${
                  logo.isSquare ? "h-9 w-9 sm:h-12 sm:w-12" : "h-full w-auto max-w-[100px] sm:max-w-[140px]"
                }`}
                style={{
                  filter: isTransparent
                    ? isDark
                      ? "grayscale(100%) brightness(0.7) invert(0)"
                      : "grayscale(100%) opacity(0.5)"
                    : "grayscale(100%) opacity(0.6)",
                  transition: "filter 0.5s, opacity 0.5s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = "none"; }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = isTransparent
                    ? isDark ? "grayscale(100%) brightness(0.7) invert(0)" : "grayscale(100%) opacity(0.5)"
                    : "grayscale(100%) opacity(0.6)";
                }}
              />
              {logo.isSquare && (
                <span className={`text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-500 ${
                  isDark ? "text-white/70" : "text-gray-500"
                }`}>{logo.alt === "Stichting iMMO" ? "iMMO" : logo.alt}</span>
              )}
            </a>
            );
          })}
        </Marquee>
        </div>
      </section>

      {/* ───── FEATURES - 2x2 grid with parallax ───── */}
      <section id="features" className="py-28 px-4 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block"
            >
              What We Do
            </motion.span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              End-to-End Sourcing
              <br />
              <span className="text-primary">from China</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f) => (
              <FeatureVideoCard key={f.title} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRICING CTA ───── */}
      <section className="py-20 px-4 relative">
        <FloatingParticles />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block">Pricing</span>
          <RevealHeading className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Transparent Pricing, Tailored to Your Order
          </RevealHeading>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Every quote is fully itemized. Submit a request and see exactly where every euro goes.
          </p>
          <Link to="/pricing">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
                View Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* ───── SOCIAL PROOF ───── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block"
            >
              Trusted by SMEs
            </motion.span>
            <RevealHeading className="font-heading text-3xl sm:text-4xl font-bold text-foreground">What Our Clients Say</RevealHeading>
          </motion.div>

          {/* Trustpilot summary */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <a href="https://www.trustpilot.com/review/equilinq.eu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-2xl font-bold text-foreground">4.0</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4].map((s) => (
                    <svg key={s} className="h-5 w-5 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="h-5 w-5 text-muted-foreground/30" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">on Trustpilot (5 reviews)</span>
            </a>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {[
              {
                quote: "Service was good! Equilinq got us a good factory and the per unit price was lower than our original supplier. Also was nice they are also based in Amsterdam and were able to reply quickly.",
                name: "AR Glasses Buyer",
                stars: 5,
                title: "AR glasses",
              },
              {
                quote: "They helped me source the products I needed, and it was much cheaper than other platforms. Their inspection service was really helpful, they checked every package and identified defects beforehand.",
                name: "Verified Buyer",
                stars: 5,
                title: "Great sourcing experience",
              },
              {
                quote: "We weren't sure how complicated sourcing from China would be, but they explained everything clearly. There were no surprise fees and they showed us different factory options instead of pushing just one.",
                name: "Ari",
                stars: 5,
                title: "Sustainable Yoga Mats",
              },
            ].map((t) => (
              <motion.div
                key={t.title}
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  boxShadow: "0 20px 60px -15px hsl(239 100% 60% / 0.2)",
                }}
                className="relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-7 transition-all duration-300 overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--chart-2) / 0.1), hsl(var(--primary) / 0.08))",
                  }}
                />
                <div className="relative z-10">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.stars)].map((_, s) => (
                      <svg key={s} className="h-4 w-4 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{t.title}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-5">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#00b67a]/20 flex items-center justify-center text-xs font-bold text-[#00b67a]">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">via Trustpilot</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <a
              href="https://www.trustpilot.com/review/equilinq.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-medium"
            >
              Read all reviews on Trustpilot →
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {[
              { label: "Vetted Factories", icon: ShieldCheck },
              { label: "Transparent Pricing", icon: DollarSign },
              { label: "Multi-Stage QC", icon: CheckCircle2 },
              { label: "200+ Countries Shipped", icon: Globe },
            ].map((badge) => (
              <motion.div
                key={badge.label}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full border border-border/40 bg-card/30 px-4 py-2"
              >
                <badge.icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground/80">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="benefits" className="py-28 px-4 relative">
        <AnimatedGlow />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block"
            >
              Benefits
            </motion.span>
            <RevealHeading className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">Why Choose Us?</RevealHeading>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Source. Brand. QC and Logistics. Everything You Need.</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/20 hover:bg-card/60 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -8 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                >
                  <b.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </motion.div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1.5">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── FOUNDER'S NOTE ───── */}
      <section className="py-28 px-4 relative">
        <FloatingParticles />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3 block">Founder's Note</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
          >
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
            <motion.div
              className="shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="https://framerusercontent.com/images/mAjvmxaxBda8vHxrvk40mSOZOo.jpg?lossless=1&w=256&h=378"
                alt="Founder"
                width={126}
                height={189}
                className="w-32 h-44 rounded-2xl object-cover border border-border/40"
                loading="lazy"
              />
              <a href="https://www.linkedin.com/in/ruqiao-fan-05379137a/" target="_blank" rel="noopener noreferrer" className="block text-center mt-3 text-xs text-muted-foreground font-medium hover:text-primary transition-colors">
                Founder & CEO ↗
              </a>
            </motion.div>
            <div className="flex-1">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-lg sm:text-xl text-foreground leading-relaxed font-heading font-medium italic"
              >
                "Why spend your time chasing factories, managing miscommunication, and fixing avoidable issues, when we can handle it for you?"
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── INSIGHTS PROMO ───── */}
      <section className="py-28 px-4 relative">
        <AnimatedGlow />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              <Link to="/insights" className="hover:text-primary transition-colors">
                Stay Ahead of What's Selling
              </Link>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check our insights page. We track best-selling products, pricing trends, and supplier signals across China, and publish clear, practical insights you can actually act on.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            {[
              { icon: TrendingUp, title: "Best-Selling SKUs", desc: "We publish regularly updated breakdowns of top-performing products by category, including SKUs, pricing ranges, and demand signals." },
              { icon: Globe, title: "Market Trend Reports", desc: "Our blog tracks shifts in consumer demand, seasonality, and sourcing trends, helping you decide what to source and when." },
              { icon: FileText, title: "Supplier & Cost Insights", desc: "We analyze supplier pricing, MOQ changes, and production signals, so you understand the real costs behind trending products." },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.02 }}
                className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/20 transition-all"
              >
                <motion.div
                  whileHover={{ rotate: -5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="h-7 w-7 text-primary mb-3" strokeWidth={1.5} />
                </motion.div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            {["Verified Market Signals", "China-Based Research", "Actionable Reports"].map((badge, i) => (
              <motion.span
                key={badge}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-xs font-medium text-primary border border-primary/30 rounded-full px-3 py-1 bg-primary/5"
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-14"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block"
            >
              FAQ's Section
            </motion.span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Common FAQ's</h2>
            <p className="text-muted-foreground mt-3">Get answers to your questions and learn about our platform</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-28 px-4 relative">
        <AnimatedGlow />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <RevealHeading className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Ready to Source Smarter?</RevealHeading>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join European SMEs already sourcing from China with full transparency, quality control, and dedicated human support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?signup=true">
              <MagneticButton>
                <Button size="sm" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-6 h-10 text-sm font-semibold shadow-[0_0_50px_-8px_hsl(239,100%,60%/0.5)] border border-primary/20">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </MagneticButton>
            </Link>
            <a href="https://calendly.com/admin-equilinq/30min" target="_blank" rel="noopener noreferrer">
              <MagneticButton>
                <Button variant="outline" size="sm" className="rounded-full border-border/60 text-foreground hover:bg-card/60 px-6 h-10 text-sm">
                  Book a Demo
                </Button>
              </MagneticButton>
            </a>
          </div>
        </motion.div>
      </section>

      </main>
      <PublicFooter />
    </div>
  );
}
