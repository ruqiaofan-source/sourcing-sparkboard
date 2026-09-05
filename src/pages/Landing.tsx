import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Reveal } from "@/components/Reveal";
import { HeroVideo } from "@/components/landing/HeroVideo";
import { ScrollHint } from "@/components/landing/ScrollHint";
import { ScrollProgressRail } from "@/components/landing/ScrollProgressRail";
import { QuoteBuildCard } from "@/components/landing/QuoteBuildCard";
import { CompareTable } from "@/components/landing/CompareTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { homeFaqs } from "@/data/homeFaqs";
import founderImg from "@/assets/founder.jpg";
import logoSoleRunning from "@/assets/logos/sole-running-cutout.png";
import logoLKK from "@/assets/logos/lkk-cutout.png";
import logoIMMO from "@/assets/logos/immo-cutout.png";
import logoBuckyDrop from "@/assets/logos/buckydrop-cutout.png";

const CALENDLY = "https://calendly.com/admin-equilinq/30min";
const PROTOTYPE = "https://prototype.equilinq.eu";

const steps = [
  { n: "01", title: "Submit your sourcing request", desc: "Share your product specs, quantity, and budget." },
  { n: "02", title: "We source and vet suppliers", desc: "We find and screen verified manufacturers for you." },
  { n: "03", title: "Receive your quote", desc: "Transparent, itemized pricing with no hidden fees." },
  { n: "04", title: "Accept and pay", desc: "Pay securely and production begins." },
  { n: "05", title: "Production and monitoring", desc: "Real-time updates with photos and progress reports." },
  { n: "06", title: "Quality control inspection", desc: "Final inspection before shipment with photo reports." },
  { n: "07", title: "Shipping and logistics", desc: "Consolidated shipping, customs handling, real-time tracking." },
  { n: "08", title: "Delivery and support", desc: "Products delivered. Ongoing support for reorders." },
];

const whatWeDo = [
  { label: "Sourcing", to: "/how-it-works", desc: "Verified factories at direct prices, from 10 units." },
  { label: "Customization", to: "/customization", desc: "Private labels, packaging and 76 finishing services." },
  { label: "Quality control", to: "/quality-control", desc: "Four-stage inspection with photo and video proof." },
  { label: "Shipping", to: "/how-it-works/shipping-and-logistics", desc: "Consolidated shipping, customs handling, real-time tracking." },
];

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
  { label: "Reviews", text: "Trustpilot 4.8 from 5 reviews", href: "https://www.trustpilot.com/review/equilinq.eu" },
  { label: "Teams", text: "Team in Amsterdam and Shenzhen" },
  { label: "Minimum order", text: "From 10 units for standard products" },
];

type Block = { type: "p"; lines: string[] } | { type: "ol"; items: { title: string; lines: string[] }[] };

function parseAnswer(answer: string): Block[] {
  const paragraphs = answer.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const blocks: Block[] = [];
  for (const para of paragraphs) {
    const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
    const match = /^(\d+)\.\s+(.*)$/.exec(lines[0] ?? "");
    if (match) {
      const item = { title: match[2], lines: lines.slice(1) };
      const last = blocks[blocks.length - 1];
      if (last && last.type === "ol") last.items.push(item);
      else blocks.push({ type: "ol", items: [item] });
    } else {
      blocks.push({ type: "p", lines });
    }
  }
  return blocks;
}

function AnswerBody({ answer }: { answer: string }) {
  const blocks = parseAnswer(answer);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-body-ink">
      {blocks.map((block, i) =>
        block.type === "ol" ? (
          <ol key={i} className="list-decimal space-y-2 pl-5">
            {block.items.map((item, j) => (
              <li key={j}>
                <span className="font-medium text-primary">{item.title}</span>
                {item.lines.map((line, k) => (
                  <span key={k} className="block">
                    {line}
                  </span>
                ))}
              </li>
            ))}
          </ol>
        ) : (
          <p key={i}>
            {block.lines.map((line, k) => (
              <span key={k} className="block">
                {line}
              </span>
            ))}
          </p>
        ),
      )}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Equilinq - Sourcing from China, checked before it ships"
        description="Verified factories, itemised quotes and inspection with photo proof, for European brands ordering from 10 units. One counterparty in Hong Kong."
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
                  itemListElement: whatWeDo.map((s) => ({
                    "@type": "Offer",
                    itemOffered: { "@type": "Service", name: s.label, description: s.desc },
                  })),
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: homeFaqs.map((faq) => ({
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
                  { "@type": "SiteNavigationElement", name: "Contact", url: "https://equilinq.eu/contact" },
                  { "@type": "SiteNavigationElement", name: "Prototyping", url: PROTOTYPE },
                  { "@type": "SiteNavigationElement", name: "Log in", url: "https://equilinq.eu/auth" },
                ],
              },
              {
                "@type": "VideoObject",
                name: "Equilinq platform preview",
                description:
                  "A walkthrough of the Equilinq sourcing platform showing sourcing requests, itemised quotes, messages and inspection reports in one place.",
                thumbnailUrl: "https://equilinq.eu/dashboard-preview-real.webp",
                uploadDate: "2026-04-14T00:00:00+02:00",
                contentUrl: "https://equilinq.eu/videos/area-demo.mp4",
                embedUrl: "https://equilinq.eu/",
                duration: "PT1M",
              },
            ],
          }),
        }}
      />

      <PublicNavbar />

      <main>
        {/* 1. HERO */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <HeroVideo
            className="hero-veil pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block"
            mediaClassName="translate-x-[7%] scale-110"
            alt="Exploded view of a product packaging stack: mailer bag, card, product, tissue, foam insert, rigid box and shipping carton"
          />

          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-40">
            <div className="max-w-[38.75rem] lg:max-w-[45%]">
              <Reveal>
                <span className="label-mono-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-white/60 backdrop-blur">
                  Sourcing and quality control, powered by Shenzhen
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 text-[clamp(2.4rem,5.4vw,4.4rem)] font-bold leading-[0.98] tracking-tight text-white">
                  Sourcing from China, checked before it{" "}
                  <span className="underline decoration-1 underline-offset-[0.18em] underline-ink">ships.</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-white/85 sm:text-lg">
                  Verified factories, itemised quotes and inspection with photo proof, for European brands ordering from 10 units. One
                  counterparty in Hong Kong.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="xl" variant="hero" className="btn-nudge bg-white bg-none text-primary-deep hover:bg-white">
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
              <p className="label-mono-up mt-10 text-white/60">
                Hong Kong entity, contracts you can read · Team in Amsterdam and Shenzhen · Backed by one of the founding shareholders of
                Tencent Holdings.
              </p>
            </div>

            <div className="mt-12 hidden justify-center lg:flex">
              <ScrollHint />
            </div>
          </div>

          <HeroVideo
            className="hero-veil relative h-56 w-full overflow-hidden sm:h-72 lg:hidden"
            alt="Exploded view of a product packaging stack on a black background"
          />
        </section>

        {/* 2. TWO DOORS */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Two ways to work with us</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">
                Building something new, or ordering something that exists?
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <Reveal>
                <a
                  href={PROTOTYPE}
                  className="card-hover block h-full rounded-2xl border border-border bg-background p-7 hover:border-accent/50"
                >
                  <span className="label-mono-up text-muted-foreground">New products</span>
                  <h3 className="mt-3 text-xl font-semibold text-primary">Prototyping and production</h3>
                  <p className="mt-4 text-sm leading-relaxed text-body-ink">
                    Design file to mass production for hardware founders in Europe and the US: a production readiness audit, prototype
                    stages, then the production bridge. This runs on our prototyping site.
                  </p>
                  <span className="btn-nudge mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Go to prototype.equilinq.eu <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </Reveal>
              <Reveal delay={80}>
                <Link
                  to="/how-it-works"
                  className="card-hover block h-full rounded-2xl border border-border bg-background p-7 hover:border-accent/50"
                >
                  <span className="label-mono-up text-muted-foreground">Existing products</span>
                  <h3 className="mt-3 text-xl font-semibold text-primary">Sourcing, customization and quality control</h3>
                  <p className="mt-4 text-sm leading-relaxed text-body-ink">
                    Verified factories, low minimum orders, branding and packaging, inspection with photo proof and door to door shipping.
                    This is what this site does; the rest of the page explains how.
                  </p>
                  <span className="btn-nudge mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    See how it works <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3. THE WALL */}
        <section className="relative bg-background">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">The wall</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">
                Alibaba is a directory. A freelance agent is a middleman. Neither is accountable.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-ink">
                You are on your own for vetting, quality control and communication, or you pay a markup to someone who is not. The horror
                stories all come from the same place: nobody checked before the money moved.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <blockquote className="mt-12 border-l-2 border-primary/40 pl-6 text-[clamp(1.4rem,3.2vw,2rem)] font-semibold leading-snug tracking-tight text-primary">
                That check is where we start.
              </blockquote>
            </Reveal>
          </div>
        </section>

        {/* 3b. COMPARE */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Compare</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">What you actually get</h2>
            </Reveal>
            <CompareTable />
          </div>
        </section>


        {/* 4. HOW IT WORKS, pinned product cycle */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="surface-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative">
            <ProductCycle />
          </div>
        </section>


        {/* 4b. THE TEAM IN SHENZHEN */}
        <section className="relative bg-background">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
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



        {/* 5. THE PLATFORM */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">The platform</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">
                Every request, quote, message and inspection report in one place.
              </h2>
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
                <div>
                  <ul className="grid gap-4 text-base leading-relaxed text-body-ink">
                    <li>Submit sourcing requests with specs, quantity and budget</li>
                    <li>Receive itemised quotes from verified factories</li>
                    <li>Compare costs: factory, logistics and service fees</li>
                  </ul>
                  <Button asChild size="xl" variant="hero" className="btn-nudge mt-8">
                    <Link to="/auth?signup=true">
                      Try it now <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 6. WHAT WE DO */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">What we do</p>
              <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">Source. Brand. Check. Ship.</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whatWeDo.map((c, i) => (
                <Reveal key={c.label} delay={i * 60}>
                  <Link
                    to={c.to}
                    className="card-hover block h-full rounded-2xl border border-border bg-card p-7 hover:border-accent/50"
                  >
                    <span className="label-mono-up text-muted-foreground">0{i + 1}</span>
                    <h3 className="mt-3 text-xl font-semibold text-primary">{c.label}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-body-ink">{c.desc}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7. PRICING */}
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

        {/* 8. PROOF */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">From our clients</p>
              <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">What clients say on Trustpilot.</h2>
              <p className="mt-4 text-base text-body-ink">
                <a
                  href="https://www.trustpilot.com/review/equilinq.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  4.8 on Trustpilot (5 reviews)
                </a>
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {reviews.map((r, i) => (
                <Reveal key={r.name} delay={i * 60}>
                  <figure className="card-hover h-full rounded-2xl border border-border bg-card p-7 hover:border-accent/50">
                    <blockquote className="whitespace-pre-line text-sm leading-relaxed text-body-ink">{r.quote}</blockquote>
                    <figcaption className="label-mono mt-6 text-muted-foreground">
                      {r.name}, {r.role}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-16">
                <p className="label-mono text-muted-foreground">Partners and clients we may name</p>
                <div className="mt-6 flex flex-wrap items-center gap-10">
                  {partners.map((p) => (
                    <img key={p.alt} src={p.src} alt={p.alt} loading="lazy" className="h-10 w-auto max-w-[150px] object-contain" />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 9. WHAT YOU CAN CHECK */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <Reveal>
              <p className="label-mono-up text-primary">What you can check</p>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {checkable.map((t, i) => (
                <Reveal key={t.label} delay={i * 50}>
                  <div className="h-full rounded-2xl border border-border bg-background p-5">
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
          </div>
        </section>

        {/* 10. FROM THE FOUNDER */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">From the founder</p>
              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
                <img
                  src={founderImg}
                  alt="Ruqiao Fan, founder of Equilinq"
                  width={126}
                  height={189}
                  loading="lazy"
                  className="h-40 w-28 shrink-0 rounded-2xl border border-border object-cover"
                />
                <div>
                  <p className="text-base leading-relaxed text-body-ink sm:text-lg">
                    Why spend your time chasing factories, managing miscommunication, and fixing avoidable issues, when we can handle it for
                    you?
                  </p>
                  <p className="label-mono mt-6 text-muted-foreground">Ruqiao Fan, founder</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 11. FAQ */}
        <section id="faq" className="relative bg-card" aria-label="Frequently asked questions">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">FAQ</p>
              <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">Common questions</h2>
            </Reveal>
            <Reveal delay={60}>
              <Accordion type="single" collapsible className="mt-10 grid gap-3">
                {homeFaqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded-2xl border border-border bg-background px-6 transition-colors duration-200 ease-out hover:border-accent/50"
                  >
                    <AccordionTrigger className="text-left font-display text-base font-semibold text-primary hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <AnswerBody answer={faq.a} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* 12. FINAL CALL TO ACTION */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="surface-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to source with someone accountable?</h2>
              <p className="mt-5 text-lg text-white/75">Submit a request in ten minutes. No commitment until you accept a quote.</p>
              <Button asChild size="xl" variant="hero" className="btn-nudge card-hover mt-9 bg-white bg-none text-primary hover:bg-white">
                <Link to="/auth?signup=true">
                  Start a request <ArrowRight />
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
