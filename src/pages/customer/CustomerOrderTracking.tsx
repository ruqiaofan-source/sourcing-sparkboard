import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, Package, Truck, CheckCircle, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  processing: { label: "Processing", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  qc_review: { label: "QC Review", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Search },
  in_transit: { label: "In Transit", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive border-destructive/20", icon: Clock },
};

export default function CustomerOrderTracking() {
  const { session } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["customer-orders", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session!.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.product_name.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusSteps = ["processing", "qc_review", "in_transit", "delivered"];

  const getStepIndex = (status: string) => {
    const idx = statusSteps.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Order Tracking</h1>
          <p className="text-muted-foreground">Track your orders from production to delivery</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary/60" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-primary">{activeOrders}</p>
              </div>
              <Package className="h-8 w-8 text-primary/60" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-green-500">{deliveredOrders}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500/60" />
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product or order number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="qc_review">QC Review</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse"><CardContent className="p-6 h-40" /></Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold">No orders found</p>
              <p className="text-sm mt-1">Your orders will appear here once you accept a quote</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const currentStep = getStepIndex(order.status);
              const cfg = statusConfig[order.status] || statusConfig.processing;

              return (
                <Card key={order.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{order.product_name}</h3>
                          <Badge variant="outline" className={cfg.color}>
                            {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Order #{order.order_number} - {format(new Date(order.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(order.total_amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: {order.quantity}</p>
                      </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="flex items-center gap-1 mb-4">
                      {statusSteps.map((step, idx) => {
                        const isComplete = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        const StepIcon = statusConfig[step]?.icon || Clock;

                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                                  isComplete
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""}`}
                              >
                                <StepIcon className="h-4 w-4" />
                              </div>
                              <span className={`text-[10px] mt-1 ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>
                                {statusConfig[step]?.label}
                              </span>
                            </div>
                            {idx < statusSteps.length - 1 && (
                              <div
                                className={`h-0.5 flex-1 -mt-4 ${
                                  idx < currentStep ? "bg-primary" : "bg-muted"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        {order.eta && (
                          <span>ETA: {format(new Date(order.eta), "MMM d, yyyy")}</span>
                        )}
                        {order.buckydrop_tracking_number && (
                          <span>Tracking: {order.buckydrop_tracking_number}</span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/orders/${order.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
