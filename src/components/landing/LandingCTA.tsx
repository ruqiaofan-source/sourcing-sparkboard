import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function RevealHeading({ children, className = "" }: { children: string; className?: string }) {
  return <h2 className={className}>{children}</h2>;
}

function AnimatedGlow() {
  return null;
}

function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export default function LandingCTA() {
  return (
    <section className="py-18 px-4 relative">
      <AnimatedGlow />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <RevealHeading className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Ready to Source Smarter?</RevealHeading>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Join European SMEs already sourcing from China with full transparency, quality control, and dedicated human support.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth?signup=true">
            <MagneticButton>
              <Button size="sm" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-6 h-10 text-sm font-semibold shadow-[0_0_50px_-8px_hsl(239,100%,60%/0.5)] border border-primary/20">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </MagneticButton>
          </Link>
          <a href="https://calendly.com/admin-equilinq/30min" target="_blank" rel="noopener noreferrer">
            <MagneticButton>
              <Button variant="outline" size="sm" className="rounded-full bg-white text-background border-white/80 hover:bg-white/90 px-6 h-10 text-sm font-semibold">
                Book a Demo
              </Button>
            </MagneticButton>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
