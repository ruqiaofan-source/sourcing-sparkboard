import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { steps } from "./HowItWorksStep";

const fadeUp = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="How It Works - Equilinq Sourcing Process in 8 Steps" description="From sourcing request to delivery: learn Equilinq's 8-step process for transparent, reliable manufacturing from China." />
      <PublicNavbar />

      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block">
              How It Works
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              From Request to Delivery
              <br />
              <span className="text-primary">in 8 Simple Steps</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We handle every stage so you can focus on growing your business.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-28 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-6 sm:space-y-8"
            >
              {steps.map((step, i) => (
                <motion.div key={step.slug} variants={fadeUp}>
                  <Link
                    to={`/how-it-works/${step.slug}`}
                    className="relative flex gap-6 sm:gap-8 group rounded-2xl border border-transparent hover:border-primary/20 hover:bg-card/30 p-4 -ml-4 transition-all"
                  >
                    <div className="shrink-0 relative z-10">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-105 transition-all">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-primary/50 font-heading tracking-wider">STEP {step.step}</span>
                      <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{step.title}</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{step.shortDesc}</p>
                    </div>

                    <div className="hidden sm:flex items-center shrink-0">
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mt-20"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Submit your first sourcing request in minutes. No commitment, no upfront costs.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/auth?signup=true">
                <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-base">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
