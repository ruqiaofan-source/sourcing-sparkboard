import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Tag, Package, Shirt, Camera, Box, Layers } from "lucide-react";

const categories = [
  {
    icon: Tag,
    title: "Brand Assets",
    items: [
      { name: "Packaging Bags", price: "EUR 35 / 200 pcs" },
      { name: "Neck Labels", price: "EUR 35 / 200 pcs" },
      { name: "Hangtags", price: "EUR 10 / 200 pcs" },
    ],
  },
  {
    icon: Layers,
    title: "Branding & Labeling",
    items: [
      { name: "Label Sewing", price: "EUR 0.25 / pc" },
      { name: "Label Removal", price: "EUR 0.20 / pc" },
      { name: "Tag Switch", price: "EUR 0.25 / pc" },
      { name: "Label Printing & Pasting", price: "EUR 0.35 / pc" },
      { name: "Tag Removal", price: "EUR 0.20 / pc" },
    ],
  },
  {
    icon: Shirt,
    title: "Apparel Finishing",
    items: [
      { name: "Thread Trimming", price: "EUR 0.20 / pc" },
      { name: "Ironing", price: "EUR 1 / pc" },
      { name: "Folding & Packing", price: "EUR 0.20 / pc" },
    ],
  },
  {
    icon: Package,
    title: "Product Packaging",
    items: [
      { name: "EPE (Pearl Cotton)", price: "EUR 0.50 / pc" },
      { name: "Dust-Proof Bag", price: "EUR 0.50 / pc" },
      { name: "Vacuum Bag", price: "EUR 1 / pc" },
      { name: "Zipper Bag Replacement", price: "EUR 0.50 / pc" },
      { name: "Bubble Mailer", price: "EUR 0.50 / pc" },
      { name: "Shrink Wrap", price: "EUR 0.75 / pc" },
    ],
  },
  {
    icon: Box,
    title: "Parcel Reinforcement",
    items: [
      { name: "Bubble Mailer", price: "EUR 1.50 / parcel" },
      { name: "Moisture-Proof Bag", price: "EUR 1.50 / parcel" },
      { name: "Vacuum Bag", price: "EUR 3 / parcel" },
      { name: "Palletization", price: "EUR 40 / parcel" },
      { name: "Stretch Film", price: "EUR 1.50 / parcel" },
      { name: "Air Column Fill", price: "EUR 3 / parcel" },
      { name: "EPE Fill", price: "EUR 1.50 / parcel" },
      { name: "Paper Tube Fill", price: "EUR 3 / parcel" },
      { name: "Tape Sealing", price: "EUR 1 / parcel" },
      { name: "Corner Protectors", price: "EUR 1 / parcel" },
      { name: "Wooden Crate", price: "EUR 40 / parcel" },
    ],
  },
  {
    icon: Camera,
    title: "Photography & Media",
    items: [
      { name: "Detail Photos", price: "EUR 0.50 / pc" },
      { name: "Model Try-On Photos", price: "EUR 30 / set" },
      { name: "360 Video", price: "EUR 2 / pc" },
      { name: "Packing Photos", price: "EUR 0.50 / parcel" },
    ],
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Customization() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Customization Services - Equilinq Branding & Packaging" description="35+ customization options: private labels, custom packaging, logo integration, product modifications. Build your brand with Equilinq." />
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block">
            Customization
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-3">
            Build It Your Way
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            35+ branding and packaging options at transparent prices.
          </p>
        </motion.div>
      </section>

      {/* Categories grid */}
      <section className="pb-28 px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.title}
              variants={fadeUp}
              className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/20 transition-colors"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <cat.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-heading text-lg font-semibold text-foreground">{cat.title}</h2>
              </div>

              {/* Items table */}
              <div className="space-y-0 divide-y divide-border/20">
                {cat.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <span className="text-sm text-foreground/80">{item.name}</span>
                    <span className="text-xs font-semibold text-primary whitespace-nowrap ml-4">{item.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
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
            Select your options when placing a sourcing request.
          </p>
          <Link to="/auth?signup=true">
            <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold border border-primary/20">
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
