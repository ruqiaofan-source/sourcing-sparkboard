import { Navigate } from "react-router-dom";
import { useRole, AppRole } from "@/hooks/useRole";

interface RoleGuardProps {
  children: React.ReactNode;
  allowed: AppRole[];
}

export function RoleGuard({ children, allowed }: RoleGuardProps) {
  const { primaryRole, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!allowed.includes(primaryRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
