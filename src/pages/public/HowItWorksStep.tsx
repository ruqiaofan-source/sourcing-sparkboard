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
      "Only verified, direct manufacturers are shortlisted, no trading companies.",
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
    desc: "We send a fully transparent, itemized quote. Every cost is visible, no hidden fees, no markups.",
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
      "No obligation, you only proceed when you are fully satisfied.",
    ],
    whatYouGet: [
      "A fully itemized quote with no hidden costs",
      "Side-by-side comparison if multiple factory options are available",
      "Transparent service fee structure based on order value",
    ],
    seoTitle: "Step 3: Transparent Quote & Pricing - Equilinq",
    seoDesc: "Receive a fully itemized sourcing quote. See factory cost, logistics, and service fees, no hidden markups.",
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
    desc: "Our QC team performs a thorough final inspection, checking defects, verifying specs, and ensuring packaging standards.",
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
      "When you are ready to reorder, simply open a new request, your supplier history is saved.",
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

      <main>
        {/* Inner hero, light */}
        <section className="relative bg-card">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
            <nav className="label-mono-up flex items-center gap-2 text-muted-foreground" aria-label="Breadcrumb">
              <Link to="/how-it-works" className="hover:text-primary">How it works</Link>
              <span aria-hidden="true">/</span>
              <span className="text-primary">Step {step.step} of 08</span>
            </nav>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              {step.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink sm:text-lg">{step.desc}</p>
          </div>
        </section>

        {/* Content */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid gap-6 md:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-border bg-card p-7">
                  <span className="label-mono-up text-muted-foreground">What's included</span>
                  <ul className="mt-4 space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex gap-3 text-sm leading-relaxed text-body-ink">
                        <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="h-full rounded-2xl border border-border bg-card p-7">
                  <span className="label-mono-up text-muted-foreground">Why it matters</span>
                  <p className="mt-4 text-sm leading-relaxed text-body-ink">{step.whyItMatters}</p>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <div className="mt-6 rounded-2xl border border-border bg-card p-7">
                <span className="label-mono-up text-muted-foreground">How it works</span>
                <ol className="mt-5 space-y-4">
                  {step.howItWorks.map((item, i) => (
                    <li key={item} className="flex gap-4 text-sm leading-relaxed text-body-ink">
                      <span className="label-mono shrink-0 text-primary">{String(i + 1).padStart(2, "0")}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-6 rounded-2xl border border-primary/25 bg-[image:var(--gradient-ink)] p-7 text-white shadow-[var(--shadow-soft)]">
                <span className="label-mono-up text-white/60">What you get</span>
                <ul className="mt-4 space-y-3">
                  {step.whatYouGet.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/85">
                      <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Previous and next */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
              <Button asChild variant="outlineInk" size="lg">
                {prev ? (
                  <Link to={`/how-it-works/${prev.slug}`}>
                    <ArrowLeft /> Step {prev.step}
                  </Link>
                ) : (
                  <Link to="/how-it-works">
                    <ArrowLeft /> Overview
                  </Link>
                )}
              </Button>
              <Button asChild variant="outlineInk" size="lg">
                {next ? (
                  <Link to={`/how-it-works/${next.slug}`}>
                    Step {next.step} <ArrowRight />
                  </Link>
                ) : (
                  <Link to="/how-it-works">
                    Overview <ArrowRight />
                  </Link>
                )}
              </Button>
            </div>

            {/* All steps */}
            <div className="mt-16 border-t border-border pt-10">
              <p className="label-mono-up text-muted-foreground">All steps</p>
              <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {steps.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/how-it-works/${s.slug}`}
                    className={`label-mono flex gap-3 border-b border-border/70 pb-3 transition-colors ${
                      s.slug === slug ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <span className="shrink-0">{s.step}</span>
                    <span className="normal-case tracking-normal">{s.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Closing band */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="surface-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to start sourcing?</h2>
              <p className="mt-5 text-lg text-white/75">
                {next
                  ? "Create your free account and submit your first sourcing request in minutes."
                  : "You have seen the full process. Let us handle your sourcing from start to finish."}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="xl" variant="hero" className="btn-nudge card-hover bg-white bg-none text-primary hover:bg-white">
                  <Link to="/auth?signup=true">
                    Start a request <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="onDark">
                  <a href={CALENDLY} target="_blank" rel="noopener noreferrer">
                    Book a call
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

