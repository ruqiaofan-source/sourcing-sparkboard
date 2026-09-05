import { useEffect, useRef, useState } from "react";
import { PackagingStack } from "@/components/PackagingStack";
import { cn } from "@/lib/utils";

interface HeroStackProps {
  className?: string;
  /** Height of the hero section in px, used as the scroll travel. */
  travel?: number;
}

/**
 * Packaging stack for the home hero. Starts fully exploded with a gentle
 * drift, then packs itself as the visitor scrolls the hero out of view.
 */
export function HeroStack({ className, travel }: HeroStackProps) {
  const [explode, setExplode] = useState(1);
  const frame = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const update = () => {
      frame.current = 0;
      const height = travel || window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / height));
      setExplode(1 - p);
    };
    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [travel]);

  return <PackagingStack className={cn(className)} explode={explode} drift instant />;
}

export default HeroStack;
