import { Link } from "react-router-dom";
import { useRef } from "react";
import { SEOHead } from "@/components/SEOHead";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { steps } from "./HowItWorksStep";
import heroTopImg from "@/assets/how-it-works-top.jpeg";
import heroBottomImg from "@/assets/how-it-works-bottom.jpeg";

/* ── Rich step card with icon, number badge, and details ── */
function StepCard({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} id={`step-${step.step}`} className="scroll-mt-24">
      <Link to={`/how-it-works/${step.slug}`} className="block group">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`relative rounded-2xl border border-border/20 bg-card/10 overflow-hidden group-hover:border-primary/30 group-hover:bg-card/30 transition-all duration-300 ${
            isEven ? "" : ""
          }`}
        >
          {/* Glow accent */}
          <div className={`absolute top-0 ${isEven ? "right-0" : "left-0"} w-1/2 h-full bg-gradient-to-${isEven ? "l" : "r"} from-transparent to-primary/[0.03] pointer-events-none`} />

          <div className="relative p-6 sm:p-8">
            {/* Top row: step number + icon */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.15, type: "spring", stiffness: 250 }}
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_25px_hsl(239,100%,60%/0.15)] transition-all duration-300"
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </motion.div>
                <div>
                  <span className="text-[10px] font-bold text-primary/50 tracking-[0.2em] font-heading block">STEP {step.step}</span>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {step.title}
                  </h2>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-lg">
              {step.desc}
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {step.details.map((d, i) => (
                <motion.div
                  key={d}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                  className="flex items-start gap-2 rounded-lg bg-background/40 border border-border/10 px-3 py-2.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary/60 shrink-0 mt-0.5" />
                  <span className="text-[11px] sm:text-xs text-foreground/60 leading-snug">{d}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </Link>
    </div>
  );
}

export default function HowItWorks() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 50]);

  const valueProps = [
    { label: "Verified Factories", sub: "Screened & audited", emoji: "🏭" },
    { label: "Transparent Quotes", sub: "No hidden costs", emoji: "📋" },
    { label: "Multi-Stage QC", sub: "Photo & video reports", emoji: "🔍" },
    { label: "Full Logistics", sub: "Door-to-door delivery", emoji: "🚢" },
  ];

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

      {/* ── Hero with parallax image ── */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroTopImg} alt="" className="w-full h-full object-cover opacity-25" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
          {/* Decorative glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/[0.06] blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-primary/[0.04] blur-[80px] pointer-events-none" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm px-4 py-1.5 mb-6"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[11px] text-primary/80 tracking-wide font-medium">8-step managed process</span>
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.08] mb-5"
          >
            From Request
            <br />
            <span className="bg-gradient-to-r from-primary to-[hsl(239,80%,75%)] bg-clip-text text-transparent">to Delivery</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed"
          >
            Verified factories, transparent pricing, multi-stage quality control, and door-to-door delivery -- all managed for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <a href="#steps">
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-11 text-sm font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.35)]">
                Explore the Process
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Link to="/auth?signup=true">
              <Button variant="outline" size="lg" className="rounded-full border-border/40 px-8 h-11 text-sm">
                Get Started Free
              </Button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-14"
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

      {/* ── Value props with richer styling ── */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {valueProps.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-border/20 bg-card/15 p-4 sm:p-5 text-center hover:border-primary/20 hover:bg-card/25 transition-all duration-200"
              >
                <span className="text-2xl block mb-2">{item.emoji}</span>
                <span className="text-xs sm:text-sm font-semibold text-foreground block leading-tight">{item.label}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{item.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mini process overview bar ── */}
      <section className="px-4 pb-10 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border/20 bg-card/10 p-4 sm:p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Quick Overview</span>
              <div className="flex-1 h-px bg-border/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              {steps.map((s, i) => (
                <a
                  key={s.slug}
                  href={`#step-${s.step}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/15 bg-background/30 px-3 py-1.5 text-[11px] text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/[0.05] transition-all duration-200"
                >
                  <s.icon className="h-3 w-3" />
                  <span className="font-medium">{s.step}.</span>
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.title.split(" ").slice(0, 2).join(" ")}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Steps grid ── */}
      <section id="steps" className="px-4 pb-16 relative z-10 scroll-mt-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase">The 8-Step Process</span>
            <div className="flex-1 h-px bg-border/20" />
            <span className="text-[10px] text-muted-foreground">Click any step for details</span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step, i) => (
              <StepCard key={step.slug} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom image + CTA ── */}
      <section className="px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden mb-10 h-48 sm:h-72"
          >
            <img src={heroBottomImg} alt="Equilinq quality control" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-foreground font-heading text-lg sm:text-2xl font-bold max-w-md leading-snug">
                Your products, sourced with full transparency and quality assurance.
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
            <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-primary/[0.04] blur-3xl pointer-events-none" />
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
              { to: "/pricing", title: "Pricing", desc: "Transparent, itemized cost breakdown", emoji: "💰" },
              { to: "/customization", title: "Customization", desc: "35+ branding and packaging options", emoji: "🎨" },
              { to: "/insights", title: "Insights", desc: "Sourcing trends and market reports", emoji: "📊" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="group block p-5 rounded-xl border border-border/20 bg-card/10 hover:border-primary/25 hover:bg-card/30 transition-all duration-200">
                <span className="text-xl block mb-2">{link.emoji}</span>
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
