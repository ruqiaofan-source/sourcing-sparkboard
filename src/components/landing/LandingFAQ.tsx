import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { homeFaqs } from "@/data/homeFaqs";

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ol"; items: { title: string; lines: string[] }[] };

function parseAnswer(answer: string): Block[] {
  const paragraphs = answer.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const blocks: Block[] = [];
  for (const para of paragraphs) {
    const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
    const match = /^(\d+)\.\s+(.*)$/.exec(lines[0] ?? "");
    if (match) {
      const item = { title: match[2], lines: lines.slice(1) };
      const last = blocks[blocks.length - 1];
      if (last && last.type === "ol") last.items.push(item);
      else blocks.push({ type: "ol", items: [item] });
    } else {
      blocks.push({ type: "p", lines });
    }
  }
  return blocks;
}

function AnswerBody({ answer }: { answer: string }) {
  const blocks = parseAnswer(answer);
  return (
    <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
      {blocks.map((block, i) =>
        block.type === "ol" ? (
          <ol key={i} className="list-decimal pl-5 space-y-2">
            {block.items.map((item, j) => (
              <li key={j}>
                <span className="text-foreground font-medium">{item.title}</span>
                {item.lines.map((line, k) => (
                  <span key={k} className="block">
                    {line}
                  </span>
                ))}
              </li>
            ))}
          </ol>
        ) : (
          <p key={i}>
            {block.lines.map((line, k) => (
              <span key={k} className="block">
                {line}
              </span>
            ))}
          </p>
        )
      )}
    </div>
  );
}

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
            <div className="px-6 pb-5">
              <AnswerBody answer={a} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LandingFAQ() {
  const faqs = homeFaqs;

  return (
    <section id="faq" className="py-16 px-4" aria-label="Frequently asked questions">
      {/* FAQPage JSON-LD for Google rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
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
            className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4 block"
          >
            FAQ
          </motion.span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Common Questions</h2>
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
