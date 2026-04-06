import { Link } from "react-router-dom";
import { useRef } from "react";
import { SEOHead } from "@/components/SEOHead";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { steps } from "./HowItWorksStep";
import heroTopImg from "@/assets/how-it-works-top.jpeg";
import heroBottomImg from "@/assets/how-it-works-bottom.jpeg";

/* ── Numbered timeline step ── */
function StepSection({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = step.icon;
  const isLast = index === steps.length - 1;

  return (
    <div ref={ref} className="relative">
      <Link to={`/how-it-works/${step.slug}`} className="block group">
        <div className="flex gap-6 sm:gap-10">
          {/* Timeline column */}
          <div className="flex flex-col items-center shrink-0">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10 h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_hsl(239,100%,60%/0.2)] transition-all duration-300"
            >
              <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </motion.div>
            {/* Vertical connector line */}
            {!isLast && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-px flex-1 bg-gradient-to-b from-primary/20 via-border/30 to-transparent origin-top min-h-[40px]"
              />
            )}
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 pb-14 sm:pb-18"
          >
            <div className="rounded-xl border border-border/20 bg-card/10 p-5 sm:p-7 group-hover:border-primary/25 group-hover:bg-card/30 transition-all duration-300">
              <span className="text-[10px] font-bold text-primary/50 tracking-[0.25em] font-heading block mb-1.5">
                STEP {step.step}
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors duration-200">
                {step.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {step.desc}
              </p>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-5">
                {step.details.map((d, i) => (
                  <motion.div
                    key={d}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.25 + i * 0.06 }}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary/70 shrink-0 mt-0.5" />
                    <span className="text-xs text-foreground/60 leading-relaxed">{d}</span>
                  </motion.div>
                ))}
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs text-primary/70 font-medium group-hover:text-primary transition-colors">
                View details
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </motion.div>
        </div>
      </Link>
    </div>
  );
}

export default function HowItWorks() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.96]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, 60]);

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
            description: "From sourcing request to delivery: Equilinq's 8-step process for transparent, reliable manufacturing from China.",
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
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroTopImg} alt="" className="w-full h-full object-cover opacity-30" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 text-center max-w-2xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/50 backdrop-blur-sm px-4 py-1.5 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] text-muted-foreground tracking-wide font-medium">8 transparent steps</span>
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.06] mb-5"
          >
            From Request
            <br />
            <span className="text-primary">to Delivery</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed"
          >
            A fully managed sourcing process with verified factories, transparent pricing, and door-to-door delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <a href="#steps">
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-11 text-sm font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.35)]">
                Explore the Process
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto w-5 h-8 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-1"
            >
              <motion.div className="w-1 h-1.5 rounded-full bg-muted-foreground/40" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Value props ── */}
      <section className="py-14 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {[
              { label: "Verified Factories", sub: "Screened & audited" },
              { label: "Transparent Quotes", sub: "No hidden costs" },
              { label: "Multi-Stage QC", sub: "Photo & video reports" },
              { label: "Full Logistics", sub: "Door-to-door delivery" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-border/20 bg-card/15 p-4 text-center"
              >
                <CheckCircle2 className="h-4 w-4 text-primary mx-auto mb-2" />
                <span className="text-xs sm:text-sm font-semibold text-foreground block leading-tight">{item.label}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{item.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline steps ── */}
      <section id="steps" className="px-4 pb-10 relative z-10 scroll-mt-8">
        <div className="max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-8"
          >
            The Process
          </motion.p>

          {steps.map((step, i) => (
            <StepSection key={step.slug} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* ── Bottom image + CTA ── */}
      <section className="px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden mb-10 h-48 sm:h-64"
          >
            <img src={heroBottomImg} alt="Equilinq quality control" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-foreground font-heading text-lg sm:text-2xl font-bold max-w-md leading-snug">
                Your products, sourced with full transparency.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center rounded-2xl border border-border/20 bg-card/15 p-8 sm:p-12 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/[0.05] blur-3xl pointer-events-none" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-7 max-w-sm mx-auto text-sm">
              Submit your first sourcing request in minutes. No commitment, no upfront costs.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/auth?signup=true">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-11 text-sm font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.35)]">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/pricing">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="rounded-full border-border/40 px-8 h-11 text-sm">
                    View Pricing
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { to: "/pricing", title: "Pricing", desc: "Transparent, itemized cost breakdown" },
              { to: "/customization", title: "Customization", desc: "35+ branding and packaging options" },
              { to: "/insights", title: "Insights", desc: "Sourcing trends and market reports" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="group block p-5 rounded-xl border border-border/20 bg-card/10 hover:border-primary/25 hover:bg-card/30 transition-all duration-200">
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
