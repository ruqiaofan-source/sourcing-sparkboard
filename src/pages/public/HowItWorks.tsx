import { Link } from "react-router-dom";
import { useRef } from "react";
import { SEOHead } from "@/components/SEOHead";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { steps } from "./HowItWorksStep";

/* ── Timeline step ── */
function TimelineStep({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = step.icon;
  const isLeft = index % 2 === 0;
  const isLast = index === steps.length - 1;

  return (
    <div ref={ref} className="relative">
      {/* ── Mobile: simple left-spine layout ── */}
      <div className="md:hidden grid grid-cols-[40px_1fr] items-stretch">
        {/* Spine */}
        <div className="relative flex flex-col items-center">
          {index > 0 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="absolute top-0 bottom-1/2 w-[2px] bg-gradient-to-b from-primary/30 to-primary/60 origin-top"
            />
          )}
          {!isLast && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="absolute top-1/2 bottom-0 w-[2px] bg-gradient-to-b from-primary/60 to-primary/30 origin-top"
            />
          )}
          <div className="flex-1" />
          <div className="relative z-10">
            {inView && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: [1, 1.8, 1.8], opacity: [0.5, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeOut" }}
              />
            )}
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.08 }}
              className="relative h-9 w-9 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center shrink-0 shadow-[0_0_24px_-4px_hsl(239,100%,60%/0.15)]"
            >
              <Icon className="h-4 w-4 text-primary" />
            </motion.div>
          </div>
          <div className="flex-1" />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to={`/how-it-works/${step.slug}`} className="block group">
            <div className="text-left p-4 rounded-xl border border-transparent group-hover:border-primary/20 group-hover:bg-primary/[0.03] transition-all duration-300">
              <StepContent step={step} index={index} align="left" inView={inView} showIcon={false} />
            </div>
          </Link>
        </motion.div>
      </div>

      {/* ── Desktop: 3-column alternating grid ── */}
      <div className="hidden md:grid grid-cols-[1fr_56px_1fr] items-stretch">
        {/* Left column */}
        <div className="flex items-center justify-end">
          {isLeft && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Link to={`/how-it-works/${step.slug}`} className="block group">
                <div className="text-right p-6 rounded-xl border border-transparent group-hover:border-primary/20 group-hover:bg-primary/[0.03] transition-all duration-300 cursor-pointer">
                  <StepContent step={step} index={index} align="right" inView={inView} />
                </div>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Center spine */}
        <div className="relative flex flex-col items-center">
          {index > 0 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="absolute top-0 bottom-1/2 w-[2px] bg-gradient-to-b from-primary/30 to-primary/60 origin-top"
            />
          )}
          {!isLast && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="absolute top-1/2 bottom-0 w-[2px] bg-gradient-to-b from-primary/60 to-primary/30 origin-top"
            />
          )}
          <div className="flex-1" />
          <div className="relative z-10">
            {inView && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: [1, 1.8, 1.8], opacity: [0.5, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeOut" }}
              />
            )}
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.08 }}
              whileHover={{ scale: 1.2, boxShadow: "0 0 32px 4px hsl(239 100% 60% / 0.35)" }}
              className="relative h-13 w-13 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center shrink-0 shadow-[0_0_24px_-4px_hsl(239,100%,60%/0.15)] transition-shadow duration-300 cursor-pointer hover:border-primary/60"
            >
              <Icon className="h-5 w-5 text-primary" />
            </motion.div>
          </div>
          <div className="flex-1" />
        </div>

        {/* Right column */}
        <div className="flex items-center">
          {!isLeft && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Link to={`/how-it-works/${step.slug}`} className="block group">
                <div className="text-left p-6 rounded-xl border border-transparent group-hover:border-primary/20 group-hover:bg-primary/[0.03] transition-all duration-300 cursor-pointer">
                  <StepContent step={step} index={index} align="left" inView={inView} />
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Step content ── */
function StepContent({
  step,
  index,
  align,
  inView,
  showIcon = true,
}: {
  step: (typeof steps)[number];
  index: number;
  align: "left" | "right";
  inView: boolean;
  showIcon?: boolean;
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        className="text-sm font-bold tracking-widest text-primary/60 uppercase"
      >
        Step {String(index + 1).padStart(2, "0")}
      </motion.span>

      <div className={`flex items-center gap-3 mt-2 mb-2.5 ${align === "right" ? "justify-end" : "justify-start"}`}>
        {showIcon && <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary/70 shrink-0" />}
        <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-200">
          {step.title}
        </h2>
      </div>

      <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed max-w-md inline-block">
        {step.shortDesc}
      </p>

      <div className="mt-4 flex items-center gap-1.5 text-primary/60 group-hover:text-primary transition-colors text-sm sm:text-base font-medium"
        style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}
      >
        Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "How It Works", url: "https://equilinq.eu/how-it-works" },
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
              url: `https://equilinq.eu/how-it-works/${s.slug}`,
            })),
          }),
        }}
      />
      <PublicNavbar />

      {/* ── Hero ── */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 text-center relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-primary/[0.03] blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[11px] text-muted-foreground tracking-wide uppercase">8-Step Process</span>
          </span>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.08] mb-5">
            From Request{" "}
            <span className="bg-gradient-to-r from-primary to-[hsl(239,80%,75%)] bg-clip-text text-transparent">
              to Doorstep
            </span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-8">
            Verified factories, transparent pricing, multi-stage quality control, and door-to-door delivery. All managed for you.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/auth?signup=true">
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-11 text-sm font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.35)]">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="rounded-full border-border/40 px-8 h-11 text-sm">
                Book a Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Timeline ── */}
      <section className="px-4 pb-20 sm:pb-32">
        <div className="max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <TimelineStep key={step.slug} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 pb-20 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto text-center rounded-2xl border border-border/20 bg-card/15 p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/[0.05] blur-3xl pointer-events-none" />
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">Ready to start?</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            Submit your first sourcing request in minutes. No commitment required.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/auth?signup=true">
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-7 h-11 text-sm font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.35)]">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="rounded-full border-border/40 px-7 h-11 text-sm">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Cross-links */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { to: "/pricing", title: "Pricing", desc: "Transparent, itemized cost breakdown" },
              { to: "/quality-control", title: "Quality Control", desc: "Multi-stage inspection for every order" },
              { to: "/customization", title: "Customization", desc: "35+ branding and packaging options" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="group block p-5 rounded-xl border border-border/30 bg-card/20 hover:border-primary/30 hover:bg-card/40 transition-all">
                <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">{link.title}</h3>
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
