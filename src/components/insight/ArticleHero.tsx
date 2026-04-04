import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";
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
  return (
    <section className="relative pt-24 sm:pt-28">
      {/* Full-bleed cover image */}
      {article.cover_image_url && (
        <div className="relative w-full max-h-[520px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background z-10" />
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-[520px] object-cover"
            loading="eager"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-20" style={{ marginTop: article.cover_image_url ? "-6rem" : "2rem" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link to="/insights" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Insights
                </Link>
              </li>
              <li className="text-muted-foreground/40">/</li>
              <li className="text-foreground/60 truncate max-w-[200px]">{article.title}</li>
            </ol>
          </nav>

          {/* Tag pill */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            <Tag className="h-3 w-3" />
            {article.tag}
          </span>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.15] mb-5">
            {article.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/40">
            {article.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={article.published_at}>
                  {format(new Date(article.published_at), "MMMM d, yyyy")}
                </time>
              </span>
            )}
            {article.author_name && (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {article.author_name}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readTime} min read
            </span>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light mb-8">
              {article.excerpt}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
