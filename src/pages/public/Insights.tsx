import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

const related = [
  { to: "/how-it-works", label: "Process", title: "How it works", desc: "See our 8-step sourcing process." },
  { to: "/pricing", label: "Pricing", title: "Transparent pricing", desc: "Itemized pricing, no hidden markups." },
  { to: "/customization", label: "Customization", title: "Build it your way", desc: "Branding and packaging options." },
];

export default function Insights() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["insights-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="China Sourcing Insights for EU Brands | Equilinq"
        description="Best-selling products, pricing trends, and supplier signals from China. Actionable sourcing insights for European SMEs."
        keywords="China sourcing trends, market reports, best selling products China, supplier insights, European SME sourcing"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Insights", url: "https://equilinq.eu/insights" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Insights - Equilinq Sourcing Trends & Market Reports",
            url: "https://equilinq.eu/insights",
            description: "Best-selling products, pricing trends, and supplier signals from China. Actionable sourcing insights for European SMEs.",
            isPartOf: { "@type": "WebSite", name: "Equilinq", url: "https://equilinq.eu" },
            ...(posts.length > 0 ? {
              mainEntity: {
                "@type": "ItemList",
                itemListElement: posts.slice(0, 10).map((post, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `https://equilinq.eu/insights/${post.slug}`,
                  name: post.title,
                })),
              },
            } : {}),
          }),
        }}
      />
      <PublicNavbar />

      <main>
        {/* Inner hero */}
        <section className="relative bg-card">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
            <p className="label-mono-up text-primary">Blog posts</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              Latest news and insights
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink sm:text-lg">
              Sourcing trends, market reports, and actionable guides for European SMEs importing from China.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal key={post.id} delay={(i % 3) * 60}>
                    <Link
                      to={`/insights/${post.slug}`}
                      className="btn-nudge card-hover group flex h-full flex-col rounded-2xl border border-border bg-card p-7 hover:border-accent/50"
                    >
                      <div className="overflow-hidden rounded-[0.75rem] border border-border bg-background">
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            loading="lazy"
                            className="aspect-video w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-video w-full items-center justify-center">
                            <span className="label-mono-up text-muted-foreground">{post.tag}</span>
                          </div>
                        )}
                      </div>
                      <p className="label-mono-up mt-5 text-muted-foreground">
                        {post.tag}
                        {post.published_at ? ` · ${format(new Date(post.published_at), "MMM d, yyyy")}` : ""}
                      </p>
                      <h2 className="mt-3 text-xl font-semibold text-primary">{post.title}</h2>
                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-body-ink">{post.excerpt}</p>
                      <span className="label-mono-up mt-6 inline-flex items-center gap-2 text-primary">
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Related */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label-mono-up text-primary">Keep reading</p>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((link, i) => (
                <Reveal key={link.to} delay={i * 60}>
                  <Link
                    to={link.to}
                    className="card-hover block h-full rounded-2xl border border-border bg-background p-7 hover:border-accent/50"
                  >
                    <span className="label-mono-up text-muted-foreground">{link.label}</span>
                    <h3 className="mt-3 text-xl font-semibold text-primary">{link.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-body-ink">{link.desc}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
