import { Link } from "react-router-dom";
import { Receipt, ArrowRight } from "lucide-react";
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
    <div className="rounded-xl border border-primary/30 bg-card overflow-hidden min-w-[260px] max-w-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-primary/[0.06]">
        <Receipt className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-card-foreground">Invoice issued</span>
        <span className={`ml-auto text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Invoice #</span>
          <span className="font-mono text-card-foreground">{invoice.invoice_number}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Product</span>
          <span className="text-card-foreground truncate ml-2">{invoice.product_name}</span>
        </div>
        <div className="flex items-end justify-between pt-1">
          <span className="text-xs text-muted-foreground">Total due</span>
          <span className="text-lg font-heading font-bold text-primary">
            {symbol}{Number(invoice.total_amount).toFixed(2)}
          </span>
        </div>
        <Button
          asChild
          size="sm"
          className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link to={`/invoice/${invoice.id}`}>
            View invoice <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
