import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Insights() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["insights-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Insights - Equilinq Sourcing Trends & Market Reports"
        description="Best-selling products, pricing trends, and supplier signals from China. Actionable sourcing insights for European SMEs."
        keywords="China sourcing trends, market reports, best selling products China, supplier insights, European SME sourcing"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Insights", url: "https://equilinq.eu/insights" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Insights - Equilinq Sourcing Trends & Market Reports",
            url: "https://equilinq.eu/insights",
            description: "Best-selling products, pricing trends, and supplier signals from China. Actionable sourcing insights for European SMEs.",
            isPartOf: { "@type": "WebSite", name: "Equilinq", url: "https://equilinq.eu" },
            ...(posts.length > 0 ? {
              mainEntity: {
                "@type": "ItemList",
                itemListElement: posts.slice(0, 10).map((post, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `https://equilinq.eu/insights/${post.slug}`,
                  name: post.title,
                })),
              },
            } : {}),
          }),
        }}
      />
      <PublicNavbar />

      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
              top: "-10%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 250 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6"
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Blog Posts</span>
            </motion.div>

            <motion.h1
              className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-5"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Latest News &{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(260 80% 68%))",
                }}
              >
                Insights
              </span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Sourcing trends, market reports, and actionable guides for European SMEs importing from China.
            </motion.p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="space-y-6"
            >
              {posts.map((post, i) => (
                <motion.div key={post.id} variants={fadeUp}>
                  <Link
                    to={`/insights/${post.slug}`}
                    className="group block rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-300"
                  >
                    <motion.div
                      className="flex flex-col md:flex-row"
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="md:w-2/5 aspect-video md:aspect-auto overflow-hidden bg-gradient-to-br from-primary/10 via-secondary to-primary/5">
                        {post.cover_image_url ? (
                          <motion.img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                          />
                        ) : (
                          <div className="w-full h-full min-h-[180px] flex items-center justify-center">
                            <span className="text-4xl font-heading font-bold text-primary/10">{post.tag}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-medium text-primary border border-primary/30 rounded-full px-2.5 py-0.5">
                            {post.tag}
                          </span>
                          {post.published_at && (
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(post.published_at), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                        <h2 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                        <span className="inline-flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all gap-1">
                          Read more
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Cross-links */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { to: "/how-it-works", title: "How It Works", desc: "See our 8-step sourcing process" },
              { to: "/pricing", title: "Pricing", desc: "Transparent, itemized pricing" },
              { to: "/customization", title: "Customization", desc: "35+ branding and packaging options" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="group block p-5 rounded-xl border border-border/30 bg-card/20 hover:border-primary/30 hover:bg-card/40 transition-all">
                <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
