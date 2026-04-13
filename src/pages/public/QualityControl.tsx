import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, ShieldCheck, ClipboardCheck, Eye, Camera, Package } from "lucide-react";
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

const inspectionServices = [
  { name: "Standard Quality Inspection", desc: "Basic incoming goods check against specifications" },
  { name: "Detailed Quality Inspection", desc: "Thorough item-by-item examination with photo reports" },
  { name: "Electrical Product Testing", desc: "Power-on and function testing for 3C/electronic goods" },
  { name: "Pre-Production Sample Validation", desc: "Verify samples match approved specifications before mass production" },
  { name: "In-Process Monitoring", desc: "On-site checks during production to catch issues early" },
  { name: "Final Pre-Shipment Inspection", desc: "Comprehensive check before goods leave the factory" },
  { name: "Packaging Quality Check", desc: "Verify outer packaging integrity and labeling accuracy" },
];

const stages = [
  { icon: ClipboardCheck, title: "Pre-Production", desc: "Sample validation against your approved specs before mass production begins." },
  { icon: Eye, title: "In-Process", desc: "On-site monitoring during production to catch defects early and keep quality consistent." },
  { icon: Camera, title: "Final Inspection", desc: "Comprehensive pre-shipment check with detailed photo and video documentation." },
  { icon: Package, title: "Packaging Audit", desc: "Verify packaging integrity, labeling accuracy, and shipping readiness." },
];

export default function QualityControl() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Quality Control - Equilinq Multi-Stage QC"
        description="Multi-stage quality control for every order. Pre-production validation, in-process monitoring, final inspection, and photo documentation. No defects, no surprises."
        keywords="quality control China, product inspection, pre-shipment inspection, QC services, quality assurance sourcing"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Quality Control", url: "https://equilinq.eu/quality-control" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Quality Control - Equilinq",
            url: "https://equilinq.eu/quality-control",
            description: "Multi-stage quality control and product inspection services for China sourcing.",
            provider: { "@type": "Organization", name: "Equilinq", url: "https://equilinq.eu" },
          }),
        }}
      />
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)", top: "-15%", right: "-10%" }}
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
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Multi-stage QC</span>
            </motion.div>

            <motion.h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Quality You Can
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(260 80% 68%))" }}>
                See and Verify
              </span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Every order goes through structured quality checks -- from pre-production samples to final pre-shipment inspection. No defects, no surprises.
            </motion.p>
          </motion.div>

          {/* QC Stages */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="mb-20">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 text-center">Our 4-Stage Process</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stages.map((stage, i) => (
                <motion.div
                  key={stage.title}
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
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary mb-3"
                  >
                    <stage.icon className="h-5 w-5" />
                  </motion.div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{stage.title}</h3>
                  <p className="text-muted-foreground text-sm">{stage.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* All QC services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-8 sm:p-10 mb-20"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">Inspection Services</h2>
            <p className="text-muted-foreground text-sm text-center mb-8 max-w-lg mx-auto">
              Every inspection includes photo and video documentation so you can verify quality remotely.
            </p>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inspectionServices.map((item) => (
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

          {/* What you receive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10 mb-20 text-center relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">What You Receive</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Every inspection comes with a full documentation package delivered to your dashboard.
            </p>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
              {["Detailed photo reports", "Video walkthroughs", "Measurement verification", "Defect documentation", "Pass/fail summary", "Real-time dashboard updates"].map((item) => (
                <motion.div key={item} variants={fadeUp} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center py-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ship With Confidence</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Submit a sourcing request and our QC team will ensure every item meets your standards.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/auth?signup=true">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/contact">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-base">Contact Us</Button>
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
              { to: "/oem-odm", title: "OEM / ODM", desc: "Custom manufacturing from concept to product" },
              { to: "/customization", title: "Customization", desc: "60+ branding and packaging options" },
              { to: "/pricing", title: "Pricing", desc: "Transparent cost breakdown per order" },
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
