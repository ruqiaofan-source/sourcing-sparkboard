import { motion, AnimatePresence, useInView } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Tag, Package, Shirt, Camera, Box, Layers, Wrench, ClipboardCheck, CheckCircle2, Search, X } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";

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

/* ──────── Service card with staggered entrance ──────── */
function ServiceCard({ item, index }: { item: { name: string; desc: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow: "0 12px 40px -10px hsl(239 100% 60% / 0.15)",
      }}
      className="group relative rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm p-5 overflow-hidden transition-colors duration-300 hover:border-primary/30"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="relative z-10 flex items-start gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 + index * 0.03, type: "spring", stiffness: 300 }}
        >
          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        </motion.div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {item.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────── Counter badge ──────── */
function CountBadge() {
  const total = categories.reduce((sum, c) => sum + c.items.length, 0);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, type: "spring" }}
      className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm px-4 py-1.5 mb-6"
    >
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-primary"
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-[11px] text-muted-foreground tracking-wide">{total}+ services available</span>
    </motion.div>
  );
}

export default function Customization() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam && tabIds.includes(tabParam) ? tabParam : tabIds[0]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (tabParam && tabIds.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const activeCategory = categories.find((c) => c.id === activeTab)!;

  // Search across all categories
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Customization Services - Equilinq Branding & Packaging"
        description="60+ customization options: private labels, custom packaging, quality inspection, OEM/ODM manufacturing. Build your brand with Equilinq."
        keywords="custom packaging China, private label manufacturing, OEM ODM China, branding services, product customization, quality inspection"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Customization", url: "https://equilinq.eu/customization" },
        ]}
        jsonLd={{
          "@type": "Service",
          name: "Customization Services - Equilinq",
          url: "https://equilinq.eu/customization",
          description: "60+ customization options including private labels, custom packaging, quality inspection, and OEM/ODM manufacturing.",
          provider: { "@type": "Organization", name: "Equilinq", url: "https://equilinq.eu" },
          areaServed: "Europe",
          serviceType: "Product Customization and Branding",
        }}
      />
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 text-center relative">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(239 100% 60% / 0.08) 0%, transparent 70%)",
              top: "-20%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10">
          <CountBadge />
          <motion.h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-[1.1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Build It
            </motion.span>{" "}
            <motion.span
              className="bg-gradient-to-r from-[hsl(239,100%,65%)] via-[hsl(280,80%,72%)] to-[hsl(239,100%,65%)] bg-clip-text text-transparent inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Your Way
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Branding, packaging, quality control, and manufacturing services — all managed for you.
          </motion.p>
        </div>
      </section>

      {/* Search bar */}
      <section className="px-4 pb-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 rounded-xl border-border/40 bg-card/30 backdrop-blur-sm h-10 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Category overview strip */}
      <section className="px-4 pb-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8"
          >
            {categories.map((cat, i) => {
              const isActive = cat.id === activeTab;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex flex-col items-center gap-2 px-3 py-4 rounded-xl text-xs font-medium transition-all overflow-hidden ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_25px_-5px_hsl(239,100%,60%/0.3)]"
                      : "bg-card/30 text-muted-foreground hover:text-foreground hover:bg-card/50 border border-border/30"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <cat.icon className={`h-5 w-5 relative z-10 ${isActive ? "text-primary" : ""}`} />
                  <span className="relative z-10 text-center leading-tight text-sm font-semibold">{cat.title}</span>
                  <span className="relative z-10 text-[10px] opacity-50">{cat.items.length} items</span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Search results or active category content */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {searchResults !== null ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="search-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {searchResults.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">No services found for "{searchQuery}"</p>
                    <p className="text-muted-foreground/60 text-sm mt-2">Try a different search term</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {searchResults.map((group) => (
                      <div key={group.categoryId}>
                        <button
                          onClick={() => { setActiveTab(group.categoryId); setSearchQuery(""); }}
                          className="text-sm font-semibold text-primary mb-4 block hover:underline"
                        >
                          {group.category} ({group.items.length} result{group.items.length > 1 ? "s" : ""})
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.items.map((item, i) => (
                            <ServiceCard key={item.name} item={item} index={i} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Category header */}
                <div className="flex items-start gap-4 mb-8">
                  <motion.div
                    key={`icon-${activeTab}`}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_30px_-5px_hsl(239,100%,60%/0.15)]"
                  >
                    <activeCategory.icon className="h-7 w-7 text-primary" />
                  </motion.div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                      {activeCategory.title}
                    </h2>
                    <p className="text-muted-foreground mt-1">{activeCategory.description}</p>
                  </div>
                </div>

                {/* Service cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCategory.items.map((item, i) => (
                    <ServiceCard key={item.name} item={item} index={i} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(239 100% 60% / 0.06) 0%, transparent 70%)",
              bottom: "-20%",
              right: "10%",
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <motion.div
            className="rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm p-10 relative overflow-hidden"
            whileHover={{ borderColor: "hsl(239 100% 65% / 0.3)" }}
          >
            <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Ready to customize?
            </h2>
            <p className="text-muted-foreground mb-8">
              Select your options when placing a sourcing request. Our team handles everything.
            </p>
            <Link to="/auth?signup=true">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="rounded-full bg-[hsl(239,55%,32%)] text-white hover:bg-[hsl(239,55%,25%)] px-8 h-12 text-base font-semibold border border-primary/20 shadow-[0_0_40px_-8px_hsl(239,100%,60%/0.4)]"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Cross-links */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { to: "/how-it-works", title: "How It Works", desc: "Our 8-step sourcing process" },
              { to: "/pricing", title: "Pricing", desc: "Transparent cost breakdown per order" },
              { to: "/contact", title: "Contact Us", desc: "Discuss your customization needs" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="group block p-5 rounded-xl border border-border/30 bg-card/20 hover:border-primary/30 hover:bg-card/40 transition-all">
                <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
