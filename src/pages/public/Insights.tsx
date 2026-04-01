import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

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
      <SEOHead title="Insights - Equilinq Sourcing Trends & Market Reports" description="Best-selling products, pricing trends, and supplier signals from China. Actionable sourcing insights for European SMEs." />
      <PublicNavbar />

      <section className="pt-32 pb-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "var(--glow-blue)" }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
              Blog Posts
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground">
              Latest News & Insights
            </h1>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link
                    to={`/insights/${post.slug}`}
                    className="group block rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/5 aspect-video md:aspect-auto">
                        {post.cover_image_url && (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
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
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
