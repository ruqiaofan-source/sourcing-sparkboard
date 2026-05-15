import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PageGlow from "@/components/PageGlow";
import {
  ArrowRight, Search, ShieldCheck, Truck, Package,
  CheckCircle2, AlertTriangle, Globe, DollarSign, FileText
} from "lucide-react";

const sections = [
  { id: "why-source-china", title: "1. Why Source from China?" },
  { id: "finding-suppliers", title: "2. Finding Reliable Suppliers" },
  { id: "verifying-factories", title: "3. Verifying Factories" },
  { id: "negotiating-pricing", title: "4. Negotiating Pricing and MOQs" },
  { id: "quality-control", title: "5. Quality Control" },
  { id: "customization", title: "6. Customization and Private Labeling" },
  { id: "shipping-logistics", title: "7. Shipping and Logistics" },
  { id: "customs-compliance", title: "8. Customs, Duties, and Compliance" },
  { id: "common-mistakes", title: "9. Common Mistakes to Avoid" },
  { id: "sourcing-agent", title: "10. Why Use a Sourcing Agent?" },
];

export default function SourcingGuide() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Sourcing from China: 2026 Guide for European SMEs"
        description="The definitive guide to sourcing products from China for European small businesses. Learn how to find verified suppliers, negotiate MOQs, manage quality control, and handle shipping to Europe."
        keywords="how to source from china, sourcing from china for small business, china sourcing agent europe, buy from china factory europe, china supplier verification, quality control china, china shipping europe, private label sourcing china, low MOQ china, sourcing guide europe"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "How to Source from China", url: "https://equilinq.eu/sourcing-guide" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "How to Source Products from China: Complete 2026 Guide for European SMEs",
            description: "The definitive guide to sourcing products from China for European small businesses.",
            author: { "@type": "Organization", name: "Equilinq", url: "https://equilinq.eu" },
            publisher: {
              "@type": "Organization",
              name: "Equilinq",
              logo: { "@type": "ImageObject", url: "https://equilinq.eu/equilinq-logo.png" },
            },
            datePublished: "2026-04-14T00:00:00+02:00",
            dateModified: "2026-04-14T00:00:00+02:00",
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://equilinq.eu/sourcing-guide" },
            image: "https://equilinq.eu/og-image.jpg",
          }),
        }}
      />
      <PublicNavbar />
      <PageGlow />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6 text-[11px] text-muted-foreground tracking-wide">
            <Globe className="h-3.5 w-3.5 text-primary" />
            Complete Guide - Updated April 2026
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            How to Source Products from China:{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(239 100% 65%), hsl(280 80% 72%), hsl(239 100% 65%))" }}
            >
              Complete Guide for European SMEs
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Everything you need to know about sourcing from China as a European small business — from finding verified suppliers to managing quality control and shipping.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-8">
            <span>By Equilinq Team</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>20 min read</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>April 2026</span>
          </div>
        </motion.div>
      </section>

      {/* Table of Contents */}
      <section className="pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-border/40 bg-card/30 p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Table of Contents
            </h2>
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">

          {/* Section 1 */}
          <section id="why-source-china">
            <h2 className="text-2xl font-bold mt-12 mb-4">1. Why Source from China?</h2>
            <p>
              China remains the world's largest manufacturing hub, producing over 28% of global manufacturing output. For European SMEs, sourcing from China offers several compelling advantages:
            </p>
            <ul className="space-y-2 my-4">
              <li><strong>Cost efficiency:</strong> Manufacturing costs in China are typically 30-50% lower than in Europe, even after accounting for shipping and import duties.</li>
              <li><strong>Scale and variety:</strong> China's manufacturing ecosystem covers virtually every product category, from electronics to textiles, with thousands of specialized factories.</li>
              <li><strong>Customization capability:</strong> Chinese factories are experienced in OEM/ODM production, making private labeling and product modifications straightforward.</li>
              <li><strong>Low MOQ flexibility:</strong> Many factories, especially those on platforms like 1688.com, accept orders as low as 10-150 units, perfect for SMEs testing new products.</li>
            </ul>
            <p>
              However, sourcing from China also comes with real challenges: language barriers, quality inconsistency, intellectual property risks, and complex logistics. This guide addresses each of these systematically.
            </p>
          </section>

          {/* Section 2 */}
          <section id="finding-suppliers">
            <h2 className="text-2xl font-bold mt-12 mb-4">2. Finding Reliable Suppliers</h2>
            <p>
              The first step is identifying potential suppliers. European SMEs typically use three main channels:
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Online Platforms</h3>
            <ul className="space-y-2 my-4">
              <li><strong>Alibaba.com:</strong> The largest B2B marketplace, with millions of suppliers. Best for initial discovery, but requires careful verification since many listings are from trading companies, not direct factories.</li>
              <li><strong>1688.com:</strong> China's domestic wholesale platform. Prices are significantly lower (often 20-40% cheaper than Alibaba) because it targets Chinese buyers. The interface is entirely in Chinese, so you will need a sourcing agent to navigate it.</li>
              <li><strong>Made-in-China.com:</strong> A smaller alternative to Alibaba with a more curated supplier base.</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3">Trade Fairs</h3>
            <p>
              The Canton Fair (Guangzhou, held biannually) is the world's largest trade exhibition. Attending in person allows you to inspect samples, compare suppliers face-to-face, and negotiate directly. Other notable fairs include the Yiwu Commodities Fair and Hong Kong Electronics Fair.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Sourcing Agents</h3>
            <p>
              A professional sourcing agent in China can leverage their existing supplier network, conduct factory visits, and handle negotiations in Mandarin. This is often the most efficient route for SMEs without China sourcing experience. <Link to="/how-it-works" className="text-primary hover:underline">Learn how Equilinq's sourcing process works</Link>.
            </p>
          </section>

          {/* Section 3 */}
          <section id="verifying-factories">
            <h2 className="text-2xl font-bold mt-12 mb-4">3. Verifying Factories</h2>
            <p>
              One of the biggest risks in China sourcing is working with unverified suppliers. A "factory" on Alibaba might actually be a trading company that marks up prices by 15-30%. Here's how to verify:
            </p>
            <ul className="space-y-2 my-4">
              <li><strong>Business license check:</strong> Request the factory's business license (yingye zhizhao) and verify it against China's National Enterprise Credit Information Publicity System.</li>
              <li><strong>Factory audit:</strong> Conduct an on-site inspection or hire a third-party auditor. Check production lines, worker conditions, quality management systems, and actual capacity.</li>
              <li><strong>Reference orders:</strong> Ask for references from European clients. A legitimate factory will have export experience and can provide container photos, inspection reports, and shipping documentation.</li>
              <li><strong>Sample orders:</strong> Always order samples before committing to a production run. Compare the sample quality to the factory's claims and your specifications.</li>
              <li><strong>Certification check:</strong> Verify ISO, CE, REACH, and other certifications relevant to your product category and the EU market.</li>
            </ul>
            <p>
              <Link to="/quality-control" className="text-primary hover:underline">Equilinq's quality control service</Link> includes factory verification as part of every sourcing engagement, eliminating this risk for our clients.
            </p>
          </section>

          {/* Section 4 */}
          <section id="negotiating-pricing">
            <h2 className="text-2xl font-bold mt-12 mb-4">4. Negotiating Pricing and MOQs</h2>
            <p>
              Pricing negotiation with Chinese suppliers follows different conventions than in Europe. Understanding these dynamics is key to getting the best deal:
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Understanding Cost Components</h3>
            <p>
              A typical factory quote includes: raw materials, labor, factory overhead, packaging, and profit margin. Ask for a cost breakdown (chengben mingxi) to understand where each euro goes. This makes negotiation more transparent and targeted.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">MOQ Negotiation</h3>
            <p>
              Most factories set MOQs based on production efficiency, not arbitrary rules. Strategies to lower MOQs:
            </p>
            <ul className="space-y-2 my-4">
              <li>Accept standard colors/materials instead of custom options</li>
              <li>Offer to pay a slightly higher per-unit price for smaller batches</li>
              <li>Commit to a long-term relationship with projected annual volumes</li>
              <li>Use a sourcing agent who can combine orders from multiple buyers</li>
            </ul>
            <p>
              At Equilinq, we routinely negotiate MOQs as low as 10 units by leveraging our factory relationships and order consolidation capabilities. <Link to="/pricing" className="text-primary hover:underline">See our transparent pricing structure</Link>.
            </p>
          </section>

          {/* Section 5 */}
          <section id="quality-control">
            <h2 className="text-2xl font-bold mt-12 mb-4">5. Quality Control</h2>
            <p>
              Quality control is arguably the most critical part of sourcing from China. Without a structured QC process, even reputable factories can deliver subpar products. A comprehensive QC system includes three stages:
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Pre-Production Inspection</h3>
            <p>
              Before production begins, verify that raw materials meet specifications. Check material thickness, color accuracy, component quality, and compliance with EU standards (CE marking, REACH, RoHS).
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">During Production Inspection (DUPRO)</h3>
            <p>
              When 20-30% of production is complete, conduct an in-line inspection. This catches defects early before the full batch is produced, saving time and money.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Final Inspection (Pre-Shipment)</h3>
            <p>
              The most important inspection. Using the AQL (Acceptable Quality Level) standard, inspectors randomly sample finished products and check against your specifications. A typical AQL 2.5 inspection means a 2.5% defect tolerance.
            </p>
            <p>
              <Link to="/quality-control" className="text-primary hover:underline">Learn about Equilinq's multi-stage quality control process</Link>, which includes photo and video documentation for every inspection.
            </p>
          </section>

          {/* Section 6 */}
          <section id="customization">
            <h2 className="text-2xl font-bold mt-12 mb-4">6. Customization and Private Labeling</h2>
            <p>
              One of the biggest advantages of sourcing from China is the ability to customize products for your brand. Options include:
            </p>
            <ul className="space-y-2 my-4">
              <li><strong>Private labeling:</strong> Adding your brand name, logo, and packaging to existing products. This is the simplest form of customization and typically requires MOQs of 100-500 units.</li>
              <li><strong>OEM (Original Equipment Manufacturing):</strong> Modifying an existing product design to meet your specifications. This might include changing materials, dimensions, colors, or features.</li>
              <li><strong>ODM (Original Design Manufacturing):</strong> Having the factory design and manufacture a product based on your concept. This is ideal for unique product ideas but requires higher MOQs and longer lead times.</li>
              <li><strong>Custom packaging:</strong> Designing branded boxes, inserts, labels, and instruction manuals. This significantly impacts perceived product value and retail positioning.</li>
            </ul>
            <p>
              <Link to="/customization" className="text-primary hover:underline">Explore 35+ customization options</Link> available through Equilinq, from simple logo placement to full product development.
            </p>
          </section>

          {/* Section 7 */}
          <section id="shipping-logistics">
            <h2 className="text-2xl font-bold mt-12 mb-4">7. Shipping and Logistics</h2>
            <p>
              Getting products from a Chinese factory to your European warehouse involves several steps and options:
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Shipping Methods</h3>
            <ul className="space-y-2 my-4">
              <li><strong>Sea freight (LCL/FCL):</strong> The most cost-effective for large or heavy orders. LCL (Less than Container Load) is ideal for SMEs; you share a container with other shippers. Transit time: 28-40 days to major European ports (Rotterdam, Hamburg, Antwerp). Cost: approximately $3-5 per kilogram.</li>
              <li><strong>Air freight:</strong> Fast (5-10 days) but expensive ($7-12 per kilogram). Best for lightweight, high-value goods or urgent orders.</li>
              <li><strong>Express courier (DHL, FedEx, UPS):</strong> Fastest option (3-7 days) with door-to-door delivery. Best for samples and small orders under 100kg.</li>
              <li><strong>Rail freight:</strong> A growing alternative via the China-Europe rail corridor. Transit time: 18-22 days, priced between sea and air freight.</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3">Incoterms</h3>
            <p>
              Understanding Incoterms is essential. The most common for China-Europe trade:
            </p>
            <ul className="space-y-2 my-4">
              <li><strong>FOB (Free on Board):</strong> The supplier covers costs until the goods are loaded onto the ship. You handle freight and insurance from that point. Most common for experienced importers.</li>
              <li><strong>CIF (Cost, Insurance, Freight):</strong> The supplier covers freight and insurance to the destination port. You handle customs clearance and inland delivery. Simpler for beginners but often more expensive.</li>
              <li><strong>DDP (Delivered Duty Paid):</strong> The supplier handles everything, including customs and duties. Most convenient but gives you the least control over logistics costs.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="customs-compliance">
            <h2 className="text-2xl font-bold mt-12 mb-4">8. Customs, Duties, and Compliance</h2>
            <p>
              Importing from China into the EU requires compliance with customs regulations and product standards:
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Import Duties and VAT</h3>
            <p>
              EU import duties vary by product category (HS code), typically ranging from 0-12%. On top of duties, you will pay import VAT (standard rate varies by country: 21% in the Netherlands, 19% in Germany, 20% in France). Use the EU's TARIC database to look up exact duty rates for your HS code.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Product Compliance</h3>
            <ul className="space-y-2 my-4">
              <li><strong>CE marking:</strong> Required for many product categories sold in the EU (electronics, toys, machinery, PPE). The manufacturer must ensure conformity with applicable EU directives.</li>
              <li><strong>REACH:</strong> EU regulation on chemicals. Products containing certain substances must be registered and restrictions apply.</li>
              <li><strong>RoHS:</strong> Restricts hazardous substances in electrical and electronic equipment.</li>
              <li><strong>Product safety:</strong> The EU General Product Safety Directive requires all consumer products to be safe. Documentation and testing may be required.</li>
            </ul>
            <p>
              Equilinq verifies compliance documentation as part of our sourcing process, ensuring your products meet EU import requirements before they leave China.
            </p>
          </section>

          {/* Section 9 */}
          <section id="common-mistakes">
            <h2 className="text-2xl font-bold mt-12 mb-4">9. Common Mistakes to Avoid</h2>
            <p>
              After facilitating hundreds of sourcing projects for European SMEs, these are the most frequent and costly mistakes we see:
            </p>
            <div className="space-y-4 my-6">
              {[
                { title: "Skipping sample orders", desc: "Never go straight to production without testing samples first. Even a 50-unit test order can save you from a 5,000-unit disaster." },
                { title: "Choosing the cheapest supplier", desc: "The lowest quote often means corners are being cut on materials or quality. Always compare quality at similar price points rather than choosing purely on cost." },
                { title: "No written specifications", desc: "Vague requirements lead to disputes. Create detailed product specifications with measurements, materials, colors (Pantone codes), packaging requirements, and quality standards." },
                { title: "Ignoring cultural differences", desc: "Chinese business culture values relationships (guanxi). Building rapport with your supplier leads to better service, priority production scheduling, and flexibility on MOQs." },
                { title: "Not planning for lead times", desc: "A typical order cycle is 4-8 weeks for production plus 4-6 weeks for shipping. Plan at least 3 months ahead, and add buffer for Chinese holidays (Chinese New Year, Golden Week)." },
                { title: "Skipping quality inspections", desc: "Relying on the factory's own quality checks is risky. Independent third-party inspection is essential for every production run." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">{item.title}:</strong>{" "}
                    <span className="text-muted-foreground">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 10 */}
          <section id="sourcing-agent">
            <h2 className="text-2xl font-bold mt-12 mb-4">10. Why Use a Sourcing Agent?</h2>
            <p>
              For European SMEs without a team on the ground in China, a professional sourcing agent provides:
            </p>
            <ul className="space-y-2 my-4">
              <li><strong>Local presence and language:</strong> Native Mandarin speakers who understand factory culture and can negotiate effectively on your behalf.</li>
              <li><strong>Verified supplier network:</strong> Pre-screened factories with proven track records, eliminating the trial-and-error of finding reliable suppliers.</li>
              <li><strong>Quality assurance:</strong> On-site quality inspections with photo and video documentation at every production stage.</li>
              <li><strong>Cost transparency:</strong> Full cost breakdowns showing factory cost, operational costs, logistics, and service fees — no hidden margins.</li>
              <li><strong>Risk mitigation:</strong> Experienced agents identify red flags before they become problems: factories overextending capacity, material substitution, and shipping delays.</li>
              <li><strong>Logistics coordination:</strong> Consolidated shipping, customs documentation, and delivery tracking managed end-to-end.</li>
            </ul>
            <p>
              Equilinq operates as a managed sourcing infrastructure for European SMEs, combining an experienced China-based team with a transparent digital platform. We handle supplier verification, negotiation, quality control, and logistics so you can focus on growing your business.
            </p>
          </section>

        </div>
      </article>

      {/* CTA */}
      <section className="pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ready to Start Sourcing?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create your free account and submit your first sourcing request. Our team will find verified suppliers and provide fully itemized quotes within days.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/auth?signup=true">
              <Button size="lg" className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="rounded-full border-border/60 px-8 h-12 text-base">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
