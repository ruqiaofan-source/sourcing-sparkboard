import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Pricing - Equilinq Sourcing Service"
        description="Transparent, itemized pricing for every order. No hidden fees. Submit a sourcing request and receive your exact cost breakdown."
        keywords="sourcing pricing, China import costs, transparent pricing, sourcing service fees, no hidden fees"
        breadcrumbs={[
          { name: "Home", url: "https://www.equilinq.eu/" },
          { name: "Pricing", url: "https://www.equilinq.eu/pricing" },
        ]}
        jsonLd={{
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What does Equilinq charge for sourcing?", acceptedAnswer: { "@type": "Answer", text: "Equilinq charges a transparent service fee: 6% for orders under EUR 5,000 (minimum EUR 99), 5% for EUR 5,000-19,999, and 4% for orders over EUR 20,000." } },
            { "@type": "Question", name: "Are there any hidden fees?", acceptedAnswer: { "@type": "Answer", text: "No. Every quote is fully itemized showing factory cost, logistics, China operations, and Equilinq service fee separately." } },
            { "@type": "Question", name: "What is included in every order?", acceptedAnswer: { "@type": "Answer", text: "Every order includes supplier sourcing, price negotiation, sample coordination, production tracking, multi-stage quality control, photo documentation, logistics coordination, customs documentation, and a dedicated human agent." } },
          ],
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Pricing - Equilinq Sourcing Service",
            url: "https://www.equilinq.eu/pricing",
            description: "Transparent, itemized pricing for every order. No hidden fees.",
            isPartOf: { "@type": "WebSite", name: "Equilinq", url: "https://www.equilinq.eu" },
            mainEntity: {
              "@type": "PriceSpecification",
              description: "Equilinq service fee based on order value",
              priceCurrency: "EUR",
              eligibleTransactionVolume: [
                { "@type": "PriceSpecification", description: "Orders under EUR 5,000: 6% (min EUR 99)" },
                { "@type": "PriceSpecification", description: "Orders EUR 5,000 - EUR 19,999: 5%" },
                { "@type": "PriceSpecification", description: "Orders EUR 20,000+: 4%" },
              ],
            },
          }),
        }}
      />
      <PublicNavbar />

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
              top: "-15%",
              right: "-10%",
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--chart-2) / 0.06) 0%, transparent 70%)",
              bottom: "10%",
              left: "-8%",
            }}
            animate={{ x: [0, -15, 10, 0], y: [0, 10, -15, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 250 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6"
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">No hidden fees</span>
            </motion.div>

            <motion.h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Transparent Pricing,
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(260 80% 68%))",
                }}
              >
                Tailored to Your Order
              </span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Every order is different. Submit a sourcing request and receive a fully itemized cost breakdown with no surprises.
            </motion.p>
          </motion.div>

          {/* How pricing works */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
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
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-heading font-bold text-sm mb-3"
                  >
                    {item.step}
                  </motion.span>
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
            className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-8 sm:p-10 mb-20"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">Every Quote Includes a Full Breakdown</h2>
            <p className="text-muted-foreground text-sm text-center mb-8 max-w-lg mx-auto">
              No hidden markups. You see exactly where every euro goes.
            </p>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { label: "Factory Cost", desc: "Direct supplier price at wholesale" },
                { label: "Logistics & Customs", desc: "Freight, clearance, duties, handling" },
                { label: "China Operations", desc: "QC, warehousing, coordination" },
                { label: "Service Fee", desc: "Equilinq sourcing and management" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  whileHover={{ y: -3, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-xl border border-border/30 bg-card/40 p-5 text-center hover:border-primary/30 transition-colors duration-300"
                >
                  <p className="font-heading text-base font-semibold text-foreground mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Volume note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10 mb-20 text-center relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
            </motion.div>
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
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left"
            >
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
                <motion.div
                  key={item}
                  variants={fadeUp}
                  className="flex items-center gap-2.5 text-sm text-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </motion.div>
              ))}
            </motion.div>
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
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
                    Submit a Request
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <a href="https://calendly.com/admin-equilinq/30min" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-base">
                    Book a Call
                  </Button>
                </motion.div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { to: "/how-it-works", title: "How It Works", desc: "See our 8-step sourcing process" },
              { to: "/customization", title: "Customization", desc: "35+ branding and packaging options" },
              { to: "/contact", title: "Contact Us", desc: "Get a free consultation" },
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
