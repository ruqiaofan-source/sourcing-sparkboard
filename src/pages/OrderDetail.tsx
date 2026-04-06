import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, Package, Truck, MapPin, Factory, DollarSign,
  Calendar, Hash, FileText, Loader2, RefreshCw, ExternalLink,
  Check, Clock, ShoppingCart, Upload
} from "lucide-react";
import { OrderProgressStepper } from "@/components/OrderProgressStepper";

const statusOptions = [
  { value: "processing", label: "Processing", style: "bg-amber-500/15 text-amber-500 border-amber-500/30" },
  { value: "qc_review", label: "QC Review", style: "bg-purple-500/15 text-purple-500 border-purple-500/30" },
  { value: "in_transit", label: "In Transit", style: "bg-blue-500/15 text-blue-500 border-blue-500/30" },
  { value: "delivered", label: "Delivered", style: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" },
];

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { primaryRole } = useRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAgentOrAdmin = primaryRole === "agent" || primaryRole === "admin";

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    eta: "",
    notes: "",
    buckydrop_tracking_number: "",
  });

  const { data: order, isLoading } = useQuery({
    queryKey: ["order-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, suppliers(name, location, category)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const { data: request } = useQuery({
    queryKey: ["order-sourcing-request", order?.sourcing_request_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sourcing_requests")
        .select("title, description, delivery_country, delivery_address, profiles!sourcing_requests_user_id_profiles_fkey(display_name, full_name, email)")
        .eq("id", order!.sourcing_request_id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!order?.sourcing_request_id,
  });

  const { data: invoice } = useQuery({
    queryKey: ["order-invoice", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("order_id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const updateOrder = useMutation({
    mutationFn: async () => {
      const updates: Record<string, unknown> = {};
      if (editData.status && editData.status !== order?.status) updates.status = editData.status;
      if (editData.eta !== (order?.eta || "")) updates.eta = editData.eta || null;
      if (editData.notes !== (order?.notes || "")) updates.notes = editData.notes || null;
      if (editData.buckydrop_tracking_number !== (order?.buckydrop_tracking_number || ""))
        updates.buckydrop_tracking_number = editData.buckydrop_tracking_number || null;

      if (Object.keys(updates).length === 0) throw new Error("No changes to save");

      const { error } = await supabase.from("orders").update(updates).eq("id", id!);
      if (error) throw error;

      // Notify customer of status change
      if (updates.status && order) {
        const statusLabels: Record<string, string> = {
          processing: "Processing",
          qc_review: "Quality Check",
          in_transit: "In Transit",
          delivered: "Delivered",
        };
        await supabase.from("notifications").insert({
          user_id: order.user_id,
          title: "Order Update",
          message: `Your order ${order.order_number} status changed to "${statusLabels[updates.status as string] || updates.status}".`,
          type: "order_update",
          link: `/orders`,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-detail", id] });
      toast({ title: "Order updated", description: "Changes saved successfully." });
      setEditMode(false);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const pushToBuckyDrop = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("buckydrop-sync", {
        body: { action: "push", order_id: id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order-detail", id] });
      if (data?.skipped) {
        toast({ title: "Already synced", description: `BuckyDrop ID: ${data.buckydrop_order_id}` });
      } else {
        toast({ title: "Pushed to BuckyDrop", description: `BuckyDrop ID: ${data.buckydrop_order_id}` });
      }
    },
    onError: (err: any) => {
      toast({ title: "BuckyDrop sync failed", description: err.message, variant: "destructive" });
    },
  });

  const pullFromBuckyDrop = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("buckydrop-sync", {
        body: { action: "pull" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order-detail", id] });
      toast({ title: "Synced from BuckyDrop", description: `Updated ${data?.updated || 0} of ${data?.total || 0} orders.` });
    },
    onError: (err: any) => {
      toast({ title: "BuckyDrop sync failed", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Order Details">
        <div className="space-y-4 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout title="Order Not Found">
        <p className="text-muted-foreground">This order doesn't exist or you don't have access.</p>
      </DashboardLayout>
    );
  }

  const startEdit = () => {
    setEditData({
      status: order.status,
      eta: order.eta || "",
      notes: order.notes || "",
      buckydrop_tracking_number: order.buckydrop_tracking_number || "",
    });
    setEditMode(true);
  };

  const statusStyle = statusOptions.find((s) => s.value === order.status)?.style || "bg-muted text-muted-foreground border-border";
  const statusLabel = statusOptions.find((s) => s.value === order.status)?.label || order.status;
  const profile = (request as any)?.profiles;
  const paymentStatus = invoice?.payment_status || "unpaid";

  return (
    <DashboardLayout title="Order Details">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {order.order_number}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {order.product_name} - {order.quantity} units
            </p>
            {profile && (
              <p className="text-sm text-muted-foreground">
                Customer: <span className="text-foreground font-medium">{profile.display_name || profile.full_name}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyle}`}>
              {statusLabel}
            </span>
            {isAgentOrAdmin && !editMode && (
              <Button variant="outline" size="sm" onClick={startEdit}>
                Edit Order
              </Button>
            )}
          </div>
        </div>

        {/* Progress stepper */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <OrderProgressStepper
            requestStatus="confirmed"
            paymentStatus={paymentStatus}
            orderStatus={order.status}
          />
        </motion.div>

        {/* Edit mode */}
        {editMode && isAgentOrAdmin && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border-2 border-primary/30 bg-primary/[0.03] p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Update Order</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={editData.status} onValueChange={(v) => setEditData((d) => ({ ...d, status: v }))}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">ETA</Label>
                <Input
                  type="date"
                  value={editData.eta}
                  onChange={(e) => setEditData((d) => ({ ...d, eta: e.target.value }))}
                  className="bg-card border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tracking Number</Label>
                <Input
                  value={editData.buckydrop_tracking_number}
                  onChange={(e) => setEditData((d) => ({ ...d, buckydrop_tracking_number: e.target.value }))}
                  placeholder="Enter tracking number..."
                  className="bg-card border-border"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <Textarea
                value={editData.notes}
                onChange={(e) => setEditData((d) => ({ ...d, notes: e.target.value }))}
                placeholder="Internal notes..."
                className="bg-card border-border"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => updateOrder.mutate()} disabled={updateOrder.isPending}>
                {updateOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
            </div>
          </motion.div>
        )}

        {/* Order details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-4">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Order Information
            </h3>
            <div className="space-y-3">
              <InfoRow icon={Hash} label="Order Number" value={order.order_number} />
              <InfoRow icon={Package} label="Product" value={order.product_name} />
              <InfoRow icon={ShoppingCart} label="Quantity" value={`${order.quantity} units`} />
              <InfoRow icon={DollarSign} label="Total Amount" value={`$${Number(order.total_amount).toLocaleString()}`} highlight />
              <InfoRow icon={Calendar} label="Created" value={new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
              {order.eta && <InfoRow icon={Calendar} label="ETA" value={new Date(order.eta).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />}
              {order.notes && <InfoRow icon={FileText} label="Notes" value={order.notes} />}
            </div>
          </motion.div>

          {/* Supplier + Delivery */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-4">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <Factory className="h-4 w-4 text-primary" />
              Supplier & Delivery
            </h3>
            <div className="space-y-3">
              {(order.suppliers as any)?.name && (
                <>
                  <InfoRow icon={Factory} label="Supplier" value={(order.suppliers as any).name} />
                  {(order.suppliers as any).location && <InfoRow icon={MapPin} label="Location" value={(order.suppliers as any).location} />}
                  {(order.suppliers as any).category && <InfoRow icon={Package} label="Category" value={(order.suppliers as any).category} />}
                </>
              )}
              {request?.delivery_country && <InfoRow icon={MapPin} label="Delivery Country" value={request.delivery_country} />}
              {request?.delivery_address && <InfoRow icon={MapPin} label="Delivery Address" value={request.delivery_address} />}
              {order.buckydrop_tracking_number && (
                <InfoRow icon={Truck} label="Tracking Number" value={order.buckydrop_tracking_number} />
              )}
            </div>
          </motion.div>
        </div>

        {/* BuckyDrop Integration */}
        {isAgentOrAdmin && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  BuckyDrop Integration
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Sync this order with BuckyDrop for fulfillment</p>
              </div>
            </div>

            <div className="space-y-3">
              {order.buckydrop_order_id ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Synced to BuckyDrop</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {order.buckydrop_order_id}
                        {order.buckydrop_synced_at && ` - Last sync: ${new Date(order.buckydrop_synced_at).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pullFromBuckyDrop.mutate()}
                    disabled={pullFromBuckyDrop.isPending}
                  >
                    {pullFromBuckyDrop.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <RefreshCw className="h-3.5 w-3.5 mr-1.5" />}
                    Pull Status
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Not yet synced</p>
                      <p className="text-xs text-muted-foreground">Push this order to BuckyDrop to start fulfillment</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => pushToBuckyDrop.mutate()}
                    disabled={pushToBuckyDrop.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {pushToBuckyDrop.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Upload className="h-3.5 w-3.5 mr-1.5" />}
                    Push to BuckyDrop
                  </Button>
                </div>
              )}

              {order.buckydrop_status && (
                <InfoRow icon={Package} label="BuckyDrop Status" value={order.buckydrop_status} />
              )}
            </div>
          </motion.div>
        )}

        {/* Invoice link */}
        {invoice && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Link to={`/invoice/${invoice.id}`} className="block rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{invoice.invoice_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.currency} {Number(invoice.total_amount).toFixed(2)} - Payment: {invoice.payment_status}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  invoice.payment_status === "confirmed" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                    : invoice.payment_status === "paid" ? "bg-blue-500/15 text-blue-500 border-blue-500/30"
                    : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                }`}>
                  {invoice.payment_status}
                </span>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

function InfoRow({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm ${highlight ? "font-semibold text-primary" : "text-foreground"} break-words`}>{value}</p>
      </div>
    </div>
  );
}

export default OrderDetail;
