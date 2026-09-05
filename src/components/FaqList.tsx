import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AnswerBody } from "@/components/FaqAnswer";
import type { HomeFaq } from "@/data/homeFaqs";

export function FaqList({ faqs }: { faqs: HomeFaq[] }) {
  return (
    <Accordion type="single" collapsible className="mt-10 grid gap-3">
      {faqs.map((faq, i) => (
        <AccordionItem
          key={faq.q}
          value={`faq-${i}`}
          className="rounded-2xl border border-border bg-background px-6 transition-colors duration-200 ease-out hover:border-accent/50"
        >
          <AccordionTrigger className="text-left font-display text-base font-semibold text-primary hover:no-underline">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent>
            <AnswerBody answer={faq.a} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default FaqList;
