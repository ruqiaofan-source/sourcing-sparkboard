import { Link } from "react-router-dom";
import { Receipt, ArrowRight, Banknote, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceMessageCardProps {
  invoice: any;
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  unpaid: { label: "Awaiting payment", cls: "bg-amber-500/15 text-amber-500 border-amber-500/30" },
  paid: { label: "Payment sent", cls: "bg-blue-500/15 text-blue-500 border-blue-500/30" },
  confirmed: { label: "Payment confirmed", cls: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" },
};

export default function InvoiceMessageCard({ invoice }: InvoiceMessageCardProps) {
  if (!invoice) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        Invoice no longer available.
      </div>
    );
  }

  const status = invoice.payment_status || "unpaid";
  const badge = STATUS_BADGE[status] || STATUS_BADGE.unpaid;
  const symbol = invoice.currency === "USD" ? "$" : invoice.currency === "EUR" ? "€" : `${invoice.currency} `;

  return (
    <div className="rounded-2xl border-2 border-primary/40 bg-card overflow-hidden w-full min-w-[300px] max-w-md shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-primary/[0.04]">
        <Receipt className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold text-card-foreground">Invoice issued</span>
        <span className={`ml-auto text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Invoice #</span>
          <span className="font-mono text-card-foreground">{invoice.invoice_number}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Product</span>
          <span className="text-card-foreground truncate ml-2">{invoice.product_name}</span>
        </div>
        <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 flex items-end justify-between">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Total due</span>
          <span className="text-2xl font-heading font-bold text-primary leading-none">
            {symbol}{Number(invoice.total_amount).toFixed(2)}
          </span>
        </div>

        {status === "unpaid" && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.07] px-3 py-2.5 flex items-start gap-2">
            <Banknote className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-snug text-card-foreground">
              <span className="font-semibold">How to pay:</span> open the invoice to see our EUR, USD and HKD bank accounts. Use invoice <span className="font-mono">{invoice.invoice_number}</span> as the transfer reference.
            </p>
          </div>
        )}

        <Button
          asChild
          size="lg"
          className="w-full mt-1 h-12 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Link to={`/invoice/${invoice.id}`}>
            {status === "unpaid" ? (
              <>
                <Banknote className="h-4 w-4 mr-2" /> View payment instructions
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" /> View invoice
              </>
            )}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
