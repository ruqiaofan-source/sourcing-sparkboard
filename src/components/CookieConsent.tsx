import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50"
        >
          <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-lift)]">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">We use cookies</p>
                <p className="text-xs text-body-ink leading-relaxed">
                  We use cookies to improve your experience and analyze site traffic. By clicking "Accept", you agree to our use of cookies.{" "}
                  <Link to="/cookies" className="text-primary underline hover:text-primary-deep">Learn more about our cookie policy</Link>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outlineInk"
                size="sm"
                onClick={handleDecline}
                className="flex-1 text-xs h-8"
              >
                Decline
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={handleAccept}
                className="flex-1 text-xs h-8"
              >
                Accept
              </Button>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
