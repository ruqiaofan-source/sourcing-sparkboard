import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";

const rows = [
  { label: "Factory cost", value: 1450 },
  { label: "Logistics and customs", value: 620 },
  { label: "China operations", value: 180 },
  { label: "Service fee", value: 135 },
];

const TOTAL = rows.reduce((sum, r) => sum + r.value, 0);

const money = (n: number) =>
  `EUR ${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Counts up to the total once the card enters the viewport. Static when reduced motion is preferred. */
function useCountUp(target: number, duration = 900) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setValue(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return { ref, value };
}

export function QuoteBuildCard() {
  const { ref, value } = useCountUp(TOTAL);

  return (
    <div>
      <div className="rounded-2xl border border-accent/50 bg-card p-7 shadow-[var(--shadow-lift)] sm:p-10">
        <p className="label-mono-up border-b border-border pb-4 text-muted-foreground">
          Example itemised quote · 500 units · cotton tote bags
        </p>

        <dl className="mt-2">
          {rows.map((row, i) => (
            <Reveal key={row.label} delay={i * 120}>
              <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
                <dt className="text-sm leading-relaxed text-body-ink sm:text-base">{row.label}</dt>
                <dd className="label-mono shrink-0 text-primary">{money(row.value)}</dd>
              </div>
            </Reveal>
          ))}
          <div className="flex items-baseline justify-between gap-6 pt-5">
            <dt className="text-base font-semibold text-primary sm:text-lg">Total</dt>
            <dd className="shrink-0 text-lg font-semibold text-primary sm:text-xl">
              <span ref={ref}>{money(value)}</span>
            </dd>
          </div>
        </dl>
      </div>
      <p className="label-mono mt-3 text-muted-foreground">Example figures</p>
    </div>
  );
}

export default QuoteBuildCard;
