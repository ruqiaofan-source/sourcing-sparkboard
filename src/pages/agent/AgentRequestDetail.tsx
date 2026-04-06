import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Send, Loader2, Factory, Truck, DollarSign, Package, User, MapPin, Leaf, FileText, Paperclip, MessageCircle, Wrench, Receipt, CreditCard, Check, Download, Copy, Link2 } from "lucide-react";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { OrderProgressStepper } from "@/components/OrderProgressStepper";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FileUpload from "@/components/FileUpload";
import RequestChat from "@/components/RequestChat";

const AgentRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { primaryRole } = useRole();
  useRealtimeSync("agent", user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quoteAttachments, setQuoteAttachments] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "details";

  const [quote, setQuote] = useState({
    factory_name: "", factory_cost: "", logistics_cost: "",
    service_fee: "", delivery_time_days: "14", moq: "", notes: "",
  });
  const [addonPrices, setAddonPrices] = useState<Record<string, string>>({});

  const updateQuote = (field: string, value: string) => setQuote((q) => ({ ...q, [field]: value }));

  const addonTotal = Object.values(addonPrices).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
  const totalCost = [quote.factory_cost, quote.logistics_cost, quote.service_fee]
    .reduce((sum, v) => sum + (parseFloat(v) || 0), 0) + addonTotal;

  const { data: request, isLoading } = useQuery({
    queryKey: ["agent-request-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sourcing_requests")
        .select("*, profiles!sourcing_requests_user_id_profiles_fkey(display_name, full_name, phone_number, area_of_residence)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const { data: existingQuotes = [] } = useQuery({
    queryKey: ["request-quotes", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("sourcing_request_id", id!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const { data: messageCount = 0 } = useQuery({
    queryKey: ["request-message-count", id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("messages" as any)
        .select("*", { count: "exact", head: true })
        .eq("sourcing_request_id", id!);
      if (error) return 0;
      return count || 0;
    },
    enabled: !!id && !!user,
  });

  // Fetch agents for assignment (admin only)
  const { data: agents = [] } = useQuery({
    queryKey: ["all-agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id, profiles!inner(display_name, full_name)")
        .in("role", ["agent", "admin"]);
      if (error) throw error;
      return data;
    },
    enabled: !!user && primaryRole === "admin",
  });

  const assignAgent = useMutation({
    mutationFn: async (agentId: string) => {
      const { error } = await supabase.from("sourcing_requests").update({ agent_id: agentId }).eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-request-detail", id] });
      toast({ title: "Agent assigned", description: "Request has been assigned." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["agent-request-invoices", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices" as any)
        .select("*")
        .eq("sourcing_request_id", id!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!id && !!user,
  });

  const { data: order } = useQuery({
    queryKey: ["agent-request-order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("sourcing_request_id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const confirmPayment = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { error } = await supabase.from("invoices" as any)
        .update({ payment_status: "confirmed" } as any)
        .eq("id", invoiceId);
      if (error) throw error;

      // Notify the customer
      if (request) {
        await supabase.from("notifications" as any).insert({
          user_id: request.user_id,
          title: "Payment Confirmed",
          message: `Your payment for "${request.title}" has been confirmed. Production will begin shortly.`,
          type: "payment_confirmed",
          link: `/sourcing-requests/${id}`,
        } as any);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-request-invoices", id] });
      toast({ title: "Payment confirmed", description: "The customer's payment has been confirmed." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const submitQuote = useMutation({
    mutationFn: async () => {
      const requestAddons = (request as any)?.service_addons as string[] | null;
      const addonFeesArr = (requestAddons || [])
        .filter((a: string) => parseFloat(addonPrices[a] || "0") > 0)
        .map((a: string) => ({
          id: a,
          label: a.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          cost: parseFloat(addonPrices[a] || "0"),
        }));

      const { error: quoteError } = await supabase.from("quotes").insert({
        sourcing_request_id: id!, agent_id: user!.id, factory_name: quote.factory_name,
        factory_cost: parseFloat(quote.factory_cost) || 0, china_ops_cost: 0,
        logistics_cost: parseFloat(quote.logistics_cost) || 0, service_fee: parseFloat(quote.service_fee) || 0,
        total_cost: totalCost, currency: request?.currency || "USD",
        delivery_time_days: parseInt(quote.delivery_time_days) || 14, moq: parseInt(quote.moq) || 1,
        notes: quote.notes || null, status: "pending", attachment_paths: quoteAttachments,
        addon_fees: addonFeesArr,
      } as any);
      if (quoteError) throw quoteError;
      const { error: updateError } = await supabase.from("sourcing_requests").update({ status: "quoted", agent_id: user!.id }).eq("id", id!);
      if (updateError) throw updateError;

      // Notify the customer
      await supabase.from("notifications" as any).insert({
        user_id: request.user_id,
        title: "Quote Ready",
        message: `Your sourcing request "${request.title}" has a new quote from ${quote.factory_name}. Review and accept to proceed.`,
        type: "quote_ready",
        link: `/sourcing-requests/${id}`,
      } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-quotes", id] });
      queryClient.invalidateQueries({ queryKey: ["agent-request-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["agent-requests"] });
      toast({ title: "Quote submitted!", description: "The customer will be notified." });
      setSheetOpen(false);
      setQuote({ factory_name: "", factory_cost: "", logistics_cost: "", service_fee: "", delivery_time_days: "14", moq: "", notes: "" });
      setAddonPrices({});
      setQuoteAttachments([]);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <DashboardLayout title="Request Details"><div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-40 w-full" /></div></DashboardLayout>;
  }

  if (!request) {
    return <DashboardLayout title="Request Not Found"><p className="text-muted-foreground">This request doesn't exist or you don't have access.</p></DashboardLayout>;
  }

  const issuedInvoice = invoices.find((inv: any) => inv.status === "issued");
  const acceptedQuote = existingQuotes.find((q: any) => q.status === "accepted");
  const paymentStatus = issuedInvoice?.payment_status || "unpaid";
  const isConfirmed = request.status === "confirmed";

  // Friendly status for agent
  const statusLabel = isConfirmed
    ? paymentStatus === "confirmed"
      ? "In Production"
      : paymentStatus === "paid"
      ? "Payment Received"
      : "Awaiting Payment"
    : request.status === "quoted"
    ? "Quote Sent"
    : request.status === "pending"
    ? "Needs Quote"
    : request.status.charAt(0).toUpperCase() + request.status.slice(1);

  const statusStyle: Record<string, string> = {
    "Needs Quote": "bg-amber-500/15 text-amber-500 border-amber-500/30",
    "Quote Sent": "bg-purple-500/15 text-purple-500 border-purple-500/30",
    "Awaiting Payment": "bg-amber-500/15 text-amber-500 border-amber-500/30",
    "Payment Received": "bg-blue-500/15 text-blue-500 border-blue-500/30",
    "In Production": "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  };

  const tabs = [
    { id: "details", label: "Overview", icon: FileText },
    { id: "chat", label: "Chat", icon: MessageCircle, badge: messageCount },
  ];

  const profile = (request as any).profiles;

  const openFile = async (p: string) => {
    const { data } = await supabase.storage.from("sourcing-attachments").createSignedUrl(p, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  return (
    <DashboardLayout title="Request Details">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/agent/requests" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Requests
        </Link>

        {/* Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">{request.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              By <span className="text-foreground font-medium">{profile?.display_name || "Unknown"}</span> - {new Date(request.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium shrink-0 ${statusStyle[statusLabel] || "bg-muted text-muted-foreground border-border"}`}>
            {statusLabel}
          </span>
        </div>

        {/* Progress stepper */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <OrderProgressStepper
            requestStatus={request.status}
            paymentStatus={paymentStatus}
            orderStatus={order?.status}
          />
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/40 border border-border w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[11px] font-bold ${
                  activeTab === tab.id ? "bg-primary/15 text-primary" : "bg-primary text-primary-foreground"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "details" ? (
          <>
            {/* === ACTION REQUIRED SECTION === */}

            {/* Agent needs to confirm payment */}
            {isConfirmed && issuedInvoice && paymentStatus === "paid" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-xl border-2 border-blue-500/30 bg-blue-500/[0.04] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">Customer Says Payment Sent</h3>
                      <p className="text-xs text-muted-foreground">Verify the bank transfer and confirm to start production</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{issuedInvoice.invoice_number}</p>
                      <p className="text-xs text-muted-foreground">{issuedInvoice.product_name} - {issuedInvoice.quantity} units</p>
                    </div>
                    <span className="text-lg font-heading font-bold text-primary">{issuedInvoice.currency} {Number(issuedInvoice.total_amount).toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={() => confirmPayment.mutate(issuedInvoice.id)}
                    disabled={confirmPayment.isPending}
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-11"
                  >
                    {confirmPayment.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                    Confirm Payment Received
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Payment confirmed - in production */}
            {isConfirmed && issuedInvoice && paymentStatus === "confirmed" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Payment Confirmed - Order In Production</p>
                      <p className="text-xs text-muted-foreground">{issuedInvoice.invoice_number} - {issuedInvoice.currency} {Number(issuedInvoice.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                  <Link to={`/invoice/${issuedInvoice.id}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Download className="h-3.5 w-3.5 mr-1.5" /> Invoice
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Awaiting customer payment (agent can only wait) */}
            {isConfirmed && issuedInvoice && paymentStatus === "unpaid" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Waiting for Customer Payment</p>
                      <p className="text-xs text-muted-foreground">{issuedInvoice.invoice_number} - {issuedInvoice.currency} {Number(issuedInvoice.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                  <Link to={`/invoice/${issuedInvoice.id}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Download className="h-3.5 w-3.5 mr-1.5" /> Invoice
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Submit quote action */}
            {!isConfirmed && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-3">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Send className="h-4 w-4 mr-2" /> Submit Quote
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="font-heading">Submit Quote</SheetTitle>
                      <SheetDescription>Provide transparent pricing breakdown for "{request.title}"</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 mt-6">
                      <div className="space-y-1.5">
                        <Label className="text-sm">Factory Name *</Label>
                        <Input value={quote.factory_name} onChange={(e) => updateQuote("factory_name", e.target.value)} placeholder="e.g., Shenzhen Electronics Co." className="bg-secondary border-border" required />
                      </div>
                      <div className="p-4 rounded-lg border border-border bg-muted/20">
                        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Cost Breakdown ({request.currency})</p>
                        <div className="space-y-3">
                          {[
                            { icon: Factory, label: "Factory Cost", field: "factory_cost", hint: "Raw manufacturing cost per unit" },
                            { icon: DollarSign, label: "Service Fee (8-10%)", field: "service_fee", hint: "Equilinq commission per unit" },
                            { icon: Truck, label: "Logistics & Customs", field: "logistics_cost", hint: "Shipping, freight, customs per unit" },
                          ].map((item) => (
                            <div key={item.field} className="flex items-center gap-3">
                              <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                              <div className="flex-1">
                                <Label className="text-xs text-muted-foreground">{item.label}</Label>
                                <Input type="number" step="0.01" min="0" value={(quote as any)[item.field]} onChange={(e) => updateQuote(item.field, e.target.value)} placeholder="0.00" className="bg-secondary border-border h-9 mt-1" />
                                <p className="text-[11px] text-muted-foreground mt-0.5">{item.hint}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add-on pricing */}
                        {(() => {
                          const addons = (request as any).service_addons as string[] | null;
                          if (!addons || addons.length === 0) return null;
                          return (
                            <div className="mt-4 pt-3 border-t border-border">
                              <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
                                <Wrench className="h-3.5 w-3.5" /> Add-on Fees
                              </p>
                              <div className="space-y-2">
                                {addons.map((addon: string) => (
                                  <div key={addon} className="flex items-center gap-3">
                                    <span className="text-xs text-card-foreground flex-1">
                                      {addon.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </span>
                                    <Input
                                      type="number" step="0.01" min="0"
                                      value={addonPrices[addon] || ""}
                                      onChange={(e) => setAddonPrices((prev) => ({ ...prev, [addon]: e.target.value }))}
                                      placeholder="0.00"
                                      className="bg-secondary border-border h-8 w-28"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                          <span className="text-sm font-medium text-card-foreground">Total per Unit</span>
                          <span className="text-lg font-heading font-bold text-primary">{request.currency} {totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Delivery Time (days)</Label>
                          <Input type="number" min="1" value={quote.delivery_time_days} onChange={(e) => updateQuote("delivery_time_days", e.target.value)} className="bg-secondary border-border h-9" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">MOQ (units)</Label>
                          <Input type="number" min="1" value={quote.moq} onChange={(e) => updateQuote("moq", e.target.value)} placeholder={String(request.quantity)} className="bg-secondary border-border h-9" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Notes for Customer</Label>
                        <Textarea value={quote.notes} onChange={(e) => updateQuote("notes", e.target.value)} placeholder="Factory notes, lead time details, material options..." rows={3} className="bg-secondary border-border resize-none" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Attachments</Label>
                        <FileUpload folder="quotes" files={quoteAttachments} onChange={setQuoteAttachments} maxFiles={5} />
                      </div>
                      <Button onClick={() => submitQuote.mutate()} disabled={submitQuote.isPending || !quote.factory_name || !quote.factory_cost} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11">
                        {submitQuote.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                        Submit Quote to Customer
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <Button variant="outline" onClick={() => setSearchParams({ tab: "chat" })} className="border-primary/30 text-primary hover:bg-primary/10">
                  <MessageCircle className="h-4 w-4 mr-2" /> Chat with Customer
                  {messageCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[11px] font-bold bg-primary text-primary-foreground">
                      {messageCount}
                    </span>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Submitted quotes */}
            {existingQuotes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
                <h3 className="font-heading font-semibold text-card-foreground text-sm">Quotes ({existingQuotes.length})</h3>
                {existingQuotes.map((q: any) => (
                  <div key={q.id} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-card-foreground">{q.factory_name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - MOQ: {q.moq} - {q.delivery_time_days} days</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        q.status === "accepted" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                        : q.status === "rejected" ? "bg-red-500/15 text-red-500 border-red-500/30"
                        : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                      }`}>{q.status === "pending" ? "Waiting" : q.status.charAt(0).toUpperCase() + q.status.slice(1)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                      <div><span className="text-[11px] text-muted-foreground">Factory</span><p className="text-card-foreground font-medium">{q.currency} {Number(q.factory_cost).toFixed(2)}</p></div>
                      <div><span className="text-[11px] text-muted-foreground">Service</span><p className="text-card-foreground font-medium">{q.currency} {Number(q.service_fee).toFixed(2)}</p></div>
                      <div><span className="text-[11px] text-muted-foreground">Logistics</span><p className="text-card-foreground font-medium">{q.currency} {Number(q.logistics_cost).toFixed(2)}</p></div>
                    </div>
                    {(() => {
                      const aFees = (q as any).addon_fees as Array<{id: string; label: string; cost: number}> | null;
                      if (!aFees || aFees.length === 0) return null;
                      return (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {aFees.map((a) => (
                            <span key={a.id} className="px-2 py-0.5 rounded bg-primary/10 text-xs text-primary">{a.label}: {q.currency} {a.cost.toFixed(2)}</span>
                          ))}
                        </div>
                      );
                    })()}
                    <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Total/unit</span>
                      <span className="font-heading font-bold text-primary">{q.currency} {Number(q.total_cost).toFixed(2)}</span>
                    </div>
                    {q.notes && <p className="mt-2 text-xs text-muted-foreground italic">{q.notes}</p>}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Request details */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="font-heading font-semibold text-card-foreground text-sm mb-3">Request Details</h3>
              <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">{request.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: Package, label: "Quantity", value: `${request.quantity?.toLocaleString()} units` },
                    { icon: DollarSign, label: "Budget/Unit", value: `${request.currency} ${Number(request.budget_per_unit).toFixed(2)}` },
                    { icon: Leaf, label: "Eco-friendly", value: request.eco_friendly || "None" },
                    { icon: User, label: "Customer", value: profile?.display_name || "Unknown" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                      </div>
                      <p className="text-sm font-medium text-card-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Customer details */}
                {profile && (profile.full_name || profile.phone_number || profile.area_of_residence) && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><User className="h-3 w-3" /> Customer Details</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      {profile.full_name && <div><span className="text-xs text-muted-foreground">Full Name</span><p className="text-card-foreground">{profile.full_name}</p></div>}
                      {profile.phone_number && <div><span className="text-xs text-muted-foreground">Phone</span><p className="text-card-foreground">{profile.phone_number}</p></div>}
                      {profile.area_of_residence && <div><span className="text-xs text-muted-foreground">Location</span><p className="text-card-foreground">{profile.area_of_residence}</p></div>}
                    </div>
                  </div>
                )}

                {((request as any).delivery_address || request.delivery_country) && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><MapPin className="h-3 w-3" /> Delivery</p>
                    <p className="text-sm text-card-foreground whitespace-pre-line">{(request as any).delivery_address || request.delivery_country}</p>
                  </div>
                )}

                {(() => {
                  const addons = (request as any).service_addons as string[] | null;
                  if (!addons || addons.length === 0) return null;
                  return (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><Wrench className="h-3 w-3" /> Add-ons</p>
                      <div className="flex flex-wrap gap-1.5">
                        {addons.map((a: string) => (
                          <span key={a} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
                            {a.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {(() => {
                  const paths = (request as any).attachment_paths as string[] | null;
                  if (!paths || paths.length === 0) return null;
                  return (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Paperclip className="h-3 w-3" /> Attachments</p>
                      <div className="flex flex-wrap gap-2">
                        {paths.map((p: string) => (
                          <button key={p} onClick={() => openFile(p)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/50 text-xs text-primary hover:underline cursor-pointer">
                            <FileText className="h-3 w-3" />
                            {p.split("/").pop()?.replace(/^\d+-[a-z0-9]+\./, "file.") || "file"}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>

            {/* Integration Export */}
            {isConfirmed && issuedInvoice && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h3 className="font-heading font-semibold text-card-foreground text-sm mb-3 flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5 text-primary" /> Integration Export
                </h3>
                <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Request ID", value: id || "" },
                      { label: "Invoice #", value: issuedInvoice.invoice_number },
                      { label: "Order ID", value: issuedInvoice.order_id || "-" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => copyToClipboard(item.value, item.label)}
                        className="text-left p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors group"
                      >
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          {item.label} <Copy className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <p className="text-xs font-mono text-card-foreground mt-0.5 truncate">{item.value}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <RequestChat requestId={id!} isCustomer={false} />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgentRequestDetail;
