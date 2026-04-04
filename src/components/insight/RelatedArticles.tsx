import { Link } from "react-router-dom";
import { format } from "date-fns";

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  published_at: string | null;
  cover_image_url: string | null;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-border/30 bg-muted/20 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-xl font-bold text-foreground mb-8">Related Insights</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {articles.map((post) => (
            <Link
              key={post.id}
              to={`/insights/${post.slug}`}
              className="group block rounded-xl border border-border/30 bg-card/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              {post.cover_image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-4">
                <span className="text-[10px] text-primary uppercase tracking-wider font-semibold">{post.tag}</span>
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
  );
}
