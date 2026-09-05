import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";
import { ArticleStructuredData } from "@/components/insight/ArticleStructuredData";
import { ArticleHero } from "@/components/insight/ArticleHero";
import { ArticleBody } from "@/components/insight/ArticleBody";
import { RelatedArticles } from "@/components/insight/RelatedArticles";
import { RelatedServiceLinks } from "@/components/insight/RelatedServiceLinks";

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
        <div className="flex justify-center px-5 pb-24 pt-40">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <PublicNavbar />
        <div className="mx-auto max-w-3xl px-5 pb-24 pt-40 text-center sm:px-8">
          <p className="label-mono-up text-primary">Not found</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-primary sm:text-5xl">Article not found</h1>
          <Button asChild size="xl" variant="hero" className="btn-nudge mt-9">
            <Link to="/insights">
              Back to insights <ArrowRight />
            </Link>
          </Button>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const readTime = estimateReadTime(article.content || "");

  // Strip leading heading that duplicates the hero title
  const cleanedContent = (article.content || "").replace(/^\s*#{1,3}\s+.+\n+/, "");

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

      <article>
        <ArticleHero article={article} readTime={readTime} />
        <ArticleBody content={cleanedContent} />
        <RelatedServiceLinks tag={article.tag} />
      </article>

      <RelatedArticles articles={relatedArticles} />

      {/* Closing band */}
      <section data-dark-band className="relative overflow-hidden bg-band text-white">
        <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <Reveal>
            <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to source your next product?</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">
              Tell us what you need and we will come back with verified factories and an itemized quote.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" variant="hero" className="btn-nudge card-hover bg-white bg-none text-primary hover:bg-white">
                <Link to="/start">
                  Get a free quote <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="onDark">
                <Link to="/insights">Back to insights</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
