import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import PageGlow from "@/components/PageGlow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  Users,
  Sparkles,
  BadgeCheck,
  Quote,
  Loader2,
  ClipboardList,
} from "lucide-react";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const stats = [
  { value: "48h", label: "Review target" },
  { value: "Global", label: "Buyer coverage" },
  { value: "24/7", label: "Sourcing flow" },
];

const profileLines = [
  "Supplier matching, sampling coordination, and buyer support.",
  "Commission-based opportunities with onboarding guidance.",
  "Clean process, clear communication, and fast feedback loops.",
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted sourcing network",
    desc: "Connect global buyers with vetted manufacturers across China and turn demand into repeatable revenue.",
  },
  {
    icon: Globe2,
    title: "International coverage",
    desc: "Work with clients in multiple regions while keeping sourcing, sampling, and shipment coordination in one place.",
  },
  {
    icon: Users,
    title: "High-value deals",
    desc: "Support B2B sourcing projects where expertise, communication, and speed matter more than volume.",
  },
];

const steps = [
  "Submit your background and sourcing experience.",
  "Our team reviews fit, region coverage, and communication style.",
  "Approved agents receive onboarding and deal support.",
];

const quotes = [
  {
    quote: "The program gave me a clear pipeline and a team that understands sourcing operations.",
    name: "Mia Chen",
    role: "Independent sourcing partner",
  },
  {
    quote: "I could focus on matching buyers with suppliers instead of chasing process details.",
    name: "Daniel Wong",
    role: "Regional procurement consultant",
  },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function AgentProgram() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [years, setYears] = useState("");
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const message = [
        `Primary region: ${region.trim() || "Not provided"}`,
        `Years of sourcing experience: ${years.trim() || "Not provided"}`,
        "",
        background.trim(),
      ].join("\n");

      const { error } = await supabase.from("contact_submissions").insert({
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        reason: "agent-program",
        message,
      });
      if (error) throw error;

      toast({ title: "Application received", description: "We will get back to you after a quick fit check." });
      setSent(true);
      setName("");
      setEmail("");
      setRegion("");
      setYears("");
      setBackground("");
    } catch (err) {
      console.error("Agent application error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Equilinq Agent Program - Earn With China Sourcing"
        description="Join the Equilinq agent program. Help global buyers find vetted Chinese manufacturers and earn commission with onboarding and deal support."
        keywords="sourcing agent program, China sourcing agent, procurement partner, sourcing commission"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Agent Program", url: "https://equilinq.eu/agent-program" },
        ]}
      />
      <PublicNavbar />
      <PageGlow />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] text-muted-foreground tracking-wide">Sparkboard agent network</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-5">
              Join the agent program built for serious sourcing work.
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Partner with Equilinq to help global buyers discover reliable suppliers, manage requests, and close deals
              with confidence.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Button
                onClick={() => scrollToId("apply")}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 font-medium"
              >
                Apply now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => scrollToId("why-join")} className="rounded-full h-11 px-6">
                Explore benefits
              </Button>
            </div>

            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-3 gap-4 max-w-lg">
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-4"
                >
                  <p className="font-heading text-xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Agent profile card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 sm:p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Agent profile</p>
                <h2 className="font-heading text-xl font-semibold text-foreground">Sparkboard ready</h2>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <BadgeCheck className="h-4.5 w-4.5 text-primary" />
              </div>
            </div>
            <div className="space-y-3">
              {profileLines.map((line) => (
                <div
                  key={line}
                  className="rounded-xl border border-border/40 bg-secondary/40 px-4 py-3 text-sm text-muted-foreground"
                >
                  {line}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why join */}
      <section id="why-join" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="text-[11px] tracking-[0.2em] uppercase text-primary mb-3">Why join</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground max-w-2xl">
              A focused program for sourcing specialists
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {benefits.map((b) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works + application */}
      <section id="apply" className="pb-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-6 sm:p-8"
          >
            <p className="text-[11px] tracking-[0.2em] uppercase text-primary mb-3">How it works</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-8">
              Simple onboarding, clear expectations
            </h2>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-xl border border-border/40 bg-secondary/30 px-4 py-4"
                >
                  <span className="h-6 w-6 shrink-0 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Application</p>
                <h2 className="font-heading text-lg font-semibold text-foreground">Start your review</h2>
              </div>
            </div>

            {sent ? (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
                <BadgeCheck className="h-8 w-8 text-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Thanks for applying. We review applications manually and respond after a quick fit check.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border h-11"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary border-border h-11"
                    required
                  />
                  <Input
                    placeholder="Primary region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="bg-secondary border-border h-11"
                  />
                  <Input
                    placeholder="Years of sourcing experience"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="bg-secondary border-border h-11"
                  />
                </div>
                <textarea
                  placeholder="Tell us about your sourcing background"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="flex min-h-[120px] w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background resize-none"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-medium"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request review"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  We review applications manually and respond after a quick fit check.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-[11px] tracking-[0.2em] uppercase text-primary mb-3">What agents say</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground max-w-2xl">
              Built for people who like clear process and real deals
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {quotes.map((q) => (
              <motion.div
                key={q.name}
                variants={fadeUp}
                className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6"
              >
                <Quote className="h-5 w-5 text-primary mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">&ldquo;{q.quote}&rdquo;</p>
                <p className="text-sm font-medium text-foreground">{q.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{q.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border/40 bg-card/20 backdrop-blur-sm px-6 py-14 text-center"
          >
            <p className="text-[11px] tracking-[0.2em] uppercase text-primary mb-4">Ready to join</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Become part of the sourcing network
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              If you already work with buyers, suppliers, or procurement teams, the agent program gives you a cleaner
              way to grow.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => scrollToId("apply")}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 font-medium"
              >
                Apply now
              </Button>
              <Link to="/">
                <Button variant="ghost" className="rounded-full h-11 px-6">
                  Back to home
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
