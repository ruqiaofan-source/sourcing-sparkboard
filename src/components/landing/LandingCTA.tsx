import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function RevealHeading({ children, className = "" }: { children: string; className?: string }) {
  const words = children.split(" ");
  return (
    <h2 className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

function AnimatedGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.16) 0%, hsl(var(--primary) / 0.07) 42%, transparent 72%)",
          top: "-25%", right: "-15%",
        }}
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.05, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ x: springX, y: springY }} whileTap={{ scale: 0.97 }} className={className}>
      {children}
    </motion.div>
  );
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
