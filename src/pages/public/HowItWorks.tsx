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

/* ── Full-width immersive step section ── */
function StepSection({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;
  const Icon = step.icon;

  return (
    <section ref={ref} className="relative py-20 sm:py-28 px-4">
      {/* Subtle side glow */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-30 ${
          isEven ? "-left-40" : "-right-40"
        }`}
        style={{ background: "hsl(239 100% 60% / 0.12)" }}
      />

      <Link to={`/how-it-works/${step.slug}`} className="block group">
        <div className={`max-w-5xl mx-auto flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-10 lg:gap-16 rounded-2xl p-6 sm:p-8 border border-transparent group-hover:border-primary/20 group-hover:bg-card/30 transition-all duration-300`}>
          {/* Icon side */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -60 : 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-primary/15 group-hover:shadow-[0_0_30px_hsl(239,100%,60%/0.15)] transition-all duration-300"
            >
              <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 max-w-xl"
          >
            <span className="text-[11px] font-bold text-primary/60 tracking-[0.2em] font-heading mb-2 block">
              STEP {step.step}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
              {step.title}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
              {step.desc}
            </p>

            {/* Details with staggered reveal */}
            <div className="space-y-3 mb-6">
              {step.details.map((d, i) => (
                <motion.div
                  key={d}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/70">{d}</span>
                </motion.div>
              ))}
            </div>

            <span className="inline-flex items-center gap-2 text-sm text-primary font-medium">
              Learn more
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>
        </div>
      </Link>

      {/* Divider line */}
      {index < steps.length - 1 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border/40 to-transparent origin-center"
        />
      )}
    </section>
  );
}

/* ── Progress dots sidebar ── */
function ScrollProgress() {
  return (
    <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
      {steps.map((s) => (
        <a
          key={s.slug}
          href={`#step-${s.step}`}
          className="group flex items-center gap-3 justify-end"
          title={s.title}
        >
          <span className="text-[10px] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {s.title}
          </span>
          <span className="h-2 w-2 rounded-full bg-border group-hover:bg-primary group-hover:shadow-[0_0_8px_hsl(239,100%,60%/0.5)] transition-all" />
        </a>
      ))}
    </div>
  );
}

export default function HowItWorks() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, 80]);

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
      <ScrollProgress />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden z-20">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={heroTopImg} alt="" className="w-full h-full object-cover opacity-40" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/60 backdrop-blur-sm px-4 py-1.5 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground tracking-wide">8 transparent steps</span>
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.08] mb-6"
          >
            From Request
            <br />
            <span className="text-primary">to Delivery</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
          >
            A fully managed sourcing process. Verified factories, transparent pricing, multi-stage quality control, and door-to-door delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-3"
          >
            <a href="#step-01">
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-sm font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.4)]">
                Explore the Process
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1"
            >
              <motion.div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Value props ── */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Verified Factories", sub: "Screened & audited" },
              { label: "Transparent Quotes", sub: "No hidden costs" },
              { label: "Multi-Stage QC", sub: "Photo & video reports" },
              { label: "Full Logistics", sub: "Door-to-door delivery" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-border/30 bg-card/20 p-4 text-center"
              >
                <CheckCircle2 className="h-5 w-5 text-primary mx-auto mb-2" />
                <span className="text-sm font-semibold text-foreground block leading-tight">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      {steps.map((step, i) => (
        <div key={step.slug} id={`step-${step.step}`}>
          <StepSection step={step} index={i} />
        </div>
      ))}

      {/* ── Bottom image + CTA ── */}
      <section className="px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden mb-12 h-56 sm:h-80"
          >
            <img src={heroBottomImg} alt="Equilinq quality control" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
              <p className="text-foreground font-heading text-xl sm:text-3xl font-bold max-w-lg leading-snug">
                Your products, sourced with full transparency and quality assurance.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm p-10 sm:p-14 relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-primary/[0.06] blur-3xl pointer-events-none" />
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm sm:text-base">
              Submit your first sourcing request in minutes. No commitment, no upfront costs.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/auth?signup=true">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-sm font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.4)]">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/pricing">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-sm">
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
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { to: "/pricing", title: "Pricing", desc: "Transparent, itemized cost breakdown" },
              { to: "/customization", title: "Customization", desc: "35+ branding and packaging options" },
              { to: "/insights", title: "Insights", desc: "Sourcing trends and market reports" },
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
