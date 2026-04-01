import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  index: number;
}

export function KpiCard({ title, value, change, changeType, icon: Icon, index }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-heading text-2xl font-bold text-card-foreground">{value}</h3>
        <p className={`text-xs font-medium ${
          changeType === "positive" ? "text-emerald-400" :
          changeType === "negative" ? "text-destructive" :
          "text-muted-foreground"
        }`}>
          {change}
        </p>
      </div>
    </motion.div>
  );
}
