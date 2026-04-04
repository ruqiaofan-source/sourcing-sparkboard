import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface ArticleBodyProps {
  content?: string | null;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  if (!content) return null;

  return (
    <article className="px-4 sm:px-6 pb-16">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-heading prose-headings:text-foreground prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:sm:text-[1.65rem] prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/30
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-foreground/80 prose-p:leading-[1.8] prose-p:mb-5
          prose-li:text-foreground/80 prose-li:leading-[1.8]
          prose-strong:text-foreground prose-strong:font-semibold
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-2 prose-blockquote:border-primary/40 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-blockquote:font-light
          prose-ul:my-6 prose-ol:my-6
        ">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2>{children}</h2>
              ),
              h3: ({ children }) => (
                <h3>{children}</h3>
              ),
              p: ({ children }) => (
                <p>{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-2 list-none pl-0">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-3 pl-0">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-[0.65rem] shrink-0" />
                  <span>{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="bg-muted/30 rounded-r-lg py-4 pr-4">{children}</blockquote>
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
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
