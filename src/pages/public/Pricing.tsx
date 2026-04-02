import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";

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
      <SEOHead
        title="Pricing - Equilinq Sourcing Service"
        description="Transparent, itemized pricing for every order. No hidden fees. Submit a sourcing request and receive your exact cost breakdown."
        keywords="sourcing pricing, China import costs, transparent pricing, sourcing service fees, no hidden fees"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Pricing", url: "https://equilinq.eu/pricing" },
        ]}
      />
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
              Transparent Pricing,
              <br />
              <span className="text-primary">Tailored to Your Order</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Every order is different. Submit a sourcing request and receive a fully itemized cost breakdown with no surprises.
            </p>
          </motion.div>

          {/* How pricing works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "01", title: "Submit Your Request", desc: "Tell us what you need -- product, quantity, specs, and budget." },
                { step: "02", title: "Receive Your Breakdown", desc: "Get a fully itemized quote with every cost line visible." },
                { step: "03", title: "Decide With Clarity", desc: "No obligation. Review, compare, and accept when ready." },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
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
            </div>
          </motion.div>

          {/* What's in every quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border/40 bg-card/30 p-8 sm:p-10 mb-20"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">Every Quote Includes a Full Breakdown</h2>
            <p className="text-muted-foreground text-sm text-center mb-8 max-w-lg mx-auto">
              No hidden markups. You see exactly where every euro goes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Factory Cost", desc: "Direct supplier price at wholesale" },
                { label: "Logistics & Customs", desc: "Freight, clearance, duties, handling" },
                { label: "China Operations", desc: "QC, warehousing, coordination" },
                { label: "Service Fee", desc: "Equilinq sourcing and management" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border/30 bg-card/40 p-5 text-center">
                  <p className="font-heading text-base font-semibold text-foreground mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Volume note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10 mb-20 text-center"
          >
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Better Rates at Higher Volumes</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Our service fees scale down as your order value grows. Submit a request and we will provide exact pricing tailored to your project.
            </p>
            <Link to="/auth?signup=true">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Button className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.4)]">
                  Get Your Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">Included in Every Order</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {[
                "Supplier sourcing and vetting",
                "Price negotiation",
                "Sample coordination",
                "Production tracking",
                "Multi-stage quality control",
                "Photo and video documentation",
                "Logistics coordination",
                "Customs documentation",
                "Real-time order updates",
                "Dedicated human agent",
                "Platform access and chat",
                "Invoice and payment processing",
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
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ready to See Your Exact Pricing?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Submit a sourcing request and receive a detailed, no-obligation quote within 48 hours.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/auth?signup=true">
                <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
                  Submit a Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="https://calendly.com/admin-equilinq/30min" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-base">
                  Book a Call
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
