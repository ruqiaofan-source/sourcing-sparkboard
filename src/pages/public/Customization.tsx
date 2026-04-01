import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Tag, Package, Shirt, Camera, Box, Layers, Wrench, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

/* ──────── Service categories with items (no pricing) ──────── */

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

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Customization() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam && tabIds.includes(tabParam) ? tabParam : tabIds[0]);

  useEffect(() => {
    if (tabParam && tabIds.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const activeCategory = categories.find((c) => c.id === activeTab)!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Customization Services - Equilinq Branding, Packaging & QC"
        description="60+ customization options: private labels, custom packaging, quality inspection, OEM/ODM manufacturing. Build your brand with Equilinq."
      />
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block">
            Customization
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Build It Your Way
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            60+ branding, packaging, quality control, and manufacturing services - all managed for you.
          </p>
        </motion.div>
      </section>

      {/* Tabs */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Tab bar */}
          <div className="mb-8 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-2">
              {categories.map((cat) => {
                const isActive = cat.id === activeTab;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card border border-border/40"
                    }`}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active category content */}
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Category header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <activeCategory.icon className="h-6 w-6 text-primary" />
              </div>
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
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="group rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm p-5 hover:border-primary/30 hover:bg-card/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground leading-snug mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Ready to customize?
          </h2>
          <p className="text-muted-foreground mb-8">
            Select your options when placing a sourcing request. Our team handles everything.
          </p>
          <Link to="/auth?signup=true">
            <Button
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold border border-primary/20"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <PublicFooter />
    </div>
  );
}
