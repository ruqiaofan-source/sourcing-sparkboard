import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { MapPin, Plus, Edit, Trash2, Star } from "lucide-react";

interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
}

const emptyAddress = {
  label: "Home",
  full_name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  phone: "",
  is_default: false,
};

export default function AddressManagement() {
  const { session } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Address | null>(null);
  const [formData, setFormData] = useState(emptyAddress);
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", session!.user.id)
        .order("is_default", { ascending: false });
      if (error) throw error;
      return data as Address[];
    },
    enabled: !!session?.user?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async (item: typeof formData & { id?: string }) => {
      const payload = { ...item, user_id: session!.user.id };
      if (item.id) {
        const { error } = await supabase.from("addresses").update(payload).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("addresses").insert(payload);
        if (error) throw error;
      }
      // If setting as default, unset others
      if (item.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", session!.user.id)
          .neq("id", item.id || "");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(editItem ? "Address updated" : "Address added");
      setDialogOpen(false);
      setEditItem(null);
      setFormData(emptyAddress);
    },
    onError: () => toast.error("Failed to save address"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Address Management</h1>
            <p className="text-muted-foreground">Manage your delivery addresses</p>
          </div>
          <Button onClick={() => { setEditItem(null); setFormData(emptyAddress); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Address
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse"><CardContent className="p-6 h-32" /></Card>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No addresses saved</p>
              <p className="text-sm mt-1">Add a delivery address to speed up your orders</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <Card key={addr.id} className={`hover:border-primary/30 transition-colors ${addr.is_default ? "border-primary/50" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{addr.label}</span>
                      {addr.is_default && (
                        <Badge variant="default" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditItem(addr); setFormData(addr); setDialogOpen(true); }}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteMutation.mutate(addr.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground space-y-0.5">
                    <p className="font-medium text-foreground">{addr.full_name}</p>
                    <p>{addr.address_line1}</p>
                    {addr.address_line2 && <p>{addr.address_line2}</p>}
                    <p>{[addr.city, addr.state, addr.postal_code].filter(Boolean).join(", ")}</p>
                    <p>{addr.country}</p>
                    {addr.phone && <p>Tel: {addr.phone}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Label</Label>
                <Input value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Home, Office..." />
              </div>
              <div>
                <Label>Full Name</Label>
                <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Address Line 1</Label>
              <Input value={formData.address_line1} onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })} />
            </div>
            <div>
              <Label>Address Line 2</Label>
              <Input value={formData.address_line2 || ""} onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City</Label>
                <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div>
                <Label>State / Province</Label>
                <Input value={formData.state || ""} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Postal Code</Label>
                <Input value={formData.postal_code} onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })} />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.is_default} onCheckedChange={(v) => setFormData({ ...formData, is_default: v })} />
              <Label>Set as default address</Label>
            </div>
            <Button className="w-full" onClick={() => saveMutation.mutate(editItem ? { ...formData, id: editItem.id } : formData)} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : editItem ? "Update Address" : "Add Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
