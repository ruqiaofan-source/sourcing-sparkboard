import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import founderImg from "@/assets/founder.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="About Equilinq - Our Story & Mission"
        description="Learn about Equilinq's mission to give European SMEs the same China sourcing access that big corporations have."
      />
      <PublicNavbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4 block">About Us</span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Sourcing, <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(260 80% 68%))" }}>Simplified</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We built Equilinq because European SMEs deserve the same China sourcing access that big corporations have.
            </p>
          </motion.div>

          {/* Founder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 mb-16"
          >
            <div className="shrink-0 text-center">
              <img
                src={founderImg}
                alt="Ruqiao Fan, Founder and CEO of Equilinq"
                width={160}
                height={200}
                className="w-40 h-52 rounded-2xl object-cover border border-border/40 mx-auto"
              />
              <p className="mt-3 font-heading font-semibold text-foreground">Ruqiao Fan</p>
              <p className="text-sm text-muted-foreground">Founder & CEO</p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Founder's Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Having seen firsthand how large corporations leverage their networks to source from China at scale, Ruqiao recognized a gap: small and medium businesses across Europe were left navigating opaque supply chains, unreliable middlemen, and hidden costs.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Equilinq was founded to change that. Incorporated with one of Tencent's co-founders and backed by StarIT Group's supply chain infrastructure in Shenzhen, we provide SMEs with enterprise-grade sourcing without the enterprise complexity.
              </p>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          >
            <div className="rounded-2xl border border-border/40 bg-card/40 p-8">
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become the default sourcing infrastructure for European SMEs, replacing fragmented supplier relationships with a structured, transparent, and scalable system.
              </p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/40 p-8">
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">How We Work</h3>
              <p className="text-muted-foreground leading-relaxed">
                We operate across Europe and China with a two-pillar model: client relations in Europe, sourcing execution in China. One platform, full transparency, real people.
              </p>
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            A cross-cultural team spanning Amsterdam, Hong Kong, and Shenzhen — combining European business understanding with deep China supply chain expertise.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { role: "Sourcing", count: "3 agents" },
                { role: "QC", count: "2 inspectors" },
                { role: "Logistics", count: "2 coordinators" },
                { role: "Client Success", count: "2 managers" },
              ].map((t) => (
                <div key={t.role} className="rounded-xl border border-border/40 bg-card/30 p-4">
                  <p className="font-heading font-semibold text-foreground">{t.role}</p>
                  <p className="text-sm text-muted-foreground">{t.count}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link to="/auth?signup=true">
              <Button className="rounded-full px-8 h-12">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}