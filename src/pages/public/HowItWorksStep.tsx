import { useParams, Link, Navigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import {
  Search, FileText, CreditCard, Factory, ShieldCheck, Truck, Package,
  MessageSquare, ArrowRight, ArrowLeft, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";

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
    seoTitle: "Step 2: Supplier Sourcing & Vetting - Equilinq",
    seoDesc: "We find and vet reliable Chinese manufacturers. Direct factory access, compliance screening, and MOQ negotiation.",
  },
  {
    slug: "receive-your-quote",
    step: "03",
    icon: FileText,
    title: "Receive Your Quote",
    shortDesc: "Get a fully transparent, itemized cost breakdown.",
    desc: "We send a fully transparent, itemized quote. Every cost is visible -- no hidden fees, no markups.",
    details: [
      "Factory cost (wholesale price)",
      "China operational costs",
      "Logistics and shipping estimate",
      "Equilinq service fee (7% or custom)",
    ],
    seoTitle: "Step 3: Transparent Quote & Pricing - Equilinq",
    seoDesc: "Receive a fully itemized sourcing quote. See factory cost, logistics, and service fees -- no hidden markups.",
  },
  {
    slug: "accept-and-pay",
    step: "04",
    icon: CreditCard,
    title: "Accept & Pay",
    shortDesc: "Review, accept, and pay securely. Production begins.",
    desc: "Review the quote, ask questions, and accept when ready. Payment is processed securely and production begins.",
    details: [
      "Secure payment processing",
      "Order confirmation and tracking number",
      "Production timeline communicated",
      "Dedicated agent assigned",
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
      <SEOHead title={step.seoTitle} description={step.seoDesc} />
      <PublicNavbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-xs text-muted-foreground mb-8"
          >
            <Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <span>/</span>
            <span className="text-foreground">Step {step.step}</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
              >
                <Icon className="h-8 w-8 text-primary" />
              </motion.div>
              <div>
                <span className="text-xs font-bold text-primary/60 font-heading tracking-wider">STEP {step.step}</span>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">{step.title}</h1>
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-10">{step.desc}</p>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-border/30 bg-card/30 p-6 mb-12"
          >
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">What's included</h2>
            <ul className="space-y-3">
              {step.details.map((detail, i) => (
                <motion.li
                  key={detail}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className="flex items-start gap-3 text-sm text-foreground/80"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Nav */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
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
              <Link to="/auth?signup=true">
                <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 font-semibold border border-primary/20">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
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
