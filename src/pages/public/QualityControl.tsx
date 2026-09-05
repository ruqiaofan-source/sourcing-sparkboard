import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Reveal } from "@/components/Reveal";

const CALENDLY = "https://calendly.com/admin-equilinq/30min";

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
  { n: "01", title: "Pre-production", desc: "Sample validation against your approved specs before mass production begins." },
  { n: "02", title: "In-process", desc: "On-site monitoring during production to catch defects early and keep quality consistent." },
  { n: "03", title: "Final inspection", desc: "Comprehensive pre-shipment check with detailed photo and video documentation." },
  { n: "04", title: "Packaging audit", desc: "Verify packaging integrity, labeling accuracy, and shipping readiness." },
];

const youReceive = [
  "Detailed photo reports",
  "Video walkthroughs",
  "Measurement verification",
  "Defect documentation",
  "Pass/fail summary",
  "Real-time dashboard updates",
];

const related = [
  { to: "/oem-odm", label: "OEM / ODM", title: "Custom manufacturing", desc: "From concept to finished product." },
  { to: "/customization", label: "Customization", title: "Build it your way", desc: "Branding and packaging options." },
  { to: "/pricing", label: "Pricing", title: "Transparent pricing", desc: "Cost breakdown per order." },
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
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What does Equilinq's quality control process include?", acceptedAnswer: { "@type": "Answer", text: "Three stages: pre-production sample validation, in-process monitoring during manufacturing, and final pre-shipment inspection. Every stage is documented with photos and a written report." } },
              { "@type": "Question", name: "Do I receive photo and video documentation?", acceptedAnswer: { "@type": "Answer", text: "Yes. Every inspection includes high-resolution photos, video walkthroughs of the production line where applicable, and a structured QC report delivered before goods are shipped." } },
              { "@type": "Question", name: "What happens if defects are found?", acceptedAnswer: { "@type": "Answer", text: "Goods are not shipped until issues are resolved. We coordinate rework with the factory, re-inspect at no extra cost, and only release the order once quality criteria are met." } },
              { "@type": "Question", name: "Is QC included in the price or extra?", acceptedAnswer: { "@type": "Answer", text: "Standard pre-shipment QC is included on every Equilinq order. Detailed inspections, electrical testing, and on-site audits are available as optional add-ons with transparent pricing." } },
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
            name: "Quality Control - Equilinq",
            url: "https://equilinq.eu/quality-control",
            description: "Multi-stage quality control and product inspection services for China sourcing.",
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
            <p className="label-mono-up text-primary">Multi-stage QC</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              Quality you can see and verify
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink sm:text-lg">
              Every order goes through structured quality checks, from pre-production samples to final pre-shipment
              inspection. No defects, no surprises.
            </p>
          </div>
        </section>

        {/* Four stages */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Our 4-stage process</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">
                Checked at every point where things go wrong
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stages.map((stage, i) => (
                <Reveal key={stage.n} delay={i * 60}>
                  <div className="card-hover h-full rounded-2xl border border-border bg-card p-7">
                    <span className="label-mono-up text-primary">{stage.n}</span>
                    <h3 className="mt-3 text-xl font-semibold text-primary">{stage.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-body-ink">{stage.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Inspection services */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Inspection services</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">
                Every inspection includes photo and video documentation
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-ink">
                So you can verify quality remotely, before anything leaves the factory.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inspectionServices.map((item, i) => (
                <Reveal key={item.name} delay={(i % 3) * 60}>
                  <div className="card-hover h-full rounded-2xl border border-border bg-background p-7">
                    <h3 className="text-lg font-semibold text-primary">{item.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-body-ink">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* What you receive */}
        <section className="relative bg-background">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <div className="rounded-2xl border border-primary/25 bg-[image:var(--gradient-ink)] p-8 text-white shadow-[var(--shadow-soft)] sm:p-12">
                <p className="label-mono-up text-white/60">What you receive</p>
                <h2 className="mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
                  A full documentation package, delivered to your dashboard
                </h2>
                <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                  {youReceive.map((item) => (
                    <li key={item} className="label-mono flex items-center gap-3 border-b border-white/15 pb-4 text-white/85">
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                      <span className="normal-case tracking-normal">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Closing band */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-bold text-white sm:text-5xl">Ship with confidence</h2>
              <p className="mt-5 text-lg text-white/75">
                Submit a sourcing request and our QC team will ensure every item meets your standards.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="xl" variant="hero" className="btn-nudge card-hover bg-white bg-none text-primary hover:bg-white">
                  <Link to="/start">
                    Get a free quote <ArrowRight />
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
