import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import equilinqLogo from "@/assets/equilinq-logo-optimized.webp";
import equilinqLogoWhite from "@/assets/equilinq-logo-white-optimized.webp";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [processing, setProcessing] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (!res.ok) setStatus("invalid");
        else if (data.valid === false && data.reason === "already_unsubscribed") setStatus("already");
        else if (data.valid) setStatus("valid");
        else setStatus("invalid");
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    setProcessing(true);
    try {
      const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setProcessing(false);
    }
  };

  const content: Record<Status, { icon: React.ReactNode; title: string; desc: string }> = {
    loading: { icon: <Loader2 className="h-8 w-8 text-primary animate-spin" />, title: "Verifying...", desc: "Please wait while we verify your request." },
    valid: { icon: <Mail className="h-8 w-8 text-primary" />, title: "Unsubscribe from emails", desc: "Click below to stop receiving app emails from Equilinq. You will still receive critical account emails." },
    already: { icon: <CheckCircle className="h-8 w-8 text-primary" />, title: "Already unsubscribed", desc: "You have already unsubscribed from our app emails." },
    invalid: { icon: <XCircle className="h-8 w-8 text-destructive" />, title: "Invalid link", desc: "This unsubscribe link is invalid or has expired." },
    success: { icon: <CheckCircle className="h-8 w-8 text-primary" />, title: "Unsubscribed", desc: "You have been successfully unsubscribed. You will no longer receive app emails from Equilinq." },
    error: { icon: <XCircle className="h-8 w-8 text-destructive" />, title: "Something went wrong", desc: "We couldn't process your request. Please try again later." },
  };

  const c = content[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--glow-blue)" }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={theme === "dark" ? equilinqLogoWhite : equilinqLogo} alt="Equilinq" className="h-8 w-8 rounded-lg object-cover" />
          <span className="font-heading text-lg font-bold text-foreground tracking-wider uppercase">Equilinq</span>
        </div>
        <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-[var(--shadow-glow)]">
          <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
            {c.icon}
          </div>
          <h1 className="font-heading text-xl font-bold text-foreground mb-2">{c.title}</h1>
          <p className="text-muted-foreground text-sm mb-6">{c.desc}</p>
          {status === "valid" && (
            <Button onClick={handleUnsubscribe} disabled={processing} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-11 w-full">
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Unsubscribe"}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Unsubscribe;
