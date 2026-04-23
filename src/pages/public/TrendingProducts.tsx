import { motion, useInView } from "framer-motion";
import { TrendingUp, Flame, ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { SEOHead } from "@/components/SEOHead";
import { useRef } from "react";

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
import PageGlow from "@/components/PageGlow";

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
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : score >= 5
      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${color}`}>
      <Flame className="h-3 w-3" />
      {score}/10
    </span>
  );
}

function RankMedal({ rank, large }: { rank: number; large?: boolean }) {
  if (rank === 1) return <span className={large ? "text-4xl" : "text-2xl"}>🥇</span>;
  if (rank === 2) return <span className={large ? "text-4xl" : "text-2xl"}>🥈</span>;
  if (rank === 3) return <span className={large ? "text-4xl" : "text-2xl"}>🥉</span>;
  return (
    <span className="text-xl font-heading font-bold text-muted-foreground/50">
      #{rank}
    </span>
  );
}

export default function TrendingProducts() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-50px" });

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

  const topThree = products.slice(0, 3);
  const remaining = products.slice(3);

  return (
    <>
      <SEOHead
        title="Top 10 Trending Products to Source | Equilinq"
        description="Discover this month's hottest products across TikTok Shop, Amazon, and major webshops. Free market intelligence for European sellers."
      />
      <PublicNavbar />
      <PageGlow />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-4 overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-primary mb-5">
                <TrendingUp className="h-4 w-4" />
                Updated Weekly
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Top 10 <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(239 100% 65%), hsl(280 80% 72%), hsl(239 100% 65%))" }}>Trending Products</span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                We scan TikTok Shop, Amazon, and major webshops every week to surface the
                hottest products you can source through us.
              </p>
              {lastUpdated && (
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 border border-border/50 rounded-full px-5 py-2.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Last updated: {lastUpdated}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Product Cards */}
        <section className="pb-24 px-4" ref={gridRef}>
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[400px] rounded-2xl" />
                  ))}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i + 3} className="h-72 rounded-xl" />
                  ))}
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-12">
                {/* Featured Top 3 */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                      Top Picks
                    </span>
                    <div className="flex-1 h-px bg-border/40 ml-3" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {topThree.map((product, i) => {
                      const slug = (product as any).slug || product.id;
                      return (
                        <Link key={product.id} to={`/trending/${slug}`}>
                          <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={gridInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
                            whileHover={{ y: -6 }}
                            className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.2)] h-full flex flex-col"
                          >
                            {/* Image */}
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted/20">
                              <img
                                src={slugImageMap[slug] || product.image_url || "/placeholder.svg"}
                                alt={product.name}
                                loading={i === 0 ? "eager" : "lazy"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                              <div className="absolute top-3 left-3">
                                <RankMedal rank={i + 1} large />
                              </div>
                              <div className="absolute top-3 right-3">
                                <TrendBadge score={product.trend_score} />
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-grow">
                              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 font-medium">
                                {product.source} &middot; {product.category}
                              </span>
                              <h2 className="font-heading font-semibold text-card-foreground text-base leading-snug mb-2 line-clamp-2">
                                {product.name}
                              </h2>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-grow">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-primary">{product.price_range}</span>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  Details <ArrowRight className="h-3 w-3" />
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Remaining 4-10 */}
                {remaining.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                        Also Trending
                      </span>
                      <div className="flex-1 h-px bg-border/40 ml-3" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {remaining.map((product, i) => {
                        const slug = (product as any).slug || product.id;
                        const rank = i + 4;
                        return (
                          <Link key={product.id} to={`/trending/${slug}`}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={gridInView ? { opacity: 1, y: 0 } : {}}
                              transition={{ delay: 0.35 + i * 0.06, duration: 0.4 }}
                              whileHover={{ y: -4 }}
                              className="group rounded-xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_36px_-8px_hsl(var(--primary)/0.15)] h-full flex flex-col"
                            >
                              <div className="relative w-full aspect-square overflow-hidden bg-muted/20">
                                <img
                                  src={slugImageMap[slug] || product.image_url || "/placeholder.svg"}
                                  alt={product.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                                <div className="absolute top-2.5 left-2.5">
                                  <RankMedal rank={rank} />
                                </div>
                                <div className="absolute top-2.5 right-2.5">
                                  <TrendBadge score={product.trend_score} />
                                </div>
                              </div>
                              <div className="p-4 flex flex-col flex-grow">
                                <span className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1 font-medium">
                                  {product.source}
                                </span>
                                <h2 className="font-heading font-semibold text-card-foreground text-sm leading-tight mb-1.5 line-clamp-2 flex-grow">
                                  {product.name}
                                </h2>
                                <div className="flex items-center justify-between mt-auto pt-2">
                                  <span className="text-sm font-bold text-primary">{product.price_range}</span>
                                  <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
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