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
    <div className="bg-card px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="label-mono-up text-primary">Related services</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="btn-nudge card-hover flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 hover:border-accent/50"
            >
              <span>
                <span className="block text-base font-semibold text-primary">{link.label}</span>
                <span className="mt-1 block text-sm leading-relaxed text-body-ink">{link.desc}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
