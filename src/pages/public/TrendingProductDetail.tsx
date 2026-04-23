import { motion } from "framer-motion";
import {
  TrendingUp, Flame, ArrowLeft, ArrowRight, Users, DollarSign,
  Factory, BarChart3, ShoppingBag, Calendar, Target, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { SEOHead } from "@/components/SEOHead";

const categoryEmoji: Record<string, string> = {
  Electronics: "🔌", Fashion: "👗", Beauty: "💄", Home: "🏠",
  Health: "💪", Sports: "⚽", Toys: "🧸", Pet: "🐾", Kitchen: "🍳", General: "📦",
};

function getEmoji(category: string) {
  for (const [key, emoji] of Object.entries(categoryEmoji)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return emoji;
  }
  return "📦";
}

function CompetitionBadge({ level }: { level: string }) {
  const color =
    level === "High"
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : level === "Medium"
      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
      {level}
    </span>
  );
}

function InsightCard({
  icon: Icon, title, children, delay = 0,
}: {
  icon: React.ElementType; title: string; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-heading font-semibold text-card-foreground text-base">{title}</h3>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </motion.div>
  );
}

export default function TrendingProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["trending-product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trending_products")
        .select("*")
        .eq("slug", slug!)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: allProducts = [] } = useQuery({
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

  const analysis = (product as any)?.detailed_analysis as {
    why_trending?: string;
    target_audience?: string;
    profit_potential?: string;
    sourcing_tip?: string;
    competition_level?: string;
    recommended_platforms?: string[];
    estimated_moq?: string;
    seasonality?: string;
  } | null;

  const currentIndex = allProducts.findIndex((p: any) => p.slug === slug);
  const otherProducts = allProducts.filter((p: any) => p.slug !== slug).slice(0, 4);

  if (isLoading) {
    return (
      <>
        <PublicNavbar />
        <main className="min-h-screen bg-background pt-28 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          </div>
        </main>
        <PublicFooter />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <PublicNavbar />
        <main className="min-h-screen bg-background pt-28 px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Product not found</h1>
          <Link to="/trending">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to trending
            </Button>
          </Link>
        </main>
        <PublicFooter />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={`${product.name} - Trending Product Analysis | Equilinq`}
        description={product.description || `In-depth sourcing analysis for ${product.name}. Discover why it's trending and how to source it.`}
      />
      <PublicNavbar />
      <main className="min-h-screen bg-background">
        {/* Hero section */}
        <section className="relative pt-28 pb-12 px-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute w-[600px] h-[600px] rounded-full top-0 right-0"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.10) 0%, transparent 70%)" }}
            />
          </div>
          <div className="max-w-4xl mx-auto relative z-10">
            <Link
              to="/trending"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all trending products
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {currentIndex >= 0 && (
                  <span className="text-4xl font-heading font-bold text-primary/30">
                    #{currentIndex + 1}
                  </span>
                )}
                <span className="text-5xl">{getEmoji(product.category)}</span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                  product.trend_score >= 8
                    ? "bg-red-500/15 text-red-400 border-red-500/30"
                    : product.trend_score >= 5
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                }`}>
                  <Flame className="h-3.5 w-3.5" />
                  Trend Score: {product.trend_score}/10
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="uppercase tracking-wider text-xs">{product.source}</span>
                <span className="text-border">|</span>
                <span>{product.category}</span>
                <span className="text-border">|</span>
                <span className="text-primary font-semibold">{product.price_range}</span>
              </div>

              <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
                {product.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Analysis Grid */}
        {analysis && Object.keys(analysis).length > 0 ? (
          <section className="pb-16 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-6"
              >
                Product Analysis
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {analysis.why_trending && (
                  <InsightCard icon={TrendingUp} title="Why It's Trending" delay={0.1}>
                    {analysis.why_trending}
                  </InsightCard>
                )}

                {analysis.target_audience && (
                  <InsightCard icon={Users} title="Target Audience" delay={0.15}>
                    {analysis.target_audience}
                  </InsightCard>
                )}

                {analysis.profit_potential && (
                  <InsightCard icon={DollarSign} title="Profit Potential" delay={0.2}>
                    {analysis.profit_potential}
                  </InsightCard>
                )}

                {analysis.sourcing_tip && (
                  <InsightCard icon={Factory} title="Sourcing Tips" delay={0.25}>
                    {analysis.sourcing_tip}
                  </InsightCard>
                )}

                {analysis.competition_level && (
                  <InsightCard icon={BarChart3} title="Competition Level" delay={0.3}>
                    <div className="flex items-center gap-3 mb-2">
                      <CompetitionBadge level={analysis.competition_level.split(" ")[0] || analysis.competition_level} />
                    </div>
                    {analysis.competition_level.includes(" ") && (
                      <p className="mt-1">{analysis.competition_level}</p>
                    )}
                  </InsightCard>
                )}

                {analysis.seasonality && (
                  <InsightCard icon={Calendar} title="Seasonality" delay={0.35}>
                    {analysis.seasonality}
                  </InsightCard>
                )}

                {analysis.estimated_moq && (
                  <InsightCard icon={Layers} title="Estimated MOQ" delay={0.4}>
                    <span className="text-foreground font-semibold text-lg">{analysis.estimated_moq}</span>
                    <p className="mt-1">Typical minimum order quantity for this product category when sourcing from China.</p>
                  </InsightCard>
                )}

                {analysis.recommended_platforms && analysis.recommended_platforms.length > 0 && (
                  <InsightCard icon={ShoppingBag} title="Best Sales Channels" delay={0.45}>
                    <div className="flex flex-wrap gap-2">
                      {analysis.recommended_platforms.map((platform) => (
                        <span
                          key={platform}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-border/50 bg-muted/50 text-foreground"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </InsightCard>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {/* CTA */}
        <section className="pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 sm:p-10 text-center"
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Want to source {product.name}?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-lg mx-auto">
                We connect you with verified Chinese factories, handle quality control,
                and ship directly to your warehouse. No middlemen, full transparency.
              </p>
              <Link to="/auth" state={{ prefillProduct: product.name }}>
                <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold">
                  Start Sourcing This Product
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Other trending products */}
        {otherProducts.length > 0 && (
          <section className="pb-24 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-6">
                Other trending products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {otherProducts.map((p: any, i: number) => (
                  <Link key={p.id} to={`/trending/${p.slug || p.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 cursor-pointer hover:border-primary/30 transition-all"
                    >
                      <div className="text-2xl mb-2">{getEmoji(p.category)}</div>
                      <h3 className="font-heading font-semibold text-card-foreground text-xs leading-tight line-clamp-2 mb-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-primary font-medium">{p.price_range}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <PublicFooter />
    </>
  );
}