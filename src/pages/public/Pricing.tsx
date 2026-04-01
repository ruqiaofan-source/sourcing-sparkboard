import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";

const pricingSteps = [
  { step: "01", title: "Factory Cost", desc: "Supplier invoice at wholesale price" },
  { step: "02", title: "Logistics & Customs", desc: "Freight, clearance, duties, handling" },
  { step: "03", title: "Equilinq Service Fee", desc: "Sourcing, negotiation, production tracking, QC & logistics coordination" },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Pricing - Equilinq Sourcing Service Fees" description="Transparent pricing: factory cost + logistics + 4-6% service fee. No hidden markups. See our full cost breakdown for sourcing from China." />
      <PublicNavbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block">
              Pricing
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              We Source It 20% Cheaper
              <br />
              <span className="text-primary">Then Charge You 7%</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              On average, brands sourcing directly from China's domestic supplier market see 15-25% lower product pricing compared to retail export marketplaces.
            </p>
          </motion.div>

          {/* What You Pay For */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 text-center">What You Pay For</h2>
          </motion.div>

          <div className="relative mb-20">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {pricingSteps.map((item) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center"
                >
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-heading font-bold text-sm mb-3">
                    {item.step}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-card/60 backdrop-blur-sm p-8 relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Standard Orders</span>
              <div className="mt-4 mb-3 flex items-baseline gap-2">
                <span className="font-heading text-6xl font-bold text-foreground">7%</span>
                <span className="text-muted-foreground text-lg">service fee</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Minimum EUR 99</p>
              <ul className="space-y-3 mb-8">
                {["Most consumer goods & repeat SKUs", "Low-MOQ orders (from 10 units)", "Small-batch launches & testing"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/auth?signup=true" className="block">
                <Button className="w-full rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] h-12 text-base font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.4)]">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Scale & Complex Projects</span>
              <div className="mt-4 mb-3">
                <span className="font-heading text-6xl font-bold text-foreground">Custom</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Tailored to project scope</p>
              <ul className="space-y-3 mb-8">
                {[
                  "High-volume repeat orders (6% above EUR 20k)",
                  "Regulated / compliance-heavy products",
                  "Retainer + percentage structure",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="https://calendly.com/admin-equilinq/30min" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full rounded-full border-border/60 h-12 text-base">
                  Book a Demo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Volume tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border/40 bg-card/30 p-8 sm:p-10 mb-20"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">Volume-Based Fee Structure</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { range: "Under EUR 5,000", fee: "7%", note: "Min. EUR 99" },
                { range: "EUR 5,000 - 19,999", fee: "6%", note: "Mid-volume" },
                { range: "EUR 20,000+", fee: "From 4%", note: "Custom pricing" },
              ].map((tier) => (
                <div key={tier.range} className="rounded-xl border border-border/30 bg-card/40 p-5 text-center">
                  <p className="text-sm text-muted-foreground mb-2">{tier.range}</p>
                  <p className="font-heading text-3xl font-bold text-primary mb-1">{tier.fee}</p>
                  <p className="text-xs text-muted-foreground">{tier.note}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">What's Included in Every Order</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {[
                "Supplier sourcing & vetting",
                "Price negotiation",
                "Sample coordination",
                "Production tracking",
                "Multi-stage quality control",
                "Photo & video documentation",
                "Logistics coordination",
                "Customs documentation",
                "Real-time order updates",
                "Dedicated human agent",
                "Platform access & chat",
                "Invoice & payment processing",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ready to Start Sourcing?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Create an account and submit your first sourcing request. No commitment required.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/auth?signup=true">
                <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="https://equilinq.eu/calendar" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-base">
                  Book a Demo
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
