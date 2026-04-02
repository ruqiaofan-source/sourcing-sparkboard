import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { steps } from "./HowItWorksStep";

/* ──────── Animated step card ──────── */
function StepCard({ step, index, onVisible }: { step: (typeof steps)[number]; index: number; onVisible: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40% 0px -40% 0px" });
  const isInViewOnce = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (isInView) onVisible(index);
  }, [isInView, index, onVisible]);

  return (
    <div ref={ref} className="relative flex items-center" id={`step-${index}`}>
      {/* Connecting line dot on the center line */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 hidden lg:block">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInViewOnce ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          className="h-5 w-5 rounded-full bg-primary border-4 border-background shadow-[0_0_20px_hsl(239,100%,60%/0.5)]"
        />
      </div>

      {/* Card - alternating left/right */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -80 : 80, y: 20 }}
        animate={isInViewOnce ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full lg:w-[45%] ${isEven ? "lg:mr-auto lg:pr-12" : "lg:ml-auto lg:pl-12"}`}
      >
        <Link to={`/how-it-works/${step.slug}`} className="group block">
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 sm:p-8 overflow-hidden hover:border-primary/30 transition-all duration-300"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInViewOnce ? { opacity: 0.05, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -top-4 -right-2 font-heading text-[120px] font-bold text-foreground pointer-events-none select-none leading-none"
            >
              {step.step}
            </motion.span>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={isInViewOnce ? { scale: 1, rotate: 0 } : {}}
                transition={{ type: "spring", stiffness: 200, delay: 0.25 }}
                className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:shadow-[0_0_30px_hsl(239,100%,60%/0.2)] transition-all"
              >
                <step.icon className="h-7 w-7 text-primary" />
              </motion.div>

              <span className="text-[10px] font-bold text-primary/60 font-heading tracking-wider block mb-1">
                STEP {step.step}
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {step.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {step.shortDesc}
              </p>

              <ul className="space-y-2">
                {step.details.slice(0, 2).map((d, i) => (
                  <motion.li
                    key={d}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInViewOnce ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                    className="flex items-start gap-2 text-xs text-foreground/70"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}



/* ──────── Animated glow background ──────── */
function SectionGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(239 100% 60% / 0.08) 0%, transparent 70%)",
          top: "10%",
          right: "-10%",
        }}
        animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(260 80% 50% / 0.06) 0%, transparent 70%)",
          bottom: "20%",
          left: "-5%",
        }}
        animate={{ y: [0, 20, 0], scale: [1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function HowItWorks() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 80]);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead title="How It Works - Equilinq Sourcing Process in 8 Steps" description="From sourcing request to delivery: learn Equilinq's 8-step process for transparent, reliable manufacturing from China." />
      <PublicNavbar />

      

      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-16 px-4 relative">
        <SectionGlow />
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 250 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[11px] text-muted-foreground tracking-wide">
              8-step process
            </span>
          </motion.span>

          <motion.h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-[1.1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              From Request to Delivery
            </motion.span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-primary via-[hsl(260,80%,68%)] to-primary bg-clip-text text-transparent inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ backgroundSize: "200% 200%" }}
            >
              in 8 Simple Steps
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            We handle every stage so you can focus on growing your business.
          </motion.p>

          {/* Quick summary strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {[
              "Verified Factories",
              "Transparent Quotes",
              "Multi-Stage QC",
              "Full Logistics",
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/30 backdrop-blur-sm px-4 py-2 text-xs font-medium text-foreground/80"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="mx-auto w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-3 rounded-full bg-primary/60"
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Mobile progress bar */}
      <div className="sticky top-16 z-30 xl:hidden">
        <div className="bg-background/80 backdrop-blur-md border-b border-border/20 px-4 py-2">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Step {activeStep + 1} of {steps.length}</span>
            <span className="text-xs font-medium text-primary">{steps[activeStep]?.title}</span>
          </div>
          <div className="max-w-5xl mx-auto mt-1.5">
            <div className="h-1 rounded-full bg-muted-foreground/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <section className="pb-28 px-4 relative">
        <div className="max-w-5xl mx-auto relative">
          {/* Center vertical line (desktop only) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden lg:block">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
            />
          </div>

          <div className="space-y-12 lg:space-y-20">
            {steps.map((step, i) => (
              <StepCard key={step.slug} step={step} index={i} onVisible={setActiveStep} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-24 max-w-2xl mx-auto relative z-10"
        >
          <motion.div
            className="rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm p-10 relative overflow-hidden"
            whileHover={{ borderColor: "hsl(239 100% 65% / 0.3)" }}
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Submit your first sourcing request in minutes. No commitment, no upfront costs.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/auth?signup=true">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.4)]">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/pricing">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-base">
                    View Pricing
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <PublicFooter />
    </div>
  );
}
