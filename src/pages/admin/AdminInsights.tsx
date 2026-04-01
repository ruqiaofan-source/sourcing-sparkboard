import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface InsightForm {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  tag: string;
  published: boolean;
  published_at: string;
  author_name: string;
  meta_title: string;
  meta_description: string;
}

const emptyForm: InsightForm = {
  title: "", slug: "", excerpt: "", content: "", cover_image_url: "",
  tag: "Blog", published: false, published_at: new Date().toISOString().split("T")[0],
  author_name: "Equilinq Team", meta_title: "", meta_description: "",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminInsights() {
  const [editing, setEditing] = useState<InsightForm | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: insights = [], isLoading } = useQuery({
    queryKey: ["admin-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (form: InsightForm) => {
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        cover_image_url: form.cover_image_url || null,
        tag: form.tag,
        published: form.published,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
        author_name: form.author_name,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        updated_at: new Date().toISOString(),
      };

      if (form.id) {
        const { error } = await supabase.from("insights").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("insights").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Insight saved successfully." });
      queryClient.invalidateQueries({ queryKey: ["admin-insights"] });
      setEditing(null);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("insights").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-insights"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (!editing) return;
    if (!editing.title || !editing.slug) {
      toast({ title: "Error", description: "Title and slug are required.", variant: "destructive" });
      return;
    }
    saveMutation.mutate(editing);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Insights Manager</h1>
            <p className="text-sm text-muted-foreground">Create and manage blog posts for SEO</p>
          </div>
          <Button onClick={() => setEditing({ ...emptyForm })} className="rounded-full">
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </div>

        {/* Editor Modal */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto py-8 px-4"
              onClick={(e) => e.target === e.currentTarget && setEditing(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    {editing.id ? "Edit Article" : "New Article"}
                  </h2>
                  <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Title *</Label>
                      <Input
                        value={editing.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setEditing({ ...editing, title, slug: editing.id ? editing.slug : slugify(title) });
                        }}
                        placeholder="Article title"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Slug *</Label>
                      <Input
                        value={editing.slug}
                        onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                        placeholder="url-friendly-slug"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Excerpt</Label>
                    <textarea
                      value={editing.excerpt}
                      onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                      className="flex min-h-[80px] w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Short summary for listings and SEO"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Content</Label>
                    <textarea
                      value={editing.content}
                      onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                      className="flex min-h-[200px] w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Full article content (plain text or markdown)"
                      rows={10}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label>Cover Image URL</Label>
                      <Input
                        value={editing.cover_image_url}
                        onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Tag</Label>
                      <Input
                        value={editing.tag}
                        onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                        placeholder="Blog"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Author</Label>
                      <Input
                        value={editing.author_name}
                        onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Publish Date</Label>
                      <Input
                        type="date"
                        value={editing.published_at}
                        onChange={(e) => setEditing({ ...editing, published_at: e.target.value })}
                      />
                    </div>
                    <div className="flex items-end gap-3 pb-1">
                      <Button
                        type="button"
                        variant={editing.published ? "default" : "outline"}
                        onClick={() => setEditing({ ...editing, published: !editing.published })}
                        className="rounded-full"
                      >
                        {editing.published ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                        {editing.published ? "Published" : "Draft"}
                      </Button>
                    </div>
                  </div>

                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground mb-2">SEO Overrides (optional)</summary>
                    <div className="grid grid-cols-1 gap-3 pt-2">
                      <div className="space-y-1.5">
                        <Label>Meta Title</Label>
                        <Input
                          value={editing.meta_title}
                          onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
                          placeholder="Custom page title for search engines"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Meta Description</Label>
                        <Input
                          value={editing.meta_description}
                          onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                          placeholder="Custom description for search engines"
                        />
                      </div>
                    </div>
                  </details>

                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => setEditing(null)} className="rounded-full">Cancel</Button>
                    <Button onClick={handleSave} disabled={saveMutation.isPending} className="rounded-full">
                      {saveMutation.isPending ? "Saving..." : "Save Article"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Articles List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No articles yet. Click "New Article" to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4 hover:border-border transition-colors"
              >
                {insight.cover_image_url && (
                  <img src={insight.cover_image_url} alt="" className="h-16 w-24 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{insight.title}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${insight.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {insight.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">/insights/{insight.slug}</p>
                  {insight.published_at && (
                    <p className="text-xs text-muted-foreground">{format(new Date(insight.published_at), "MMM d, yyyy")}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setEditing({
                        id: insight.id,
                        title: insight.title,
                        slug: insight.slug,
                        excerpt: insight.excerpt || "",
                        content: insight.content || "",
                        cover_image_url: insight.cover_image_url || "",
                        tag: insight.tag || "Blog",
                        published: insight.published,
                        published_at: insight.published_at ? insight.published_at.split("T")[0] : "",
                        author_name: insight.author_name || "Equilinq Team",
                        meta_title: insight.meta_title || "",
                        meta_description: insight.meta_description || "",
                      })
                    }
                    className="rounded-full"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Delete this article?")) deleteMutation.mutate(insight.id);
                    }}
                    className="rounded-full text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
