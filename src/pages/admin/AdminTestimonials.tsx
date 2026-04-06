import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { MessageSquareQuote, Plus, Edit, Trash2, Star } from "lucide-react";

interface Testimonial {
  id: string;
  customer_name: string;
  company: string | null;
  role: string | null;
  content: string;
  rating: number;
  is_published: boolean;
  sort_order: number;
}

const emptyTestimonial = {
  customer_name: "",
  company: "",
  role: "",
  content: "",
  rating: 5,
  is_published: false,
  sort_order: 0,
};

export default function AdminTestimonials() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState(emptyTestimonial);
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: typeof formData & { id?: string }) => {
      if (item.id) {
        const { error } = await supabase.from("testimonials").update(item).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(item);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success(editItem ? "Testimonial updated" : "Testimonial added");
      setDialogOpen(false);
      setEditItem(null);
      setFormData(emptyTestimonial);
    },
    onError: () => toast.error("Failed to save"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const publishedCount = testimonials.filter((t) => t.is_published).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Testimonials</h1>
            <p className="text-muted-foreground">Manage customer testimonials displayed on the website</p>
          </div>
          <Button onClick={() => { setEditItem(null); setFormData(emptyTestimonial); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Testimonial
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{testimonials.length}</p>
              </div>
              <MessageSquareQuote className="h-8 w-8 text-primary/60" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-500">{publishedCount}</p>
              </div>
              <MessageSquareQuote className="h-8 w-8 text-green-500/60" />
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse"><CardContent className="p-6 h-32" /></Card>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <MessageSquareQuote className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No testimonials yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <Card key={t.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {t.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{t.customer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {[t.role, t.company].filter(Boolean).join(" at ") || "Customer"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={t.is_published ? "default" : "secondary"}>
                      {t.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-0.5 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">"{t.content}"</p>
                  <div className="flex gap-1 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => { setEditItem(t); setFormData(t); setDialogOpen(true); }}>
                      <Edit className="h-3.5 w-3.5 mr-1" />Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(t.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1 text-destructive" />Delete
                    </Button>
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
            <DialogTitle>{editItem ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Customer Name</Label>
              <Input value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Company</Label>
                <Input value={formData.company || ""} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={formData.role || ""} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Content</Label>
              <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Rating (1-5)</Label>
                <Input type="number" min={1} max={5} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.is_published} onCheckedChange={(v) => setFormData({ ...formData, is_published: v })} />
              <Label>Published</Label>
            </div>
            <Button className="w-full" onClick={() => saveMutation.mutate(editItem ? { ...formData, id: editItem.id } : formData)} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : editItem ? "Update" : "Add Testimonial"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
