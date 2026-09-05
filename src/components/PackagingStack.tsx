import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Eight cut-out layers of one packaging assembly, drawn bottom to top on a
 * square stage. `explode` (0 to 1) drives the vertical spacing with transforms
 * only, so there is never a layout pass while scrolling.
 */
export interface PackagingLayer {
  slug: string;
  label: string;
  /** Natural width as a percentage of the stage. */
  width: number;
  /** Intrinsic pixel size of the source image. */
  w: number;
  h: number;
  /** Vertical offset as a percentage of the stage when nested (explode 0). */
  nested: number;
}

export const packagingLayers: PackagingLayer[] = [
  { slug: "01-carton", label: "Shipping carton", width: 78, w: 1200, h: 721, nested: 26 },
  { slug: "02-box", label: "Rigid box", width: 58, w: 1200, h: 749, nested: 14 },
  { slug: "03-lid", label: "Box lid", width: 58, w: 1200, h: 752, nested: 4 },
  { slug: "04-insert", label: "Foam insert", width: 50, w: 1107, h: 773, nested: 10 },
  { slug: "05-tissue", label: "Tissue", width: 52, w: 1200, h: 982, nested: 4 },
  { slug: "06-product", label: "Product", width: 22, w: 1076, h: 919, nested: -2 },
  { slug: "07-card", label: "Thank you card", width: 26, w: 1200, h: 661, nested: -9 },
  { slug: "08-mailer", label: "Mailer bag", width: 54, w: 1200, h: 1258, nested: -24 },
];

const COUNT = packagingLayers.length;
/** Evenly spread across the full stage height at explode 1. */
const exploded = (i: number) => 45 - (i * 90) / (COUNT - 1);
const scaleFor = (i: number) => 1 - (i * 0.06) / (COUNT - 1);

export interface PackagingStackProps {
  className?: string;
  /** 0 nested, 1 spread evenly along the vertical axis. */
  explode?: number;
  /** Layer indexes drawn at full opacity while the rest drop back. */
  highlight?: number[];
  /** Gentle floating loop, one timing per layer. */
  drift?: boolean;
  /** Black stage, for use inside a dark band. */
  dark?: boolean;
  /** Skip the smooth transition, e.g. while scroll drives explode. */
  instant?: boolean;
  alt?: string;
}

export function PackagingStack({
  className,
  explode = 1,
  highlight,
  drift = false,
  dark = false,
  instant = false,
  alt = "Exploded view of a packaging assembly: shipping carton, rigid box, lid, foam insert, tissue, product, card and mailer bag",
}: PackagingStackProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setSize(Math.min(box.width, box.height) || box.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /** Poster mode: fully exploded, no drift. */
  const t = reduced ? 1 : Math.min(1, Math.max(0, explode));
  const floating = drift && !reduced;

  return (
    <div
      ref={stageRef}
      role="img"
      aria-label={alt}
      className={cn("relative aspect-square w-full overflow-hidden", dark && "bg-black", className)}
    >
      {packagingLayers.map((layer, i) => {
        const y = ((layer.nested + (exploded(i) - layer.nested) * t) / 100) * size;
        const on = !highlight || highlight.includes(i);
        return (
          <div
            key={layer.slug}
            className={cn(
              "absolute left-1/2 top-1/2",
              !instant && !reduced && "transition-transform duration-500 ease-out",
            )}
            style={{
              width: `${layer.width}%`,
              transform: `translate(-50%, -50%) translateY(${y.toFixed(2)}px) scale(${scaleFor(i)})`,
              zIndex: i + 1,
            }}
          >
            <div
              className="transition-opacity duration-300"
              style={{
                opacity: on ? 1 : 0.4,
                animation: floating
                  ? `stack-drift ${6 + (i % 4) * 0.75}s ease-in-out ${(i * 0.4).toFixed(2)}s infinite`
                  : undefined,
              }}
            >
              {highlight && on && (
                <span className="pointer-events-none absolute -inset-[3%] rounded-xl border border-white/40" />
              )}
              <picture>
                <source srcSet={`/stack/${layer.slug}.webp`} type="image/webp" />
                <img
                  src={`/stack/${layer.slug}.png`}
                  alt=""
                  width={layer.w}
                  height={layer.h}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full select-none"
                  draggable={false}
                />
              </picture>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PackagingStack;
