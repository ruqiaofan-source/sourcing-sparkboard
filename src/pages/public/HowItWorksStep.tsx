import { useParams, Link, Navigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import {
  Search, FileText, CreditCard, Factory, ShieldCheck, Truck, Package,
  MessageSquare, ArrowRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Reveal } from "@/components/Reveal";

const CALENDLY = "https://calendly.com/admin-equilinq/30min";


export const steps = [
  {
    slug: "submit-sourcing-request",
    step: "01",
    icon: MessageSquare,
    title: "Submit Your Sourcing Request",
    shortDesc: "Share your product specs, quantity, and budget.",
    desc: "Describe your product, quantity, budget, and any customization requirements. Upload reference images or specs to help us find the right match.",
    details: [
      "Product description and specifications",
      "Target quantity and budget per unit",
      "Customization needs (branding, packaging, colors)",
      "Delivery country and preferred timeline",
    ],
    whyItMatters: "A clear, detailed request is the foundation of a successful sourcing project. The more information you provide upfront, the faster we can match you with the right factory and avoid costly revisions later.",
    howItWorks: [
      "Log in to your Equilinq dashboard and open a new sourcing request.",
      "Fill in your product details: name, material, dimensions, colors, and any reference images.",
      "Set your target quantity, budget per unit, and preferred delivery timeline.",
      "Add any customization requirements such as logos, packaging, or labeling.",
      "Submit the request and our sourcing team will begin working within 24 hours.",
    ],
    whatYouGet: [
      "A dedicated sourcing agent assigned to your request",
      "Confirmation and initial feedback within one business day",
      "Direct messaging channel for follow-up questions",
    ],
    seoTitle: "Step 1: Submit Your Sourcing Request - Equilinq",
    seoDesc: "Start your China sourcing journey. Submit product specs, quantity, budget, and customization needs to Equilinq.",
  },
  {
    slug: "source-and-vet-suppliers",
    step: "02",
    icon: Search,
    title: "We Source & Vet Suppliers",
    shortDesc: "We find and screen verified manufacturers for you.",
    desc: "Our team searches our vetted factory network, screening for production capability, quality, compliance, and MOQ flexibility.",
    details: [
      "Access to verified factory network",
      "Capability and compliance screening",
      "MOQ negotiation on your behalf",
      "Elimination of trading companies",
    ],
    whyItMatters: "Finding a reliable factory is the hardest part of sourcing from China. Trading companies, inconsistent quality, and unverified claims waste time and money. We remove that risk by doing the legwork for you.",
    howItWorks: [
      "Our China-based team searches our vetted factory database for matches.",
      "We cross-reference production capability, certifications, and past performance.",
      "Factories are contacted and screened for your specific product requirements.",
      "We negotiate MOQ, lead times, and pricing on your behalf.",
      "Only verified, direct manufacturers are shortlisted -- no trading companies.",
    ],
    whatYouGet: [
      "A curated shortlist of pre-vetted factories",
      "Factory capability profiles (certifications, capacity, past orders)",
      "Negotiated pricing and MOQ tailored to your order size",
    ],
    seoTitle: "Step 2: Supplier Sourcing & Vetting - Equilinq",
    seoDesc: "We find and vet reliable Chinese manufacturers. Direct factory access, compliance screening, and MOQ negotiation.",
  },
  {
    slug: "receive-your-quote",
    step: "03",
    icon: FileText,
    title: "Receive Your Quote",
    shortDesc: "Transparent, itemized pricing with no hidden fees.",
    desc: "We send a fully transparent, itemized quote. Every cost is visible -- no hidden fees, no markups.",
    details: [
      "Factory cost (wholesale price)",
      "China operational costs",
      "Logistics and shipping estimate",
      "Equilinq service fee",
    ],
    whyItMatters: "Hidden markups and unclear pricing are common in sourcing. Our fully itemized quotes let you see exactly where every euro goes, so you can make informed decisions and compare options confidently.",
    howItWorks: [
      "Once suppliers are vetted, we compile pricing from the best-matched factory.",
      "Each quote is broken down into factory cost, operational costs, logistics, and our service fee.",
      "You receive the quote in your dashboard with a clear cost breakdown.",
      "Ask questions, request adjustments, or compare with alternative options.",
      "No obligation -- you only proceed when you are fully satisfied.",
    ],
    whatYouGet: [
      "A fully itemized quote with no hidden costs",
      "Side-by-side comparison if multiple factory options are available",
      "Transparent service fee structure based on order value",
    ],
    seoTitle: "Step 3: Transparent Quote & Pricing - Equilinq",
    seoDesc: "Receive a fully itemized sourcing quote. See factory cost, logistics, and service fees -- no hidden markups.",
  },
  {
    slug: "accept-and-pay",
    step: "04",
    icon: CreditCard,
    title: "Accept & Pay",
    shortDesc: "Pay securely and production begins.",
    desc: "Review the quote, ask questions, and accept when ready. Payment is processed securely and production begins.",
    details: [
      "Secure payment processing",
      "Order confirmation and tracking number",
      "Production timeline communicated",
      "Dedicated agent assigned",
    ],
    whyItMatters: "A smooth, secure payment process means production can start without delays. You receive immediate confirmation and a clear timeline, so there are no surprises once your order is underway.",
    howItWorks: [
      "Review the final quote and confirm all specifications are correct.",
      "Accept the quote through your dashboard.",
      "Complete payment securely via our integrated payment system.",
      "Receive your order confirmation with a unique order number.",
      "Your dedicated agent shares the production timeline and milestones.",
    ],
    whatYouGet: [
      "Secure, encrypted payment processing",
      "Instant order confirmation with tracking number",
      "A clear production schedule with key milestone dates",
    ],
    seoTitle: "Step 4: Accept Quote & Secure Payment - Equilinq",
    seoDesc: "Accept your sourcing quote and pay securely. Get order confirmation, timeline, and a dedicated agent.",
  },
  {
    slug: "production-and-monitoring",
    step: "05",
    icon: Factory,
    title: "Production & Monitoring",
    shortDesc: "Real-time updates with photos and progress reports.",
    desc: "We coordinate with the factory throughout production. You receive updates, photos, and progress reports through the platform.",
    details: [
      "Pre-production sample validation",
      "In-process production monitoring",
      "Regular photo and video updates",
      "Specification adherence checks",
    ],
    whyItMatters: "Production issues caught early are cheap to fix. Issues caught after shipping are expensive. Our monitoring process ensures your order stays on spec and on schedule throughout the entire production run.",
    howItWorks: [
      "Before mass production starts, a pre-production sample is created and validated.",
      "Our team visits the factory or coordinates remotely to monitor progress.",
      "You receive photo and video updates at key production milestones.",
      "Any deviations from specifications are flagged and resolved immediately.",
      "A progress report is shared with you at each stage through the dashboard.",
    ],
    whatYouGet: [
      "Pre-production sample approval before mass production",
      "Regular photo/video updates from the factory floor",
      "Proactive issue resolution if specifications drift",
    ],
    seoTitle: "Step 5: Production Monitoring - Equilinq",
    seoDesc: "Track production in real-time. Get photo updates, sample validation, and in-process monitoring from China.",
  },
  {
    slug: "quality-control-inspection",
    step: "06",
    icon: ShieldCheck,
    title: "Quality Control Inspection",
    shortDesc: "Final inspection before shipment with photo reports.",
    desc: "Our QC team performs a thorough final inspection -- checking defects, verifying specs, and ensuring packaging standards.",
    details: [
      "Visual and functional inspection",
      "Defect rate assessment (AQL standards)",
      "Packaging and labeling verification",
      "Detailed QC report with photos",
    ],
    whyItMatters: "Shipping defective products to Europe is costly and damaging to your brand. A professional final inspection catches problems before they leave the factory, saving you returns, refunds, and reputation damage.",
    howItWorks: [
      "Once production is complete, our QC inspector visits the factory.",
      "A random sample is pulled according to AQL (Acceptable Quality Level) standards.",
      "Each unit is checked visually and functionally against your specifications.",
      "Packaging, labeling, and branding are verified for accuracy.",
      "A detailed QC report with photos is uploaded to your dashboard for review.",
    ],
    whatYouGet: [
      "Professional on-site inspection by trained QC personnel",
      "AQL-based sampling with pass/fail criteria",
      "A detailed photo report you can review before approving shipment",
    ],
    seoTitle: "Step 6: Quality Control Inspection - Equilinq",
    seoDesc: "Multi-stage quality control before shipment. AQL inspections, defect checks, and detailed photo QC reports.",
  },
  {
    slug: "shipping-and-logistics",
    step: "07",
    icon: Truck,
    title: "Shipping & Logistics",
    shortDesc: "Consolidated shipping, customs handling, real-time tracking.",
    desc: "We arrange shipping, handle export docs, and coordinate customs. Choose standard, express, or premium speed.",
    details: [
      "Standard (15-25 days), Express (7-14), Premium (5-10)",
      "Export documentation and customs coordination",
      "Real-time shipment tracking",
      "Insurance coverage available",
    ],
    whyItMatters: "International shipping from China involves export licenses, customs documentation, and logistics coordination. We handle all of it so your products arrive on time, intact, and cleared through customs without hassle.",
    howItWorks: [
      "After QC approval, we arrange shipping based on your preferred speed and budget.",
      "All export documentation (commercial invoice, packing list, certificates) is prepared.",
      "The shipment is picked up from the factory and transported to the port or airport.",
      "Customs clearance is coordinated on both the China and destination side.",
      "You receive a tracking number and real-time shipment updates in your dashboard.",
    ],
    whatYouGet: [
      "End-to-end logistics management from factory to your door",
      "Three shipping tiers: Standard, Express, and Premium",
      "Real-time tracking and proactive delay notifications",
    ],
    seoTitle: "Step 7: Shipping & Logistics from China - Equilinq",
    seoDesc: "Consolidated shipping from China with customs handling. Standard, express, and premium options with real-time tracking.",
  },
  {
    slug: "delivery-and-support",
    step: "08",
    icon: Package,
    title: "Delivery & Support",
    shortDesc: "Products delivered. Ongoing support for reorders.",
    desc: "Products arrive at your address. We remain available for post-delivery questions, reorders, or ongoing sourcing.",
    details: [
      "Delivery to your specified address",
      "Post-delivery support",
      "Easy reorder process",
      "Long-term supplier relationship management",
    ],
    whyItMatters: "Sourcing does not end at delivery. Building a long-term supplier relationship means better pricing, faster turnarounds, and consistent quality over time. We help you grow beyond a single order.",
    howItWorks: [
      "Your products are delivered to the address specified in your order.",
      "Inspect your delivery and confirm everything matches your expectations.",
      "If any issues arise, contact your agent directly through the platform.",
      "When you are ready to reorder, simply open a new request -- your supplier history is saved.",
      "We maintain the factory relationship so future orders are faster and smoother.",
    ],
    whatYouGet: [
      "Door-to-door delivery to your specified address in Europe",
      "Ongoing post-delivery support for any questions or concerns",
      "Streamlined reorder process with saved supplier preferences",
    ],
    seoTitle: "Step 8: Delivery & Ongoing Support - Equilinq",
    seoDesc: "Products delivered to your door. Ongoing support, easy reorders, and long-term supplier relationship management.",
  },
];

export default function HowItWorksStep() {
  const { slug } = useParams<{ slug: string }>();
  const stepIndex = steps.findIndex((s) => s.slug === slug);

  if (stepIndex === -1) return <Navigate to="/how-it-works" replace />;

  const step = steps[stepIndex];
  const prev = stepIndex > 0 ? steps[stepIndex - 1] : null;
  const next = stepIndex < steps.length - 1 ? steps[stepIndex + 1] : null;
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={step.seoTitle}
        description={step.seoDesc}
        keywords={`${step.title}, China sourcing, Equilinq process, ${step.details.slice(0, 2).join(', ')}`}
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "How It Works", url: "https://equilinq.eu/how-it-works" },
          { name: step.title, url: `https://equilinq.eu/how-it-works/${step.slug}` },
        ]}
        jsonLd={{
          "@type": "HowToStep",
          name: step.title,
          text: step.desc,
          url: `https://equilinq.eu/how-it-works/${step.slug}`,
          position: parseInt(step.step),
        }}
      />
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 text-center relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-primary/[0.03] blur-[100px]" />
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-8"
          >
            <Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <span>/</span>
            <span className="text-foreground">Step {step.step}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Step {step.step} of 08</span>
            </span>

            <div className="flex items-center justify-center gap-4 mb-5">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
              >
                <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </motion.div>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.08] mb-5">
              <span className="bg-gradient-to-r from-[hsl(239,100%,65%)] via-[hsl(280,80%,72%)] to-[hsl(239,100%,65%)] bg-clip-text text-transparent">
                {step.title}
              </span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed">{step.desc}</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          {/* What's included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-border/30 bg-card/30 p-6 sm:p-8 mb-8"
          >
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">What's included</h2>
            <ul className="space-y-3">
              {step.details.map((detail, i) => (
                <motion.li
                  key={detail}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className="flex items-start gap-3 text-sm sm:text-base text-foreground/80"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Why it matters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl border border-border/30 bg-card/30 p-6 sm:p-8 mb-8"
          >
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Why it matters</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.whyItMatters}</p>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="rounded-2xl border border-border/30 bg-card/30 p-6 sm:p-8 mb-8"
          >
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">How it works</h2>
            <ol className="space-y-4">
              {step.howItWorks.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
                  className="flex items-start gap-3 text-sm sm:text-base text-foreground/80"
                >
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* What you get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8 mb-12"
          >
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">What you get</h2>
            <ul className="space-y-3">
              {step.whatYouGet.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                  className="flex items-start gap-3 text-sm sm:text-base text-foreground/80"
                >
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] p-8 sm:p-10 mb-12 text-center"
          >
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-3">
              Ready to start sourcing?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
              {next
                ? "Create your free account and submit your first sourcing request in minutes."
                : "You have seen the full process. Let us handle your sourcing from start to finish."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?signup=true">
                <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-semibold border border-primary/20">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="https://calendly.com/admin-equilinq/30min" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="rounded-full px-6">
                  Book a Call
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Nav */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="flex items-center justify-between"
          >
            {prev ? (
              <Link to={`/how-it-works/${prev.slug}`}>
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Step {prev.step}
                </Button>
              </Link>
            ) : (
              <Link to="/how-it-works">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Overview
                </Button>
              </Link>
            )}

            {next ? (
              <Link to={`/how-it-works/${next.slug}`}>
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  Step {next.step}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/how-it-works">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Overview
                </Button>
              </Link>
            )}
          </motion.div>

          {/* All steps nav */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-16 pt-10 border-t border-border/20"
          >
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">All Steps</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {steps.map((s, i) => (
                <Link
                  key={s.slug}
                  to={`/how-it-works/${s.slug}`}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                    s.slug === slug
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/30 bg-card/20 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                  }`}
                >
                  <span className="text-[10px] block text-primary/50 mb-0.5">Step {s.step}</span>
                  {s.title}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
