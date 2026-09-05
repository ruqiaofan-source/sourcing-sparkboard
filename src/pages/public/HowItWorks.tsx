import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Reveal } from "@/components/Reveal";
import { steps } from "./HowItWorksStep";

const CALENDLY = "https://calendly.com/admin-equilinq/30min";

const related = [
  { to: "/pricing", label: "Pricing", title: "Transparent pricing", desc: "Every quote itemised, no hidden markups." },
  { to: "/quality-control", label: "Quality control", title: "Checked before it ships", desc: "Multi-stage inspection for every order." },
  { to: "/customization", label: "Customization", title: "Build it your way", desc: "Branding, packaging and finishing services." },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="How It Works - Equilinq Sourcing Process in 8 Steps"
        description="From sourcing request to delivery: learn Equilinq's 8-step process for transparent, reliable manufacturing from China."
        keywords="sourcing process, China manufacturing steps, how sourcing works, supplier vetting, quality control process"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "How It Works", url: "https://equilinq.eu/how-it-works" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How China Sourcing Works with Equilinq",
            description: "From sourcing request to delivery: Equilinq's 8-step process.",
            totalTime: "P30D",
            step: steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.desc,
              url: `https://equilinq.eu/how-it-works/${s.slug}`,
            })),
          }),
        }}
      />
      <PublicNavbar />

      <main>
        {/* Hero, black band */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="surface-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
            <p className="label-mono-up text-white/60">8-step process</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              From request to delivery
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Verified factories, transparent pricing, multi-stage quality control, and door-to-door delivery. All managed
              for you.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" variant="hero" className="btn-nudge bg-white bg-none text-primary-deep hover:bg-white">
                <Link to="/auth?signup=true">
                  Start a request <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="onDark">
                <Link to="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Eight steps */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">The process</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">
                Eight steps, one counterparty
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-ink">
                Every step happens on the platform, with a named agent and a written record you can go back to.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <Reveal key={step.slug} delay={(i % 4) * 60}>
                  <Link
                    to={`/how-it-works/${step.slug}`}
                    className="card-hover block h-full rounded-2xl border border-border bg-background p-7 hover:border-accent/50"
                  >
                    <span className="label-mono-up text-primary">{step.step}</span>
                    <h3 className="mt-3 text-xl font-semibold text-primary">{step.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-body-ink">{step.shortDesc}</p>
                    <span className="btn-nudge mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Ready to start */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="surface-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to start?</h2>
              <p className="mt-5 text-lg text-white/75">
                Submit your first sourcing request in minutes. No commitment required.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="xl" variant="hero" className="btn-nudge card-hover bg-white bg-none text-primary hover:bg-white">
                  <Link to="/auth?signup=true">
                    Start a request <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="onDark">
                  <a href={CALENDLY} target="_blank" rel="noopener noreferrer">
                    Book a call
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Related */}
        <section className="relative bg-background">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Keep reading</p>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((link, i) => (
                <Reveal key={link.to} delay={i * 60}>
                  <Link
                    to={link.to}
                    className="card-hover block h-full rounded-2xl border border-border bg-card p-7 hover:border-accent/50"
                  >
                    <span className="label-mono-up text-muted-foreground">{link.label}</span>
                    <h3 className="mt-3 text-xl font-semibold text-primary">{link.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-body-ink">{link.desc}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
