import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AppRole = "customer" | "agent" | "admin";

export function useRole() {
  const { user } = useAuth();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["user-roles", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data.map((r: any) => r.role as AppRole);
    },
    enabled: !!user,
  });

  return {
    roles,
    isLoading,
    isCustomer: roles.includes("customer"),
    isAgent: roles.includes("agent"),
    isAdmin: roles.includes("admin"),
    primaryRole: (roles.includes("admin") ? "admin" : roles.includes("agent") ? "agent" : "customer") as AppRole,
  };
}
