import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Reveal } from "@/components/Reveal";

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
    <section className="relative bg-background">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="label-mono-up text-primary">Related insights</p>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {articles.map((post, i) => (
            <Reveal key={post.id} delay={i * 60}>
              <Link
                to={`/insights/${post.slug}`}
                className="card-hover block h-full rounded-2xl border border-border bg-card p-7 hover:border-accent/50"
              >
                {post.cover_image_url && (
                  <div className="overflow-hidden rounded-[0.75rem] border border-border bg-background">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <p className="label-mono-up mt-5 text-muted-foreground">
                  {post.tag}
                  {post.published_at ? ` · ${format(new Date(post.published_at), "MMM d, yyyy")}` : ""}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-primary">{post.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
