import { motion } from "framer-motion";
import founderImg from "@/assets/founder.jpg";

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3) * 2}px`,
            height: `${2 + (i % 3) * 2}px`,
            left: `${5 + i * 12}%`,
            top: `${10 + (i % 5) * 18}%`,
            background: i % 2 === 0 ? "hsl(var(--primary) / 0.4)" : "hsl(var(--chart-2) / 0.3)",
          }}
          animate={{ y: [0, -(30 + i * 5), 0], opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </div>
  );
}

export default function LandingFounder() {
  return (
    <section className="py-28 px-4 relative">
      <FloatingParticles />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3 block">Founder's Note</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
          <motion.div className="shrink-0" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <img
              src={founderImg}
              alt="Founder"
              width={126}
              height={189}
              className="w-32 h-44 rounded-2xl object-cover border border-border/40"
              loading="lazy"
            />
            <a href="https://www.linkedin.com/in/ruqiao-fan-05379137a/" target="_blank" rel="noopener noreferrer" className="block text-center mt-3 text-xs text-muted-foreground font-medium hover:text-primary transition-colors">
              Founder & CEO ↗
            </a>
          </motion.div>
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-lg sm:text-xl text-foreground leading-relaxed font-heading font-medium italic"
            >
              "Why spend your time chasing factories, managing miscommunication, and fixing avoidable issues, when we can handle it for you?"
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
