import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";

interface QuoteComposerSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  requestId: string;
}

export default function QuoteComposerSheet({ open, onOpenChange, requestId }: QuoteComposerSheetProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    factory_cost: "",
    logistics_cost: "",
    service_fee: "",
    delivery_time_days: "14",
    moq: "",
    notes: "",
    currency: "EUR",
  });
  const [attachments, setAttachments] = useState<string[]>([]);

  const setField = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const totalCost =
    (parseFloat(form.factory_cost) || 0) +
    (parseFloat(form.logistics_cost) || 0) +
    (parseFloat(form.service_fee) || 0);

  const reset = () => {
    setForm({
      factory_cost: "",
      logistics_cost: "",
      service_fee: "",
      delivery_time_days: "14",
      moq: "",
      notes: "",
      currency: "EUR",
    });
    setAttachments([]);
  };

  const submit = useMutation({
    mutationFn: async () => {
      // Fetch request details for notifications
      const { data: request } = await supabase
        .from("sourcing_requests")
        .select("id, title, user_id")
        .eq("id", requestId)
        .maybeSingle();
      if (!request) throw new Error("Request not found");

      // 1) Insert quote
      const { data: quoteRow, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          sourcing_request_id: requestId,
          agent_id: user!.id,
          factory_name: "Equilinq Verified Factory",
          factory_cost: parseFloat(form.factory_cost) || 0,
          china_ops_cost: 0,
          logistics_cost: parseFloat(form.logistics_cost) || 0,
          service_fee: parseFloat(form.service_fee) || 0,
          total_cost: totalCost,
          currency: form.currency || "EUR",
          delivery_time_days: parseInt(form.delivery_time_days) || 14,
          moq: parseInt(form.moq) || 1,
          notes: form.notes || null,
          status: "pending",
          attachment_paths: attachments,
          addon_fees: [],
        } as any)
        .select("id")
        .single();
      if (quoteError) throw quoteError;
      const quoteId = (quoteRow as any).id as string;

      // 2) Update request status (best-effort)
      await supabase
        .from("sourcing_requests")
        .update({ status: "quoted", agent_id: user!.id } as any)
        .eq("id", requestId);

      // 3) Insert chat message linked to the quote
      const summary = `New quote: €${totalCost.toFixed(2)}/unit · MOQ ${form.moq || 1} · ${
        form.delivery_time_days || 14
      } days delivery`;
      const { error: msgError } = await supabase
        .from("messages" as any)
        .insert({
          sourcing_request_id: requestId,
          sender_id: user!.id,
          content: summary,
          message_type: "quote",
          quote_id: quoteId,
          attachment_paths: [],
        } as any);
      if (msgError) {
        // Rollback the quote so we don't leak orphans
        await supabase.from("quotes").delete().eq("id", quoteId);
        throw msgError;
      }

      // 4) Notify customer in-app
      await supabase.from("notifications" as any).insert({
        user_id: (request as any).user_id,
        title: "Quote Ready",
        message: `Your sourcing request "${(request as any).title}" has a new quote. Review and accept to proceed.`,
        type: "quote_ready",
        link: `/sourcing-requests/${requestId}`,
      } as any);

      // 5) Admin email (best-effort)
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "admin-notification",
            recipientEmail: "admin@equilinq.eu",
            idempotencyKey: `admin-new-quote-${requestId}-${user!.id}-${Date.now()}`,
            templateData: {
              eventType: "new_quote",
              title: "New quote submitted by agent",
              summary: `An agent submitted a quote for "${(request as any).title}".`,
              details: {
                Request: (request as any).title,
                "Total cost": `${totalCost.toFixed(2)} €`,
                MOQ: form.moq,
                "Delivery (days)": form.delivery_time_days,
              },
              link: `${window.location.origin}/admin/requests`,
            },
          },
        });
      } catch (e) {
        console.warn("Admin notification failed", e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-messages", requestId] });
      queryClient.invalidateQueries({ queryKey: ["request-quotes", requestId] });
      queryClient.invalidateQueries({ queryKey: ["customer-request-quotes", requestId] });
      queryClient.invalidateQueries({ queryKey: ["agent-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["customer-conversations"] });
      toast({ title: "Quote sent!", description: "The customer will see it in the chat." });
      reset();
      onOpenChange(false);
    },
    onError: (e: any) =>
      toast({ title: "Couldn't send quote", description: e.message, variant: "destructive" }),
  });

  const isValid =
    (parseFloat(form.factory_cost) || 0) > 0 &&
    (parseInt(form.moq) || 0) > 0 &&
    (parseInt(form.delivery_time_days) || 0) > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Send a quote in chat</SheetTitle>
          <SheetDescription>
            The customer will receive this as a quote card inside the conversation.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="factory_cost">Factory cost (€/unit)</Label>
              <Input
                id="factory_cost"
                type="number"
                min="0"
                step="0.01"
                value={form.factory_cost}
                onChange={(e) => setField("factory_cost", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="logistics_cost">Logistics (€/unit)</Label>
              <Input
                id="logistics_cost"
                type="number"
                min="0"
                step="0.01"
                value={form.logistics_cost}
                onChange={(e) => setField("logistics_cost", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="service_fee">Service fee (€/unit)</Label>
              <Input
                id="service_fee"
                type="number"
                min="0"
                step="0.01"
                value={form.service_fee}
                onChange={(e) => setField("service_fee", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="moq">MOQ (units)</Label>
              <Input
                id="moq"
                type="number"
                min="1"
                value={form.moq}
                onChange={(e) => setField("moq", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="delivery_time_days">Delivery time (days)</Label>
              <Input
                id="delivery_time_days"
                type="number"
                min="1"
                value={form.delivery_time_days}
                onChange={(e) => setField("delivery_time_days", e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total per unit</span>
            <span className="text-lg font-heading font-bold text-primary">
              €{totalCost.toFixed(2)}
            </span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Anything the customer should know about this quote"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Attachments (optional)</Label>
            <FileUpload
              folder={`quotes/${requestId}`}
              files={attachments}
              onChange={setAttachments}
              maxFiles={5}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={submit.isPending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!isValid || submit.isPending}
              onClick={() => submit.mutate()}
            >
              {submit.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <Send className="h-4 w-4 mr-1.5" />
              )}
              Send quote
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}