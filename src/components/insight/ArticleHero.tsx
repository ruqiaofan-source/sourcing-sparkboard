import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface ArticleHeroProps {
  article: {
    title: string;
    excerpt?: string | null;
    tag: string;
    published_at?: string | null;
    author_name?: string | null;
    cover_image_url?: string | null;
  };
  readTime: number;
}

export function ArticleHero({ article, readTime }: ArticleHeroProps) {
  const meta = [
    article.published_at ? format(new Date(article.published_at), "MMMM d, yyyy") : null,
    article.author_name || null,
    `${readTime} min read`,
  ].filter(Boolean) as string[];

  return (
    <section className="relative bg-card">
      <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-32 sm:px-8 sm:pt-40">
        <nav aria-label="Breadcrumb">
          <Link
            to="/insights"
            className="label-mono-up inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Insights
          </Link>
        </nav>

        <p className="label-mono-up mt-8 text-primary">{article.tag}</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
          {article.title}
        </h1>
        <p className="label-mono-up mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground">
          {meta.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-border" />}
              {item}
            </span>
          ))}
        </p>

        {article.excerpt && (
          <p className="mt-8 border-t border-border pt-8 text-lg leading-relaxed text-body-ink">{article.excerpt}</p>
        )}

        {article.cover_image_url && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-background">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="aspect-[16/8] w-full object-cover"
              loading="eager"
            />
          </div>
        )}
      </div>
    </section>
  );
}
