import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Palette, ShieldCheck, Truck, CheckCircle2, ArrowRight, Send, Package, FileText, BarChart3, ScanLine, Globe, Layers, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tabs = [
  {
    id: "sourcing",
    label: "Perfect Sourcing",
    icon: Search,
    headline: "Submit a request. We find the best factories.",
    description: "Tell us what you need, and our agents source verified factories in China. Compare quotes with full cost breakdowns \u2014 no hidden fees.",
    features: [
      { icon: Send, text: "Submit sourcing requests with specs, quantity, and budget" },
      { icon: FileText, text: "Receive itemized quotes from verified factories" },
      { icon: BarChart3, text: "Compare costs: factory, logistics, and service fees" },
    ],
    mockup: SourcingMockup,
    accent: "from-blue-500/20 to-indigo-500/10",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  {
    id: "customization",
    label: "Customization",
    icon: Palette,
    headline: "35+ service add-ons for your product.",
    description: "From private labels to custom packaging, select exactly the services you need. Each add-on is clearly priced in your quote.",
    features: [
      { icon: Tag, text: "Private label, custom logos, and branding" },
      { icon: Layers, text: "Custom packaging, inserts, and hang tags" },
      { icon: Palette, text: "Material and color modifications" },
    ],
    mockup: CustomizationMockup,
    accent: "from-violet-500/20 to-purple-500/10",
    iconBg: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  },
  {
    id: "qc",
    label: "Quality Control",
    icon: ShieldCheck,
    headline: "Multi-stage inspection. Every order.",
    description: "Our on-the-ground QC team inspects at every stage. Get photo and video proof before shipment so you never receive defective goods.",
    features: [
      { icon: ScanLine, text: "Pre-production sample validation" },
      { icon: ShieldCheck, text: "In-process monitoring with photo reports" },
      { icon: CheckCircle2, text: "Final inspection before shipment" },
    ],
    mockup: QCMockup,
    accent: "from-emerald-500/20 to-green-500/10",
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  },
  {
    id: "shipping",
    label: "Global Shipping",
    icon: Truck,
    headline: "200+ countries. Real-time tracking.",
    description: "Consolidated shipping, customs handling, and live tracking from factory to your doorstep. Choose standard, express, or premium.",
    features: [
      { icon: Globe, text: "Standard, express, and premium tiers" },
      { icon: Package, text: "Consolidated shipping and customs docs" },
      { icon: Truck, text: "Live tracking from factory to delivery" },
    ],
    mockup: ShippingMockup,
    accent: "from-cyan-500/20 to-blue-500/10",
    iconBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  },
];

/* ── Dashboard-style mockup components ── */

function SourcingMockup() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border/50 bg-card/80 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-[11px] text-muted-foreground font-medium">New Sourcing Request</span>
        </div>
        <div className="space-y-2.5">
          {["Product Name", "Quantity", "Budget per Unit"].map((label) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground w-24 shrink-0">{label}</span>
              <div className="h-7 flex-1 rounded-md bg-muted/50 border border-border/30" />
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <div className="h-7 w-24 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-[10px] text-primary font-medium">Submit</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border/50 bg-card/80 p-4">
        <span className="text-[11px] text-muted-foreground font-medium mb-2 block">Quote Comparison</span>
        <div className="space-y-2">
          {[
            { factory: "Shenzhen Electronics Co.", cost: "EUR 4.20/unit", score: "9.2" },
            { factory: "Guangzhou Precision MFG", cost: "EUR 3.85/unit", score: "8.7" },
          ].map((q) => (
            <div key={q.factory} className="flex items-center justify-between rounded-lg bg-muted/30 border border-border/20 px-3 py-2">
              <div>
                <p className="text-[10px] font-medium text-card-foreground">{q.factory}</p>
                <p className="text-[9px] text-muted-foreground">{q.cost}</p>
              </div>
              <span className="text-[10px] font-bold text-primary">{q.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomizationMockup() {
  const addons = [
    { label: "Custom Logo Printing", category: "Branding", selected: true },
    { label: "Custom Packaging Box", category: "Packaging", selected: true },
    { label: "Hang Tags", category: "Branding", selected: false },
    { label: "Color Card Selection", category: "Materials", selected: false },
    { label: "Size Labels (Woven)", category: "Garment", selected: true },
  ];

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-muted-foreground font-medium">Service Add-ons</span>
        <span className="text-[10px] text-primary font-medium">3 selected</span>
      </div>
      <div className="space-y-1.5">
        {addons.map((a) => (
          <div key={a.label} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${a.selected ? "bg-primary/[0.06] border border-primary/20" : "bg-muted/20 border border-border/20"}`}>
            <div className={`h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0 ${a.selected ? "bg-primary border-primary" : "border-border/50"}`}>
              {a.selected && <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-card-foreground">{a.label}</p>
              <p className="text-[9px] text-muted-foreground">{a.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QCMockup() {
  const stages = [
    { label: "Sample Validation", status: "done" },
    { label: "Production Check", status: "done" },
    { label: "Final Inspection", status: "active" },
    { label: "Shipment Release", status: "pending" },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border/50 bg-card/80 p-4">
        <span className="text-[11px] text-muted-foreground font-medium mb-3 block">Inspection Progress</span>
        <div className="space-y-2">
          {stages.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                s.status === "done" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                s.status === "active" ? "bg-primary/20 text-primary border border-primary/30 ring-2 ring-primary/10" :
                "bg-muted/30 text-muted-foreground border border-border/30"
              }`}>
                {s.status === "done" ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
              </div>
              <span className={`text-[10px] ${s.status === "active" ? "text-card-foreground font-medium" : s.status === "done" ? "text-muted-foreground line-through" : "text-muted-foreground/60"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border/50 bg-card/80 p-4">
        <span className="text-[11px] text-muted-foreground font-medium mb-2 block">QC Report Preview</span>
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted/40 border border-border/20 flex items-center justify-center">
              <ScanLine className="h-4 w-4 text-muted-foreground/40" />
            </div>
          ))}
        </div>
        <p className="text-[9px] text-muted-foreground mt-2">3 photos, 1 video report attached</p>
      </div>
    </div>
  );
}

function ShippingMockup() {
  const steps = [
    { label: "Factory Pickup", date: "Apr 15", done: true },
    { label: "Customs Cleared", date: "Apr 18", done: true },
    { label: "In Transit", date: "Apr 22", done: false, active: true },
    { label: "Delivered", date: "Est. Apr 28", done: false },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border/50 bg-card/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-muted-foreground font-medium">Order #EQ-2026-0142</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">In Transit</span>
        </div>
        <div className="relative pl-4">
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border/40" />
          {steps.map((s) => (
            <div key={s.label} className="flex items-start gap-3 mb-3 last:mb-0 relative">
              <div className={`h-3.5 w-3.5 rounded-full shrink-0 -ml-[11px] z-10 ${
                s.done ? "bg-emerald-500 border-2 border-emerald-500/30" :
                s.active ? "bg-primary border-2 border-primary/30 ring-2 ring-primary/10" :
                "bg-muted border-2 border-border/40"
              }`} />
              <div>
                <p className={`text-[10px] ${s.done || s.active ? "text-card-foreground font-medium" : "text-muted-foreground/60"}`}>
                  {s.label}
                </p>
                <p className="text-[9px] text-muted-foreground">{s.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border/50 bg-card/80 p-3 flex items-center gap-3">
        <Globe className="h-4 w-4 text-cyan-400 shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] font-medium text-card-foreground">Shenzhen &rarr; Rotterdam</p>
          <p className="text-[9px] text-muted-foreground">Standard shipping, 15-25 days</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */

export default function LandingFeatureTabs() {
  const [activeTab, setActiveTab] = useState("sourcing");
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="features" className="py-18 px-4 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block"
          >
            What We Do
          </motion.span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            End-to-End Sourcing<br />
            <span className="text-primary">from China</span>
          </h2>
        </motion.div>

        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_20px_-6px_hsl(var(--primary)/0.3)]"
                    : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border/40 hover:bg-card/40"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
          >
            {/* Left: description */}
            <div className="flex flex-col justify-center">
              <div className={`h-12 w-12 rounded-xl border flex items-center justify-center mb-5 ${active.iconBg}`}>
                <active.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {active.headline}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                {active.description}
              </p>
              <ul className="space-y-3 mb-8">
                {active.features.map((f, i) => (
                  <motion.li
                    key={f.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <div className="h-6 w-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <f.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {f.text}
                  </motion.li>
                ))}
              </ul>
              <Link to="/auth?signup=true">
                <Button
                  size="sm"
                  className="rounded-full px-6 h-10 text-sm font-semibold w-fit"
                >
                  Try It Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Right: dashboard mockup */}
            <div className="relative">
              <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br ${active.accent} blur-2xl opacity-50 pointer-events-none`} />
              <div className="relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-5 sm:p-6">
                {/* Fake window chrome */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
                  <div className="flex-1 mx-3 h-5 rounded-md bg-muted/30 border border-border/20 flex items-center px-2">
                    <span className="text-[9px] text-muted-foreground/50">equilinq.eu/dashboard</span>
                  </div>
                </div>
                <active.mockup />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}