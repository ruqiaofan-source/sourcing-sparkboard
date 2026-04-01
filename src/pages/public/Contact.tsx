import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Calendar, Send, Loader2, HelpCircle } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // For now just show success toast - can wire to edge function later
    await new Promise((r) => setTimeout(r, 800));
    toast({ title: "Message sent", description: "We'll get back to you shortly." });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Contact Equilinq - Get in Touch" description="Questions about sourcing from China? Contact Equilinq for a free consultation. Book a call or send us a message." />
      <PublicNavbar />

      <section className="pt-32 pb-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: "var(--glow-blue)" }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
              Contact & Inquiries
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Talk to the Equilinq Team
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              If you're exploring sourcing with Equilinq or want to understand how our service works, reach out here. Pricing, product quotes, and order-specific requests are handled after account signup inside the dashboard.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left - info cards */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">General Inquiries</h3>
                <p className="text-sm text-muted-foreground mb-3">Questions about services, pricing, or process.</p>
                <a href="mailto:contact@equilinq.eu" className="text-sm text-primary hover:underline">
                  contact@equilinq.eu
                </a>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Book a Call</h3>
                <p className="text-sm text-muted-foreground mb-3">Speak directly with our team about your needs.</p>
                <a
                  href="https://calendly.com/admin-equilinq/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Schedule a consultation
                </a>
              </div>
            </motion.div>

            {/* Right - form */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
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
                  <Label className="text-sm text-card-foreground">Subject of Interest</Label>
                  <Input
                    placeholder="Service related"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-secondary border-border h-11"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-card-foreground">Message</Label>
                  <textarea
                    placeholder="What would you like to know?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex min-h-[120px] w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-sm text-muted-foreground">Receive sourcing insights & market updates</span>
                </label>

                <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-medium">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <>
                      Contact Equilinq
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
