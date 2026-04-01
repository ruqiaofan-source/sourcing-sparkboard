import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Calendar,
  Send,
  Loader2,
  MessageSquare,
  Globe,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const reasons = [
  "General inquiry",
  "Sourcing consultation",
  "Pricing question",
  "Partnership",
  "Press & media",
  "Other",
];

const faqs = [
  {
    q: "What is the minimum order quantity?",
    a: "We work with factories that accept orders as low as 10 units, making it easy to test products before scaling.",
  },
  {
    q: "How long does sourcing take?",
    a: "Most sourcing requests receive initial quotes within 3-5 business days. Full production timelines depend on the product.",
  },
  {
    q: "Do you handle shipping and customs?",
    a: "Yes. We coordinate end-to-end logistics including consolidated shipping, customs documentation, and delivery to your door.",
  },
  {
    q: "Is there a cost to get a quote?",
    a: "No. Submitting a sourcing request and receiving quotes is completely free. You only pay when you approve and place an order.",
  },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast({ title: "Message sent", description: "We'll get back to you shortly." });
    setSent(true);
    setName("");
    setEmail("");
    setReason("");
    setMessage("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Contact Equilinq - Get in Touch"
        description="Questions about sourcing from China? Contact Equilinq for a free consultation. Book a call or send us a message."
      />
      <PublicNavbar />

      {/* ───── Hero ───── */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ background: "var(--glow-blue)" }}
        />
        {/* Decorative grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Let's connect
              </span>
            </motion.div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-[1.1]">
              We'd love to hear
              <br />
              <span className="text-primary">from you</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Whether you're exploring sourcing for the first time or scaling an existing supply chain, our team is here to help.
            </p>
          </motion.div>

          {/* ───── Quick-action cards ───── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
            {[
              {
                icon: Mail,
                title: "Email us",
                desc: "contact@equilinq.eu",
                href: "mailto:contact@equilinq.eu",
                cta: "Send email",
              },
              {
                icon: Calendar,
                title: "Book a call",
                desc: "30-min free consultation",
                href: "https://calendly.com/admin-equilinq/30min",
                cta: "Schedule now",
                external: true,
              },
              {
                icon: Clock,
                title: "Response time",
                desc: "Within 24 hours",
                href: null,
                cta: null,
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              >
                {card.href ? (
                  <a
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                    className="group block h-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <card.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{card.desc}</p>
                    {card.cta && (
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        {card.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </a>
                ) : (
                  <div className="h-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <card.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Form + FAQ split ───── */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left - Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Send a message
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Get in touch
              </h2>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">Message received!</h3>
                  <p className="text-muted-foreground mb-6">We'll get back to you within 24 hours.</p>
                  <Button
                    variant="outline"
                    onClick={() => setSent(false)}
                    className="rounded-full"
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 sm:p-8 space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm text-card-foreground">Name</Label>
                      <Input
                        placeholder="Jane"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-secondary border-border h-11"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-card-foreground">Email</Label>
                      <Input
                        type="email"
                        placeholder="jane@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-secondary border-border h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm text-card-foreground">Reason for contact</Label>
                    <div className="flex flex-wrap gap-2">
                      {reasons.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReason(r)}
                          className={`rounded-full px-3.5 py-1.5 text-sm border transition-all duration-200 ${
                            reason === r
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border/60 bg-secondary/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm text-card-foreground">Message</Label>
                    <textarea
                      placeholder="Tell us about your project, what you're looking to source, or any questions you have..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex min-h-[140px] w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background resize-none"
                      required
                    />
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-sm text-muted-foreground">
                      Receive sourcing insights & market updates
                    </span>
                  </label>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-medium"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Send message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Right - FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Quick answers
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Common questions
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5"
                  >
                    <h3 className="font-heading text-sm font-semibold text-foreground mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6"
              >
                <h3 className="font-heading text-base font-semibold text-foreground mb-2">
                  Ready to start sourcing?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a free account and submit your first request in minutes. No commitment required.
                </p>
                <a href="/auth?signup=true">
                  <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                    Get started free
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
