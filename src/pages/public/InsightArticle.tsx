import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

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

  // Fetch related articles
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
      />

      {/* JSON-LD Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.meta_description || article.excerpt,
            image: article.cover_image_url || undefined,
            datePublished: article.published_at,
            dateModified: article.updated_at,
            url: `https://equilinq.eu/insights/${article.slug}`,
            author: {
              "@type": "Organization",
              name: article.author_name || "Equilinq",
              url: "https://equilinq.eu",
            },
            publisher: {
              "@type": "Organization",
              name: "Equilinq",
              url: "https://equilinq.eu",
              logo: {
                "@type": "ImageObject",
                url: "https://equilinq.eu/favicon.ico",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://equilinq.eu/insights/${article.slug}`,
            },
            articleSection: article.tag,
            wordCount: article.content?.split(/\s+/).length || 0,
          }),
        }}
      />

      {/* BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://equilinq.eu/" },
              { "@type": "ListItem", position: 2, name: "Insights", item: "https://equilinq.eu/insights" },
              { "@type": "ListItem", position: 3, name: article.title, item: `https://equilinq.eu/insights/${article.slug}` },
            ],
          }),
        }}
      />

      <PublicNavbar />

      <article className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "var(--glow-blue)" }} />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <li><Link to="/insights" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"><ArrowLeft className="h-4 w-4" /> Insights</Link></li>
                <li className="text-muted-foreground/40">/</li>
                <li className="text-foreground/60 truncate max-w-[200px]">{article.title}</li>
              </ol>
            </nav>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-xs font-medium text-primary border border-primary/30 rounded-full px-2.5 py-0.5 inline-flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {article.tag}
              </span>
              {article.published_at && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={article.published_at}>
                    {format(new Date(article.published_at), "MMMM d, yyyy")}
                  </time>
                </span>
              )}
              {article.author_name && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {article.author_name}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {readTime} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-2 border-primary/30 pl-4">
                {article.excerpt}
              </p>
            )}

            {/* Cover image */}
            {article.cover_image_url && (
              <div className="rounded-2xl overflow-hidden mb-10 border border-border/30">
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Article content rendered as markdown */}
            {article.content && (
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 className="font-heading text-2xl font-bold text-foreground mt-10 mb-4">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-heading text-xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-foreground/85 leading-relaxed mb-4">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-2 mb-6 ml-1">{children}</ul>
                    ),
                    li: ({ children }) => (
                      <li className="text-foreground/85 leading-relaxed flex items-start gap-2">
                        <span className="text-primary mt-2 shrink-0">•</span>
                        <span>{children}</span>
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-foreground font-semibold">{children}</strong>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-primary/40 pl-4 my-6 text-muted-foreground italic">{children}</blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>
            )}
          </motion.div>
        </div>
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="pb-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-xl font-bold text-foreground mb-6">Related Insights</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedArticles.map((post) => (
                <Link
                  key={post.id}
                  to={`/insights/${post.slug}`}
                  className="group block rounded-xl border border-border/30 bg-card/30 overflow-hidden hover:border-primary/30 transition-all"
                >
                  {post.cover_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-[10px] text-primary uppercase tracking-wider font-medium">{post.tag}</span>
                    <h3 className="font-heading text-sm font-semibold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.published_at && (
                      <p className="text-[11px] text-muted-foreground mt-2">
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PublicFooter />
    </div>
  );
}
