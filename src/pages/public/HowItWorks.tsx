import { Link } from "react-router-dom";
import { useRef } from "react";
import { SEOHead } from "@/components/SEOHead";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { steps } from "./HowItWorksStep";

/* ── Timeline step ── */
function TimelineStep({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = step.icon;
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_auto_1fr] gap-0">
      {/* Left content */}
      <div className={`py-6 sm:py-10 pr-6 sm:pr-10 ${isLeft ? "" : "hidden sm:block"}`}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-right"
          >
            <StepContent step={step} index={index} align="right" />
          </motion.div>
        )}
      </div>

      {/* Center spine */}
      <div className="relative flex flex-col items-center w-10 sm:w-12">
        {/* Line above */}
        {index > 0 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="w-px flex-1 bg-border/40 origin-top"
          />
        )}
        {index === 0 && <div className="flex-1" />}

        {/* Node */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="relative z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center shrink-0"
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </motion.div>

        {/* Line below */}
        {index < steps.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-px flex-1 bg-border/40 origin-top"
          />
        )}
        {index === steps.length - 1 && <div className="flex-1" />}
      </div>

      {/* Right content */}
      <div className={`py-6 sm:py-10 pl-6 sm:pl-10 ${isLeft ? "block sm:hidden" : ""}`}>
        {/* On mobile, always show on right side */}
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden"
          >
            <StepContent step={step} index={index} align="left" />
          </motion.div>
        )}
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepContent step={step} index={index} align="left" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── Step content block ── */
function StepContent({
  step,
  index,
  align,
}: {
  step: (typeof steps)[number];
  index: number;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <span className="text-[10px] sm:text-xs font-bold tracking-widest text-primary/60 uppercase">
        Step {String(index + 1).padStart(2, "0")}
      </span>
      <h2 className="font-heading text-base sm:text-xl font-bold text-foreground mt-1 mb-2 leading-tight">
        {step.title}
      </h2>
      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 max-w-sm inline-block">
        {step.shortDesc}
      </p>
      <div>
        <Link to={`/how-it-works/${step.slug}`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary hover:bg-primary/10 text-xs px-0 h-7 gap-1"
          >
            Learn more <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
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
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 text-center relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 mb-5">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[11px] text-primary/80 tracking-wide font-medium">8-step managed process</span>
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-foreground leading-[1.1] mb-4">
            How It Works
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            From your first request to door-to-door delivery -- transparent sourcing with verified factories.
          </p>
        </motion.div>
      </section>

      {/* ── Timeline ── */}
      <section className="px-4 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <TimelineStep key={step.slug} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto text-center rounded-2xl border border-border/20 bg-card/15 p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/[0.05] blur-3xl pointer-events-none" />
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">Ready to start?</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Submit your first sourcing request in minutes.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/auth?signup=true">
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-7 h-10 text-sm font-semibold border border-primary/20">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="rounded-full border-border/40 px-7 h-10 text-sm">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <PublicFooter />
    </div>
  );
}
