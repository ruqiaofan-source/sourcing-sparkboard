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
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const reasons = [
  "General inquiry",
  "Sourcing consultation",
  "Pricing question",
  "Partnership",
  "Other",
];

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
        keywords="contact Equilinq, sourcing consultation, China sourcing help, European SME supplier contact"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Contact", url: "https://equilinq.eu/contact" },
        ]}
      />
      <PublicNavbar />

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-[1.1]">
              Get in touch
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Have a question or ready to start sourcing? We'd love to hear from you.
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <a
              href="mailto:contact@equilinq.eu"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4 text-primary" />
              contact@equilinq.eu
            </a>
            <a
              href="https://calendly.com/admin-equilinq/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
            >
              <Calendar className="h-4 w-4 text-primary" />
              Book a 30-min call
            </a>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Reply within 24h
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {sent ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-2">Message received!</h2>
                <p className="text-muted-foreground mb-6">We'll get back to you within 24 hours.</p>
                <Button variant="outline" onClick={() => setSent(false)} className="rounded-full">
                  Send another message
                </Button>
              </div>
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
                    className="flex min-h-[120px] w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background resize-none"
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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mt-10 text-center"
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
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
