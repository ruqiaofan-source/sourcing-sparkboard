import { motion } from "framer-motion";

const orders = [
  { id: "ORD-2847", supplier: "Shenzhen Tech Co.", product: "PCB Assemblies", qty: "5,000 units", status: "In Transit", date: "Mar 28, 2026" },
  { id: "ORD-2846", supplier: "Mumbai Textiles Ltd.", product: "Cotton Fabric Rolls", qty: "2,400 yards", status: "Processing", date: "Mar 27, 2026" },
  { id: "ORD-2845", supplier: "Istanbul Metals", product: "Stainless Steel Sheets", qty: "800 kg", status: "Delivered", date: "Mar 25, 2026" },
  { id: "ORD-2844", supplier: "São Paulo Agri", product: "Organic Coffee Beans", qty: "12 tons", status: "In Transit", date: "Mar 24, 2026" },
  { id: "ORD-2843", supplier: "Hanoi Ceramics", product: "Porcelain Tiles", qty: "3,200 sqm", status: "Processing", date: "Mar 23, 2026" },
];

const statusStyles: Record<string, string> = {
  "In Transit": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Processing": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Delivered": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export function RecentOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
    >
      <h3 className="font-heading text-lg font-semibold text-card-foreground mb-1">Recent Orders</h3>
      <p className="text-sm text-muted-foreground mb-6">Latest sourcing orders across all suppliers</p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Order ID</th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Supplier</th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Product</th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Quantity</th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3 pr-4 text-sm font-medium text-primary">{order.id}</td>
                <td className="py-3 pr-4 text-sm text-card-foreground">{order.supplier}</td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">{order.product}</td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">{order.qty}</td>
                <td className="py-3 pr-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-sm text-muted-foreground">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
