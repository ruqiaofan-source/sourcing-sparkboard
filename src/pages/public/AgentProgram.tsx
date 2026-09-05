import { useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, BadgeCheck, Loader2 } from "lucide-react";

const statLine = ["48h review target", "Global buyer coverage", "24/7 sourcing flow"];

const profileLines = [
  "Supplier matching, sampling coordination, and buyer support.",
  "Commission-based opportunities with onboarding guidance.",
  "Clean process, clear communication, and fast feedback loops.",
];

const benefits = [
  {
    label: "Network",
    title: "Trusted sourcing network",
    desc: "Connect global buyers with vetted manufacturers across China and turn demand into repeatable revenue.",
  },
  {
    label: "Reach",
    title: "International coverage",
    desc: "Work with clients in multiple regions while keeping sourcing, sampling, and shipment coordination in one place.",
  },
  {
    label: "Deals",
    title: "High-value deals",
    desc: "Support B2B sourcing projects where expertise, communication, and speed matter more than volume.",
  },
];

const steps = [
  { n: "01", title: "Apply", desc: "Submit your background and sourcing experience." },
  { n: "02", title: "Review", desc: "Our team reviews fit, region coverage, and communication style." },
  { n: "03", title: "Onboard", desc: "Approved agents receive onboarding and deal support." },
];

const inputClass =
  "h-11 rounded-[0.75rem] border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring";

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

      <main>
        {/* Inner hero */}
        <section className="relative bg-card">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="label-mono-up text-primary">Agent programme</p>
                <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
                  Join the agent program built for serious sourcing work.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink sm:text-lg">
                  Partner with Equilinq to help global buyers discover reliable suppliers, manage requests, and close
                  deals with confidence.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="xl" variant="hero" className="btn-nudge" onClick={() => scrollToId("apply")}>
                    Apply now <ArrowRight />
                  </Button>
                  <Button size="xl" variant="outlineInk" onClick={() => scrollToId("why-join")}>
                    Explore benefits
                  </Button>
                </div>
                <p className="label-mono-up mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground">
                  {statLine.map((item, i) => (
                    <span key={item} className="flex items-center gap-3">
                      {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-border" />}
                      {item}
                    </span>
                  ))}
                </p>
              </div>

              {/* Agent profile card */}
              <div className="card-hover rounded-2xl border border-border bg-background p-7 hover:border-accent/50">
                <span className="label-mono-up text-muted-foreground">Agent profile</span>
                <h2 className="mt-3 text-xl font-semibold text-primary">What the role looks like</h2>
                <ul className="mt-6 grid gap-3">
                  {profileLines.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-3 rounded-[0.75rem] border border-border bg-card px-4 py-3 text-sm leading-relaxed text-body-ink"
                    >
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why join */}
        <section id="why-join" className="relative bg-background">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Why join</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-bold text-primary sm:text-4xl">
                A focused program for sourcing specialists
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 60}>
                  <div className="card-hover h-full rounded-2xl border border-border bg-card p-7 hover:border-accent/50">
                    <span className="label-mono-up text-muted-foreground">{b.label}</span>
                    <h3 className="mt-3 text-xl font-semibold text-primary">{b.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-body-ink">{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">How it works</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-bold text-primary sm:text-4xl">
                Simple onboarding, clear expectations
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step, i) => (
                <Reveal key={step.n} delay={i * 60}>
                  <div className="card-hover h-full rounded-2xl border border-border bg-background p-7 hover:border-accent/50">
                    <span className="label-mono-up text-primary">{step.n}</span>
                    <h3 className="mt-3 text-xl font-semibold text-primary">{step.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-body-ink">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Application */}
        <section id="apply" className="relative bg-background">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <div className="rounded-2xl border border-accent/50 bg-card p-7 shadow-[var(--shadow-lift)] sm:p-10">
                <span className="label-mono-up text-muted-foreground">Application</span>
                <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">Start your review</h2>

                {sent ? (
                  <div className="mt-8 rounded-[0.75rem] border border-border bg-background p-8 text-center">
                    <BadgeCheck className="mx-auto mb-4 h-8 w-8 text-primary" />
                    <p className="text-sm leading-relaxed text-body-ink">
                      Thanks for applying. We review applications manually and respond after a quick fit check.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <label htmlFor="agent-name" className="label-mono-up text-muted-foreground">
                          Name
                        </label>
                        <Input
                          id="agent-name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputClass}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="agent-email" className="label-mono-up text-muted-foreground">
                          Email
                        </label>
                        <Input
                          id="agent-email"
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClass}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="agent-region" className="label-mono-up text-muted-foreground">
                          Region
                        </label>
                        <Input
                          id="agent-region"
                          placeholder="Primary region"
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="agent-years" className="label-mono-up text-muted-foreground">
                          Experience
                        </label>
                        <Input
                          id="agent-years"
                          placeholder="Years of sourcing experience"
                          value={years}
                          onChange={(e) => setYears(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="agent-background" className="label-mono-up text-muted-foreground">
                        Background
                      </label>
                      <textarea
                        id="agent-background"
                        placeholder="Tell us about your sourcing background"
                        value={background}
                        onChange={(e) => setBackground(e.target.value)}
                        className="min-h-32 w-full resize-none rounded-[0.75rem] border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                      />
                    </div>
                    <Button type="submit" size="xl" variant="hero" className="btn-nudge w-full" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request review"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      We review applications manually and respond after a quick fit check.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Closing band */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="surface-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-white/60">Ready to join</p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">Become part of the sourcing network</h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">
                If you already work with buyers, suppliers, or procurement teams, the agent program gives you a cleaner
                way to grow.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="xl"
                  variant="hero"
                  className="btn-nudge card-hover bg-white bg-none text-primary hover:bg-white"
                  onClick={() => scrollToId("apply")}
                >
                  Apply now <ArrowRight />
                </Button>
                <Button asChild size="xl" variant="onDark">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
