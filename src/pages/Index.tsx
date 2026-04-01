import { Package, Users, DollarSign, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { KpiCard } from "@/components/KpiCard";
import { OrdersChart } from "@/components/OrdersChart";
import { RecentOrders } from "@/components/RecentOrders";
import { SupplierPerformance } from "@/components/SupplierPerformance";

const kpis = [
  { title: "Active Orders", value: "127", change: "+12.5% from last month", changeType: "positive" as const, icon: Package },
  { title: "Total Suppliers", value: "48", change: "+3 new this quarter", changeType: "positive" as const, icon: Users },
  { title: "Monthly Revenue", value: "$2.4M", change: "+18.2% from last month", changeType: "positive" as const, icon: DollarSign },
  { title: "Avg. Lead Time", value: "14 days", change: "-2.3 days improvement", changeType: "positive" as const, icon: Clock },
];

const Index = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <KpiCard key={kpi.title} {...kpi} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrdersChart />
          </div>
          <SupplierPerformance />
        </div>

        <RecentOrders />
      </div>
    </DashboardLayout>
  );
};

export default Index;
