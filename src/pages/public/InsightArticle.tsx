import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { ArrowLeft, Calendar, User, Clock, Tag, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { ArticleStructuredData } from "@/components/insight/ArticleStructuredData";
import { ArticleHero } from "@/components/insight/ArticleHero";
import { ArticleBody } from "@/components/insight/ArticleBody";
import { RelatedArticles } from "@/components/insight/RelatedArticles";

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}

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

  const { data: relatedArticles = [] } = useQuery({
    queryKey: ["related-insights", article?.tag, article?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights")
        .select("id, title, slug, tag, excerpt, published_at, cover_image_url")
        .eq("published", true)
        .eq("tag", article!.tag)
        .neq("id", article!.id)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!article?.tag && !!article?.id,
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

  const readTime = estimateReadTime(article.content || "");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={article.meta_title || `${article.title} - Equilinq Insights`}
        description={article.meta_description || article.excerpt}
        ogImage={article.cover_image_url || undefined}
        ogType="article"
        keywords={`${article.tag}, China sourcing, European SME, ${article.title.split(' ').slice(0, 3).join(', ')}`}
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Insights", url: "https://equilinq.eu/insights" },
          { name: article.title, url: `https://equilinq.eu/insights/${article.slug}` },
        ]}
      />

      <ArticleStructuredData article={article} />

      <PublicNavbar />

      <ArticleHero article={article} readTime={readTime} />

      <ArticleBody content={article.content} />

      <RelatedArticles articles={relatedArticles} />

      <PublicFooter />
    </div>
  );
}
