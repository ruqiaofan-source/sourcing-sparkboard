import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const fallbackFaqs = [
  {
    q: "What is the minimum order quantity (MOQ) and how does pricing work?",
    a: "For most standard products, our MOQ starts at just 10 units per SKU. We operate on a zero-markup pricing model with transparent cost breakdowns.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes ~15-25 days, express ~7-14 days, premium ~5-10 days. All shipments include real-time tracking.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border border-border/60 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm hover:border-primary/20 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
      >
        <span className="text-foreground font-medium text-[15px] pr-4 group-hover:text-primary transition-colors">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, type: "spring", stiffness: 200 }}>
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LandingFAQ() {
  const { data: dbFaqs = [] } = useQuery({
    queryKey: ["public-faq-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data.map((item: any) => ({ q: item.question, a: item.answer }));
    },
  });

  const faqs = dbFaqs.length > 0 ? dbFaqs : fallbackFaqs;

  return (
    <section id="faq" className="py-28 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block"
          >
            FAQ's Section
          </motion.span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Common FAQ's</h2>
          <p className="text-muted-foreground mt-3">Get answers to your questions and learn about our platform</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
