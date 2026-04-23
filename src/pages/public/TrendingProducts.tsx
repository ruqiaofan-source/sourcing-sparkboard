import { motion } from "framer-motion";
import { TrendingUp, Flame, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { SEOHead } from "@/components/SEOHead";

import imgLabubu from "@/assets/trending/labubu-vinyl-toys.jpg";
import imgWalkingPad from "@/assets/trending/walking-pad-treadmill.jpg";
import imgPetToys from "@/assets/trending/smart-pet-toys.jpg";
import imgLipStains from "@/assets/trending/viral-lip-stains.jpg";
import imgDadJeans from "@/assets/trending/stretchy-dad-jeans.jpg";
import imgBlender from "@/assets/trending/portable-mini-blender.jpg";
import imgPhoneCharms from "@/assets/trending/y2k-phone-charms.jpg";
import imgFoodStorage from "@/assets/trending/food-storage-containers.jpg";
import imgSiliconeBags from "@/assets/trending/silicone-food-bags.jpg";
import imgMassageGun from "@/assets/trending/mini-massage-gun.jpg";

const slugImageMap: Record<string, string> = {
  "labubu-style-vinyl-toys": imgLabubu,
  "walking-pad-under-desk-treadmill": imgWalkingPad,
  "smart-pet-toys": imgPetToys,
  "viral-lip-stains": imgLipStains,
  "stretchy-soft-dad-jeans": imgDadJeans,
  "portable-usb-mini-blender": imgBlender,
  "y2k-phone-charms": imgPhoneCharms,
  "stackable-food-storage-containers": imgFoodStorage,
  "reusable-silicone-food-bags": imgSiliconeBags,
  "mini-massage-gun": imgMassageGun,
};

function TrendBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : score >= 5
      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
      <Flame className="h-3 w-3" />
      {score}/10
    </span>
  );
}

export default function TrendingProducts() {
  const { data: products = [], isLoading } = useQuery({
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
  });

  const lastUpdated = products[0]?.scraped_at
    ? new Date(products[0].scraped_at).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <>
      <SEOHead
        title="Top 10 Trending Products to Source | Equilinq"
        description="Discover this month's hottest products across TikTok Shop, Amazon, and major webshops. Free market intelligence for European sellers."
      />
      <PublicNavbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute w-[800px] h-[800px] rounded-full top-0 left-1/2 -translate-x-1/2"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)" }}
            />
          </div>
          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">
                <TrendingUp className="h-4 w-4" />
                Updated Weekly
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5">
                Top 10 <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(260 80% 68%))" }}>Trending Products</span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-6">
                We scan TikTok Shop, Amazon, and major webshops every week to find the hottest
                products you can source through us. Click any product for a full breakdown.
              </p>
              {lastUpdated && (
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-full px-4 py-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Last updated: {lastUpdated}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="pb-24 px-4">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {products.map((product, i) => {
                  const slug = (product as any).slug || product.id;
                  return (
                    <Link key={product.id} to={`/trending/${slug}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                        whileHover={{ y: -8, scale: 1.03 }}
                        className="group rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-[0_16px_48px_-12px_hsl(var(--primary)/0.25)] h-full flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl font-heading font-bold text-primary/30">
                            #{i + 1}
                          </span>
                          <TrendBadge score={product.trend_score} />
                        </div>

                        <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-muted/30">
                          <img
                            src={slugImageMap[slug] || product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <h2 className="font-heading font-semibold text-card-foreground text-sm leading-tight mb-1.5 line-clamp-2 flex-grow">
                          {product.name}
                        </h2>

                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                          {product.source}
                        </p>

                        <p className="text-sm text-primary font-semibold mb-2">
                          {product.price_range}
                        </p>

                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                          {product.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                          View full breakdown
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                No trending products available right now. Check back soon!
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pb-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-10"
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Ready to source?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-lg mx-auto">
                Found a product you like? Sign up and we handle sourcing, quality control,
                and shipping for you. From idea to doorstep.
              </p>
              <Link to="/auth">
                <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold">
                  Start Sourcing Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}