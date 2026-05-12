import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X, Factory, Truck, DollarSign, ArrowRight, Banknote, Loader2 } from "lucide-react";
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
      queryClient.invalidateQueries({ queryKey: ["customer-request-quotes", requestId] });
      queryClient.invalidateQueries({ queryKey: ["customer-request-invoices", requestId] });
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