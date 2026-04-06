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
              h1: ({ children }) => (
                <h2 className="font-heading text-[1.55rem] sm:text-[1.7rem] font-bold text-foreground tracking-tight mt-14 mb-5 first:mt-0">
                  {children}
                </h2>
              ),
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
              h4: ({ children }) => (
                <h4 className="font-heading text-base sm:text-lg font-semibold text-foreground tracking-tight mt-8 mb-3">
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className="font-sans text-[1.05rem] text-foreground/80 leading-[1.85] mb-6">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-3 my-7 pl-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-4 my-7 pl-1 list-none">{children}</ol>
              ),
              li: ({ children, node }) => {
                // Check if this is inside an ordered list by looking at the parent
                const isOrdered = node?.position ? false : false;
                // We detect ordered lists by checking if the content starts with a number pattern
                const childText = typeof children === 'string' ? children : '';
                
                return (
                  <li className="font-sans text-[1.05rem] text-foreground/80 leading-[1.8] flex items-start gap-3">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-[0.7rem] shrink-0" />
                    <span>{children}</span>
                  </li>
                );
              },
              strong: ({ children }) => (
                <strong className="text-foreground font-semibold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-foreground/70 italic">{children}</em>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-[3px] border-primary/30 pl-6 my-8 py-1">
                  <div className="font-sans text-[1.05rem] text-muted-foreground leading-[1.8] italic">
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
              table: ({ children }) => (
                <div className="my-7 overflow-x-auto rounded-lg border border-border/30">
                  <table className="w-full text-[1.05rem]">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted/50 font-heading text-foreground">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left font-semibold text-sm">{children}</th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-foreground/80 border-t border-border/20">{children}</td>
              ),
              code: ({ children, className }) => {
                if (className) {
                  return (
                    <pre className="my-7 p-4 bg-muted/50 rounded-lg overflow-x-auto">
                      <code className="font-mono text-sm text-foreground/90">{children}</code>
                    </pre>
                  );
                }
                return (
                  <code className="font-mono text-sm bg-muted/50 px-1.5 py-0.5 rounded text-foreground/90">
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </motion.div>
    </article>
  );
}
