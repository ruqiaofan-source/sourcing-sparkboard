import { motion } from "framer-motion";
import founderImg from "@/assets/founder.jpg";

function FloatingParticles() {
  return null;
}

export default function LandingFounder() {
  return (
    <section className="py-12 px-4 relative">
      <FloatingParticles />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-3 block">Founder's Note</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden max-w-3xl mx-auto"
        >
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
          <motion.div className="shrink-0" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <img
              src={founderImg}
              alt="Ruqiao Fan, Founder and CEO of Equilinq sourcing platform"
              width={126}
              height={189}
              className="w-24 h-32 sm:w-28 sm:h-40 rounded-2xl object-cover border border-border/40"
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
              className="text-base sm:text-lg text-foreground leading-relaxed font-heading font-medium italic"
            >
              "We built Equilinq because European SMEs deserve the same China sourcing access that big corporations have -- without the risk, complexity, or hidden fees."
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
