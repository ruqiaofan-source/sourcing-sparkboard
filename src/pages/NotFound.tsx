import { Link, useLocation } from "react-router-dom";
import { useEffect, forwardRef } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";


const NotFound = forwardRef<HTMLElement>(function NotFound(_props, ref) {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-card">
      <SEOHead
        title="Page Not Found - Equilinq"
        description="The page you are looking for does not exist. Return to the Equilinq homepage."
        noindex
      />
      <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative px-5 text-center">
        <Link to="/" className="mb-8 inline-flex transition-opacity hover:opacity-80" aria-label="Equilinq home">
          <BrandLogo className="h-12" />
        </Link>

        <p className="label-mono-up text-primary">404</p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl">The page you are looking for does not exist.</h1>
        <p className="mt-5 text-base leading-relaxed text-body-ink">The link may be outdated, or the page may have moved.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="xl" variant="hero" className="btn-nudge">
            <Link to="/">
              Back to home
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outlineInk">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </main>
  );
});

export default NotFound;
