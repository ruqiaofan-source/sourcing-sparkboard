import { useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Calendar,
  Send,
  Loader2,
  Clock,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Globe,
  MessageSquare,
} from "lucide-react";

const reasons = [
  "General inquiry",
  "Sourcing consultation",
  "Pricing question",
  "Partnership",
  "Other",
];

const contactCards = [
  {
    icon: Mail,
    title: "Email us",
    desc: "We respond within 24 hours",
    action: "contact@equilinq.eu",
    href: "mailto:contact@equilinq.eu",
  },
  {
    icon: Calendar,
    title: "Book a call",
    desc: "Free 30-minute consultation",
    action: "Schedule now",
    href: "https://calendly.com/admin-equilinq/30min",
    external: true,
  },
  {
    icon: Globe,
    title: "Europe & China",
    desc: "Teams across both regions",
    action: "Learn more",
    href: "/how-it-works",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

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
      />
      <PublicNavbar />

      {/* Hero section with animated background */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
              top: "-10%",
              right: "-5%",
            }}
            animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.05, 0.95, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--chart-2) / 0.08) 0%, transparent 70%)",
              bottom: "0%",
              left: "-5%",
            }}
            animate={{ x: [0, -20, 15, 0], y: [0, 15, -20, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-14"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 250 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6"
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">
                We reply within 24 hours
              </span>
            </motion.div>

            <motion.h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-5"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Let's talk{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(260 80% 68%))",
                }}
              >
                sourcing
              </span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Whether you have a question or are ready to start, we are here to help you source smarter.
            </motion.p>
          </motion.div>

          {/* Contact cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16"
          >
            {contactCards.map((card) => (
              <motion.a
                key={card.title}
                variants={fadeUp}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className="group relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card/60 transition-all duration-300 cursor-pointer"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{card.desc}</p>
                <span className="text-sm text-primary font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  {card.action}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* Main content: form + side info */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form - takes 3 cols */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="lg:col-span-3"
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5"
                  >
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Message received!</h2>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
                  </p>
                  <Button variant="outline" onClick={() => setSent(false)} className="rounded-full">
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 sm:p-8 space-y-5"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h2 className="font-heading text-lg font-semibold text-foreground">Send us a message</h2>
                  </div>

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
                    <Label className="text-sm text-card-foreground">Reason</Label>
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
                      placeholder="Tell us about your project or question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex min-h-[140px] w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background resize-none"
                      required
                    />
                  </div>

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

            {/* Side info - takes 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Response time */}
              <div className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">Average response</h3>
                    <p className="text-primary font-bold text-lg font-heading">Under 12 hours</p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                    initial={{ width: "0%" }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              {/* Office locations */}
              <div className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Our Offices
                </h3>
                <div className="space-y-4">
                  {[
                    { city: "Netherlands", region: "European Operations", flag: "🇳🇱" },
                    { city: "Shenzhen", region: "China Operations", flag: "🇨🇳" },
                    { city: "Hong Kong", region: "StarIT Group HQ", flag: "🇭🇰" },
                  ].map((office, i) => (
                    <motion.div
                      key={office.city}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xl">{office.flag}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{office.city}</p>
                        <p className="text-xs text-muted-foreground">{office.region}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6">
                <h3 className="font-heading font-semibold text-foreground mb-3">Common questions</h3>
                <div className="space-y-3">
                  {[
                    { q: "What's your minimum order?", a: "As low as 10 units per SKU." },
                    { q: "Do I need experience?", a: "No, we guide you through every step." },
                    { q: "How fast can I get a quote?", a: "Usually within 2-3 business days." },
                  ].map((item, i) => (
                    <motion.div
                      key={item.q}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                    >
                      <p className="text-sm font-medium text-foreground">{item.q}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.a}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="text-center pt-2"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Ready to start sourcing? Create a free account.
                </p>
                <a href="/auth?signup=true">
                  <Button variant="outline" className="rounded-full" size="sm">
                    Get started free
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { to: "/how-it-works", title: "How It Works", desc: "Our 8-step sourcing process" },
              { to: "/pricing", title: "Pricing", desc: "Transparent cost breakdown" },
              { to: "/insights", title: "Insights", desc: "Sourcing trends and market reports" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="group block p-5 rounded-xl border border-border/30 bg-card/20 hover:border-primary/30 hover:bg-card/40 transition-all">
                <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
