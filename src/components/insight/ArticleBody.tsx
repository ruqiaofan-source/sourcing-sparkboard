import ReactMarkdown from "react-markdown";

interface ArticleBodyProps {
  content?: string | null;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  if (!content) return null;

  return (
    <div className="bg-card px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="article-content">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h2 className="mt-14 text-2xl font-bold tracking-tight text-primary first:mt-0 sm:text-3xl">
                  {children}
                </h2>
              ),
              h2: ({ children }) => (
                <h2 className="mt-14 text-2xl font-bold tracking-tight text-primary first:mt-0 sm:text-3xl">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-10 text-lg font-semibold tracking-tight text-foreground sm:text-xl">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="mt-8 text-base font-semibold tracking-tight text-foreground sm:text-lg">{children}</h4>
              ),
              p: ({ children }) => <p className="mt-5 text-base leading-relaxed text-body-ink">{children}</p>,
              ul: ({ children }) => <ul className="my-6 grid gap-3">{children}</ul>,
              ol: ({ children }) => <ol className="my-6 grid list-none gap-3">{children}</ol>,
              li: ({ children }) => (
                <li className="flex items-start gap-3 text-base leading-relaxed text-body-ink">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="italic text-body-ink">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="my-8 border-l-2 border-primary/40 pl-6 text-lg font-semibold leading-snug tracking-tight text-primary">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              hr: () => <hr className="my-10 border-border" />,
              table: ({ children }) => (
                <div className="my-8 overflow-x-auto rounded-[0.75rem] border border-border">
                  <table className="w-full text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-background">{children}</thead>,
              th: ({ children }) => (
                <th className="label-mono-up border-b border-border px-4 py-3 text-left text-muted-foreground">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border-t border-border px-4 py-3 align-top text-body-ink">{children}</td>
              ),
              code: ({ children, className }) => {
                if (className) {
                  return (
                    <pre className="my-7 overflow-x-auto rounded-[0.75rem] border border-border bg-background p-4">
                      <code className="font-mono text-sm text-foreground">{children}</code>
                    </pre>
                  );
                }
                return (
                  <code className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-sm text-foreground">
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
