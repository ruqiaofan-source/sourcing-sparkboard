import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const TAG_TO_LINKS: Record<string, Array<{ to: string; label: string; desc: string }>> = {
  "Quality Control": [
    { to: "/quality-control", label: "Our QC Process", desc: "See our multi-stage quality control system" },
    { to: "/customization", label: "Customization", desc: "60+ branding and packaging options" },
  ],
  "Supply Chain": [
    { to: "/how-it-works", label: "How It Works", desc: "Our 8-step sourcing process explained" },
    { to: "/pricing", label: "Pricing", desc: "Transparent, itemized cost breakdowns" },
  ],
  "E-Commerce": [
    { to: "/customization", label: "Customization", desc: "Private labels, packaging, and branding" },
    { to: "/oem-odm", label: "OEM / ODM", desc: "Custom manufacturing from concept to product" },
  ],
  "Market Trends": [
    { to: "/how-it-works", label: "How It Works", desc: "Start sourcing trending products" },
    { to: "/pricing", label: "Pricing", desc: "See our transparent pricing model" },
  ],
  "Blog": [
    { to: "/how-it-works", label: "How It Works", desc: "Our end-to-end sourcing process" },
    { to: "/quality-control", label: "Quality Control", desc: "Multi-stage QC for every order" },
  ],
  "trending": [
    { to: "/how-it-works", label: "Start Sourcing", desc: "Submit a request for trending products" },
    { to: "/customization", label: "Customization", desc: "Brand these products with your label" },
  ],
};

const DEFAULT_LINKS = [
  { to: "/how-it-works", label: "How It Works", desc: "See our sourcing process" },
  { to: "/pricing", label: "Pricing", desc: "Transparent cost breakdown" },
];

export function RelatedServiceLinks({ tag }: { tag: string }) {
  const links = TAG_TO_LINKS[tag] || DEFAULT_LINKS;

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 pb-12">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Related Services</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group flex items-center justify-between p-4 rounded-xl border border-border/30 bg-card/20 hover:border-primary/30 hover:bg-card/40 transition-all"
          >
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{link.label}</p>
              <p className="text-xs text-muted-foreground">{link.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
