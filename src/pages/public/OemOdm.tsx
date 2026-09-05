import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Reveal } from "@/components/Reveal";

const CALENDLY = "https://calendly.com/admin-equilinq/30min";

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
  { n: "01", title: "Share your concept", desc: "Send us your product idea, reference images, or specifications." },
  { n: "02", title: "Factory matching", desc: "We identify and vet the best manufacturers for your product." },
  { n: "03", title: "Sampling and production", desc: "Approve samples, then we manage the full production run." },
  { n: "04", title: "QC and delivery", desc: "Multi-stage quality control and logistics to your door." },
];

const oem = ["Your branding on proven products", "Lower development cost", "Faster time to market", "Low MOQ from 10 units"];
const odm = ["Fully custom product design", "Unique to your brand", "Full IP ownership", "Prototype and sample validation"];

const related = [
  { to: "/quality-control", label: "Quality control", title: "Checked before it ships", desc: "Multi-stage inspection for every order." },
  { to: "/customization", label: "Customization", title: "Build it your way", desc: "Branding and packaging options." },
  { to: "/how-it-works", label: "Process", title: "How it works", desc: "Our 8-step sourcing process." },
];

export default function OemOdm() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="OEM / ODM Manufacturing - Equilinq Custom Production"
        description="Custom OEM and ODM manufacturing from China. From concept to finished product, factory sourcing, sampling, production management, and delivery to Europe."
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

      <main>
        {/* Inner hero */}
        <section className="relative bg-card">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
            <p className="label-mono-up text-primary">Custom manufacturing</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              From concept to finished product
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink sm:text-lg">
              Whether you need an existing product under your brand (OEM) or a fully custom design (ODM), we manage the
              entire process from factory to doorstep.
            </p>
          </div>
        </section>

        {/* OEM vs ODM */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">OEM vs ODM</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">Two routes to your own product</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <Reveal>
                <div className="card-hover h-full rounded-2xl border border-border bg-card p-7">
                  <span className="label-mono-up text-muted-foreground">OEM</span>
                  <h3 className="mt-3 text-xl font-semibold text-primary">Your brand on a proven product</h3>
                  <p className="mt-4 text-sm leading-relaxed text-body-ink">
                    Original Equipment Manufacturing, apply your brand and packaging to an existing product from a verified
                    factory.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {oem.map((item) => (
                      <li key={item} className="label-mono flex items-center gap-3 text-body-ink">
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="normal-case tracking-normal">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="card-hover h-full rounded-2xl border border-border bg-card p-7">
                  <span className="label-mono-up text-muted-foreground">ODM</span>
                  <h3 className="mt-3 text-xl font-semibold text-primary">A product that is only yours</h3>
                  <p className="mt-4 text-sm leading-relaxed text-body-ink">
                    Original Design Manufacturing, we develop a completely custom product based on your specifications and
                    design.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {odm.map((item) => (
                      <li key={item} className="label-mono flex items-center gap-3 text-body-ink">
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="normal-case tracking-normal">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">How it works</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">Four stages, managed for you</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <Reveal key={step.n} delay={i * 60}>
                  <div className="card-hover h-full rounded-2xl border border-border bg-background p-7">
                    <span className="label-mono-up text-primary">{step.n}</span>
                    <h3 className="mt-3 text-xl font-semibold text-primary">{step.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-body-ink">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="relative bg-background">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Manufacturing services</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">
                End-to-end support from sourcing to delivery
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((item, i) => (
                <Reveal key={item.name} delay={(i % 3) * 60}>
                  <div className="card-hover h-full rounded-2xl border border-border bg-card p-7">
                    <h3 className="text-lg font-semibold text-primary">{item.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-body-ink">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Closing band */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to build your product?</h2>
              <p className="mt-5 text-lg text-white/75">
                Tell us what you want to create and we will find the right factory, manage production, and deliver to your
                door.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="xl" variant="hero" className="btn-nudge card-hover bg-white bg-none text-primary hover:bg-white">
                  <Link to="/auth?signup=true">
                    Start your project <ArrowRight />
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
