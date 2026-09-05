import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { prefersReducedMotion } from "./cycle/useSequence";
import {
  RequestFormArtefact,
  VettingArtefact,
  QuoteArtefact,
  AcceptPayArtefact,
  ProductionArtefact,
  InspectionArtefact,
  ShippingArtefact,
  DeliveredArtefact,
} from "./cycle/artefacts";

const steps = [
  { n: "01", title: "Submit your sourcing request", desc: "Share your product specs, quantity, and budget.", Artefact: RequestFormArtefact },
  { n: "02", title: "We source and vet suppliers", desc: "We find and screen verified manufacturers for you.", Artefact: VettingArtefact },
  { n: "03", title: "Receive your quote", desc: "Transparent, itemised pricing with no hidden fees.", Artefact: QuoteArtefact },
  { n: "04", title: "Accept and pay", desc: "Pay securely and production begins.", Artefact: AcceptPayArtefact },
  { n: "05", title: "Production and monitoring", desc: "Real-time updates with photos and progress reports.", Artefact: ProductionArtefact },
  { n: "06", title: "Quality control inspection", desc: "Final inspection before shipment with photo reports.", Artefact: InspectionArtefact },
  { n: "07", title: "Shipping and logistics", desc: "Consolidated shipping, customs handling, real-time tracking.", Artefact: ShippingArtefact },
  { n: "08", title: "Delivery and support", desc: "Products delivered. Ongoing support for reorders.", Artefact: DeliveredArtefact },
];

export interface ProductCycleProps {
  /** Optional richer per-step descriptions, in step order. */
  descriptions?: string[];
  /** Optional per-step detail page paths, in step order. */
  hrefs?: string[];
}

const Header = () => (
  <>
    <p className="label-mono-up text-white/60">How it works</p>
    <h2 className="mt-4 max-w-xl text-3xl font-bold text-white sm:text-4xl">
      Eight steps from request to delivery, every one visible in your dashboard.
    </h2>
  </>
);

const ReadMore = ({ hrefs }: { hrefs?: string[] }) =>
  hrefs ? null : (
    <Link to="/how-it-works" className="btn-nudge mt-10 inline-flex items-center gap-2 text-sm font-medium text-white">
      Read the full process <ArrowRight className="h-4 w-4" />
    </Link>
  );

const StagePanel = ({ children }: { children: React.ReactNode }) => (
  <div className="h-[60svh] min-h-[26rem] overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04]">{children}</div>
);


/** Desktop pinned cycle: one viewport of scroll per step, sticky stage. */
function PinnedCycle({ descriptions, hrefs }: ProductCycleProps) {

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
      setActive(Math.min(steps.length - 1, Math.floor(progress * steps.length)));
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

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (travel * (index + 0.5)) / steps.length, behavior: "smooth" });
  };

  const Artefact = steps[active].Artefact;
  const fill = `${((active + 1) / steps.length) * 100}%`;

  return (
    <div ref={trackRef} className="relative hidden md:block" style={{ height: `${steps.length * 100}svh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <Header />
            <div className="mt-10 grid grid-cols-[2px_1fr] gap-6">
              <div className="relative bg-white/15">
                <div className="absolute inset-x-0 top-0 bg-white transition-[height] duration-300 ease-out" style={{ height: fill }} />
              </div>
              <ol className="grid gap-2">
                {steps.map((step, i) => {
                  const on = i === active;
                  const href = hrefs?.[i];
                  return (
                    <li key={step.n}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-current={on ? "step" : undefined}
                        className="w-full text-left transition-colors duration-300"
                      >
                        <span className={`label-mono mr-3 ${on ? "text-white" : "text-white/35"}`}>{step.n}</span>
                        <span className={`text-sm font-medium ${on ? "text-white" : "text-white/35"}`}>{step.title}</span>
                      </button>
                      {on && (
                        <>
                          <span className="mt-1 block max-w-md text-sm leading-relaxed text-white/70">
                            {descriptions?.[i] ?? step.desc}
                          </span>
                          {href && (
                            <Link
                              to={href}
                              className="btn-nudge mt-2 inline-flex items-center gap-2 text-sm font-medium text-white"
                            >
                              Read this step <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
            <p className="label-mono-up mt-8 text-white/50">
              Step {steps[active].n} of 08
            </p>
            <ReadMore hrefs={hrefs} />

          </div>

          <StagePanel>
            <div key={steps[active].n} className="h-full" style={{ animation: "fade-in 180ms ease-out" }}>
              <Artefact />
            </div>
          </StagePanel>
        </div>
      </div>
    </div>
  );
}

/** Mobile and reduced motion: plain list, each step followed by its artefact. */
function StackedCycle({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
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
      setProgress(Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel)));
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

  return (
    <div className={className}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Header />
        <div ref={ref} className="mt-10">
          <div className="h-[2px] w-full bg-white/15">
            <div
              className="h-full bg-white transition-[width] duration-150 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <div className="mt-8 grid gap-8">
            {steps.map((step) => (
              <div key={step.n}>
                <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-5">
                  <span className="label-mono-up text-white">{step.n}</span>
                  <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/85">{step.desc}</p>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04]">
                  <step.Artefact />
                </div>
              </div>
            ))}
          </div>
        </div>
        <ReadMore />
      </div>
    </div>
  );
}

export function ProductCycle() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (reduced) return <StackedCycle />;

  return (
    <>
      <PinnedCycle />
      <StackedCycle className="md:hidden" />
    </>
  );
}

export default ProductCycle;
