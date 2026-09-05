import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Reveal } from "@/components/Reveal";
import { HeroStack } from "@/components/landing/HeroStack";
import { ScrollHint } from "@/components/landing/ScrollHint";
import { ProductCycle } from "@/components/landing/ProductCycle";
import { QuoteBuildCard } from "@/components/landing/QuoteBuildCard";
import { CompareTable } from "@/components/landing/CompareTable";
import { FaqList } from "@/components/FaqList";
import { homeFaqs } from "@/data/homeFaqs";
import logoSoleRunning from "@/assets/logos/sole-running-cutout.png";
import logoLKK from "@/assets/logos/lkk-cutout.png";
import logoIMMO from "@/assets/logos/immo-cutout.png";
import logoBuckyDrop from "@/assets/logos/buckydrop-cutout.png";

const CALENDLY = "https://calendly.com/admin-equilinq/30min";
const PROTOTYPE = "https://prototype.equilinq.eu";

const services = [
  { label: "Sourcing", desc: "Verified factories at direct prices, from 10 units." },
  { label: "Customization", desc: "Private labels, packaging and 76 finishing services." },
  { label: "Quality control", desc: "Four-stage inspection with photo and video proof." },
  { label: "Shipping", desc: "Consolidated shipping, customs handling, real-time tracking." },
];

/** Six questions on the home page: MOQ and pricing, shipping, quality control, legitimacy, VAT, samples. */
const homeFaqIndexes = [0, 1, 3, 7, 5, 11];
const shortFaqs = homeFaqIndexes.map((i) => homeFaqs[i]);

const reviews = [
  {
    name: "Hammad Ahmed",
    role: "CEO Longlive",
    quote:
      "I worked with Equilinq Team on the potential procurement of a vascular Doppler. Through out the process , Team spent time to understand our requirement and matched us to the right manufacturers. The process was efficient and transparent at each step.",
  },
  {
    name: "Marian Leenman",
    role: "NGO Strategic Buyer",
    quote:
      "I enjoyed the service from Equilinq. They helped me source the products I needed, and it was much cheaper than other platforms. They also assisted with communication in Chinese. When one of the products was out of stock, they immediately found another supplier who sold the same item. Their inspection service was also really helpful, they checked every package and identified defects beforehand, so I didn't have to worry about quality issues. Lastly, their delivery was efficient. They designed the optimal route and delivered directly to my house. It was a nice experience.",
  },
  {
    name: "Henry",
    role: "Amazon Reseller",
    quote:
      "Service was good! We had some problems with tech things sourcing from oher countries and also china ourselves. Regarding Ar glasses its always a hard one to do because some components were always made very cheaply. Equilinq was helpful becuase they got us a good factory and the per unit price was lower than our orginial supplier. Also was nice they are also based in Amsterdam and were able to reply qucikly. Would recommend",
  },
  {
    name: "Ari",
    role: "Sustainable Yoga Mats",
    quote:
      "We worked with Equilinq to source sustainable yoga mats and honestly it went much smoother then we expected.\n\nAt first we weren't sure how complicated sourcing from China would be, but they explained everything very clearly and broke down the costs in a way that actually made sense. The communication was fast and they always replied when we had questions (even small ones).\n\nWhat we really liked was the transparancy. There were no \"surprise\" fees and they showed us different factory options instead of pushing just one. That made us feel more in control of the decision.\n\nShipping and coordination also went well and overall it just felt structured and professional, but still personal.\n\nWould definitely consider working with them again.",
  },
];

const partners = [
  { src: logoLKK, alt: "LKK Design" },
  { src: logoBuckyDrop, alt: "BuckyDrop" },
  { src: logoSoleRunning, alt: "Sole Running" },
  { src: logoIMMO, alt: "Stichting iMMO" },
];

const checkable = [
  { label: "Registration", text: "Equilinq Limited, Hong Kong Company No. 79372452", href: "https://www.icris.cr.gov.hk/" },
  { label: "Accountability", text: "A named agent on every order" },
  { label: "Teams", text: "Team in Amsterdam and Shenzhen" },
  { label: "Minimum order", text: "From 10 units for standard products" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <SEOHead
        title="Equilinq - Your China order, checked before it ships"
        description="One named agent, one itemised quote, no fee until you order. Verified factories, samples first and inspection with photo proof for European brands from 10 units."
        keywords="sourcing from China, European brands sourcing, verified factories, quality control inspection, private label, low minimum order, China logistics"
        breadcrumbs={[{ name: "Home", url: "https://equilinq.eu/" }]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                name: "Sourcing, customization and quality control from China",
                provider: { "@type": "Organization", name: "Equilinq" },
                description:
                  "Verified factories, itemised quotes, customization, multi-stage quality control with photo proof and door to door shipping for European brands ordering from 10 units.",
                areaServed: "Europe",
                serviceType: "Product Sourcing",
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Sourcing Services",
                  itemListElement: services.map((s) => ({
                    "@type": "Offer",
                    itemOffered: { "@type": "Service", name: s.label, description: s.desc },
                  })),
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: shortFaqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.q,
                  acceptedAnswer: { "@type": "Answer", text: faq.a },
                })),
              },
              {
                "@type": "SiteNavigationElement",
                name: "Main Navigation",
                hasPart: [
                  { "@type": "SiteNavigationElement", name: "How it works", url: "https://equilinq.eu/how-it-works" },
                  { "@type": "SiteNavigationElement", name: "Customization", url: "https://equilinq.eu/customization" },
                  { "@type": "SiteNavigationElement", name: "Quality control", url: "https://equilinq.eu/quality-control" },
                  { "@type": "SiteNavigationElement", name: "Pricing", url: "https://equilinq.eu/pricing" },
                  { "@type": "SiteNavigationElement", name: "Insights", url: "https://equilinq.eu/insights" },
                  { "@type": "SiteNavigationElement", name: "Get a free quote", url: "https://equilinq.eu/start" },
                  { "@type": "SiteNavigationElement", name: "Contact", url: "https://equilinq.eu/contact" },
                  { "@type": "SiteNavigationElement", name: "Prototyping", url: PROTOTYPE },
                  { "@type": "SiteNavigationElement", name: "Log in", url: "https://equilinq.eu/auth" },
                ],
              },
            ],
          }),
        }}
      />

      <PublicNavbar />

      <main>
        {/* 1. HERO */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="hero-veil pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] items-center lg:flex">
            <HeroStack className="translate-x-[7%] scale-110" />
          </div>

          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-40">
            <div className="max-w-[38.75rem] lg:max-w-[45%]">
              <Reveal>
                <span className="label-mono-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-white/60 backdrop-blur">
                  Sourcing and quality control, powered by Shenzhen
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 text-[clamp(2.4rem,5.4vw,4.4rem)] font-bold leading-[0.98] tracking-tight text-white">
                  Your China order, checked before it{" "}
                  <span className="underline decoration-1 underline-offset-[0.18em] underline-ink">ships.</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-white/85 sm:text-lg">
                  One named agent, one itemised quote, no fee until you order. For European brands ordering from 10 units: verified
                  factories, samples first, inspection with photo proof, customs documents handled, delivered to your door.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="xl" variant="hero" className="btn-nudge bg-white bg-none text-primary-deep hover:bg-white">
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
              <p className="label-mono-up mt-10 text-white/60">
                Hong Kong entity, contracts you can read · Team in Amsterdam and Shenzhen · Backed by one of the founding shareholders of
                Tencent Holdings.
              </p>
            </div>

            <div className="mt-12 hidden justify-center lg:flex">
              <ScrollHint />
            </div>

            <div className="mx-auto mt-10 max-w-[20rem] lg:hidden">
              <HeroStack />
            </div>
          </div>
        </section>


        {/* 2. TWO DOORS, compact */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="grid gap-4 md:grid-cols-2">
              <Reveal>
                <a
                  href={PROTOTYPE}
                  className="card-hover flex h-full flex-col rounded-2xl border border-border bg-background p-6 hover:border-accent/50"
                >
                  <h2 className="text-lg font-semibold text-primary">Prototyping and production</h2>
                  <p className="mt-2 text-sm leading-relaxed text-body-ink">
                    Design file to mass production for hardware founders. This runs on our prototyping site.
                  </p>
                  <span className="btn-nudge mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Go to prototype.equilinq.eu <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </Reveal>
              <Reveal delay={80}>
                <Link
                  to="/how-it-works"
                  className="card-hover flex h-full flex-col rounded-2xl border border-border bg-background p-6 hover:border-accent/50"
                >
                  <h2 className="text-lg font-semibold text-primary">Sourcing, customization and quality control</h2>
                  <p className="mt-2 text-sm leading-relaxed text-body-ink">
                    Verified factories, low minimum orders, inspection with photo proof and door to door shipping.
                  </p>
                  <span className="btn-nudge mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    See how it works <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS, pinned product cycle */}
        <section data-dark-band className="relative bg-band text-white">
          <div className="surface-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative">
            <ProductCycle />
          </div>
        </section>

        {/* 4. THE QUOTE THAT BUILDS ITSELF */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Pricing</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">
                Every quote is itemised. You see where every euro goes.
              </h2>
            </Reveal>
            <div className="mt-12">
              <QuoteBuildCard />
              <div className="mt-6 grid gap-2">
                <p className="label-mono text-muted-foreground">
                  Our fee is its own line on every quote, agreed before you order. Nothing added later.
                </p>
                <p className="label-mono text-muted-foreground">
                  Minimum order from 10 units on standard products, about 50 on custom products.
                </p>
              </div>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-body-ink">
                Service fees scale down as your order value grows. Submit a request and we quote your exact project.
              </p>
              <Button asChild size="xl" variant="hero" className="btn-nudge mt-6">
                <Link to="/pricing">
                  View pricing <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 5. COMPARE */}
        <section className="relative bg-background">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Compare</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">What you actually get</h2>
            </Reveal>
            <CompareTable />
          </div>
        </section>

        {/* 6. THE TEAM IN SHENZHEN */}
        <section className="relative bg-card">
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">The team in Shenzhen</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">
                Some of the people who check your goods before they ship.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-ink">
                Our own sourcing agents, on the floor of our Shenzhen warehouse, where orders are received, inspected and
                packed. You deal with one named agent from first quote to delivery.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <figure className="mt-12">
                <div className="overflow-hidden rounded-2xl border border-border">
                  <img
                    src="/team/team-band-1600.jpg"
                    srcSet="/team/team-band-800.jpg 800w, /team/team-band-1200.jpg 1200w, /team/team-band-1600.jpg 1600w"
                    sizes="(max-width: 1152px) 100vw, 1088px"
                    alt="Six Equilinq sourcing agents standing in the Equilinq warehouse in Shenzhen"
                    width={1600}
                    height={768}
                    loading="lazy"
                    className="block h-auto w-full object-cover"
                  />
                </div>
                <figcaption className="label-mono mt-3 text-muted-foreground">
                  Sourcing agents at the Equilinq warehouse, Shenzhen, September 2026. Some of the team.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* 7. PROOF */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">From our clients</p>
              <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">What clients say.</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {reviews.map((r, i) => (
                <Reveal key={r.name} delay={i * 60}>
                  <figure className="card-hover h-full rounded-2xl border border-border bg-card p-7 hover:border-accent/50">
                    <blockquote className="whitespace-pre-line text-sm leading-relaxed text-body-ink">{r.quote}</blockquote>
                    <figcaption className="label-mono mt-6 text-muted-foreground">
                      {r.name}, {r.role}
                      <span className="mt-1 block">via Trustpilot</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {checkable.map((t, i) => (
                <Reveal key={t.label} delay={i * 50}>
                  <div className="h-full rounded-2xl border border-border bg-card p-5">
                    <p className="label-mono-up text-muted-foreground">{t.label}</p>
                    {t.href ? (
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block text-sm leading-relaxed text-primary underline underline-offset-4"
                      >
                        {t.text}
                      </a>
                    ) : (
                      <p className="mt-3 text-sm leading-relaxed text-body-ink">{t.text}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="mt-16">
                <p className="label-mono text-center text-muted-foreground">Partners and clients we may name</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
                  {partners.map((p) => (
                    <img
                      key={p.alt}
                      src={p.src}
                      alt={p.alt}
                      loading="lazy"
                      className="h-[22px] w-auto max-w-[140px] object-contain opacity-55 transition-opacity duration-300 hover:opacity-90 sm:h-7"
                      style={{ filter: "grayscale(1) brightness(0)" }}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

          </div>
        </section>

        {/* 8. FAQ */}
        <section id="faq" className="relative bg-card" aria-label="Frequently asked questions">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">FAQ</p>
              <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">Common questions</h2>
            </Reveal>
            <Reveal delay={60}>
              <FaqList faqs={shortFaqs} />
            </Reveal>
            <Reveal>
              <Link to="/how-it-works#faq" className="label-mono-up btn-nudge mt-8 inline-flex items-center gap-2 text-primary">
                All thirteen questions <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* 9. FINAL BAND */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="surface-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to see your first itemised quote?</h2>
              <p className="mt-5 text-lg text-white/75">Two fields, no account, a reply within one business day.</p>
              <Button asChild size="xl" variant="hero" className="btn-nudge card-hover mt-9 bg-white bg-none text-primary hover:bg-white">
                <Link to="/start">
                  Get a free itemised quote <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
