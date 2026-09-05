import { useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import founderImg from "@/assets/founder.jpg";


const reasons = ["General inquiry", "Sourcing consultation", "Pricing question", "Partnership", "Other"];

const contactCards = [
  {
    label: "Email",
    title: "Email us",
    desc: "We respond within 24 hours.",
    action: "contact@equilinq.eu",
    href: "mailto:contact@equilinq.eu",
  },
  {
    label: "Call",
    title: "Book a call",
    desc: "Free 30-minute consultation.",
    action: "Schedule now",
    href: "https://calendly.com/admin-equilinq/30min",
    external: true,
  },
  {
    label: "Coverage",
    title: "Europe and China",
    desc: "Teams across both regions.",
    action: "Learn more",
    href: "/how-it-works",
  },
];

const offices = [
  { code: "NL", city: "Netherlands", region: "European operations" },
  {
    code: "CN",
    city: "Shenzhen",
    region: "China operations",
    image: "/team/team-tight-800.jpg",
    imageAlt: "Equilinq sourcing agents at the warehouse in Shenzhen",
  },
  { code: "HK", city: "Hong Kong", region: "StarIT Group HQ" },
];


const faqs = [
  { q: "What's your minimum order?", a: "As low as 10 units per SKU." },
  { q: "Do I need experience?", a: "No, we guide you through every step." },
  { q: "How fast can I get a quote?", a: "Usually within 2-3 business days." },
];

const related = [
  { to: "/how-it-works", label: "Process", title: "How it works", desc: "Our 8-step sourcing process." },
  { to: "/pricing", label: "Pricing", title: "Transparent pricing", desc: "Itemized cost breakdown." },
  { to: "/insights", label: "Insights", title: "Sourcing insights", desc: "Trends and market reports." },
];

const inputClass =
  "h-11 rounded-[0.75rem] border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = crypto.randomUUID();

      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert({ id, name: name.trim(), email: email.trim(), reason: reason || null, message: message.trim() });

      if (dbError) throw dbError;

      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-confirmation",
          recipientEmail: email.trim(),
          idempotencyKey: `contact-confirm-${id}`,
          templateData: { name: name.trim() },
        },
      });

      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-notification",
          recipientEmail: "contact@equilinq.eu",
          idempotencyKey: `contact-notify-${id}`,
          templateData: { name: name.trim(), email: email.trim(), reason, message: message.trim() },
        },
      });

      toast({ title: "Message sent", description: "We'll get back to you shortly." });
      setSent(true);
      setName("");
      setEmail("");
      setReason("");
      setMessage("");
    } catch (err) {
      console.error("Contact form error:", err);
      toast({ title: "Something went wrong", description: "Please try again or email us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Contact Equilinq - Get in Touch"
        description="Questions about sourcing from China? Contact Equilinq for a free consultation. Book a call or send us a message."
        keywords="contact Equilinq, sourcing consultation, China sourcing help, European SME supplier contact"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Contact", url: "https://equilinq.eu/contact" },
        ]}
        jsonLd={{
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What's your minimum order?", acceptedAnswer: { "@type": "Answer", text: "As low as 10 units per SKU." } },
            { "@type": "Question", name: "Do I need sourcing experience?", acceptedAnswer: { "@type": "Answer", text: "No, we guide you through every step of the sourcing process." } },
            { "@type": "Question", name: "How fast can I get a quote?", acceptedAnswer: { "@type": "Answer", text: "Usually within 2-3 business days." } },
          ],
        }}
      />
      <PublicNavbar />

      <main>
        {/* Inner hero */}
        <section className="relative bg-card">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
            <p className="label-mono-up text-primary">We reply within 24 hours</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              Let's talk sourcing
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink sm:text-lg">
              Whether you have a question or are ready to start, we are here to help you source smarter.
            </p>
          </div>
        </section>

        {/* Contact cards */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="grid gap-6 sm:grid-cols-3">
              {contactCards.map((card, i) => (
                <Reveal key={card.title} delay={i * 60}>
                  <a
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                    className="btn-nudge card-hover block h-full rounded-2xl border border-border bg-card p-7 hover:border-accent/50"
                  >
                    <span className="label-mono-up text-muted-foreground">{card.label}</span>
                    <h2 className="mt-3 text-xl font-semibold text-primary">{card.title}</h2>
                    <p className="mt-4 text-sm leading-relaxed text-body-ink">{card.desc}</p>
                    <span className="label-mono-up mt-6 inline-flex items-center gap-2 text-primary">
                      {card.action} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>

            {/* Form */}
            <div className="mt-16 grid gap-8 lg:grid-cols-5 lg:gap-12">
              <div className="lg:col-span-3">
                <Reveal>
                  {sent ? (
                    <div className="rounded-2xl border border-accent/50 bg-card p-10 text-center shadow-[var(--shadow-lift)]">
                      <CheckCircle2 className="mx-auto mb-5 h-10 w-10 text-primary" />
                      <h2 className="text-2xl font-bold text-primary">Message received</h2>
                      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-body-ink">
                        Thank you for reaching out. Our team will review your message and get back to you within 24
                        hours.
                      </p>
                      <Button variant="outlineInk" size="xl" className="mt-8" onClick={() => setSent(false)}>
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="rounded-2xl border border-accent/50 bg-card p-7 shadow-[var(--shadow-lift)] sm:p-10"
                    >
                      <span className="label-mono-up text-muted-foreground">Message</span>
                      <h2 className="mt-3 text-2xl font-bold text-primary sm:text-3xl">Send us a message</h2>

                      <div className="mt-8 grid gap-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div className="grid gap-2">
                            <label htmlFor="contact-name" className="label-mono-up text-muted-foreground">
                              Name
                            </label>
                            <Input
                              id="contact-name"
                              placeholder="Jane"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className={inputClass}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="contact-email" className="label-mono-up text-muted-foreground">
                              Email
                            </label>
                            <Input
                              id="contact-email"
                              type="email"
                              placeholder="jane@company.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <span className="label-mono-up text-muted-foreground">Reason</span>
                          <div className="flex flex-wrap gap-2">
                            {reasons.map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setReason(r)}
                                className={`rounded-[0.75rem] border px-3.5 py-2 text-sm transition-colors ${
                                  reason === r
                                    ? "border-primary bg-secondary font-medium text-primary"
                                    : "border-border bg-background text-body-ink hover:border-accent/50 hover:text-primary"
                                }`}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <label htmlFor="contact-message" className="label-mono-up text-muted-foreground">
                            Message
                          </label>
                          <textarea
                            id="contact-message"
                            placeholder="Tell us about your project or question"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-32 w-full resize-none rounded-[0.75rem] border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            required
                          />
                        </div>

                        <Button type="submit" size="xl" variant="hero" className="btn-nudge w-full" disabled={loading}>
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Send message <ArrowRight />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </Reveal>
              </div>

              {/* Side info */}
              <div className="grid content-start gap-6 lg:col-span-2">
                <Reveal>
                  <p className="label-mono-up text-muted-foreground">
                    Average response · Under 12 hours
                  </p>
                </Reveal>

                <Reveal delay={60}>
                  <p className="label-mono-up text-primary">Our offices</p>
                </Reveal>
                <div className="grid gap-4">
                  {offices.map((office, i) => (
                    <Reveal key={office.city} delay={i * 60}>
                      <div className="card-hover rounded-2xl border border-border bg-card p-5 hover:border-accent/50">
                        {"image" in office && office.image ? (
                          <div className="mb-4 overflow-hidden rounded-2xl border border-border">
                            <img
                              src={office.image}
                              alt={office.imageAlt}
                              width={800}
                              height={450}
                              loading="lazy"
                              className="block h-auto w-full object-cover"
                            />
                          </div>
                        ) : null}
                        <span className="label-mono-up text-muted-foreground">{office.code}</span>

                        <h3 className="mt-2 text-lg font-semibold text-primary">{office.city}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-body-ink">{office.region}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <Reveal>
                  <p className="label-mono-up mt-4 text-primary">Common questions</p>
                  <Accordion type="single" collapsible className="mt-4">
                    {faqs.map((item) => (
                      <AccordionItem
                        key={item.q}
                        value={item.q}
                        className="transition-colors duration-200 ease-out hover:border-accent/50"
                      >
                        <AccordionTrigger className="text-left font-display text-base font-semibold text-primary hover:no-underline">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm leading-relaxed text-body-ink">{item.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Reveal>

                <Reveal>
                  <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                    <p className="label-mono-up text-primary">From the founder</p>
                    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">
                      <img
                        src={founderImg}
                        alt="Ruqiao Fan, founder of Equilinq"
                        width={126}
                        height={189}
                        loading="lazy"
                        className="h-40 w-28 shrink-0 rounded-2xl border border-border object-cover"
                      />
                      <div>
                        <p className="text-base leading-relaxed text-body-ink">
                          Why spend your time chasing factories, managing miscommunication, and fixing avoidable issues,
                          when we can handle it for you?
                        </p>
                        <p className="label-mono mt-5 text-muted-foreground">Ruqiao Fan, founder</p>
                      </div>
                    </div>
                  </div>
                </Reveal>

                <Reveal>
                  <div className="mt-4">
                    <p className="text-sm leading-relaxed text-body-ink">
                      Ready to start sourcing? Get a free quote.
                    </p>
                    <Button asChild size="xl" variant="hero" className="btn-nudge mt-4">
                      <Link to="/start">
                        Get a free quote <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </Reveal>

              </div>
            </div>
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
