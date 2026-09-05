import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Reveal } from "@/components/Reveal";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Tag, Package, Shirt, Camera, Box, Layers, Wrench, ClipboardCheck, Search, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { Input } from "@/components/ui/input";

const CALENDLY = "https://calendly.com/admin-equilinq/30min";


/* ──────── Service categories with items ──────── */

const categories = [
  {
    id: "brand-assets",
    icon: Tag,
    title: "Brand Assets",
    description: "Custom-made packaging materials to elevate your brand identity.",
    items: [
      { name: "Custom Packaging Bags", desc: "Personalized bags with your logo and design, from 200pcs" },
      { name: "Neck Labels / Woven Labels", desc: "Custom woven or printed labels for garments and products" },
      { name: "Hangtags", desc: "Branded swing tags with your logo, material info, and design" },
      { name: "Custom Stickers & Seals", desc: "Branded stickers for packaging, products, or parcels" },
      { name: "Custom Tissue Paper", desc: "Printed tissue paper for premium unboxing experience" },
      { name: "Custom Boxes & Inserts", desc: "Rigid or corrugated boxes with custom print and inserts" },
      { name: "Custom Mailer Bags", desc: "Poly mailers with your brand design and logo" },
      { name: "Custom Packaging Material OEM", desc: "Fully custom packaging solutions designed to your specs" },
    ],
  },
  {
    id: "branding-labeling",
    icon: Layers,
    title: "Branding & Labeling",
    description: "Add, remove, or replace labels, tags, and stickers on your products.",
    items: [
      { name: "Label Sewing", desc: "Sew custom woven or printed labels onto garments" },
      { name: "Label Removal", desc: "Remove original brand labels cleanly and professionally" },
      { name: "Tag Switching", desc: "Replace existing hangtags with your custom branded tags" },
      { name: "Tag Removal", desc: "Remove original hangtags from products" },
      { name: "Label Printing & Pasting", desc: "Print and apply adhesive labels to products or packaging" },
      { name: "Parcel Label Printing & Pasting", desc: "Apply shipping or brand labels to outer parcels" },
      { name: "Product Sticker Application", desc: "Apply custom stickers to product surfaces" },
      { name: "Logo Removal (No-Logo Zipper Bags)", desc: "Replace original branded packaging with unbranded alternatives" },
    ],
  },
  {
    id: "apparel-finishing",
    icon: Shirt,
    title: "Apparel Finishing",
    description: "Professional finishing touches for clothing and textile products.",
    items: [
      { name: "Thread Trimming", desc: "Remove loose threads for a clean, professional finish" },
      { name: "Garment Ironing", desc: "Steam pressing for wrinkle-free presentation" },
      { name: "Folding & Packing", desc: "Neatly fold and pack garments to retail standard" },
      { name: "Garment Reinforcement", desc: "Reinforce stitching and structure of clothing items" },
      { name: "Pocket Opening Service", desc: "Open sealed pockets on jackets, blazers, and trousers" },
      { name: "Button Hole Opening", desc: "Open sealed button holes on new garments" },
      { name: "Stain Cleaning", desc: "Professional spot cleaning and stain removal" },
      { name: "Size Measurement Service", desc: "Measure garment dimensions and verify against specs" },
    ],
  },
  {
    id: "product-packaging",
    icon: Package,
    title: "Product Packaging",
    description: "Protective and branded packaging for individual products.",
    items: [
      { name: "Pearl Cotton (EPE) Wrapping", desc: "Soft foam wrapping for fragile item protection" },
      { name: "Custom Pearl Cotton Packaging", desc: "Die-cut EPE foam inserts shaped to your product" },
      { name: "Dust-Proof Bag", desc: "Transparent dust bags for clean product storage" },
      { name: "Vacuum Bag (Product)", desc: "Vacuum-sealed packaging for compression and protection" },
      { name: "Zipper Bag Replacement", desc: "Swap existing bags with branded or unbranded zipper bags" },
      { name: "Bubble Column Packaging", desc: "Inflatable air column bags for shock absorption" },
      { name: "Shrink Wrap / Sealing", desc: "Heat-sealed plastic wrap for tamper-proof packaging" },
      { name: "Box Removal", desc: "Remove original retail boxes for rebranding or space saving" },
      { name: "Gift Paper Wrapping", desc: "Premium gift wrapping with decorative paper" },
    ],
  },
  {
    id: "parcel-reinforcement",
    icon: Box,
    title: "Parcel Reinforcement",
    description: "Strengthen and protect your parcels for international shipping.",
    items: [
      { name: "Bubble Mailer Protection", desc: "Extra bubble wrap layer around parcel contents" },
      { name: "Moisture-Proof Bag", desc: "Waterproof inner lining for humidity protection" },
      { name: "Vacuum Bag (Parcel)", desc: "Vacuum-sealed outer parcel for maximum compression" },
      { name: "Palletization", desc: "Secure palletizing for large or heavy shipments" },
      { name: "Stretch Film Wrapping", desc: "Industrial stretch film for pallet and box stability" },
      { name: "Air Column Fill", desc: "Air cushion filling for void space protection" },
      { name: "Foam Board Fill", desc: "Rigid foam inserts for fragile item isolation" },
      { name: "Paper Tube Fill", desc: "Rolled paper void fill for eco-friendly cushioning" },
      { name: "Full Tape Sealing", desc: "Complete tape seal on all parcel edges and seams" },
      { name: "Corner Protectors", desc: "Cardboard or foam corner guards for box edges" },
      { name: "Wooden Crate Reinforcement", desc: "Heavy-duty wooden crate for oversized or fragile cargo" },
      { name: "Packing List Printing", desc: "Printed packing slips included with each parcel" },
      { name: "Commercial Invoice Printing", desc: "Trade invoices printed and included for customs" },
    ],
  },
  {
    id: "photography-media",
    icon: Camera,
    title: "Photography & Media",
    description: "Professional product photography and video content services.",
    items: [
      { name: "Standard Product Photos", desc: "3-angle photos: front, back, and detail shots" },
      { name: "Detail / Close-Up Photos", desc: "High-resolution close-ups of textures and features" },
      { name: "Parcel Photography", desc: "Photos taken before shipping for verification" },
      { name: "Model Try-On Photos", desc: "Professional model wearing or using your product" },
      { name: "360-Degree Video", desc: "Full rotation video showcasing product from all angles" },
      { name: "International Model Photography", desc: "Professional model shoots for marketing and listings" },
      { name: "AI Image Processing", desc: "AI-powered image enhancement, text translation, watermark removal" },
    ],
  },
  {
    id: "quality-inspection",
    icon: ClipboardCheck,
    title: "Quality Inspection",
    description: "Multi-level quality control to ensure product standards before shipping.",
    items: [
      { name: "Standard Quality Inspection", desc: "Basic incoming goods check against specifications" },
      { name: "Detailed Quality Inspection", desc: "Thorough item-by-item examination with photo reports" },
      { name: "Electrical Product Testing", desc: "Power-on and function testing for 3C/electronic goods" },
      { name: "Pre-Production Sample Validation", desc: "Verify samples match approved specifications before mass production" },
      { name: "In-Process Monitoring", desc: "On-site checks during production to catch issues early" },
      { name: "Final Pre-Shipment Inspection", desc: "Comprehensive check before goods leave the factory" },
      { name: "Packaging Quality Check", desc: "Verify outer packaging integrity and labeling accuracy" },
    ],
  },
  {
    id: "oem-odm",
    icon: Wrench,
    title: "OEM / ODM",
    description: "Full custom manufacturing, from concept to finished product.",
    items: [
      { name: "OEM / ODM Custom Manufacturing", desc: "Design and produce products to your exact specifications" },
      { name: "Product Source Finding", desc: "Locate optimal suppliers based on product links, images, or descriptions" },
      { name: "Product Source Finding (Professional)", desc: "Deep multi-platform search across Chinese e-commerce platforms" },
      { name: "Product Creation & Listing", desc: "Create product listings from scratch based on your requirements" },
      { name: "Source Replacement", desc: "Find alternative suppliers when existing sources become unavailable" },
      { name: "Product Information Update (API)", desc: "Automated price and stock sync via API integration" },
      { name: "Product Binding", desc: "Bind product listings to verified supplier sources" },
      { name: "Inventory Update Service", desc: "Automatic stock level synchronization with supplier" },
      { name: "Custom Logistics Solution", desc: "Tailored shipping plans for special or oversized products" },
      { name: "Priority Processing", desc: "Fast-track handling for urgent international parcels" },
      { name: "Keycap Replacement", desc: "Specialized keyboard keycap swapping service" },
      { name: "Order Fulfillment Submission", desc: "Verify and submit corrected order details on your behalf" },
      { name: "Shipping Order Submission", desc: "Review and submit shipping documentation for dispatch" },
      { name: "Returns & After-Sales (Shipping)", desc: "Handle post-delivery returns and exchanges for shipped orders" },
      { name: "Returns & After-Sales (Purchasing)", desc: "Manage returns and refunds for purchased inventory" },
      { name: "Purchase Order Cancellation", desc: "Process cancellations for pending purchase orders" },
    ],
  },
];

const tabIds = categories.map((c) => c.id);

const related = [
  { to: "/how-it-works", label: "Process", title: "How it works", desc: "Our 8-step sourcing process." },
  { to: "/pricing", label: "Pricing", title: "Transparent pricing", desc: "Cost breakdown per order." },
  { to: "/contact", label: "Contact", title: "Talk to us", desc: "Discuss your customization needs." },
];

function ServiceCard({ item }: { item: { name: string; desc: string } }) {
  return (
    <div className="card-hover h-full rounded-2xl border border-border bg-card p-7">
      <h3 className="text-lg font-semibold text-primary">{item.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-body-ink">{item.desc}</p>
    </div>
  );
}

export default function Customization() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam && tabIds.includes(tabParam) ? tabParam : tabIds[0]);
  const [searchQuery, setSearchQuery] = useState("");
  

  const goToTab = (slug: string) => {
    setActiveTab(slug);
    setSearchQuery("");
    setSearchParams({ tab: slug }, { replace: true });
    document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  useEffect(() => {
    if (tabParam && tabIds.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const activeCategory = categories.find((c) => c.id === activeTab)!;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: { category: string; categoryId: string; items: { name: string; desc: string }[] }[] = [];
    for (const cat of categories) {
      const matched = cat.items.filter(
        (item) => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
      );
      if (matched.length > 0) {
        results.push({ category: cat.title, categoryId: cat.id, items: matched });
      }
    }
    return results;
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Customization Services - Equilinq Branding & Packaging"
        description="76+ customization options: private labels, custom packaging, quality inspection, OEM/ODM manufacturing. Build your brand with Equilinq."
        keywords="custom packaging China, private label manufacturing, OEM ODM China, branding services, product customization, quality inspection"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Customization", url: "https://equilinq.eu/customization" },
        ]}
        jsonLd={{
          "@type": "Service",
          name: "Customization Services - Equilinq",
          url: "https://equilinq.eu/customization",
          description: "76+ customization options including private labels, custom packaging, quality inspection, and OEM/ODM manufacturing.",
          provider: { "@type": "Organization", name: "Equilinq", url: "https://equilinq.eu" },
          areaServed: "Europe",
          serviceType: "Product Customization and Branding",
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What customization options does Equilinq offer?", acceptedAnswer: { "@type": "Answer", text: "Over 70 options across brand assets, branding and labeling, apparel finishing, product packaging, parcel reinforcement, photography and media, quality inspection, and full OEM/ODM manufacturing." } },
              { "@type": "Question", name: "Can I get custom packaging with low MOQs?", acceptedAnswer: { "@type": "Answer", text: "Yes. Custom branded boxes, inserts, hangtags, and polybags are available from MOQs as low as 100-500 units depending on print method and material." } },
              { "@type": "Question", name: "Do you handle private label and white label?", acceptedAnswer: { "@type": "Answer", text: "Yes. We manage logo placement, label sewing, custom prints, and branded packaging. Your products ship ready for retail or e-commerce under your own brand." } },
              { "@type": "Question", name: "How is customization pricing structured?", acceptedAnswer: { "@type": "Answer", text: "Each customization line item is quoted transparently with factory cost, materials, and a small handling fee. There are no hidden markups, you see the same breakdown we negotiate with the factory." } },
            ],
          }),
        }}
      />
      <PublicNavbar />

      <main>
        {/* Inner hero */}
        <section className="relative bg-card">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
            <p className="label-mono-up text-primary">Customization</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              Build it your way.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-ink sm:text-lg">
              Seventy-six finishing, branding, packaging and inspection services, applied at our warehouse before your order
              ships.
            </p>
          </div>
        </section>

        {/* Eight categories */}
        <section className="relative bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <Reveal>
              <p className="label-mono-up text-primary">Eight categories</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary sm:text-4xl">Pick what your order needs.</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <Reveal key={cat.id} delay={(i % 4) * 60}>
                    <button
                      type="button"
                      onClick={() => goToTab(cat.id)}
                      className="card-hover flex h-full w-full flex-col rounded-2xl border border-border bg-background p-7 text-left hover:border-accent/50"
                    >
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      <h3 className="mt-4 text-lg font-semibold text-primary">{cat.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-body-ink">{cat.description}</p>
                      <span className="label-mono mt-4 text-muted-foreground">{cat.items.length} services</span>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Catalogue */}
        <section id="catalogue" className="relative bg-background scroll-mt-24">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <p className="label-mono-up text-primary">The full catalogue</p>
            <div className="relative mt-8 max-w-md">

              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search services"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search customization services"
                className="h-11 rounded-xl border-border bg-card pl-9 pr-9 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Segmented tabs */}
            <div className="mt-10 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              <div role="tablist" aria-label="Service categories" className="flex min-w-max gap-7 border-b border-border">
                {categories.map((cat) => {
                  const isActive = cat.id === activeTab && !searchQuery;
                  return (
                    <button
                      key={cat.id}
                      role="tab"
                      aria-selected={isActive}
                      type="button"
                      onClick={() => { setActiveTab(cat.id); setSearchQuery(""); }}
                      className={`label-mono-up whitespace-nowrap border-b-2 pb-4 transition-colors ${
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {cat.title} <span className="opacity-60">{cat.items.length}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {searchResults !== null ? (
              <div className="mt-12">
                {searchResults.length === 0 ? (
                  <p className="text-base text-body-ink">No services found for "{searchQuery}". Try a different term.</p>
                ) : (
                  <div className="space-y-14">
                    {searchResults.map((group) => (
                      <div key={group.categoryId}>
                        <button
                          type="button"
                          onClick={() => { setActiveTab(group.categoryId); setSearchQuery(""); }}
                          className="label-mono-up text-primary hover:underline"
                        >
                          {group.category} ({group.items.length})
                        </button>
                        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {group.items.map((item) => (
                            <ServiceCard key={item.name} item={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-primary sm:text-4xl">{activeCategory.title}</h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-ink">{activeCategory.description}</p>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {activeCategory.items.map((item, i) => (
                    <Reveal key={item.name} delay={(i % 3) * 60}>
                      <ServiceCard item={item} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Closing band */}
        <section data-dark-band className="relative overflow-hidden bg-band text-white">
          <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to customize?</h2>
              <p className="mt-5 text-lg text-white/75">
                Select your options when placing a sourcing request. Our team handles everything.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="xl" variant="hero" className="btn-nudge card-hover bg-white bg-none text-primary hover:bg-white">
                  <Link to="/start">
                    Get a free quote <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="onDark">
                  <a href={CALENDLY} target="_blank" rel="noopener noreferrer">
                    Book a call
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}

