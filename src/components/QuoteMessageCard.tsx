import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X, Factory, Truck, DollarSign, ArrowRight, Banknote, Loader2, Copy, Paperclip, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuoteMessageCardProps {
  quote: any;
  requestId: string;
  /** When true, current viewer is the customer (can accept/reject) */
  isCustomer: boolean;
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  },
  accepted: {
    label: "Accepted",
    cls: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

export default function QuoteMessageCard({ quote, requestId, isCustomer }: QuoteMessageCardProps) {
  const queryClient = useQueryClient();

  const respond = useMutation({
    mutationFn: async (action: "accepted" | "rejected") => {
      if (action === "accepted") {
        const { data, error } = await supabase.functions.invoke("accept-quote", {
          body: { quote_id: quote.id },
        });
        if (error) throw error;
        if ((data as any)?.error) throw new Error((data as any).error);
        return data;
      }
      const { error } = await supabase
        .from("quotes")
        .update({ status: "rejected" } as any)
        .eq("id", quote.id);
      if (error) throw error;
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({ queryKey: ["request-messages", requestId] });
      queryClient.invalidateQueries({ queryKey: ["request-quotes", requestId] });
      queryClient.invalidateQueries({ queryKey: ["request-quotes-chat", requestId] });
      queryClient.invalidateQueries({ queryKey: ["customer-request-quotes", requestId] });
      queryClient.invalidateQueries({ queryKey: ["customer-request-invoices", requestId] });
      queryClient.invalidateQueries({ queryKey: ["quote-invoice", quote?.id] });
      toast({
        title: action === "accepted" ? "Quote accepted!" : "Quote rejected",
        description:
          action === "accepted"
            ? "Your invoice has been issued. Check your email for payment details."
            : "The agent will be notified.",
      });
    },
    onError: (e: any) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const status = (quote?.status as string) || "pending";
  const badge = STATUS_BADGE[status] || STATUS_BADGE.pending;
  const currency = quote?.currency === "USD" ? "$" : "€";
  const detailPath = isCustomer
    ? `/sourcing-requests/${requestId}`
    : `/agent/requests/${requestId}`;

  // After acceptance, fetch the invoice tied to this quote so the customer
  // can use its number as the transfer reference.
  const { data: invoice } = useQuery({
    queryKey: ["quote-invoice", quote?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("id, invoice_number")
        .eq("quote_id", quote.id)
        .maybeSingle();
      return data;
    },
    enabled: !!quote?.id && status === "accepted",
  });

  const copyInvoiceNumber = () => {
    if (!invoice?.invoice_number) return;
    navigator.clipboard.writeText(invoice.invoice_number);
    toast({ title: "Copied", description: invoice.invoice_number });
  };

  // Resolve signed URLs for any attachments the agent uploaded with this quote,
  // so the customer can see/download photos and files directly from the chat card.
  const attachmentPaths = (Array.isArray((quote as any)?.attachment_paths)
    ? ((quote as any).attachment_paths as string[])
    : []) || [];
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    if (attachmentPaths.length === 0) return;
    let cancelled = false;
    (async () => {
      const next: Record<string, string> = {};
      for (const p of attachmentPaths) {
        const { data } = await supabase.storage
          .from("sourcing-attachments")
          .createSignedUrl(p, 3600);
        if (data?.signedUrl) next[p] = data.signedUrl;
      }
      if (!cancelled) setSignedUrls(next);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(attachmentPaths)]);

  return (
    <div className="w-full rounded-xl border border-primary/30 bg-card/95 p-4 shadow-[var(--shadow-card)] min-w-[260px] max-w-[360px]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">
            Sourcing Quote
          </p>
          <p className="text-sm font-medium text-card-foreground mt-0.5">
            {quote?.factory_name || "Verified Factory"}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="space-y-1.5 mb-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Factory className="h-3 w-3" /> Factory
          </span>
          <span className="font-medium text-card-foreground">
            {currency}
            {Number(quote?.factory_cost || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="h-3 w-3" /> Service
          </span>
          <span className="font-medium text-card-foreground">
            {currency}
            {Number(quote?.service_fee || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Truck className="h-3 w-3" /> Logistics
          </span>
          <span className="font-medium text-card-foreground">
            {currency}
            {Number(quote?.logistics_cost || 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground">Total / unit</p>
          <p className="text-lg font-heading font-bold text-primary leading-none">
            {currency}
            {Number(quote?.total_cost || 0).toFixed(2)}
          </p>
        </div>
        <div className="text-right text-[10px] text-muted-foreground space-y-0.5">
          <p>MOQ: {quote?.moq ?? "—"} units</p>
          <p>Delivery: {quote?.delivery_time_days ?? "—"} days</p>
        </div>
      </div>

      {quote?.notes && (
        <p className="text-[11px] text-muted-foreground italic mb-3 border-t border-border/40 pt-2">
          {quote.notes}
        </p>
      )}

      {attachmentPaths.length > 0 && (
        <div className="border-t border-border/40 pt-2 mb-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 flex items-center gap-1">
            <Paperclip className="h-3 w-3" /> Attachments
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {attachmentPaths.map((p) => {
              const url = signedUrls[p];
              const fileName = p.split("/").pop() || "file";
              const cleanName = fileName.replace(/^\d+-[a-z0-9]+-?/, "");
              const isImg = /\.(png|jpe?g|gif|webp|svg|bmp|heic)$/i.test(fileName);
              if (!url) {
                return (
                  <div
                    key={p}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground px-2 py-1.5 rounded-md bg-muted/30 border border-border/50"
                  >
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                  </div>
                );
              }
              if (isImg) {
                return (
                  <a
                    key={p}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-md overflow-hidden border border-border/50"
                  >
                    <img
                      src={url}
                      alt={cleanName}
                      className="w-full h-20 object-cover hover:opacity-90 transition-opacity"
                    />
                  </a>
                );
              }
              return (
                <a
                  key={p}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-1.5 text-[11px] text-primary hover:underline px-2 py-1.5 rounded-md bg-muted/30 border border-border/50 truncate"
                  title={cleanName}
                >
                  <FileText className="h-3 w-3 shrink-0" />
                  <span className="truncate">{cleanName}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {status === "accepted" && invoice?.invoice_number && (
        <div className="rounded-lg border border-primary/30 bg-primary/[0.07] px-3 py-2.5 mb-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Use as transfer reference
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm font-semibold text-primary truncate">
              {invoice.invoice_number}
            </span>
            <button
              onClick={copyInvoiceNumber}
              className="shrink-0 inline-flex items-center gap-1 rounded-md border border-primary/30 bg-background/60 px-2 h-7 text-[10px] font-medium text-primary hover:bg-primary/10 transition-colors"
              title="Copy invoice number"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-1.5">
        {isCustomer && status === "pending" && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 h-8 text-xs"
              disabled={respond.isPending}
              onClick={() => respond.mutate("rejected")}
            >
              {respond.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <X className="h-3 w-3 mr-1" /> Reject
                </>
              )}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 h-8 text-xs"
              disabled={respond.isPending}
              onClick={() => respond.mutate("accepted")}
            >
              {respond.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Check className="h-3 w-3 mr-1" /> Accept & Pay
                </>
              )}
            </Button>
          </>
        )}
        {(!isCustomer || status !== "pending") && (
          <Link
            to={detailPath}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 h-9 text-xs font-semibold transition-colors flex-1 ${
              isCustomer && status === "accepted"
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                : "border border-border/60 bg-background/60 text-card-foreground hover:bg-muted/50"
            }`}
          >
            {isCustomer && status === "accepted" ? (
              <>
                <Banknote className="h-3.5 w-3.5" /> Complete Your Transfer{" "}
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Open request <ArrowRight className="h-3 w-3" />
              </>
            )}
          </Link>
        )}
      </div>
    </div>
  );
}