import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, CheckCircle2, Lightbulb, ArrowRight, Package, DollarSign, Layers, Leaf, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SourcingSuggestion {
  title: string;
  description: string;
  quantity_min: number;
  quantity_recommended: number;
  budget_per_unit_eur: number;
  eco_friendly: string;
  tips: string[];
  reasoning: string;
}

interface SourcingAssistantProps {
  onApplySuggestion: (suggestion: SourcingSuggestion) => void;
}

const placeholders = [
  "I want to sell branded water bottles on my Shopify store...",
  "Custom printed tote bags for a retail launch in Germany...",
  "Looking for a manufacturer for silicone phone cases with logos...",
  "Need eco-friendly packaging boxes for a skincare brand...",
];

export default function SourcingAssistant({ onApplySuggestion }: SourcingAssistantProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SourcingSuggestion | null>(null);
  const [applied, setApplied] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Rotate placeholder text
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setPlaceholderIdx((i) => (i + 1) % placeholders.length), 4000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleAsk = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setSuggestion(null);
    setApplied(false);

    try {
      const { data, error } = await supabase.functions.invoke("sourcing-assistant", {
        body: { message: input.trim() },
      });
      if (error) throw error;

      if (data?.type === "suggestion" && data.suggestion) {
        setSuggestion(data.suggestion);
      } else if (data?.error) {
        toast({ title: "AI Assistant", description: data.error, variant: "destructive" });
      } else {
        toast({ title: "AI Assistant", description: data?.content || "Could not generate suggestions. Try being more specific." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to get suggestions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!suggestion) return;
    onApplySuggestion(suggestion);
    setApplied(true);
    toast({ title: "Applied!", description: "AI suggestions filled into your form." });
  };

  const ecoLabel = (v: string) => {
    const map: Record<string, string> = { none: "Not needed", preferred: "Preferred", required: "Required", certified_only: "Certified only" };
    return map[v] || v;
  };

  // Collapsed trigger
  if (!open) {
    return (
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="group mt-5 w-full flex items-center gap-3 rounded-2xl border border-dashed border-primary/20 bg-gradient-to-r from-primary/[0.04] to-transparent px-4 py-3.5 text-left transition-all hover:border-primary/35 hover:from-primary/[0.07]"
      >
        <motion.div
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors shrink-0"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Not sure what to source?</p>
          <p className="text-xs text-muted-foreground mt-0.5">Describe your idea and let AI fill in the details</p>
        </div>
        <ArrowRight className="h-4 w-4 text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="mt-5 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.05] via-primary/[0.02] to-transparent overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground font-heading">AI Sourcing Advisor</p>
            <p className="text-[11px] text-muted-foreground">Powered by Equilinq AI</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Input area */}
      <div className="px-5 pb-4 pt-2">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[placeholderIdx]}
            rows={3}
            className="w-full rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground/35 resize-none focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                handleAsk();
              }
            }}
          />
          <motion.button
            type="button"
            onClick={handleAsk}
            disabled={!input.trim() || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shadow-[0_0_15px_-3px_hsl(var(--primary)/0.4)]"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </motion.button>
        </div>

        {/* Loading shimmer */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Finding the best sourcing strategy for you...</span>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-10 rounded-lg bg-secondary/40"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {suggestion && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="mt-4 space-y-3"
            >
              {/* Reasoning bubble */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2.5"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="h-3 w-3 text-primary" />
                </div>
                <div className="rounded-xl rounded-tl-sm bg-secondary/40 border border-border/40 px-3.5 py-2.5 flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">{suggestion.reasoning}</p>
                </div>
              </motion.div>

              {/* Suggestion cards */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Package, label: "Product", value: suggestion.title, delay: 0.15 },
                  { icon: DollarSign, label: "Budget", value: `EUR ${suggestion.budget_per_unit_eur.toFixed(2)}/unit`, delay: 0.2 },
                  { icon: Layers, label: "Quantity", value: `${suggestion.quantity_recommended} units (min ${suggestion.quantity_min})`, delay: 0.25 },
                  { icon: Leaf, label: "Eco-friendly", value: ecoLabel(suggestion.eco_friendly), delay: 0.3 },
                ].map((card) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: card.delay }}
                    className="rounded-xl border border-border/40 bg-secondary/25 px-3 py-2.5 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <card.icon className="h-3 w-3 text-primary/60" />
                      <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">{card.label}</p>
                    </div>
                    <p className="text-sm text-foreground font-medium leading-snug">{card.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Description preview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl border border-border/40 bg-secondary/25 px-3.5 py-2.5"
              >
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium mb-1">Suggested description</p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{suggestion.description}</p>
              </motion.div>

              {/* Tips */}
              {suggestion.tips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-1.5"
                >
                  <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">Pro tips</p>
                  {suggestion.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.08 }}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-500/70 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{tip}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Apply button */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="button"
                  onClick={handleApply}
                  disabled={applied}
                  className={`w-full rounded-xl h-11 text-sm font-semibold transition-all ${
                    applied
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10 shadow-none"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_25px_-5px_hsl(var(--primary)/0.4)]"
                  }`}
                >
                  {applied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Applied to form - continue to next step
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" /> Apply all suggestions
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
