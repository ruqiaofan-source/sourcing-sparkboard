import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const stockLabel: Record<string, string> = {
  "in_stock": "In Stock",
  "low_stock": "Low Stock",
  "made_to_order": "Made to Order",
};

const stockColor: Record<string, string> = {
  "in_stock": "text-emerald-400",
  "low_stock": "text-amber-400",
  "made_to_order": "text-blue-400",
};

const Products = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, suppliers(name)")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.suppliers as any)?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <DashboardLayout title="Products">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeCategory === c
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "bg-card text-muted-foreground border-border hover:border-primary/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <span className={`text-xs font-medium ${stockColor[product.stock_status]}`}>
                    {stockLabel[product.stock_status]}
                  </span>
                </div>

                <h3 className="font-heading font-semibold text-card-foreground text-sm mb-1">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground font-mono">{product.sku}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{product.category}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Unit Price</p>
                    <p className="text-sm font-medium text-card-foreground">{product.unit_price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">MOQ</p>
                    <p className="text-sm font-medium text-card-foreground">{product.moq}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lead Time</p>
                    <p className="text-sm font-medium text-card-foreground">{product.lead_time_days} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Supplier</p>
                    <p className="text-sm font-medium text-primary truncate">{(product.suppliers as any)?.name || "-"}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No products found.</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
