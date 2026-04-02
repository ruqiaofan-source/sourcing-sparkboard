import { useState, useRef } from "react";
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
import { ArrowLeft, Package, DollarSign, MapPin, Leaf, Clock, Check, X, Factory, Truck, FileText, Paperclip, MessageCircle, Wrench, Receipt, Download } from "lucide-react";
import { PaymentDetails } from "@/components/PaymentDetails";
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

  const respondToQuote = useMutation({
    mutationFn: async ({ quoteId, action }: { quoteId: string; action: "accepted" | "rejected" }) => {
      const { error } = await supabase.from("quotes").update({ status: action }).eq("id", quoteId);
      if (error) throw error;
      if (action === "accepted") {
        await supabase.from("sourcing_requests").update({ status: "confirmed" }).eq("id", id!);

        const acceptedQuote = quotes.find((q: any) => q.id === quoteId);
        if (acceptedQuote && request) {
          const orderNumber = `EQ-${Date.now().toString(36).toUpperCase()}`;
          const totalAmount = Number(acceptedQuote.total_cost) * request.quantity;
          const addonFees = (acceptedQuote as any).addon_fees || [];

          // Create order
          const { data: orderData } = await supabase.from("orders").insert({
            user_id: user!.id,
            order_number: orderNumber,
            product_name: request.title,
            quantity: String(request.quantity),
            total_amount: totalAmount,
            status: "processing",
            sourcing_request_id: id!,
            quote_id: quoteId,
            notes: `Factory: ${acceptedQuote.factory_name} · ${acceptedQuote.currency} ${Number(acceptedQuote.total_cost).toFixed(2)}/unit`,
          } as any).select("id").single();

          const addonTotal = addonFees.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);

          // Create draft invoice
          const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
          await supabase.from("invoices" as any).insert({
            user_id: user!.id,
            order_id: orderData?.id || null,
            quote_id: quoteId,
            sourcing_request_id: id!,
            invoice_number: invoiceNumber,
            factory_cost: Number(acceptedQuote.factory_cost) * request.quantity,
            china_ops_cost: 0,
            logistics_cost: Number(acceptedQuote.logistics_cost) * request.quantity,
            service_fee: Number(acceptedQuote.service_fee) * request.quantity,
            financial_costs: 0,
            total_amount: (Number(acceptedQuote.factory_cost) + Number(acceptedQuote.service_fee) + Number(acceptedQuote.logistics_cost) + addonTotal) * request.quantity,
            currency: acceptedQuote.currency,
            quantity: request.quantity,
            product_name: request.title,
            factory_name: acceptedQuote.factory_name,
            delivery_address: (request as any).delivery_address || request.delivery_country || "",
            status: "draft",
          } as any);
        }
      }
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["customer-request-quotes", id] });
      queryClient.invalidateQueries({ queryKey: ["customer-request-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["customer-request-invoices", id] });
      toast({
        title: action === "accepted" ? "Quote accepted!" : "Quote rejected",
        description: action === "accepted" ? "Your order and invoice have been created." : "The agent will be notified.",
      });
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

  const statusStyle: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    quoted: "bg-purple-500/15 text-purple-500 border-purple-500/30",
    confirmed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  };

  const tabs = [
    { id: "details", label: "Details & Quotes", icon: FileText },
    { id: "chat", label: "Chat with Agent", icon: MessageCircle, badge: messageCount },
  ];

  return (
    <DashboardLayout title="Request Details">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/sourcing-requests" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Requests
        </Link>

        {/* Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">{request.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submitted {new Date(request.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium shrink-0 ${statusStyle[request.status] || statusStyle.pending}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        {/* Tab navigation */}
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

        {/* Tab content */}
        {activeTab === "details" ? (
          <>
            {/* Request info */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">{request.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Package, label: "Quantity", value: `${request.quantity?.toLocaleString()} units` },
                  { icon: DollarSign, label: "Budget/Unit", value: `${request.currency} ${Number(request.budget_per_unit).toFixed(2)}` },
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

              {/* Delivery Address */}
              {((request as any).delivery_address || request.delivery_country) && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1.5 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Delivery Address</span>
                  </div>
                  <p className="text-sm text-card-foreground whitespace-pre-line">
                    {(request as any).delivery_address || request.delivery_country}
                  </p>
                </div>
              )}

              {/* Service Add-ons */}
              {(() => {
                const addons = (request as any).service_addons as string[] | null;
                if (!addons || addons.length === 0) return null;
                return (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Service Add-ons</span>
                    </div>
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

              {/* Attachments */}
              {(() => {
                const paths = (request as any).attachment_paths as string[] | null;
                if (!paths || paths.length === 0) return null;
                const getUrl = async (p: string) => {
                  const { data } = await supabase.storage.from("sourcing-attachments").createSignedUrl(p, 3600);
                  return data?.signedUrl || "#";
                };
                // Use synchronous signed URL approach - generate on click
                const openFile = async (p: string) => {
                  const { data } = await supabase.storage.from("sourcing-attachments").createSignedUrl(p, 3600);
                  if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                };
                return (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Paperclip className="h-3 w-3" /> Attached Files</p>
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
            </motion.div>

            {/* Chat prompt banner */}
            {messageCount > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">You have {messageCount} message{messageCount !== 1 ? "s" : ""}</p>
                    <p className="text-xs text-muted-foreground">Chat with your sourcing agent about this request</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSearchParams({ tab: "chat" })} className="border-primary/30 text-primary hover:bg-primary/10">
                  Open Chat
                </Button>
              </motion.div>
            )}

            {/* Quotes received */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="font-heading font-semibold text-foreground mb-4">
                {quotes.length > 0 ? `Quotes Received (${quotes.length})` : "Waiting for Quotes"}
              </h3>
              {quotes.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Our sourcing agents are reviewing your request.<br />You'll receive competitive quotes within 24-48 hours.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quotes.map((q: any) => (
                    <div key={q.id} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Factory className="h-4 w-4 text-primary" />
                            <p className="font-medium text-card-foreground">{q.factory_name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            MOQ: {q.moq} units · Delivery: {q.delivery_time_days} days
                          </p>
                        </div>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          q.status === "accepted" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                          : q.status === "rejected" ? "bg-red-500/15 text-red-500 border-red-500/30"
                          : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                        }`}>{q.status}</span>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/20 border border-border/50 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5"><Factory className="h-3 w-3" /> Factory Cost</span>
                            <span className="text-card-foreground font-medium">{q.currency} {Number(q.factory_cost).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <DollarSign className="h-3 w-3" /> Service Fee
                              {Number(q.factory_cost) > 0 && (
                                <span className="text-[11px]">({((Number(q.service_fee) / Number(q.factory_cost)) * 100).toFixed(0)}%)</span>
                              )}
                            </span>
                            <span className="text-card-foreground font-medium">{q.currency} {Number(q.service_fee).toFixed(2)}</span>
                          </div>
                          {/* Add-on fees */}
                          {(() => {
                            const aFees = (q as any).addon_fees as Array<{id: string; label: string; cost: number}> | null;
                            if (!aFees || aFees.length === 0) return null;
                            return aFees.map((a) => (
                              <div key={a.id} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1.5"><Wrench className="h-3 w-3" /> {a.label}</span>
                                <span className="text-card-foreground font-medium">{q.currency} {a.cost.toFixed(2)}</span>
                              </div>
                            ));
                          })()}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5"><Truck className="h-3 w-3" /> Logistics & Customs</span>
                            <span className="text-card-foreground font-medium">{q.currency} {Number(q.logistics_cost).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted-foreground">Total per Unit</span>
                          <p className="text-lg font-heading font-bold text-primary">{q.currency} {Number(q.total_cost).toFixed(2)}</p>
                        </div>
                        {q.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => respondToQuote.mutate({ quoteId: q.id, action: "rejected" })} disabled={respondToQuote.isPending} className="border-destructive/30 text-destructive hover:bg-destructive/10">
                              <X className="h-3.5 w-3.5 mr-1" /> Reject
                            </Button>
                            <Button size="sm" onClick={() => respondToQuote.mutate({ quoteId: q.id, action: "accepted" })} disabled={respondToQuote.isPending} className="bg-emerald-600 text-white hover:bg-emerald-700">
                              <Check className="h-3.5 w-3.5 mr-1" /> Accept Quote
                            </Button>
                          </div>
                        )}
                      </div>

                      {q.notes && <p className="mt-3 text-xs text-muted-foreground italic border-t border-border/50 pt-3">{q.notes}</p>}
                      
                      {(() => {
                        const qPaths = (q as any).attachment_paths as string[] | null;
                        if (!qPaths || qPaths.length === 0) return null;
                        const openQFile = async (p: string) => {
                          const { data } = await supabase.storage.from("sourcing-attachments").createSignedUrl(p, 3600);
                          if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                        };
                        return (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Paperclip className="h-3 w-3" /> Attachments</p>
                            <div className="flex flex-wrap gap-1.5">
                              {qPaths.map((p: string) => (
                                <button key={p} onClick={() => openQFile(p)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/30 border border-border/50 text-[11px] text-primary hover:underline cursor-pointer">
                                  <FileText className="h-3 w-3" />
                                  {p.split("/").pop()?.replace(/^\d+-[a-z0-9]+\./, "file.") || "file"}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Invoices */}
            {invoices.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  Invoices ({invoices.length})
                </h3>
                <div className="space-y-4">
                  {invoices.map((inv: any) => {
                    const isDraft = inv.status === "draft";
                    return (
                      <div key={inv.id} className={`rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] ${isDraft ? "border-amber-500/40" : "border-border"}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-medium text-card-foreground">{inv.invoice_number}</p>
                            <p className="text-xs text-muted-foreground">
                              {isDraft ? "Pending agent finalization" : `Issued ${new Date(inv.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
                            </p>
                          </div>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            isDraft ? "bg-amber-500/15 text-amber-500 border-amber-500/30" : "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                          }`}>
                            {inv.status}
                          </span>
                        </div>

                        {isDraft ? (
                          <p className="text-sm text-muted-foreground py-4 text-center">Your agent is preparing the final invoice with exact shipping and logistics costs.</p>
                        ) : (
                          <div className="p-4 rounded-lg bg-muted/20 border border-border/50 mb-4">
                            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Invoice Breakdown</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1.5"><Factory className="h-3 w-3" /> Factory Cost ({inv.quantity} units)</span>
                                <span className="text-card-foreground font-medium">{inv.currency} {Number(inv.factory_cost).toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1.5"><DollarSign className="h-3 w-3" /> Equilinq Service Fee</span>
                                <span className="text-card-foreground font-medium">{inv.currency} {Number(inv.service_fee).toFixed(2)}</span>
                              </div>
                              {Number(inv.financial_costs || 0) > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground flex items-center gap-1.5"><DollarSign className="h-3 w-3" /> Financial Costs</span>
                                  <span className="text-card-foreground font-medium">{inv.currency} {Number(inv.financial_costs).toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1.5"><Truck className="h-3 w-3" /> Logistics & Shipping</span>
                                <span className="text-card-foreground font-medium">{inv.currency} {Number(inv.logistics_cost).toFixed(2)}</span>
                              </div>
                              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                                <span className="text-sm font-semibold text-card-foreground">Total Amount</span>
                                <span className="text-lg font-heading font-bold text-primary">{inv.currency} {Number(inv.total_amount).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            <p><span className="font-medium text-card-foreground">Product:</span> {inv.product_name}</p>
                            <p><span className="font-medium text-card-foreground">Factory:</span> {inv.factory_name}</p>
                            {inv.delivery_address && <p><span className="font-medium text-card-foreground">Delivery:</span> {inv.delivery_address}</p>}
                          </div>
                          {!isDraft && (
                            <Link to={`/invoice/${inv.id}`} target="_blank">
                              <Button variant="outline" size="sm">
                                <Download className="h-3.5 w-3.5 mr-1.5" /> Download PDF
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment Details - show when there's an issued invoice */}
                {invoices.some((inv: any) => inv.status !== "draft") && (
                  <PaymentDetails invoiceCurrency={invoices.find((inv: any) => inv.status !== "draft")?.currency} />
                )}
              </motion.div>
            )}
          </>
        ) : (
          /* Chat Tab */
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <RequestChat requestId={id!} isCustomer={true} />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerRequestDetail;
