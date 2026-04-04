import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, ChevronDown, ChevronUp, CheckCircle2, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

export default function SourcingAssistant({ onApplySuggestion }: SourcingAssistantProps) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SourcingSuggestion | null>(null);
  const [applied, setApplied] = useState(false);

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
      toast({
        title: "Error",
        description: err.message || "Failed to get suggestions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!suggestion) return;
    onApplySuggestion(suggestion);
    setApplied(true);
    toast({ title: "Applied!", description: "AI suggestions have been filled into your form." });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-4"
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-2 text-sm text-primary/80 hover:text-primary transition-colors group w-full"
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="font-medium">Not sure what to source? Let AI help you</span>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl border border-primary/15 bg-primary/[0.03] p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Describe your product idea in plain language. Our AI will suggest product specs, quantities, and budget estimates.
              </p>

              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., I want to sell eco-friendly water bottles with my brand logo for my online store..."
                  rows={2}
                  className="bg-secondary/50 border-border resize-none text-sm placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/30 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAsk();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAsk}
                  disabled={!input.trim() || loading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 h-auto self-end px-3"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              {/* Loading state */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground py-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Analyzing your product idea...</span>
                </motion.div>
              )}

              {/* Suggestion result */}
              <AnimatePresence>
                {suggestion && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {/* Reasoning */}
                    <div className="rounded-lg bg-secondary/30 border border-border/50 p-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{suggestion.reasoning}</p>
                      </div>
                    </div>

                    {/* Suggested values */}
                    <div className="grid grid-cols-2 gap-2">
                      <SuggestionPill label="Product" value={suggestion.title} />
                      <SuggestionPill label="Budget" value={`EUR ${suggestion.budget_per_unit_eur.toFixed(2)}/unit`} />
                      <SuggestionPill label="Quantity" value={`${suggestion.quantity_recommended} units`} />
                      <SuggestionPill
                        label="Eco-friendly"
                        value={suggestion.eco_friendly === "none" ? "Not required" : suggestion.eco_friendly.replace("_", " ")}
                      />
                    </div>

                    {/* Tips */}
                    {suggestion.tips.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-medium">Sourcing tips</p>
                        {suggestion.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Apply button */}
                    <Button
                      type="button"
                      onClick={handleApply}
                      disabled={applied}
                      className={`w-full rounded-xl h-10 text-sm font-medium transition-all ${
                        applied
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-5px_hsl(239_100%_65%/0.3)]"
                      }`}
                    >
                      {applied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Applied to form
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4 mr-2" /> Apply suggestions to form
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SuggestionPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/20 px-3 py-2">
      <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-foreground font-medium mt-0.5 truncate">{value}</p>
    </div>
  );
}
