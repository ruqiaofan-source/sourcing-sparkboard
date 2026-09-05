import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, BadgeCheck, Loader2 } from "lucide-react";

const CALENDLY = "https://calendly.com/admin-equilinq/30min";

const inputClass =
  "h-11 rounded-[0.75rem] border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring";

const reassurance = [
  "No fee until you order",
  "Samples first on custom products",
  "One Hong Kong company, contracts you can read",
];

export default function Start() {
  const [product, setProduct] = useState("");
  const [units, setUnits] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const message = [
        `Roughly how many units: ${units.trim() || "Not provided"}`,
        `Company or shop: ${company.trim() || "Not provided"}`,
        "",
        product.trim(),
      ].join("\n");

      const { error } = await supabase.from("contact_submissions").insert({
        id: crypto.randomUUID(),
        name: company.trim() || email.trim(),
        email: email.trim(),
        reason: "quote-request",
        message,
      });
      if (error) throw error;

      toast({ title: "Request received", description: "A named agent replies within one business day." });
      setSent(true);
      setProduct("");
      setUnits("");
      setEmail("");
      setCompany("");
    } catch (err) {
      console.error("Quote request error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Get a Free Itemised Quote - Equilinq"
        description="Tell us what you want to source. Two fields and your email, no account needed. Questions or a first itemised quote within one business day."
        keywords="free sourcing quote, China sourcing request, itemised quote, sourcing from China"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Get a free quote", url: "https://equilinq.eu/start" },
        ]}
      />
      <PublicNavbar />

      <main>
        {/* Hero */}
        <section className="relative bg-card">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-32 sm:px-8 sm:pb-16 sm:pt-40">
            <p className="label-mono-up text-primary">Free quote</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              Tell us what you want to source.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-body-ink sm:text-lg">
              Two fields and your email. No account needed. You get questions or a first itemised quote within one
              business day.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-3xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28">
            <Reveal>
              <div className="rounded-2xl border border-accent/50 bg-card p-7 shadow-[var(--shadow-lift)] sm:p-10">
                {sent ? (
                  <div className="rounded-[0.75rem] border border-border bg-background p-8 text-center">
                    <BadgeCheck className="mx-auto mb-4 h-8 w-8 text-primary" />
                    <p className="text-base leading-relaxed text-body-ink">
                      Received. A named agent replies within one business day.
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Prefer to talk?{" "}
                      <a
                        href={CALENDLY}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary underline underline-offset-4"
                      >
                        Book a call
                      </a>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid gap-5">
                    <div className="grid gap-2">
                      <label htmlFor="start-product" className="label-mono-up text-muted-foreground">
                        What do you want to source?
                      </label>
                      <textarea
                        id="start-product"
                        placeholder="Product, material, any link or reference"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        maxLength={2000}
                        className="min-h-32 w-full resize-none rounded-[0.75rem] border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="start-units" className="label-mono-up text-muted-foreground">
                        Roughly how many units?
                      </label>
                      <Input
                        id="start-units"
                        placeholder="e.g. 300"
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                        maxLength={100}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="start-email" className="label-mono-up text-muted-foreground">
                        Your email
                      </label>
                      <Input
                        id="start-email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={255}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="start-company" className="label-mono-up text-muted-foreground">
                        Company or shop (optional)
                      </label>
                      <Input
                        id="start-company"
                        placeholder="Your company or shop"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        maxLength={120}
                        className={inputClass}
                      />
                    </div>
                    <Button type="submit" size="xl" variant="hero" className="btn-nudge w-full" disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Send my request <ArrowRight />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </Reveal>

            <div className="mt-8 grid gap-2">
              {reassurance.map((line) => (
                <p key={line} className="label-mono text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
