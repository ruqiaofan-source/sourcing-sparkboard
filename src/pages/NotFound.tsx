import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <SEOHead
        title="Page Not Found - Equilinq"
        description="The page you are looking for does not exist. Return to the Equilinq homepage."
        noindex
      />
      <div className="text-center px-4">
        <h1 className="mb-4 text-6xl font-heading font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">The page you are looking for does not exist.</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/">
            <Button className="rounded-full">
              Back to Home
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="rounded-full">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
