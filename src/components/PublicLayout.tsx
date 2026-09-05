import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Linkedin, Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import equilinqLogo from "@/assets/equilinq-logo-optimized.webp";
import equilinqLogoWhite from "@/assets/equilinq-logo-white-optimized.webp";

const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Customization", href: "/customization" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const PROTOTYPE_URL = "https://prototype.equilinq.eu";
const CALENDLY_URL = "https://calendly.com/admin-equilinq/30min";

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const location = useLocation();

  const update = useCallback(() => {
    setScrolled(window.scrollY > 40);
    const bands = document.querySelectorAll<HTMLElement>("[data-dark-band]");
    let dark = false;
    bands.forEach((band) => {
      const rect = band.getBoundingClientRect();
      if (rect.top <= 36 && rect.bottom >= 36) dark = true;
    });
    setOnDark(dark);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const raf = requestAnimationFrame(update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, [update, location.pathname]);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const shell = scrolled
    ? onDark
      ? "border-b border-white/12 bg-black/85 backdrop-blur-xl"
      : "border-b border-border bg-background/85 backdrop-blur-xl"
    : "border-b border-transparent";

  const linkClass = (active: boolean) =>
    [
      "relative text-base transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full",
      onDark
        ? active
          ? "text-white after:bg-white after:w-full"
          : "text-white/80 hover:text-white after:bg-white"
        : active
          ? "text-primary-deep after:bg-primary-deep after:w-full"
          : "text-muted-foreground hover:text-primary-deep after:bg-primary-deep",
    ].join(" ");

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${shell}`}>
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Link to="/" className="flex h-[60px] shrink-0 items-center gap-2.5" aria-label="Equilinq home">
          <img
            src={onDark ? equilinqLogoWhite : equilinqLogo}
            alt=""
            aria-hidden="true"
            className="h-9 w-auto object-contain"
            loading="eager"
            decoding="sync"
          />
          <span
            className={`font-display text-[1.4rem] font-medium leading-none tracking-[0.13em] ${
              onDark ? "text-white" : "text-foreground"
            }`}
          >
            EQUILINQ
          </span>
        </Link>


        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className={linkClass(location.pathname.startsWith(link.href))}>
              {link.label}
            </Link>
          ))}
          <a href={PROTOTYPE_URL} className={`${linkClass(false)} inline-flex items-center gap-1`}>
            Prototyping
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/auth"
            className={`text-base transition-colors ${onDark ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-primary-deep"}`}
          >
            Log in
          </Link>
          <Link to="/auth?signup=true">
            <Button variant="hero" className={onDark ? "bg-white bg-none text-primary hover:bg-white" : undefined}>
              Start a request
            </Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className={`flex h-11 w-11 items-center justify-center rounded-md border md:hidden ${
            onDark ? "border-white/25 text-white" : "border-border text-foreground"
          }`}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-lg px-2 py-3 text-lg text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <a href={PROTOTYPE_URL} className="inline-flex items-center gap-1 rounded-lg px-2 py-3 text-lg text-foreground">
              Prototyping
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link to="/auth" className="rounded-lg px-2 py-3 text-lg text-muted-foreground">
              Log in
            </Link>
            <Link to="/auth?signup=true" className="mt-2">
              <Button variant="hero" size="xl" className="w-full">
                Start a request
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

const footerColumns = [
  {
    heading: "Sourcing",
    links: [
      { label: "How it works", to: "/how-it-works" },
      { label: "Customization", to: "/customization" },
      { label: "Quality control", to: "/quality-control" },
      { label: "OEM and ODM", to: "/oem-odm" },
      { label: "Pricing", to: "/pricing" },
      { label: "Insights", to: "/insights" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Prototyping and production", href: PROTOTYPE_URL },
      { label: "Agent programme", to: "/agent-program" },
      { label: "Contact", to: "/contact" },
      { label: "Book a call", href: CALENDLY_URL },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", to: "/privacy" },
      { label: "Cookie policy", to: "/cookies" },
      { label: "Terms of service", to: "/terms" },
      { label: "Refund policy", to: "/refund-policy" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="bg-band text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="max-w-sm">
            <img src={equilinqLogoWhite} alt="Equilinq" className="h-14 w-auto object-contain" loading="lazy" />
            <p className="mt-5 text-sm leading-relaxed text-white/80">
              Sourcing, customization, quality control and shipping from China for European brands. One counterparty,
              checked before it ships.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-x-12">
            {footerColumns.map((col) => (
              <div key={col.heading}>
                <h3 className="label-mono-up text-white/50">{col.heading}</h3>
                <nav className="mt-4 grid gap-3 text-sm text-white/70" aria-label={col.heading}>
                  {col.links.map((link) =>
                    "to" in link ? (
                      <Link key={link.label} to={link.to as string} className="hover:text-white">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-white"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ),
                  )}
                  {col.heading === "Company" && (
                    <a
                      href="https://www.linkedin.com/company/equilinq/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-white"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      LinkedIn
                    </a>
                  )}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6">
          <p className="label-mono-up text-white/40">
            Equilinq Limited, Hong Kong. Operating across Europe and Mainland China.
          </p>
          <div className="label-mono text-white/40">
            <p>Equilinq Limited · Company No. 79372452 · Business Registration No. 79372452-000-12-25-3</p>
            <p>Unit D 11/F, Two Chinachem Plaza, 68 Connaught Rd Central, Hong Kong</p>
            <p>© 2026 Equilinq Limited. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
