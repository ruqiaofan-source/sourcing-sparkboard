import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import {
  CheckCircle2, ArrowRight, Sparkles, Factory, Ship, ShieldCheck, Percent,
  Search, Handshake, PackageCheck, Truck, Camera, MessageCircle, FileText, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
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
            { "@type": "Question", name: "What does Equilinq charge?", acceptedAnswer: { "@type": "Answer", text: "6% for orders under EUR 5,000 (min EUR 99), 5% for EUR 5,000-19,999, 4% for EUR 20,000+." } },
            { "@type": "Question", name: "Are there hidden fees?", acceptedAnswer: { "@type": "Answer", text: "No. Every quote is fully itemized." } },
          ],
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Pricing - Equilinq",
            url: "https://www.equilinq.eu/pricing",
            description: "Transparent, itemized pricing. No hidden fees.",
            isPartOf: { "@type": "WebSite", name: "Equilinq", url: "https://www.equilinq.eu" },
          }),
        }}
      />
      <PublicNavbar />

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)", top: "-15%", right: "-10%" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">

          {/* ── HERO ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-20">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 250 }} className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6">
              <motion.span className="h-1.5 w-1.5 rounded-full bg-primary" animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Zero hidden fees</span>
            </motion.div>

            <motion.h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              You See{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(260 80% 68%))" }}>
                Every Euro
              </span>
            </motion.h1>
            <motion.p className="text-muted-foreground mt-4 max-w-md mx-auto text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Fully itemized quotes. No surprises. Ever.
            </motion.p>
          </motion.div>

          {/* ── VISUAL COST BREAKDOWN ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="font-heading text-xl font-semibold text-foreground mb-8 text-center">What's in Your Quote</h2>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Factory, label: "Factory Cost", pct: "~60-70%", color: "hsl(var(--primary))" },
                { icon: Ship, label: "Logistics", pct: "~15-25%", color: "hsl(260 80% 68%)" },
                { icon: ShieldCheck, label: "China Ops & QC", pct: "~5-10%", color: "hsl(var(--chart-2))" },
                { icon: Percent, label: "Service Fee", pct: "4-6%", color: "hsl(150 60% 50%)" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 text-center overflow-hidden group"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 transition-all duration-500 group-hover:h-1.5" style={{ background: item.color }} />
                  <motion.div
                    whileHover={{ rotate: -8, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3"
                  >
                    <item.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  </motion.div>
                  <p className="font-heading text-2xl font-bold text-foreground mb-1">{item.pct}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── 3 STEPS ── */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "01", title: "Submit", desc: "Tell us what you need." },
                { step: "02", title: "Review", desc: "Get an itemized breakdown." },
                { step: "03", title: "Decide", desc: "No obligation. Accept when ready." },
              ].map((item, i) => (
                <motion.div key={item.step} variants={fadeUp} whileHover={{ y: -4 }} className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center relative">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-heading font-bold text-sm mb-3">{item.step}</span>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                  {i < 2 && <div className="hidden sm:block absolute top-1/2 -right-2 w-4 text-muted-foreground/30"><ArrowRight className="h-4 w-4" /></div>}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── VOLUME TIERS - visual ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10 mb-20 relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
            <motion.div initial={{ scale: 0, rotate: -180 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}>
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
            </motion.div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8 text-center">Volume Pricing</h2>

            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { range: "< EUR 5k", fee: "6%", note: "Min EUR 99" },
                { range: "EUR 5k - 20k", fee: "5%", note: "Best for growing brands", highlight: true },
                { range: "EUR 20k+", fee: "4%", note: "Enterprise-ready" },
              ].map((tier) => (
                <motion.div
                  key={tier.range}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className={`rounded-2xl border p-6 text-center transition-all ${
                    tier.highlight
                      ? "border-primary/40 bg-primary/10 shadow-[0_0_40px_-12px_hsl(239,100%,60%/0.3)]"
                      : "border-border/30 bg-card/30"
                  }`}
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{tier.range}</p>
                  <p className="font-heading text-4xl font-bold text-foreground mb-1">{tier.fee}</p>
                  <p className="text-xs text-muted-foreground">{tier.note}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center">
              <Link to="/auth?signup=true">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Button className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.4)]">
                    Get Your Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* ── INCLUDED - icon grid ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-8 text-center">Included in Every Order</h2>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { icon: Search, label: "Supplier Sourcing" },
                { icon: Handshake, label: "Price Negotiation" },
                { icon: PackageCheck, label: "Sample Coordination" },
                { icon: ShieldCheck, label: "Multi-Stage QC" },
                { icon: Camera, label: "Photo & Video Proof" },
                { icon: Truck, label: "Logistics & Customs" },
                { icon: MessageCircle, label: "Real-Time Updates" },
                { icon: UserCheck, label: "Dedicated Agent" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-3 rounded-xl border border-border/30 bg-card/30 p-4 hover:border-primary/20 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-primary shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-foreground font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── CTA ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center py-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Ready?</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Get a detailed, no-obligation quote within 48 hours.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/auth?signup=true">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
                    Submit a Request <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <a href="https://calendly.com/admin-equilinq/30min" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-base">Book a Call</Button>
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
              { to: "/how-it-works", title: "How It Works", desc: "Our 8-step process" },
              { to: "/customization", title: "Customization", desc: "35+ branding options" },
              { to: "/contact", title: "Contact Us", desc: "Free consultation" },
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
