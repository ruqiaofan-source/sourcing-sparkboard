import { Check, ArrowRight, Package } from "lucide-react";
import { useSequence, useCountUp } from "./useSequence";

const item = (on: boolean) =>
  `transition-all duration-300 ease-out ${on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full w-full flex-col justify-center gap-4 overflow-hidden p-6 sm:p-8">{children}</div>
);

/* 01 -------------------------------------------------------------------- */

const requestFields = [
  { label: "Product", value: "Cotton tote bag, 320 gsm" },
  { label: "Quantity", value: "500" },
  { label: "Target unit price", value: "EUR 2.90" },
  { label: "Branding", value: "1-colour print" },
];

export function RequestFormArtefact() {
  const { ref, shown } = useSequence(requestFields.length + 1, 130);
  return (
    <Frame>
      <div ref={ref} className="grid gap-3">
        <p className="label-mono-up text-white/50">New sourcing request</p>
        {requestFields.map((field, i) => (
          <div key={field.label} className={`rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 ${item(shown > i)}`}>
            <p className="label-mono text-white/45">{field.label}</p>
            <p className="mt-1 text-sm text-white/85">
              {field.value}
              {shown === i + 1 && (
                <span aria-hidden="true" className="ml-1 inline-block h-4 w-px animate-pulse bg-white align-middle" />
              )}
            </p>
          </div>
        ))}
        <p className={`label-mono-up text-white ${item(shown > requestFields.length)}`}>Submitted</p>
      </div>
    </Frame>
  );
}

/* 02 -------------------------------------------------------------------- */

const checks = ["Business licence verified", "Export history", "Sample quality", "Capacity for 500"];
const factories = ["Factory A", "Factory B", "Factory C"];

export function VettingArtefact() {
  const { ref, shown } = useSequence(factories.length * checks.length + 1, 45);
  return (
    <Frame>
      <div ref={ref} className="grid gap-3">
        <p className="label-mono-up text-white/50">Supplier vetting</p>
        {factories.map((factory, f) => (
          <div key={factory} className="rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-white/85">{factory}</p>
              {f === 2 && (
                <span className={`label-mono-up text-white ${item(shown >= factories.length * checks.length)}`}>
                  Shortlisted
                </span>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              {checks.map((check, c) => (
                <p key={check} className={`label-mono flex items-center gap-1.5 text-white/60 ${item(shown > f * checks.length + c)}`}>
                  <Check className="h-3 w-3 shrink-0 text-white" aria-hidden="true" />
                  {check}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* 03 -------------------------------------------------------------------- */

const quoteRows = [
  { label: "Factory cost", value: 1450 },
  { label: "Logistics and customs", value: 620 },
  { label: "China operations", value: 180 },
  { label: "Service fee", value: 135 },
];
const quoteTotal = quoteRows.reduce((s, r) => s + r.value, 0);
const money = (n: number) =>
  `EUR ${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function QuoteArtefact() {
  const { ref, shown } = useSequence(quoteRows.length, 130);
  const total = useCountUp(quoteTotal, 900);
  return (
    <Frame>
      <div ref={ref}>
        <p className="label-mono-up border-b border-white/12 pb-3 text-white/50">
          Itemised quote · 500 units · cotton tote bags
        </p>
        <dl>
          {quoteRows.map((row, i) => (
            <div key={row.label} className={`flex items-baseline justify-between gap-4 border-b border-white/12 py-3 ${item(shown > i)}`}>
              <dt className="text-sm text-white/85">{row.label}</dt>
              <dd className="label-mono shrink-0 text-white">{money(row.value)}</dd>
            </div>
          ))}
        </dl>
        <div className="flex items-baseline justify-between gap-4 pt-4">
          <p className="text-base font-semibold text-white">Total</p>
          <p className="text-base font-semibold text-white">
            <span ref={total.ref}>{money(total.value)}</span>
          </p>
        </div>
        <p className="label-mono mt-4 text-white/45">Example figures</p>
      </div>
    </Frame>
  );
}

/* 04 -------------------------------------------------------------------- */

export function AcceptPayArtefact() {
  const { ref, shown } = useSequence(3, 180);
  return (
    <Frame>
      <div ref={ref} className="grid gap-4">
        <div className={`flex items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/[0.03] px-4 py-4 ${item(shown > 0)}`}>
          <p className="text-sm text-white/85">Quote accepted by the customer</p>
          <span className="label-mono-up shrink-0 text-white">Accepted</span>
        </div>
        <p className={`label-mono text-white/70 ${item(shown > 1)}`}>Order EQ-2026-0417 confirmed</p>
        <div className={`flex items-baseline justify-between gap-3 border-t border-white/12 pt-4 ${item(shown > 2)}`}>
          <p className="text-sm text-white/85">Production starts</p>
          <span className="label-mono-up text-white/60">Day 0</span>
        </div>
      </div>
    </Frame>
  );
}

/* 05 -------------------------------------------------------------------- */

const milestones = [
  { label: "Materials in", photo: false },
  { label: "Cutting", photo: true },
  { label: "Printing", photo: false },
  { label: "Sewing", photo: true },
  { label: "Packing", photo: false },
];

export function ProductionArtefact() {
  const { ref, shown } = useSequence(milestones.length, 150);
  return (
    <Frame>
      <div ref={ref}>
        <p className="label-mono-up text-white/50">Production timeline</p>
        <div className="relative mt-8 hidden sm:block">
          <div className="absolute inset-x-0 top-1.5 h-px bg-white/12" />
          <div
            className="absolute left-0 top-1.5 h-px bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${(Math.max(shown - 1, 0) / (milestones.length - 1)) * 100}%` }}
          />
          <div className="relative grid grid-cols-5 gap-1">
            {milestones.map((m, i) => (
              <div key={m.label} className="flex flex-col items-center px-1 text-center">
                <span
                  aria-hidden="true"
                  className={`h-3 w-3 rounded-full border border-white/40 transition-colors duration-300 ${
                    shown > i ? "bg-white" : "bg-transparent"
                  }`}
                />
                <span className={`label-mono mt-3 leading-snug text-white/70 ${item(shown > i)}`}>{m.label}</span>
                {m.photo && (
                  <span
                    className={`label-mono-up mt-2 rounded-md border border-white/12 px-1.5 py-0.5 leading-snug text-white/60 ${item(shown > i)}`}
                  >
                    Photo update
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <ol className="mt-6 grid gap-3 sm:hidden">
          {milestones.map((m, i) => (
            <li key={m.label} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`h-3 w-3 shrink-0 rounded-full border border-white/40 transition-colors duration-300 ${
                  shown > i ? "bg-white" : "bg-transparent"
                }`}
              />
              <span className={`label-mono text-white/70 ${item(shown > i)}`}>{m.label}</span>
              {m.photo && (
                <span className={`label-mono-up rounded-md border border-white/12 px-1.5 py-0.5 text-white/60 ${item(shown > i)}`}>
                  Photo update
                </span>
              )}
            </li>
          ))}
        </ol>

      </div>
    </Frame>
  );
}

/* 06 -------------------------------------------------------------------- */

const inspection = [
  { label: "Stitching", result: "Pass" },
  { label: "Print alignment", result: "Pass" },
  { label: "Colour match", result: "Pass" },
  { label: "Packaging", result: "Pass" },
  { label: "Measurements", result: "1 deviation, corrected" },
];

export function InspectionArtefact() {
  const { ref, shown } = useSequence(inspection.length + 4, 110);
  return (
    <Frame>
      <div ref={ref}>
        <p className="label-mono-up border-b border-white/12 pb-3 text-white/50">
          Pre-shipment inspection · 500 units · AQL 2.5
        </p>
        <dl>
          {inspection.map((row, i) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4 border-b border-white/12 py-2.5">
              <dt className="text-sm text-white/85">{row.label}</dt>
              <dd className={`label-mono shrink-0 text-white/70 ${item(shown > i)}`}>{row.result}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-lg border border-white/12 transition-colors duration-300 ${
                shown > inspection.length + i ? "bg-white/10" : "bg-transparent"
              }`}
            >
              <span className="label-mono text-white/45">photo</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* 07 -------------------------------------------------------------------- */

const legs = ["Shenzhen", "Hong Kong", "Rotterdam", "Your door"];

export function ShippingArtefact() {
  const { ref, shown } = useSequence(legs.length, 150);
  return (
    <Frame>
      <div ref={ref}>
        <div className="overflow-hidden rounded-xl border border-white/12">
          <img
            src="/hero/hero-poster.jpg"
            alt="Packed cartons ready for shipping"
            loading="lazy"
            className="block h-36 w-full object-cover object-bottom sm:h-44"
          />
        </div>
        <div className="relative mt-8">
          <div className="absolute inset-x-0 top-1.5 h-px bg-white/12" />
          <div
            className="absolute left-0 top-1.5 h-px bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${(Math.max(shown - 1, 0) / (legs.length - 1)) * 100}%` }}
          />
          <div className="relative grid grid-cols-4 gap-2">
            {legs.map((leg, i) => (
              <div key={leg} className="flex flex-col items-center text-center">
                <span
                  aria-hidden="true"
                  className={`h-3 w-3 rounded-full border border-white/40 transition-colors duration-300 ${
                    shown > i ? "bg-white" : "bg-transparent"
                  }`}
                />
                <span className={`label-mono mt-3 text-white/70 ${item(shown > i)}`}>{leg}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="label-mono-up mt-8 flex items-center gap-2 text-white/60">
          <Package className="h-3.5 w-3.5" aria-hidden="true" />
          Consolidated · DDP · tracking live
        </p>
      </div>
    </Frame>
  );
}

/* 08 -------------------------------------------------------------------- */

export function DeliveredArtefact() {
  const { ref, shown } = useSequence(3, 180);
  return (
    <Frame>
      <div ref={ref} className="grid gap-5">
        <div className={`rounded-xl border border-white/12 bg-white/[0.03] px-5 py-6 ${item(shown > 0)}`}>
          <p className="label-mono-up text-white/50">Order EQ-2026-0417</p>
          <p className="mt-3 flex items-center gap-2 text-base font-semibold text-white">
            <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
            Delivered · 500 units · 0 open issues
          </p>
        </div>
        <div className={item(shown > 1)}>
          <span className="btn-nudge inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2 text-sm font-medium text-white">
            Reorder
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <p className={`label-mono text-white/60 ${item(shown > 2)}`}>Your agent stays on the order</p>
      </div>
    </Frame>
  );
}
