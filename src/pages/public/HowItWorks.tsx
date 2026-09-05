import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Reveal } from "@/components/Reveal";
import { ProductCycle } from "@/components/landing/ProductCycle";
import { FaqList } from "@/components/FaqList";
import { homeFaqs } from "@/data/homeFaqs";
import { steps } from "./HowItWorksStep";

const CALENDLY = "https://calendly.com/admin-equilinq/30min";

/** Richer per-step lines, taken from each step page's "What's included" list. */
const cycleDescriptions = steps.map((s) => s.details.join(" · "));
const cycleHrefs = steps.map((s) => `/how-it-works/${s.slug}`);

const platformLines = [
  "Submit sourcing requests with specs, quantity and budget",
  "Receive itemised quotes from verified factories",
  "Compare costs: factory, logistics and service fees",
];

const related = [
  { to: "/pricing", label: "Pricing", title: "Transparent pricing", desc: "Every quote itemised, no hidden markups." },
  { to: "/quality-control", label: "Quality control", title: "Checked before it ships", desc: "Multi-stage inspection for every order." },
  { to: "/customization", label: "Customization", title: "Build it your way", desc: "Branding, packaging and finishing services." },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
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
            "@graph": [
              {
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
              },
              {
                "@type": "FAQPage",
                mainEntity: homeFaqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.q,
                  acceptedAnswer: { "@type": "Answer", text: faq.a },
                })),
              },
            ],
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
                <Link to="/start">
                  Get a free quote <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="onDark">
                <Link to="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* The pinned product cycle */}
        <section data-dark-band className="relative bg-band text-white">
          <div className="surface-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative">
            <ProductCycle descriptions={cycleDescriptions} hrefs={cycleHrefs} />
          </div>
        </section>

        {/* Every step, in your dashboard */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">The platform</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">Every step, in your dashboard</h2>
            </Reveal>
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <Reveal>
                <div>
                  <div className="overflow-hidden rounded-2xl border border-border bg-band">
                    <video
                      src="/videos/area-demo.mp4"
                      poster="/dashboard-preview-real-1024.webp"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-label="Equilinq sourcing platform walkthrough"
                      className="block h-auto w-full object-cover object-top"
                    />
                  </div>
                  <p className="label-mono mt-3 text-muted-foreground">Platform preview</p>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <ul className="grid gap-4 text-base leading-relaxed text-body-ink">
                  {platformLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Full FAQ */}
        <section id="faq" className="relative bg-background" aria-label="Frequently asked questions">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">FAQ</p>
              <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">Everything buyers ask us</h2>
            </Reveal>
            <Reveal delay={60}>
              <FaqList faqs={homeFaqs} />
            </Reveal>
          </div>
        </section>

        {/* Closing band */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="surface-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to start?</h2>
              <p className="mt-5 text-lg text-white/75">Two fields, no account, a reply within one business day.</p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="xl" variant="hero" className="btn-nudge card-hover bg-white bg-none text-primary hover:bg-white">
                  <Link to="/start">
                    Get a free itemised quote <ArrowRight />
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
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Keep reading</p>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((link, i) => (
                <Reveal key={link.to} delay={i * 60}>
                  <Link
                    to={link.to}
                    className="card-hover block h-full rounded-2xl border border-border bg-background p-7 hover:border-accent/50"
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
