import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { steps } from "./HowItWorksStep";
import heroTopImg from "@/assets/how-it-works-top.jpeg";
import heroBottomImg from "@/assets/how-it-works-bottom.jpeg";

/* ──────── Compact step row ──────── */
function StepRow({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.05 }}
    >
      <Link to={`/how-it-works/${step.slug}`} className="group block">
        <div className="flex gap-4 sm:gap-6 items-start p-4 sm:p-5 rounded-xl border border-border/30 bg-card/20 hover:border-primary/30 hover:bg-card/40 transition-all duration-300">
          {/* Step number */}
          <div className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_hsl(239,100%,60%/0.15)] transition-all">
            <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-primary/60 tracking-wider">STEP {step.step}</span>
            </div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors leading-snug">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-2 line-clamp-2">
              {step.shortDesc}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {step.details.slice(0, 3).map((d) => (
                <span key={d} className="flex items-center gap-1.5 text-[11px] text-foreground/60">
                  <CheckCircle2 className="h-3 w-3 text-primary/70 shrink-0" />
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-3 group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function HowItWorks() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 60]);

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
            description: "From sourcing request to delivery: Equilinq's 8-step process for transparent, reliable manufacturing from China.",
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

      {/* Hero with top image */}
      <section ref={heroRef} className="pt-24 pb-8 px-4 relative">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="max-w-5xl mx-auto relative z-10"
        >
          {/* Top image banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden mb-8 h-48 sm:h-64"
          >
            <img src={heroTopImg} alt="Equilinq sourcing process" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/60 backdrop-blur-sm px-3 py-1 mb-3"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] text-muted-foreground tracking-wide">8-step process</span>
              </motion.span>
              <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1]">
                From Request to Delivery
              </h1>
            </div>
          </motion.div>

          {/* Value props row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-2">
            {[
              { label: "Verified Factories", sub: "Screened & audited" },
              { label: "Transparent Quotes", sub: "No hidden costs" },
              { label: "Multi-Stage QC", sub: "Photo & video reports" },
              { label: "Full Logistics", sub: "Door-to-door delivery" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                className="rounded-xl border border-border/30 bg-card/20 p-3 sm:p-4 text-center"
              >
                <CheckCircle2 className="h-4 w-4 text-primary mx-auto mb-1.5" />
                <span className="text-xs sm:text-sm font-semibold text-foreground block leading-tight">{item.label}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{item.sub}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Steps list - compact */}
      <section className="px-4 pb-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">All Steps</h2>
            <span className="text-xs text-muted-foreground">Click any step for details</span>
          </div>

          <div className="space-y-3">
            {steps.map((step, i) => (
              <StepRow key={step.slug} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom image + CTA */}
      <section className="px-4 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Bottom image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden mb-10 h-48 sm:h-72"
          >
            <img src={heroBottomImg} alt="Equilinq quality control" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-foreground font-heading text-lg sm:text-2xl font-bold max-w-lg">
                Your products, sourced with full transparency and quality assurance.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm p-8 sm:p-10 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
              Submit your first sourcing request in minutes. No commitment, no upfront costs.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/auth?signup=true">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-11 text-sm font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.4)]">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/pricing">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-11 text-sm">
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
