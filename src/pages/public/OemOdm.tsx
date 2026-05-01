import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Wrench, Lightbulb, Factory, Truck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import PageGlow from "@/components/PageGlow";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const services = [
  { name: "OEM / ODM Custom Manufacturing", desc: "Design and produce products to your exact specifications" },
  { name: "Product Source Finding", desc: "Locate optimal suppliers based on product links, images, or descriptions" },
  { name: "Product Source Finding (Professional)", desc: "Deep multi-platform search across Chinese e-commerce platforms" },
  { name: "Product Creation & Listing", desc: "Create product listings from scratch based on your requirements" },
  { name: "Source Replacement", desc: "Find alternative suppliers when existing sources become unavailable" },
  { name: "Custom Logistics Solution", desc: "Tailored shipping plans for special or oversized products" },
  { name: "Priority Processing", desc: "Fast-track handling for urgent international parcels" },
];

const steps = [
  { icon: Lightbulb, title: "Share Your Concept", desc: "Send us your product idea, reference images, or specifications." },
  { icon: Search, title: "Factory Matching", desc: "We identify and vet the best manufacturers for your product." },
  { icon: Factory, title: "Sampling & Production", desc: "Approve samples, then we manage the full production run." },
  { icon: Truck, title: "QC & Delivery", desc: "Multi-stage quality control and logistics to your door." },
];

export default function OemOdm() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="OEM / ODM Manufacturing - Equilinq Custom Production"
        description="Custom OEM and ODM manufacturing from China. From concept to finished product -- factory sourcing, sampling, production management, and delivery to Europe."
        keywords="OEM manufacturing China, ODM China, custom manufacturing, private label production, product development China"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "OEM / ODM", url: "https://equilinq.eu/oem-odm" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What is the difference between OEM and ODM?", acceptedAnswer: { "@type": "Answer", text: "OEM (Original Equipment Manufacturing) means we produce your existing product design under your brand. ODM (Original Design Manufacturing) means the factory's existing design is customized and rebranded for you, which is faster and lower cost." } },
              { "@type": "Question", name: "What is the minimum order quantity for OEM/ODM?", acceptedAnswer: { "@type": "Answer", text: "MOQs depend on the product and tooling but typically start from 100-500 units for ODM and 300-1,000 units for OEM. We negotiate flexible MOQs with our network of partner factories." } },
              { "@type": "Question", name: "How long does OEM/ODM development take?", acceptedAnswer: { "@type": "Answer", text: "ODM projects typically take 3-6 weeks from sample to bulk delivery. Full OEM with custom tooling typically takes 8-14 weeks depending on complexity." } },
              { "@type": "Question", name: "Do you protect my IP and design files?", acceptedAnswer: { "@type": "Answer", text: "Yes. We sign NNN agreements (Non-Disclosure, Non-Use, Non-Circumvention) with every factory before sharing designs, and we recommend registering your trademark in China." } },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "OEM / ODM Manufacturing - Equilinq",
            url: "https://equilinq.eu/oem-odm",
            description: "Custom OEM and ODM manufacturing services from China for European businesses.",
            provider: { "@type": "Organization", name: "Equilinq", url: "https://equilinq.eu" },
          }),
        }}
      />
      <PublicNavbar />
      <PageGlow />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)", top: "-15%", left: "-10%" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 250 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6"
            >
              <Wrench className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-primary tracking-wide uppercase">Custom Manufacturing</span>
            </motion.div>

            <motion.h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              From Concept to
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(239 100% 65%), hsl(280 80% 72%), hsl(239 100% 65%))" }}>
                Finished Product
              </span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Whether you need an existing product under your brand (OEM) or a fully custom design (ODM), we manage the entire process from factory to doorstep.
            </motion.p>
          </motion.div>

          {/* OEM vs ODM */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="mb-20">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 text-center">OEM vs ODM</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={fadeUp} whileHover={{ y: -4, scale: 1.02 }} className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">OEM</h3>
                <p className="text-sm text-muted-foreground mb-4">Original Equipment Manufacturing -- apply your brand and packaging to an existing product from a verified factory.</p>
                <ul className="space-y-2">
                  {["Your branding on proven products", "Lower development cost", "Faster time to market", "Low MOQ from 10 units"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ y: -4, scale: 1.02 }} className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">ODM</h3>
                <p className="text-sm text-muted-foreground mb-4">Original Design Manufacturing -- we develop a completely custom product based on your specifications and design.</p>
                <ul className="space-y-2">
                  {["Fully custom product design", "Unique to your brand", "Full IP ownership", "Prototype and sample validation"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Process */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="mb-20">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-heading font-bold text-sm mb-3"
                  >
                    <step.icon className="h-5 w-5" />
                  </motion.div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-8 sm:p-10 mb-20"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">Manufacturing Services</h2>
            <p className="text-muted-foreground text-sm text-center mb-8 max-w-lg mx-auto">
              End-to-end support from sourcing to delivery.
            </p>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((item) => (
                <motion.div key={item.name} variants={fadeUp} className="flex items-start gap-3 p-4 rounded-xl border border-border/30 bg-card/40 hover:border-primary/30 transition-colors">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center py-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ready to Build Your Product?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Tell us what you want to create and we will find the right factory, manage production, and deliver to your door.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/auth?signup=true">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
                    Start Your Project <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/contact">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-base">Book a Demo</Button>
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
              { to: "/quality-control", title: "Quality Control", desc: "Multi-stage inspection for every order" },
              { to: "/customization", title: "Customization", desc: "60+ branding and packaging options" },
              { to: "/how-it-works", title: "How It Works", desc: "Our 8-step sourcing process" },
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
