import { motion } from "framer-motion";
import { TrendingUp, Globe, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

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

export default function LandingInsights() {
  return (
    <section className="py-28 px-4 relative">
      <AnimatedGlow />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            <Link to="/insights" className="hover:text-primary transition-colors">
              Stay Ahead of What's Selling
            </Link>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Check our insights page. We track best-selling products, pricing trends, and supplier signals across China, and publish clear, practical insights you can actually act on.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: TrendingUp, title: "Best-Selling SKUs", desc: "We publish regularly updated breakdowns of top-performing products by category, including SKUs, pricing ranges, and demand signals." },
            { icon: Globe, title: "Market Trend Reports", desc: "Our blog tracks shifts in consumer demand, seasonality, and sourcing trends, helping you decide what to source and when." },
            { icon: FileText, title: "Supplier & Cost Insights", desc: "We analyze supplier pricing, MOQ changes, and production signals, so you understand the real costs behind trending products." },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/20 transition-all"
            >
              <motion.div whileHover={{ rotate: -5, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                <item.icon className="h-7 w-7 text-primary mb-3" strokeWidth={1.5} />
              </motion.div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-1.5">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          {["Verified Market Signals", "China-Based Research", "Actionable Reports"].map((badge, i) => (
            <motion.span
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-xs font-medium text-primary border border-primary/30 rounded-full px-3 py-1 bg-primary/5"
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
