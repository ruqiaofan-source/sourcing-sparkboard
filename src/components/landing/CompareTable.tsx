import { Reveal } from "@/components/Reveal";

const columns = ["Alibaba", "A freelance agent", "Equilinq"];

const rows: { label: string; cells: [string, string, string] }[] = [
  { label: "Who vets the factory", cells: ["You", "Sometimes", "We do, on site"] },
  { label: "Inspection before shipping", cells: ["No", "Rarely", "Every order, with photo and video proof"] },
  {
    label: "Pricing",
    cells: ["Listing price, fees unclear", "Markup, often hidden", "Itemised: factory, logistics, operations, service fee"],
  },
  { label: "Minimum order", cells: ["Factory MOQ", "Factory MOQ", "From 10 units on standard products"] },
  {
    label: "Accountability",
    cells: ["Platform dispute process", "A person, no contract", "One Hong Kong company, contracts you can read"],
  },
  { label: "Contact", cells: ["Supplier chat", "WhatsApp", "One named agent, in your time zone"] },
];

export function CompareTable() {
  return (
    <Reveal>
      <div className="mt-12 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr>
              <th scope="col" className="label-mono-up border-b border-border bg-background px-5 py-4 text-muted-foreground">
                &nbsp;
              </th>
              {columns.map((col, i) => (
                <th
                  key={col}
                  scope="col"
                  className={`label-mono-up border-b border-border px-5 py-4 ${
                    i === 2 ? "bg-primary/5 text-primary" : "bg-background text-muted-foreground"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="border-b border-border bg-background px-5 py-4 text-sm font-medium text-primary">
                  {row.label}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={i}
                    className={`border-b border-border px-5 py-4 text-sm leading-relaxed ${
                      i === 2 ? "bg-primary/5 font-medium text-primary" : "bg-card text-body-ink"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

export default CompareTable;
