import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface ArticleBodyProps {
  content?: string | null;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  if (!content) return null;

  return (
    <article className="px-6 sm:px-8 pb-20">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="article-content">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="font-heading text-[1.55rem] sm:text-[1.7rem] font-bold text-foreground tracking-tight mt-14 mb-5 first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground tracking-tight mt-10 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[1.05rem] text-foreground/80 leading-[1.85] mb-6">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-3 my-7 pl-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-3 my-7 pl-1 list-decimal list-inside">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-[1.05rem] text-foreground/80 leading-[1.8] flex items-start gap-3">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-[0.7rem] shrink-0" />
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="text-foreground font-semibold">{children}</strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-[3px] border-primary/30 pl-6 my-8 py-1">
                  <div className="text-[1.05rem] text-muted-foreground leading-[1.8] italic">
                    {children}
                  </div>
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              hr: () => (
                <hr className="my-10 border-border/30" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </motion.div>
    </article>
  );
}
