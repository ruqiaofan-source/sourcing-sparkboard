interface ArticleStructuredDataProps {
  article: {
    title: string;
    meta_description?: string | null;
    excerpt: string;
    cover_image_url?: string | null;
    published_at?: string | null;
    updated_at: string;
    slug: string;
    author_name?: string | null;
    tag: string;
    content?: string | null;
  };
}

export function ArticleStructuredData({ article }: ArticleStructuredDataProps) {
  return (
    <>
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
              logo: { "@type": "ImageObject", url: "https://equilinq.eu/favicon.ico" },
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
    </>
  );
}
