import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useTheme } from "@/hooks/useTheme";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useUnreadMessagesTotal } from "@/hooks/useUnreadMessagesTotal";
import { useEffect } from "react";

const routeNames: Record<string, string> = {
  "/dashboard": "Home",
  "/sourcing-requests": "My Requests",
  "/new-request": "New Request",
  "/messages": "Messages",
  "/orders": "Orders",
  "/suppliers": "Suppliers",
  "/products": "Products",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/addresses": "Addresses",
  "/help": "Help & Support",
  "/admin/agents": "Agent Management",
  "/admin/applications": "Agent Applications",
  "/admin/qa": "QA Management",
  "/admin/testimonials": "Testimonials",
};

export function DashboardLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const { user } = useAuth();
  const { primaryRole } = useRole();
  const { theme } = useTheme();
  const location = useLocation();
  const unreadMessages = useUnreadMessagesTotal();

  // Reflect unread count in the browser tab title so it's visible when the
  // user is on a different tab.
  useEffect(() => {
    const baseTitle = "Equilinq";
    if (unreadMessages > 0) {
      document.title = `(${unreadMessages > 9 ? "9+" : unreadMessages}) ${baseTitle} — new message${unreadMessages > 1 ? "s" : ""}`;
    } else {
      document.title = baseTitle;
    }
    return () => {
      document.title = "Equilinq";
    };
  }, [unreadMessages]);

  const initials = user?.email?.slice(0, 2).toUpperCase() || "EQ";
  const roleBadge = primaryRole === "admin" ? "Admin" : primaryRole === "agent" ? "Agent" : "Customer";

  // Simple breadcrumb
  const pathSegments = location.pathname === "/dashboard" ? [] : [{ label: routeNames[location.pathname] || title, path: location.pathname }];

  return (
    <SidebarProvider>
      <div className={`${theme === "light" ? "light " : ""}min-h-screen flex w-full bg-background`}>
        <AppSidebar />
        <div className="flex-1 flex flex-col relative min-w-0">
          {/* Dramatic blue light streaks matching equilinq.eu */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{ background: "var(--glow-blue)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{ background: "var(--glow-streak)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{ background: "var(--glow-blue-bottom)" }}
          />

          <header className="h-14 flex items-center border-b border-border/40 px-3 sm:px-6 relative z-10 gap-2 bg-background/70 backdrop-blur-md">
            <SidebarTrigger className="shrink-0" />
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm min-w-0 flex-1">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                Dashboard
              </Link>
              {pathSegments.map((seg) => (
                <span key={seg.path} className="flex items-center gap-1 min-w-0">
                  <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="font-medium text-foreground truncate">{seg.label}</span>
                </span>
              ))}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {roleBadge}
              </span>
              <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">{initials}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-3 sm:p-6 overflow-auto relative z-10">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
