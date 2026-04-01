import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import equilinqLogo from "@/assets/equilinq-logo.png";

const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Customization", href: "/customization" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white backdrop-blur-xl px-5 py-3 shadow-[var(--shadow-card)]">
        <Link to="/" className="flex items-center gap-1.5 mr-4">
          <img src={equilinqLogo} alt="Equilinq" className="h-8 w-8 object-contain" />
          <span className="font-heading text-lg font-bold tracking-wider uppercase text-gray-900">
            Equilinq
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7 text-sm text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/auth" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 rounded-full">
              Login
            </Button>
          </Link>
          <Link to="/auth?signup=true" className="hidden sm:block">
            <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5 border border-primary/20">
              Get Started
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-900 p-1"
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
            className="mt-2 rounded-2xl border border-gray-200 bg-white backdrop-blur-xl p-4 md:hidden shadow-lg"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-1 flex gap-3">
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
