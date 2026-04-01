import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X, ChevronDown, Tag, Package, Shirt, Camera, Box, Layers, Wrench, ClipboardCheck } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import equilinqLogo from "@/assets/equilinq-logo.png";

const customizationCategories = [
  { label: "Brand Assets", href: "/customization?tab=brand-assets", icon: Tag, desc: "Custom bags, labels, hangtags" },
  { label: "Branding & Labeling", href: "/customization?tab=branding-labeling", icon: Layers, desc: "Sewing, printing, pasting" },
  { label: "Apparel Finishing", href: "/customization?tab=apparel-finishing", icon: Shirt, desc: "Trimming, ironing, folding" },
  { label: "Product Packaging", href: "/customization?tab=product-packaging", icon: Package, desc: "Wrapping, sealing, protection" },
  { label: "Parcel Reinforcement", href: "/customization?tab=parcel-reinforcement", icon: Box, desc: "Filling, crating, film wrapping" },
  { label: "Photography & Media", href: "/customization?tab=photography-media", icon: Camera, desc: "Photos, videos, model shots" },
  { label: "Quality Inspection", href: "/customization?tab=quality-inspection", icon: ClipboardCheck, desc: "Standard, detailed, electrical QC" },
  { label: "OEM / ODM", href: "/customization?tab=oem-odm", icon: Wrench, desc: "Custom manufacturing & design" },
];

const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Customization", href: "/customization", hasDropdown: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [mobileCustomizationOpen, setMobileCustomizationOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setCustomizationOpen(true);
  };
  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setCustomizationOpen(false), 200);
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white backdrop-blur-xl px-5 py-3 shadow-lg">
        <Link to="/" className="flex items-center gap-1.5 mr-3 shrink-0">
          <img src={equilinqLogo} alt="Equilinq" className="h-8 w-8 object-contain" />
          <span className="font-heading text-lg font-bold tracking-wider uppercase text-gray-900">
            Equilinq
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-base font-medium text-gray-700">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                  <Link
                    to={link.href}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors whitespace-nowrap text-base"
                  >
                  {link.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${customizationOpen ? "rotate-180" : ""}`} />
                </Link>

                <AnimatePresence>
                  {customizationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                    >
                      <div className="w-[420px] rounded-2xl border border-gray-200 bg-white shadow-xl p-3 grid grid-cols-2 gap-1">
                        {customizationCategories.map((cat) => (
                          <Link
                            key={cat.label}
                            to={cat.href}
                            onClick={() => setCustomizationOpen(false)}
                            className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                              <cat.icon className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 leading-tight">{cat.label}</p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{cat.desc}</p>
                            </div>
                          </Link>
                        ))}
                        <div className="col-span-2 border-t border-gray-100 mt-1 pt-2 px-3 pb-1">
                          <Link
                            to="/customization"
                            onClick={() => setCustomizationOpen(false)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                          >
                            View all services
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="hover:text-gray-900 transition-colors whitespace-nowrap text-base"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/auth" className="hidden lg:block">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 rounded-full text-base">
              Login
            </Button>
          </Link>
          <Link to="/auth?signup=true" className="hidden lg:block">
            <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5 border border-primary/20">
              Get Started
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-gray-900 p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-2 rounded-2xl border border-gray-200 bg-white backdrop-blur-xl p-4 lg:hidden shadow-lg"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileCustomizationOpen(!mobileCustomizationOpen)}
                      className="flex items-center justify-between w-full text-base font-medium text-gray-700 hover:text-gray-900 transition-colors py-2.5 px-1"
                    >
                      {link.label}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${mobileCustomizationOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobileCustomizationOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-3 pb-2 space-y-1">
                            {customizationCategories.map((cat) => (
                              <Link
                                key={cat.label}
                                to={cat.href}
                                onClick={() => { setMobileOpen(false); setMobileCustomizationOpen(false); }}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors py-1.5"
                              >
                                <cat.icon className="h-3.5 w-3.5 text-indigo-500" />
                                {cat.label}
                              </Link>
                            ))}
                            <Link
                              to="/customization"
                              onClick={() => { setMobileOpen(false); setMobileCustomizationOpen(false); }}
                              className="flex items-center gap-1 text-xs font-medium text-indigo-600 pt-1"
                            >
                              View all
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors py-2.5 px-1"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="border-t border-gray-200 pt-3 mt-2 flex gap-3">
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-full">Login</Button>
                </Link>
                <Link to="/auth?signup=true" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full rounded-full bg-primary text-primary-foreground">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border/40 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src={equilinqLogo} alt="Equilinq" className="h-7 w-7 rounded-md object-cover" />
            <span className="font-heading text-sm font-bold tracking-wider uppercase text-foreground">Equilinq</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link to="/insights" className="hover:text-foreground transition-colors">Insights</Link>
            <Link to="/customization" className="hover:text-foreground transition-colors">Customization</Link>
            <a href="https://equilinq.eu/calendar" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Book a Call</a>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1">
            <a href="mailto:contact@equilinq.eu" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              contact@equilinq.eu
            </a>
            <p className="text-xs text-muted-foreground/60">
              &copy; {new Date().getFullYear()} Equilinq. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
