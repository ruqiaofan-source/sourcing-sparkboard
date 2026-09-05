import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Reveal } from "@/components/Reveal";

const CALENDLY = "https://calendly.com/admin-equilinq/30min";

const howItWorks = [
  { n: "01", title: "Submit your request", desc: "Tell us what you need: product, quantity, specs, and budget." },
  { n: "02", title: "Receive your breakdown", desc: "Get a fully itemized quote with every cost line visible." },
  { n: "03", title: "Decide with clarity", desc: "No obligation. Review, compare, and accept when ready." },
];

const costBlocks = [
  { label: "Factory cost", desc: "Direct supplier price at wholesale" },
  { label: "Logistics and customs", desc: "Freight, clearance, duties, handling" },
  { label: "China operations", desc: "QC, warehousing, coordination" },
  { label: "Service fee", desc: "Equilinq sourcing and management" },
];

const included = [
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
];

const related = [
  { to: "/how-it-works", label: "Process", title: "How it works", desc: "See our 8-step sourcing process." },
  { to: "/customization", label: "Customization", title: "Build it your way", desc: "Branding and packaging options." },
  { to: "/contact", label: "Contact", title: "Talk to us", desc: "Get a free consultation." },
];

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
        jsonLd={{
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What does Equilinq charge for sourcing?", acceptedAnswer: { "@type": "Answer", text: "Equilinq charges a transparent service fee on the order value. Service fees scale down as your order value grows, and the exact fee is shown as its own line in every quote." } },
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
            "@type": "Service",
            name: "Sourcing Service - Equilinq",
            url: "https://equilinq.eu/pricing",
            description: "End-to-end sourcing service with transparent, itemized pricing. Factory cost, logistics, operations, and service fee clearly separated.",
            provider: { "@type": "Organization", name: "Equilinq", url: "https://equilinq.eu" },
            areaServed: "Europe",
            serviceType: "Product Sourcing and Procurement",
          }),
        }}
      />
      <PublicNavbar />

      <main>
        {/* Inner hero */}
        <section className="relative bg-card">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
            <p className="label-mono-up text-primary">No hidden fees</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              Transparent pricing, tailored to your order
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink sm:text-lg">
              Every order is different. Submit a sourcing request and receive a fully itemized cost breakdown with no
              surprises.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">How it works</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">Three steps to a real number</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {howItWorks.map((item, i) => (
                <Reveal key={item.n} delay={i * 60}>
                  <div className="card-hover h-full rounded-2xl border border-border bg-card p-7">
                    <span className="label-mono-up text-primary">{item.n}</span>
                    <h3 className="mt-3 text-xl font-semibold text-primary">{item.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-body-ink">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Cost breakdown */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <div className="rounded-2xl border border-primary/25 bg-[image:var(--gradient-ink)] p-8 text-white shadow-[var(--shadow-soft)] sm:p-12">
                <p className="label-mono-up text-white/60">Every quote includes a full breakdown</p>
                <h2 className="mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
                  No hidden markups. You see exactly where every euro goes.
                </h2>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {costBlocks.map((block) => (
                    <div key={block.label} className="border-t border-white/20 pt-5">
                      <p className="label-mono-up text-white/60">{block.label}</p>
                      <p className="mt-3 text-sm leading-relaxed text-white/85">{block.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Volume */}
        <section className="relative bg-background">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Volume</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">Better rates at higher volumes</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink">
                Our service fees scale down as your order value grows. Submit a request and we will provide exact pricing
                tailored to your project.
              </p>
              <Button asChild size="xl" variant="hero" className="btn-nudge mt-9">
                <Link to="/auth?signup=true">
                  Get your quote <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          </div>
        </section>

        {/* Included */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Included in every order</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">
                Twelve things you never have to arrange yourself
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {included.map((item) => (
                  <li key={item} className="label-mono flex items-center gap-3 border-b border-border pb-4 text-body-ink">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="normal-case tracking-normal">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Closing band */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to see your exact pricing?</h2>
              <p className="mt-5 text-lg text-white/75">
                Submit a sourcing request and receive a detailed, no-obligation quote within 48 hours.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="xl" variant="hero" className="btn-nudge card-hover bg-white bg-none text-primary hover:bg-white">
                  <Link to="/auth?signup=true">
                    Submit a request <ArrowRight />
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
