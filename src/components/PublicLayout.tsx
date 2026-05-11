import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X, ChevronDown, Tag, Package, Shirt, Camera, Box, Layers, Wrench, ClipboardCheck } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import equilinqLogo from "@/assets/equilinq-logo-optimized.webp";
import equilinqLogoWhite from "@/assets/equilinq-logo-white-optimized.webp";

const customizationCategories = [
  { label: "Brand Assets", href: "/customization?tab=brand-assets", icon: Tag, desc: "Custom bags, labels, hangtags" },
  { label: "Branding & Labeling", href: "/customization?tab=branding-labeling", icon: Layers, desc: "Sewing, printing, pasting" },
  { label: "Apparel Finishing", href: "/customization?tab=apparel-finishing", icon: Shirt, desc: "Trimming, ironing, folding" },
  { label: "Product Packaging", href: "/customization?tab=product-packaging", icon: Package, desc: "Wrapping, sealing, protection" },
  { label: "Parcel Reinforcement", href: "/customization?tab=parcel-reinforcement", icon: Box, desc: "Filling, crating, film wrapping" },
  { label: "Photography & Media", href: "/customization?tab=photography-media", icon: Camera, desc: "Photos, videos, model shots" },
  { label: "Quality Inspection", href: "/quality-control", icon: ClipboardCheck, desc: "Standard, detailed, electrical QC" },
  { label: "OEM / ODM", href: "/oem-odm", icon: Wrench, desc: "Custom manufacturing & design" },
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      // 0 at top, 1 at 300px scroll
      const progress = Math.min(window.scrollY / 300, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setCustomizationOpen(true);
  };
  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setCustomizationOpen(false), 200);
  };

  // Dynamic navbar styles based on scroll
  const blur = 12 + scrollProgress * 12;
  const borderOpacity = 0.15 + scrollProgress * 0.1;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 z-50 w-[95%] max-w-5xl group/nav"
      aria-label="Main navigation"
    >
      <div
        className="relative flex items-center justify-between rounded-2xl border px-5 py-3 bg-white dark:bg-white transition-all duration-500"
        style={{
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          boxShadow: scrollProgress > 0.3
            ? `0 4px 24px -4px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.06)`
            : `0 2px 16px -4px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)`,
          borderColor: `hsl(var(--border) / ${borderOpacity})`,
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
      >
        {/* White shimmer border sweep */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-700 overflow-hidden"
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `conic-gradient(from var(--shimmer-angle, 0deg) at 50% 50%, transparent 0%, rgba(255, 255, 255, 0.4) 10%, transparent 20%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1.5px',
            }}
          />
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 mr-3 shrink-0 group/logo transition-transform duration-300 hover:scale-[1.03]"
          aria-label="Equilinq home"
        >
          <img
            src={theme === "dark" ? equilinqLogoWhite : equilinqLogo}
            alt="Equilinq"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-contain transition-all duration-300 group-hover/logo:drop-shadow-[0_0_12px_hsl(var(--primary)/0.55)] group-hover/logo:rotate-[-2deg]"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-lg font-bold tracking-wider uppercase text-foreground transition-colors duration-300 group-hover/logo:text-primary">
              Equilinq
            </span>
            <span className="text-[8px] font-medium tracking-[0.15em] uppercase text-muted-foreground hidden sm:block">
              EU-China Sourcing
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-base font-medium text-gray-600">
          {navLinks.map((link, i) =>
            link.hasDropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="relative flex items-center gap-1 hover:text-gray-900 transition-all whitespace-nowrap text-base group/link hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
                  >
                    {link.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${customizationOpen ? "rotate-180" : ""}`} />
                  </Link>
                </motion.div>

                <AnimatePresence>
                  {customizationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-0 pt-3"
                    >
                      <div className="w-[420px] rounded-2xl border border-border bg-card shadow-xl p-3 grid grid-cols-2 gap-1">
                        {customizationCategories.map((cat, ci) => (
                          <motion.div
                            key={cat.label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: ci * 0.03 }}
                          >
                            <Link
                              to={cat.href}
                              onClick={() => setCustomizationOpen(false)}
                              className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-accent transition-colors group"
                            >
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200">
                                <cat.icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground leading-tight">{cat.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{cat.desc}</p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                        <div className="col-span-2 border-t border-border mt-1 pt-2 px-3 pb-1">
                          <Link
                            to="/customization"
                            onClick={() => setCustomizationOpen(false)}
                            className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 group/all"
                          >
                            View all services
                            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/all:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              >
                <Link
                  to={link.href}
                  className="relative hover:text-gray-900 transition-all whitespace-nowrap text-base hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
                >
                  {link.label}
                </Link>
              </motion.div>
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
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5 border border-primary/20">
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </motion.div>
          </Link>

          {/* Mobile hamburger */}
          <motion.button
            className="lg:hidden text-gray-900 p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
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
            className="mt-2 rounded-2xl border border-border bg-card backdrop-blur-xl p-4 lg:hidden shadow-lg"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileCustomizationOpen(!mobileCustomizationOpen)}
                      className="flex items-center justify-between w-full text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5 px-1"
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
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5"
                              >
                                <cat.icon className="h-3.5 w-3.5 text-primary" />
                                {cat.label}
                              </Link>
                            ))}
                            <Link
                              to="/customization"
                              onClick={() => { setMobileOpen(false); setMobileCustomizationOpen(false); }}
                              className="flex items-center gap-1 text-xs font-medium text-primary pt-1"
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
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5 px-1"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="border-t border-border pt-3 mt-2 flex gap-3">
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
    </motion.nav>
  );
}

export function PublicFooter() {
  const { theme } = useTheme();
  return (
    <footer className="border-t border-border/40 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="group/flogo flex items-center gap-2.5 mb-3 w-fit transition-transform duration-300 hover:scale-[1.03]" aria-label="Equilinq home">
              <img
                src={theme === "dark" ? equilinqLogoWhite : equilinqLogo}
                alt="Equilinq"
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg object-contain transition-all duration-300 group-hover/flogo:drop-shadow-[0_0_12px_hsl(var(--primary)/0.55)] group-hover/flogo:rotate-[-2deg]"
              />
              <span className="font-heading text-sm font-bold tracking-wider uppercase text-foreground transition-colors duration-300 group-hover/flogo:text-primary">Equilinq</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              EU-China Sourcing & Procurement Services.
              <br />
              Operating across Europe and Mainland China.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <a href="https://www.linkedin.com/company/equilinq/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground/60 hover:text-foreground transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@equilinq" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-muted-foreground/60 hover:text-foreground transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <a href="https://www.instagram.com/equilinq.eu/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground/60 hover:text-foreground transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Services</h3>
            <nav className="flex flex-col gap-2" aria-label="Services">
              <Link to="/how-it-works" className="text-xs text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
              <Link to="/customization" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Customization</Link>
              <Link to="/quality-control" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Quality Control</Link>
              <Link to="/oem-odm" className="text-xs text-muted-foreground hover:text-foreground transition-colors">OEM / ODM</Link>
              <Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Resources</h3>
            <nav className="flex flex-col gap-2" aria-label="Resources">
              <Link to="/insights" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Insights & Blog</Link>
              <Link to="/sourcing-guide" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sourcing Guide</Link>
              <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
              <a href="https://calendly.com/admin-equilinq/30min" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Book a Demo</a>
              <Link to="/auth?signup=true" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Get Started</Link>
            </nav>
          </div>

          {/* Contact & legal */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Contact</h3>
            <div className="flex flex-col gap-2">
              <a href="mailto:contact@equilinq.eu" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                contact@equilinq.eu
              </a>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                Equilinq Limited
                <br />
                Hong Kong Company No. 79372452
                <br />
                Business Registration No. 79372452-000-12-25-3
                <br />
                Unit D 11/F, Two Chinachem Plaza,
                <br />
                68 Connaught Rd Central, Hong Kong
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Equilinq Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
