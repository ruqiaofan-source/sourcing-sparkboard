import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", orders: 42, revenue: 128000 },
  { month: "Feb", orders: 55, revenue: 156000 },
  { month: "Mar", orders: 48, revenue: 142000 },
  { month: "Apr", orders: 72, revenue: 198000 },
  { month: "May", orders: 65, revenue: 185000 },
  { month: "Jun", orders: 88, revenue: 242000 },
  { month: "Jul", orders: 95, revenue: 268000 },
];

export function OrdersChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
    >
      <h3 className="font-heading text-lg font-semibold text-card-foreground mb-1">Orders Overview</h3>
      <p className="text-sm text-muted-foreground mb-6">Monthly order volume & revenue trend</p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 14%)" />
            <XAxis dataKey="month" stroke="hsl(240, 5%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(240, 5%, 55%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(240, 6%, 6%)",
                border: "1px solid hsl(240, 6%, 14%)",
                borderRadius: "10px",
                color: "hsl(0, 0%, 95%)",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
              }}
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="hsl(239, 84%, 67%)"
              strokeWidth={2}
              fill="url(#orderGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
