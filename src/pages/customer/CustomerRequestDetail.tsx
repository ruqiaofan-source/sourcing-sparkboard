import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import RequestChat from "@/components/RequestChat";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, DollarSign, MapPin, Leaf, Clock, Check, X, Factory, Truck, FileText, Paperclip, MessageCircle, Wrench, Receipt, Download, CreditCard, BanknoteIcon } from "lucide-react";
import { PaymentDetails } from "@/components/PaymentDetails";
import { OrderProgressStepper } from "@/components/OrderProgressStepper";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

const CustomerRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  useRealtimeSync("customer", user?.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "details";

  const { data: request, isLoading } = useQuery({
    queryKey: ["customer-request-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sourcing_requests")
        .select("*")
        .eq("id", id!)
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ["customer-request-quotes", id],
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

  const { data: invoices = [] } = useQuery({
    queryKey: ["customer-request-invoices", id],
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
    queryKey: ["customer-request-order", id],
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

  const respondToQuote = useMutation({
    mutationFn: async ({ quoteId, action }: { quoteId: string; action: "accepted" | "rejected" }) => {
      if (action === "accepted") {
        // Use server-side edge function for secure order/invoice creation
        const { data, error } = await supabase.functions.invoke("accept-quote", {
          body: { quote_id: quoteId },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        return data;
      } else {
        // Rejection is simple - just update the quote status
        const { error } = await supabase.from("quotes").update({ status: "rejected" }).eq("id", quoteId);
        if (error) throw error;
      }
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["customer-request-quotes", id] });
      queryClient.invalidateQueries({ queryKey: ["customer-request-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["customer-request-invoices", id] });
      queryClient.invalidateQueries({ queryKey: ["customer-request-order", id] });
      toast({
        title: action === "accepted" ? "Quote accepted!" : "Quote rejected",
        description: action === "accepted" ? "Your invoice has been issued and payment instructions sent to your email." : "The agent will be notified.",
      });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const markAsPaid = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { error } = await supabase.from("invoices" as any)
        .update({ payment_status: "paid" } as any)
        .eq("id", invoiceId);
      if (error) throw error;

      // Notify all agents about the payment
      const { data: agents } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["agent", "admin"]);
      if (agents && request) {
        const notifs = agents.map((a: any) => ({
          user_id: a.user_id,
          title: "Payment Sent",
          message: `Customer has sent payment for "${request.title}". Please verify and confirm.`,
          type: "payment_sent",
          link: `/agent/requests/${id}`,
        }));
        await supabase.from("notifications" as any).insert(notifs as any);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-request-invoices", id] });
      toast({ title: "Payment marked", description: "Our team will confirm receipt shortly." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <DashboardLayout title="Request Details"><Skeleton className="h-40 w-full" /></DashboardLayout>;
  }

  if (!request) {
    return <DashboardLayout title="Not Found"><p className="text-muted-foreground">Request not found.</p></DashboardLayout>;
  }

  const issuedInvoice = invoices.find((inv: any) => inv.status === "issued");
  const acceptedQuote = quotes.find((q: any) => q.status === "accepted");
  const pendingQuotes = quotes.filter((q: any) => q.status === "pending");
  const hasQuotes = quotes.length > 0;
  const isConfirmed = request.status === "confirmed";
  const paymentStatus = issuedInvoice?.payment_status || "unpaid";

  // Friendly status labels
  const statusLabel = isConfirmed
    ? paymentStatus === "confirmed"
      ? "In Production"
      : paymentStatus === "paid"
      ? "Payment Sent"
      : "Awaiting Payment"
    : request.status === "quoted"
    ? "Quote Ready"
    : "Under Review";

  const statusStyle = isConfirmed
    ? paymentStatus === "confirmed"
      ? "bg-blue-500/15 text-blue-500 border-blue-500/30"
      : paymentStatus === "paid"
      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
      : "bg-amber-500/15 text-amber-500 border-amber-500/30"
    : request.status === "quoted"
    ? "bg-purple-500/15 text-purple-500 border-purple-500/30"
    : "bg-amber-500/15 text-amber-500 border-amber-500/30";

  const tabs = [
    { id: "details", label: "Overview", icon: FileText },
    { id: "chat", label: "Chat", icon: MessageCircle, badge: messageCount },
  ];

  const openFile = async (p: string) => {
    const { data } = await supabase.storage.from("sourcing-attachments").createSignedUrl(p, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <DashboardLayout title="Request Details">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/sourcing-requests" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Requests
        </Link>

        {/* Title + status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">{request.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submitted {new Date(request.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium shrink-0 ${statusStyle}`}>
            {statusLabel}
          </span>
        </div>

        {/* Progress stepper - horizontal on desktop, vertical on mobile */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Order Progress</h3>
          <div className="hidden sm:block">
            <OrderProgressStepper
              requestStatus={request.status}
              paymentStatus={paymentStatus}
              orderStatus={order?.status}
              createdAt={request.created_at}
            />
          </div>
          <div className="sm:hidden">
            <OrderProgressStepper
              requestStatus={request.status}
              paymentStatus={paymentStatus}
              orderStatus={order?.status}
              createdAt={request.created_at}
              variant="vertical"
            />
          </div>
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
            {/* === ACTION REQUIRED SECTION (shows what user needs to do NOW) === */}

            {/* Awaiting payment - show invoice + payment details prominently */}
            {isConfirmed && issuedInvoice && paymentStatus === "unpaid" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="rounded-xl border-2 border-primary/30 bg-primary/[0.03] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">Complete Your Payment</h3>
                      <p className="text-xs text-muted-foreground">Transfer the amount below to proceed with your order</p>
                    </div>
                  </div>

                  {/* Invoice summary */}
                  <div className="p-4 rounded-lg bg-card border border-border mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-card-foreground">{issuedInvoice.invoice_number}</span>
                      <Link to={`/invoice/${issuedInvoice.id}`} target="_blank">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                          <Download className="h-3 w-3 mr-1" /> View Invoice
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Factory Cost ({issuedInvoice.quantity} units)</span>
                        <span className="text-card-foreground">€{Number(issuedInvoice.factory_cost).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span className="text-card-foreground">€{Number(issuedInvoice.service_fee).toFixed(2)}</span>
                      </div>
                      {Number(issuedInvoice.logistics_cost) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Logistics & Shipping</span>
                          <span className="text-card-foreground">€{Number(issuedInvoice.logistics_cost).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="pt-2 mt-2 border-t border-border flex justify-between">
                        <span className="font-semibold text-card-foreground">Total Due</span>
                        <span className="text-lg font-heading font-bold text-primary">€{Number(issuedInvoice.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => markAsPaid.mutate(issuedInvoice.id)}
                    disabled={markAsPaid.isPending}
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-11"
                  >
                    <CreditCard className="h-4 w-4 mr-2" /> I've Completed the Bank Transfer
                  </Button>
                </div>

                {/* Bank account details */}
                <PaymentDetails invoiceCurrency={issuedInvoice.currency} />
              </motion.div>
            )}

            {/* Payment sent - waiting for confirmation */}
            {isConfirmed && issuedInvoice && paymentStatus === "paid" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-3">
                    <Check className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">Payment Sent</h3>
                  <p className="text-sm text-muted-foreground">Our team is verifying your payment. You'll be notified once confirmed.</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Link to={`/invoice/${issuedInvoice.id}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Download className="h-3.5 w-3.5 mr-1.5" /> View Invoice
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Payment confirmed - in production */}
            {isConfirmed && issuedInvoice && paymentStatus === "confirmed" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/[0.05] p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-500/15 flex items-center justify-center mx-auto mb-3">
                    <Factory className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">Order In Production</h3>
                  <p className="text-sm text-muted-foreground">Payment confirmed. Your order is now being manufactured.</p>
                  {order && (
                    <p className="text-xs text-muted-foreground mt-2">Order #{order.order_number}</p>
                  )}
                  <div className="mt-4 flex justify-center gap-2">
                    <Link to={`/invoice/${issuedInvoice.id}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Download className="h-3.5 w-3.5 mr-1.5" /> View Invoice
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Pending quotes - show waiting state */}
            {!isConfirmed && !hasQuotes && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-heading font-semibold text-foreground mb-1">Finding the Best Factories</h3>
                  <p className="text-sm text-muted-foreground">Our sourcing agents are reviewing your request and sourcing quotes from verified manufacturers. You'll hear back within 24-48 hours.</p>
                </div>
              </motion.div>
            )}

            {/* Quotes to review */}
            {pendingQuotes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  Review Your Quote{pendingQuotes.length > 1 ? "s" : ""}
                </h3>
                <div className="space-y-4">
                  {pendingQuotes.map((q: any) => (
                    <QuoteCard key={q.id} q={q} request={request} onRespond={respondToQuote} openFile={openFile} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Accepted quote summary (collapsed) */}
            {acceptedQuote && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-xl border border-emerald-500/20 bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-emerald-500" />
                      </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Quote Accepted</p>
                      <p className="text-xs text-muted-foreground">€{Number(acceptedQuote.total_cost).toFixed(2)}/unit - {acceptedQuote.delivery_time_days} days delivery</p>
                    </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-emerald-500/15 text-emerald-500 border-emerald-500/30">
                      Accepted
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Chat prompt */}
            {messageCount > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{messageCount} message{messageCount !== 1 ? "s" : ""}</p>
                    <p className="text-xs text-muted-foreground">Chat with your sourcing agent</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSearchParams({ tab: "chat" })} className="border-primary/30 text-primary hover:bg-primary/10">
                  Open Chat
                </Button>
              </motion.div>
            )}

            {/* Request details (collapsible-like, always visible at bottom) */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="font-heading font-semibold text-foreground mb-3 text-sm">Request Details</h3>
              <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">{request.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Package, label: "Quantity", value: `${request.quantity?.toLocaleString()} units` },
                    { icon: DollarSign, label: "Budget/Unit", value: `€${Number(request.budget_per_unit).toFixed(2)}` },
                    { icon: Leaf, label: "Eco-friendly", value: request.eco_friendly || "None" },
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
                {((request as any).delivery_address || request.delivery_country) && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><MapPin className="h-3 w-3" /> Delivery</p>
                    <p className="text-sm text-card-foreground">{(request as any).delivery_address || request.delivery_country}</p>
                  </div>
                )}
                {(() => {
                  const addons = (request as any).service_addons as string[] | null;
                  if (!addons || addons.length === 0) return null;
                  return (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><Wrench className="h-3 w-3" /> Add-ons</p>
                      <div className="flex flex-wrap gap-1.5">
                        {addons.map((a: string) => (
                          <span key={a} className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
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
                    <div className="mt-3 pt-3 border-t border-border/50">
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
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-2 flex justify-end">
              <Link
                to={`/messages?request=${id}`}
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Open in Messages →
              </Link>
            </div>
            <RequestChat requestId={id!} isCustomer={true} />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

/* --- Quote Card Component --- */
function QuoteCard({ q, request, onRespond, openFile }: { q: any; request: any; onRespond: any; openFile: (p: string) => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-medium text-card-foreground">Quote Details</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            MOQ: {q.moq} units - Delivery: {q.delivery_time_days} days
          </p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted/20 border border-border/50 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5"><Factory className="h-3 w-3" /> Factory Cost</span>
            <span className="text-card-foreground font-medium">€{Number(q.factory_cost).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5"><DollarSign className="h-3 w-3" /> Service Fee</span>
            <span className="text-card-foreground font-medium">€{Number(q.service_fee).toFixed(2)}</span>
          </div>
          {(() => {
            const aFees = (q as any).addon_fees as Array<{id: string; label: string; cost: number}> | null;
            if (!aFees || aFees.length === 0) return null;
            return aFees.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5"><Wrench className="h-3 w-3" /> {a.label}</span>
                <span className="text-card-foreground font-medium">€{a.cost.toFixed(2)}</span>
              </div>
            ));
          })()}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5"><Truck className="h-3 w-3" /> Logistics & Customs</span>
            <span className="text-card-foreground font-medium">€{Number(q.logistics_cost).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-muted-foreground">Total per Unit</span>
          <p className="text-lg font-heading font-bold text-primary">€{Number(q.total_cost).toFixed(2)}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Total ({request.quantity} units)</span>
          <p className="text-sm font-semibold text-card-foreground">€{(Number(q.total_cost) * request.quantity).toFixed(2)}</p>
        </div>
      </div>

      {q.notes && <p className="text-xs text-muted-foreground italic border-t border-border/50 pt-3 mb-3">{q.notes}</p>}

      {(() => {
        const qPaths = (q as any).attachment_paths as string[] | null;
        if (!qPaths || qPaths.length === 0) return null;
        return (
          <div className="border-t border-border/50 pt-3 mb-3">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Paperclip className="h-3 w-3" /> Attachments</p>
            <div className="flex flex-wrap gap-1.5">
              {qPaths.map((p: string) => (
                <button key={p} onClick={() => openFile(p)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/30 border border-border/50 text-[11px] text-primary hover:underline cursor-pointer">
                  <FileText className="h-3 w-3" />
                  {p.split("/").pop()?.replace(/^\d+-[a-z0-9]+\./, "file.") || "file"}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="flex gap-2 pt-2 border-t border-border/50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onRespond.mutate({ quoteId: q.id, action: "rejected" })}
          disabled={onRespond.isPending}
          className="border-destructive/30 text-destructive hover:bg-destructive/10 flex-1"
        >
          <X className="h-3.5 w-3.5 mr-1" /> Reject
        </Button>
        <Button
          size="sm"
          onClick={() => onRespond.mutate({ quoteId: q.id, action: "accepted" })}
          disabled={onRespond.isPending}
          className="bg-emerald-600 text-white hover:bg-emerald-700 flex-1"
        >
          <Check className="h-3.5 w-3.5 mr-1" /> Accept & Pay
        </Button>
      </div>
    </div>
  );
}

export default CustomerRequestDetail;
