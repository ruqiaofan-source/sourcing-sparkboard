import { motion } from "framer-motion";

export default function PageGlow() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.14) 0%, hsl(var(--primary) / 0.06) 40%, transparent 70%)",
          top: "-20%", right: "-15%",
        }}
        animate={{ x: [0, 40, -25, 0], y: [0, -30, 25, 0], scale: [1, 1.04, 0.96, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--chart-2) / 0.07) 0%, hsl(var(--primary) / 0.04) 45%, transparent 70%)",
          bottom: "-10%", left: "-8%",
        }}
        animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0], scale: [1, 0.96, 1.04, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, transparent 20%, hsl(var(--primary) / 0.05) 45%, hsl(var(--chart-2) / 0.03) 55%, transparent 80%)" }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}