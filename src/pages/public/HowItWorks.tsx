import { Link } from "react-router-dom";
import { useRef } from "react";
import { SEOHead } from "@/components/SEOHead";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { steps } from "./HowItWorksStep";

/* ── Feature highlight cards shown beside certain steps ── */
const featureCards: Record<number, { left?: { title: string; desc: string }[]; right?: { title: string; desc: string }[] }> = {
  0: {
    right: [
      { title: "Fast responses.", desc: "Initial supplier matches within 24 hours." },
      { title: "Pre-Verification.", desc: "Suppliers are pre-verified against international standards." },
    ],
  },
  1: {
    left: [
      { title: "Direct access.", desc: "No trading companies. Real factory connections only." },
      { title: "MOQ flexibility.", desc: "Negotiate lower minimums for small-batch testing." },
    ],
  },
  2: {
    right: [
      { title: "Full transparency.", desc: "Every cost line visible. No hidden markups." },
      { title: "Compare easily.", desc: "Side-by-side quote comparison across factories." },
    ],
  },
  4: {
    left: [
      { title: "Photo updates.", desc: "Regular production photos and video check-ins." },
      { title: "Spec tracking.", desc: "Continuous adherence checks against your requirements." },
    ],
  },
  5: {
    right: [
      { title: "AQL standards.", desc: "Industry-standard defect rate assessment." },
      { title: "QC reports.", desc: "Detailed inspection reports with photo evidence." },
    ],
  },
  7: {
    left: [
      { title: "Reorder easily.", desc: "One-click reorders with saved specifications." },
      { title: "Long-term support.", desc: "Ongoing supplier relationship management." },
    ],
  },
};

/* ── Feature card component ── */
function FeatureCard({ title, desc, delay }: { title: string; desc: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm p-4 sm:p-5"
    >
      <h4 className="font-heading text-sm font-bold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ── Single step row ── */
function StepRow({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = step.icon;
  const features = featureCards[index];

  return (
    <div ref={ref} className="relative">
      {/* Connector line above (except first) */}
      {index > 0 && (
        <div className="absolute left-1/2 -translate-x-px -top-px h-16 sm:h-24 w-px bg-gradient-to-b from-transparent via-border/40 to-border/40 hidden md:block" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-start">
        {/* Left feature cards */}
        <div className="hidden md:flex flex-col gap-3 justify-center min-h-[120px]">
          {features?.left?.map((f, i) => (
            <FeatureCard key={f.title} title={f.title} desc={f.desc} delay={0.2 + i * 0.1} />
          ))}
        </div>

        {/* Center: step content */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-md mx-auto md:mx-0"
        >
          {/* Step number + icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="mx-auto mb-4 h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border border-primary/20 bg-primary/[0.08] flex items-center justify-center"
          >
            <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          </motion.div>

          <span className="font-heading text-3xl sm:text-4xl font-bold text-foreground/15 block mb-1">
            {index + 1}.
          </span>

          <h2 className="font-heading text-lg sm:text-2xl font-bold text-foreground mb-2 leading-tight">
            {step.title}
          </h2>

          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 max-w-sm mx-auto">
            {step.desc}
          </p>

          <Link to={`/how-it-works/${step.slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary text-xs px-5 h-8"
            >
              Learn more
            </Button>
          </Link>

          {/* Mobile feature cards */}
          {(features?.left || features?.right) && (
            <div className="mt-5 flex flex-col gap-2 md:hidden">
              {[...(features?.left || []), ...(features?.right || [])].map((f, i) => (
                <FeatureCard key={f.title} title={f.title} desc={f.desc} delay={0.3 + i * 0.1} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Right feature cards */}
        <div className="hidden md:flex flex-col gap-3 justify-center min-h-[120px]">
          {features?.right?.map((f, i) => (
            <FeatureCard key={f.title} title={f.title} desc={f.desc} delay={0.2 + i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="How It Works - Equilinq Sourcing Process in 8 Steps"
        description="From sourcing request to delivery: learn Equilinq's 8-step process for transparent, reliable manufacturing from China."
        keywords="sourcing process, China manufacturing steps, how sourcing works, supplier vetting, quality control process"
        breadcrumbs={[
          { name: "Home", url: "https://www.equilinq.eu/" },
          { name: "How It Works", url: "https://www.equilinq.eu/how-it-works" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How China Sourcing Works with Equilinq",
            description: "From sourcing request to delivery: Equilinq's 8-step process.",
            totalTime: "P30D",
            step: steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.desc,
              url: `https://www.equilinq.eu/how-it-works/${s.slug}`,
            })),
          }),
        }}
      />
      <PublicNavbar />

      {/* ── Hero ── */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 text-center relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm px-4 py-1.5 mb-6">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[11px] text-primary/80 tracking-wide font-medium">8-step managed process</span>
          </span>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.08] mb-5">
            How It Works
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            From your first request to door-to-door delivery -- a transparent, managed sourcing process with verified factories and multi-stage quality control.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/auth?signup=true">
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-11 text-sm font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.35)]">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="rounded-full border-border/40 px-8 h-11 text-sm">
                Talk to Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Steps ── */}
      <section className="px-4 pb-16 sm:pb-24 relative z-10">
        <div className="max-w-5xl mx-auto space-y-16 sm:space-y-24">
          {steps.map((step, i) => (
            <StepRow key={step.slug} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-4 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center rounded-2xl border border-border/20 bg-card/15 p-8 sm:p-14 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/[0.05] blur-3xl pointer-events-none" />
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-7 max-w-sm mx-auto text-sm">
            Submit your first sourcing request in minutes. No commitment, no upfront costs.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/auth?signup=true">
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-11 text-sm font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.35)]">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="rounded-full border-border/40 px-8 h-11 text-sm">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Cross-links */}
      <section className="pb-16 sm:pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { to: "/pricing", title: "Pricing", desc: "Transparent, itemized cost breakdown", emoji: "💰" },
              { to: "/customization", title: "Customization", desc: "35+ branding and packaging options", emoji: "🎨" },
              { to: "/insights", title: "Insights", desc: "Sourcing trends and market reports", emoji: "📊" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="group block p-5 rounded-xl border border-border/20 bg-card/10 hover:border-primary/25 hover:bg-card/30 transition-all duration-200">
                <span className="text-lg block mb-1.5">{link.emoji}</span>
                <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-0.5">{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
