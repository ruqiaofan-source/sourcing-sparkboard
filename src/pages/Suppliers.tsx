import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search, Star, MapPin, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useRole } from "@/hooks/useRole";

const statusColor: Record<string, string> = {
  "verified": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "pending_review": "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const statusLabel: Record<string, string> = {
  "verified": "Verified",
  "pending_review": "Pending Review",
};

const Suppliers = () => {
  const [search, setSearch] = useState("");
  const { primaryRole } = useRole();
  const isStaff = primaryRole === "agent" || primaryRole === "admin";

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const uniqueCountries = new Set(suppliers.map((s) => s.country)).size;

  return (
    <DashboardLayout title="Suppliers">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-muted-foreground text-sm">{suppliers.length} suppliers across {uniqueCountries} countries</p>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((supplier, i) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground">{supplier.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      {supplier.location}
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[supplier.status]}`}>
                    {statusLabel[supplier.status]}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4 py-3 border-y border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-card-foreground">{Number(supplier.rating).toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-sm font-medium text-card-foreground mt-0.5">{supplier.total_orders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">On-Time</p>
                    <p className="text-sm font-medium text-emerald-400 mt-0.5">{Number(supplier.on_time_percentage).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Since</p>
                    <p className="text-sm font-medium text-card-foreground mt-0.5">{supplier.since_year}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">{supplier.category}</span>
                  <div className="flex items-center gap-2">
                    {isStaff && supplier.contact_email && (
                      <a href={`mailto:${supplier.contact_email}`} className="text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {isStaff && supplier.contact_phone && (
                      <a href={`tel:${supplier.contact_phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Suppliers;
