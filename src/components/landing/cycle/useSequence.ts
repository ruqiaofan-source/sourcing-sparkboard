import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Reveals `count` items one after another once the element is in view.
 * Returns the number of items currently revealed. Under reduced motion every
 * item is revealed immediately.
 */
export function useSequence(count: number, stepMs = 120) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setShown(count);
      return;
    }

    // The whole reveal must finish within 300 ms of the step becoming active:
    // cap the number of ticks and reveal several items per tick when needed.
    const ticks = Math.max(1, Math.min(count, Math.floor(260 / Math.max(16, stepMs)) || 1, 12));
    const perTick = Math.ceil(count / ticks);
    const step = Math.max(16, Math.round(260 / ticks));
    let timer = 0;
    const run = () => {
      let i = 0;
      const tick = () => {
        i = Math.min(count, i + perTick);
        setShown(i);
        if (i < count) timer = window.setTimeout(tick, step);
      };
      timer = window.setTimeout(tick, 30);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          run();
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [count, stepMs]);

  return { ref, shown };
}

/** Counts up to a target once visible. */
export function useCountUp(target: number, duration = 700) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
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
