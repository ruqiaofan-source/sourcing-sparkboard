import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Flame, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const categoryEmoji: Record<string, string> = {
  "Electronics": "🔌",
  "Fashion": "👗",
  "Beauty": "💄",
  "Home": "🏠",
  "Health": "💪",
  "Sports": "⚽",
  "Toys": "🧸",
  "Pet": "🐾",
  "Kitchen": "🍳",
  "General": "📦",
};

function getEmoji(category: string) {
  for (const [key, emoji] of Object.entries(categoryEmoji)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return emoji;
  }
  return "📦";
}

function TrendBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : score >= 5
      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${color}`}>
      <Flame className="h-3 w-3" />
      {score}/10
    </span>
  );
}

export default function LandingTrending() {
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  const { data: products = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["trending-products-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trending_products")
        .select("*")
        .eq("is_active", true)
        .order("trend_score", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
    enabled: revealed,
  });

  const handleDiscover = async () => {
    setRevealed(true);
    // If no cached products, trigger the scrape
    if (products.length === 0) {
      try {
        const res = await supabase.functions.invoke("fetch-trending-products");
        if (res.error) console.error("Scrape error:", res.error);
        refetch();
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      }
    }
  };

  const handleSourceProduct = (productName: string) => {
    // Navigate to signup with product name as state
    navigate("/auth", { state: { prefillProduct: productName } });
  };

  return (
    <section className="py-20 sm:py-28 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4"
          >
            <TrendingUp className="h-4 w-4" />
            Product Discovery
          </motion.span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Not sure what to sell?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Discover this month's top 10 best-selling products across TikTok Shop and major
            webshops. We find the trends, you source them through us.
          </p>
        </motion.div>

        {/* CTA button or product grid */}
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  onClick={handleDiscover}
                  className="rounded-full px-10 h-14 text-base font-semibold gap-3 bg-gradient-to-r from-primary to-[hsl(var(--chart-2))] hover:opacity-90 text-white shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.4)]"
                >
                  <Sparkles className="h-5 w-5" />
                  Show Me Trending Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {(isLoading || isFetching) && products.length === 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-6 w-6 text-primary" />
                    </motion.div>
                    <p className="text-muted-foreground text-sm">
                      Scanning TikTok Shop, Amazon, and more for this month's hottest products...
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-52 rounded-xl" />
                    ))}
                  </div>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {products.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 cursor-pointer transition-all duration-300 hover:border-primary/30 hover:shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.2)]"
                        onClick={() => handleSourceProduct(product.name)}
                      >
                        {/* Rank + Trend */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-heading font-bold text-primary/40">
                            #{i + 1}
                          </span>
                          <TrendBadge score={product.trend_score} />
                        </div>

                        {/* Emoji + Category */}
                        <div className="text-3xl mb-2">{getEmoji(product.category)}</div>

                        {/* Name */}
                        <h3 className="font-heading font-semibold text-card-foreground text-sm leading-tight mb-1 line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Source */}
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                          {product.source}
                        </p>

                        {/* Price */}
                        <p className="text-xs text-primary font-medium mb-2">
                          {product.price_range}
                        </p>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {product.description}
                        </p>

                        {/* CTA */}
                        <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Source this product
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-10"
                  >
                    <p className="text-muted-foreground text-sm mb-4">
                      Found something you like? Sign up and we handle sourcing, quality control,
                      and shipping for you.
                    </p>
                    <Link to="/auth">
                      <Button
                        size="lg"
                        className="rounded-full px-8 h-12 text-base font-semibold"
                      >
                        Start Sourcing Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No trending products available right now. Check back soon!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}