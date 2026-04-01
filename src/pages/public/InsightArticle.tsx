import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function InsightArticle() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ["insight", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <PublicNavbar />
        <div className="pt-32 pb-24 px-4 flex justify-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <PublicNavbar />
        <div className="pt-32 pb-24 px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Article not found</h1>
          <Link to="/insights" className="text-primary hover:underline">Back to Insights</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={article.meta_title || `${article.title} - Equilinq Insights`}
        description={article.meta_description || article.excerpt}
      />

      {/* JSON-LD for article SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            image: article.cover_image_url,
            datePublished: article.published_at,
            author: { "@type": "Person", name: article.author_name || "Equilinq Team" },
            publisher: { "@type": "Organization", name: "Equilinq" },
          }),
        }}
      />

      <PublicNavbar />

      <article className="pt-32 pb-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "var(--glow-blue)" }} />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              to="/insights"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Insights
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-primary border border-primary/30 rounded-full px-2.5 py-0.5">
                {article.tag}
              </span>
              {article.published_at && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(article.published_at), "MMM d, yyyy")}
                </span>
              )}
              {article.author_name && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {article.author_name}
                </span>
              )}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {article.excerpt}
              </p>
            )}

            {article.cover_image_url && (
              <div className="rounded-2xl overflow-hidden mb-10 border border-border/30">
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {article.content && (
              <div className="prose prose-invert prose-lg max-w-none text-foreground/90 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            )}
          </motion.div>
        </div>
      </article>

      <PublicFooter />
    </div>
  );
}
