import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Users, Star, Search, Plus, Edit, Globe } from "lucide-react";

interface Agent {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  experience_years: number;
  rating: number;
  total_orders: number;
  status: string;
  avatar_url: string | null;
  bio: string | null;
  languages: string[];
}

export default function AdminAgents() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Agent[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (agent: Partial<Agent> & { id: string }) => {
      const { error } = await supabase
        .from("agents")
        .update({
          name: agent.name,
          specialty: agent.specialty,
          experience_years: agent.experience_years,
          rating: agent.rating,
          status: agent.status,
          bio: agent.bio,
          languages: agent.languages,
        })
        .eq("id", agent.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent updated");
      setDialogOpen(false);
      setEditAgent(null);
    },
    onError: () => toast.error("Failed to update agent"),
  });

  const filtered = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = agents.filter((a) => a.status === "active").length;
  const inactiveCount = agents.filter((a) => a.status === "inactive").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Agent Management</h1>
          <p className="text-muted-foreground">Manage all agent profiles and permissions</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                  <p className="text-2xl font-bold">{agents.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                  <p className="text-2xl font-bold text-green-500">{activeCount}</p>
                </div>
                <Star className="h-8 w-8 text-green-500/60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive Agents</p>
                  <p className="text-2xl font-bold text-muted-foreground">{inactiveCount}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
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
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Agent Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 h-48" />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No agents found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((agent) => (
              <Card key={agent.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{agent.name || "Unnamed"}</h3>
                        <Badge variant={agent.status === "active" ? "default" : "secondary"} className="shrink-0">
                          {agent.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{agent.specialty || "General"}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-sm">{Number(agent.rating).toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{agent.experience_years}y</p>
                      <p className="text-xs text-muted-foreground">Experience</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{agent.total_orders}</p>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </div>
                  </div>

                  {agent.languages && agent.languages.length > 0 && (
                    <div className="mt-3 flex items-center gap-1 flex-wrap">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      {agent.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => {
                      setEditAgent(agent);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          {editAgent && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editAgent.name}
                  onChange={(e) => setEditAgent({ ...editAgent, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Specialty</Label>
                <Input
                  value={editAgent.specialty}
                  onChange={(e) => setEditAgent({ ...editAgent, specialty: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Experience (years)</Label>
                  <Input
                    type="number"
                    value={editAgent.experience_years}
                    onChange={(e) => setEditAgent({ ...editAgent, experience_years: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    step="0.1"
                    max="5"
                    value={editAgent.rating}
                    onChange={(e) => setEditAgent({ ...editAgent, rating: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editAgent.status} onValueChange={(v) => setEditAgent({ ...editAgent, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={editAgent.bio || ""}
                  onChange={(e) => setEditAgent({ ...editAgent, bio: e.target.value })}
                  rows={3}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => updateMutation.mutate(editAgent)}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
