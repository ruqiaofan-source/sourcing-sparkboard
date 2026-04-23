import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import PageGlow from "@/components/PageGlow";

export default function Demo() {
  // Inject a prefetch link for the video so the browser starts downloading ASAP
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = "/videos/area-demo.mp4";
    link.type = "video/mp4";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Platform Demo - See Equilinq in Action"
        description="Watch a full walkthrough of the Equilinq sourcing platform. See how European SMEs source products from China with transparent pricing and quality control."
        keywords="Equilinq demo, sourcing platform demo, China sourcing walkthrough, product sourcing video"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Demo", url: "https://equilinq.eu/demo" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "Equilinq Platform Demo - Sourcing from China for European SMEs",
            description: "A complete walkthrough of the Equilinq sourcing platform showing how European SMEs can source products from China with transparent pricing, multi-stage quality control, and end-to-end logistics.",
            thumbnailUrl: "https://equilinq.eu/og-image.jpg",
            uploadDate: "2026-04-14T00:00:00+02:00",
            contentUrl: "https://equilinq.eu/videos/area-demo.mp4",
            embedUrl: "https://equilinq.eu/demo",
            duration: "PT1M",
            publisher: {
              "@type": "Organization",
              name: "Equilinq",
              url: "https://equilinq.eu",
              logo: { "@type": "ImageObject", url: "https://equilinq.eu/equilinq-logo.png" },
            },
          }),
        }}
      />
      <PublicNavbar />
      <PageGlow />

      <section className="pt-32 pb-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
            See Equilinq{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(239 100% 65%), hsl(280 80% 72%), hsl(239 100% 65%))" }}
            >
              in Action
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            Watch how European SMEs use Equilinq to source products from China with transparent pricing, quality control, and end-to-end logistics management.
          </p>
        </motion.div>
      </section>

      {/* Main video - primary content */}
      <section className="pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-black/30">
            <video
              src="/videos/area-demo.mp4"
              controls
              autoPlay
              muted
              playsInline
              preload="auto"
              poster="/og-image.jpg"
              className="w-full h-auto block"
            >
              <track kind="captions" />
            </video>
          </div>
        </motion.div>
      </section>

      {/* Key highlights */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">What You Will See</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Submit a Request", desc: "How to submit a product sourcing request in under 2 minutes" },
              { title: "Receive Quotes", desc: "Fully itemized quotes with transparent cost breakdown" },
              { title: "Track Orders", desc: "Real-time order tracking and production updates" },
              { title: "Quality Reports", desc: "Multi-stage QC with photo and video documentation" },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-border/40 bg-card/30 p-5 text-center"
              >
                <h3 className="font-heading text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-4 text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">Create your free account and submit your first sourcing request today.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/auth?signup=true">
            <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-base">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
