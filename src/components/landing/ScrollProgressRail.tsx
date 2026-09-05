import { ReactNode, useEffect, useRef, useState } from "react";

interface ScrollProgressRailProps {
  children: ReactNode;
}

/**
 * Thin rail that fills as the section travels through the viewport.
 * Vertical next to the grid on desktop, horizontal above it on mobile.
 * Plain scroll listener, throttled with requestAnimationFrame.
 */
export function ScrollProgressRail({ children }: ScrollProgressRailProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height + window.innerHeight;
      const passed = window.innerHeight - rect.top;
      setProgress(Math.min(1, Math.max(0, passed / travel)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const pct = `${Math.round(progress * 100)}%`;

  return (
    <div ref={ref} className="mt-12">
      <div className="mb-6 h-[2px] w-full bg-white/15 lg:hidden">
        <div className="h-full bg-white transition-[width] duration-150 ease-out" style={{ width: pct }} />
      </div>
      <div className="lg:grid lg:grid-cols-[2px_1fr] lg:gap-8">
        <div className="relative hidden bg-white/15 lg:block">
          <div className="absolute inset-x-0 top-0 bg-white transition-[height] duration-150 ease-out" style={{ height: pct }} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default ScrollProgressRail;
