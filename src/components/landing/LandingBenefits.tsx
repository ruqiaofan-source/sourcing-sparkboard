import { motion } from "framer-motion";
import { DollarSign, ShieldCheck, Truck, Palette, BarChart3, Users } from "lucide-react";

const benefits = [
  { icon: DollarSign, title: "We Source It Cheaper", desc: "Direct from vetted Chinese factories at lowest prices." },
  { icon: ShieldCheck, title: "Quality Guaranteed", desc: "Factory check, warehouse QC, insured shipping." },
  { icon: Truck, title: "Deliver Anywhere", desc: "Competitive rates to 200+ countries, eco-friendly options." },
  { icon: Palette, title: "Own Your Brand", desc: "Private labels, custom packaging, 35+ branding options." },
  { icon: BarChart3, title: "Full Visibility", desc: "Real-time updates on every order, every step." },
  { icon: Users, title: "Human Agents", desc: "Real people, not AI, handling your orders." },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

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

export default function LandingBenefits() {
  return (
    <section id="benefits" className="py-28 px-4 relative">
      <AnimatedGlow />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block"
          >
            Benefits
          </motion.span>
          <RevealHeading className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">Why Choose Us?</RevealHeading>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Source. Brand. QC and Logistics. Everything You Need.</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              className="group rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/20 hover:bg-card/60 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
              >
                <b.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </motion.div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-1.5">{b.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
