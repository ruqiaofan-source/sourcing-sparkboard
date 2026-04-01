import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const suppliers = [
  { name: "Shenzhen Tech", rating: 95, orders: 48 },
  { name: "Mumbai Textiles", rating: 88, orders: 32 },
  { name: "Istanbul Metals", rating: 92, orders: 27 },
  { name: "São Paulo Agri", rating: 85, orders: 21 },
  { name: "Hanoi Ceramics", rating: 90, orders: 18 },
];

export function SupplierPerformance() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
    >
      <h3 className="font-heading text-lg font-semibold text-card-foreground mb-1">Supplier Performance</h3>
      <p className="text-sm text-muted-foreground mb-6">Reliability scores by supplier</p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={suppliers} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 14%)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="hsl(240, 5%, 55%)" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="hsl(240, 5%, 55%)" fontSize={12} width={110} />
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
            <Bar dataKey="rating" fill="hsl(239, 84%, 67%)" radius={[0, 6, 6, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
