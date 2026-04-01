import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "The Global eCommerce Giants You've Probably Never Used",
    excerpt: "When people talk about the world's largest eCommerce platforms, the same names usually appear: Amazon, eBay, or Shopify. However, the Global eCommerce Outlook 2026 published by ECDB paints a very different picture. Several of the largest platforms in the world are not based in the West.",
    date: "Feb 27, 2026",
    tag: "Blog",
    image: "https://framerusercontent.com/images/mfGD3xxyD3pBZOCH0fmBY8wsKw.jpeg?width=1280&height=708",
    url: "https://equilinq.eu/insights/the-global-ecommerce-giants-you%E2%80%99ve-probably-never-used",
  },
  {
    title: "Germany's Largest Second-Hand Marketplace Introduces AI Search",
    excerpt: "Germany's largest classifieds and second-hand marketplace, Kleinanzeigen, recently introduced AI-powered search using ChatGPT. Instead of relying on traditional keywords, users can now describe what they are looking for in natural language.",
    date: "Feb 17, 2026",
    tag: "Blog",
    image: "https://framerusercontent.com/images/Ookguc8yejFLpR4ndHuSUkh1ag.jpeg?width=1800&height=1012",
    url: "https://equilinq.eu/insights/germany%E2%80%99s-largest-second-hand-marketplace-introduces-ai-search-%E2%80%94-a-new-era-for-online-product-discovery",
  },
  {
    title: "Amazon's 2026 Return Rule: Faster Refunds, Higher Risk for Sellers",
    excerpt: "Amazon is introducing major changes to its returns and refund process in 2026. The new policy focuses on faster refunds and a more streamlined buyer experience, but increases financial and operational risks for sellers.",
    date: "Feb 10, 2026",
    tag: "Blog",
    image: "https://framerusercontent.com/images/M3G247KjmZn2u9oGjXDOW7zqOk.jpg?width=949&height=360",
    url: "https://equilinq.eu/insights/amazon-2026-return-rule-risks-for-sellers",
  },
  {
    title: "OEM Manufacturing: How to Avoid the 3 Biggest Mistakes New E-commerce Brands Make",
    excerpt: "Launching an OEM product can be a powerful way to build a brand, but sourcing mistakes during manufacturing can quickly turn a promising idea into a costly failure. Decisions made early in the sourcing process can have a major impact.",
    date: "Jan 4, 2026",
    tag: "Blog",
    image: "https://framerusercontent.com/images/z8Fol40VXmlLsewPoh2gmkKTvo.jpg?width=1500&height=1001",
    url: "https://equilinq.eu/insights/oem-manufacturing-how-to-avoid-the-3-biggest-mistakes-new-e-commerce-brands-make",
  },
];

export default function Insights() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Insights - Equilinq Sourcing Trends & Market Reports" description="Best-selling products, pricing trends, and supplier signals from China. Actionable sourcing insights for European SMEs." />
      <PublicNavbar />

      <section className="pt-32 pb-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "var(--glow-blue)" }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
              Blog Posts
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground">
              Latest News & Insights
            </h1>
          </motion.div>

          <div className="space-y-6">
            {blogPosts.map((post, i) => (
              <motion.a
                key={i}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group block rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 aspect-video md:aspect-auto">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium text-primary border border-primary/30 rounded-full px-2.5 py-0.5">
                        {post.tag}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all gap-1">
                      Read more
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
