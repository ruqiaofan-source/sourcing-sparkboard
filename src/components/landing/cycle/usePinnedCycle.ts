import { useEffect, useRef, useState } from "react";

/**
 * Pinned scroll cycle: one viewport of scroll per step while the stage stays
 * sticky. Returns the track ref, the active step index and a scroll-to-step
 * helper. Shared by the home product cycle and the customization cycle.
 */
export function usePinnedCycle(count: number) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      setActive(Math.min(count - 1, Math.floor(progress * count)));
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
  }, [count]);

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (travel * (index + 0.5)) / count, behavior: "smooth" });
  };

  return { trackRef, active, goTo };
}
