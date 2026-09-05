import { useEffect, useState } from "react";
import { PackagingStack } from "@/components/PackagingStack";
import { usePinnedCycle } from "./cycle/usePinnedCycle";
import { prefersReducedMotion } from "./cycle/useSequence";

const ALL = [0, 1, 2, 3, 4, 5, 6, 7];

export interface CycleStep {
  n: string;
  slug: string;
  title: string;
  line: string;
  count: number;
  highlight: number[];
  /** Extra mono overlay drawn on the stage. */
  overlay?: "frame" | "checks" | "tag";
}

export const customizationSteps: CycleStep[] = [
  { n: "01", slug: "brand-assets", title: "Brand assets", line: "Custom bags, labels, hangtags, tissue, boxes, mailers", count: 8, highlight: [6, 4, 7] },
  { n: "02", slug: "branding-labeling", title: "Branding and labeling", line: "Label sewing, printing, pasting, tag switching", count: 8, highlight: [5, 6] },
  { n: "03", slug: "apparel-finishing", title: "Apparel finishing", line: "Trimming, ironing, folding, reinforcement, measurement", count: 8, highlight: [4] },
  { n: "04", slug: "product-packaging", title: "Product packaging", line: "Wrapping, sealing, dust and vacuum bags, gift wrap", count: 9, highlight: [1, 2, 3] },
  { n: "05", slug: "parcel-reinforcement", title: "Parcel reinforcement", line: "Filling, corner protectors, crating, film, pallets", count: 13, highlight: [0] },
  { n: "06", slug: "photography-media", title: "Photography and media", line: "Product, detail, parcel and model photos, 360 video", count: 7, highlight: ALL, overlay: "frame" },
  { n: "07", slug: "quality-inspection", title: "Quality inspection", line: "Standard, detailed, electrical, pre-shipment checks", count: 7, highlight: ALL, overlay: "checks" },
  { n: "08", slug: "oem-odm", title: "OEM and ODM", line: "Custom manufacturing, source finding, listings", count: 16, highlight: [5], overlay: "tag" },
];

/** Corner brackets, check marks or a mono tag, drawn over the black stage. */
function Overlay({ kind }: { kind?: CycleStep["overlay"] }) {
  if (!kind) return null;
  if (kind === "frame") {
    return (
      <div className="pointer-events-none absolute inset-6">
        <span className="absolute left-0 top-0 h-6 w-6 border-l border-t border-white/50" />
        <span className="absolute right-0 top-0 h-6 w-6 border-r border-t border-white/50" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-white/50" />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-white/50" />
        <span className="label-mono absolute -top-5 left-0 text-white/50">photo</span>
      </div>
    );
  }
  if (kind === "checks") {
    return (
      <div className="pointer-events-none absolute inset-6">
        {["left-0 top-0", "right-0 top-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
          <span key={pos} className={`label-mono absolute ${pos} text-white/60`}>
            ok
          </span>
        ))}
      </div>
    );
  }
  return (
    <span className="label-mono pointer-events-none absolute left-6 top-6 rounded-full border border-white/25 px-2.5 py-1 text-white/70">
      custom
    </span>
  );
}

function Stage({ step, className }: { step: CycleStep; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/12 bg-black ${className ?? ""}`}>
      <PackagingStack explode={0.55} highlight={step.highlight} dark />
      <Overlay kind={step.overlay} />
    </div>
  );
}

const Header = () => (
  <>
    <p className="label-mono-up text-white/60">What we can add</p>
    <h2 className="mt-4 max-w-xl text-3xl font-bold text-white sm:text-4xl">
      Eight categories, applied at our warehouse before your order ships.
    </h2>
  </>
);

function StepMeta({ step }: { step: CycleStep }) {
  return (
    <p className="label-mono-up mt-4 text-white/50">
      {step.title} · {step.count} services
    </p>
  );
}

function PinnedCycle({ onPick }: { onPick: (slug: string) => void }) {
  const { trackRef, active, goTo } = usePinnedCycle(customizationSteps.length);
  const step = customizationSteps[active];
  const fill = `${((active + 1) / customizationSteps.length) * 100}%`;

  return (
    <div
      ref={trackRef}
      className="relative hidden lg:block"
      style={{ height: `${customizationSteps.length * 100}svh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <Header />
            <div className="mt-10 grid grid-cols-[2px_1fr] gap-6">
              <div className="relative bg-white/15">
                <div className="absolute inset-x-0 top-0 bg-white transition-[height] duration-300 ease-out" style={{ height: fill }} />
              </div>
              <ol className="grid gap-2">
                {customizationSteps.map((s, i) => {
                  const on = i === active;
                  return (
                    <li key={s.n}>
                      <button type="button" onClick={() => goTo(i)} aria-current={on ? "step" : undefined} className="w-full text-left">
                        <span className={`label-mono mr-3 ${on ? "text-white" : "text-white/35"}`}>{s.n}</span>
                        <span className={`text-sm font-medium ${on ? "text-white" : "text-white/35"}`}>{s.title}</span>
                      </button>
                      {on && (
                        <>
                          <span className="mt-1 block max-w-md text-sm leading-relaxed text-white/70">{s.line}</span>
                          <button
                            type="button"
                            onClick={() => onPick(s.slug)}
                            className="btn-nudge mt-2 inline-flex items-center gap-2 text-sm font-medium text-white"
                          >
                            See the {s.count} services
                          </button>
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div>
            <Stage step={step} className="h-[60svh] min-h-[26rem]" />
            <StepMeta step={step} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedCycle({ className, onPick }: { className?: string; onPick: (slug: string) => void }) {
  return (
    <div className={className}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Header />
        <div className="mt-10 grid gap-8">
          {customizationSteps.map((s) => (
            <div key={s.n}>
              <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-5">
                <span className="label-mono-up text-white">{s.n}</span>
                <h3 className="mt-3 text-base font-semibold text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{s.line}</p>
                <button
                  type="button"
                  onClick={() => onPick(s.slug)}
                  className="btn-nudge mt-4 inline-flex items-center gap-2 text-sm font-medium text-white"
                >
                  See the {s.count} services
                </button>
              </div>
              <Stage step={s} className="mt-4" />
              <StepMeta step={s} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CustomizationCycle({ onPick }: { onPick: (slug: string) => void }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (reduced) return <StackedCycle onPick={onPick} />;

  return (
    <>
      <PinnedCycle onPick={onPick} />
      <StackedCycle className="lg:hidden" onPick={onPick} />
    </>
  );
}

export default CustomizationCycle;
