import { LayoutDashboard, ShoppingCart, BarChart3, Settings, LogOut, Plus, FileText, Send, MessageCircle, Users, Newspaper, Inbox, ShieldCheck, UserCheck, ClipboardList, HelpCircle, MessageSquareQuote, MapPin, Activity } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useTheme } from "@/hooks/useTheme";
import { useUnreadMessagesTotal } from "@/hooks/useUnreadMessagesTotal";
import { motion } from "framer-motion";
const equilinqLogo = "/brand/equilinq-logo-dark.png";
const equilinqLogoWhite = "/brand/equilinq-logo-white.png";
import {
  Sidebar,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar";

const customerItems = [
  { title: "Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Requests", url: "/sourcing-requests", icon: FileText },
  { title: "Orders", url: "/order-tracking", icon: ShoppingCart },
  { title: "Messages", url: "/messages", icon: MessageCircle },
  { title: "New Request", url: "/new-request", icon: Plus },
  { title: "Addresses", url: "/addresses", icon: MapPin },
  { title: "Help", url: "/help", icon: HelpCircle },
];

const agentItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Requests", url: "/agent/requests", icon: FileText },
  { title: "Messages", url: "/agent/messages", icon: MessageCircle },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
];

const adminItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Requests", url: "/admin/requests", icon: FileText },
  { title: "Quotes", url: "/admin/quotes", icon: Send },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Agents", url: "/admin/agents", icon: UserCheck },
  { title: "Applications", url: "/admin/applications", icon: ClipboardList },
  { title: "QA", url: "/admin/qa", icon: HelpCircle },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquareQuote },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Site Health", url: "/admin/analytics", icon: Activity },
  { title: "Insights", url: "/admin/insights", icon: Newspaper },
  { title: "Contact", url: "/admin/contact", icon: Inbox },
  { title: "Audit", url: "/admin/audit", icon: ShieldCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
  const { primaryRole } = useRole();
  const { theme } = useTheme();
  const unreadMessages = useUnreadMessagesTotal();

  const mainItems = primaryRole === "admin" ? adminItems : primaryRole === "agent" ? agentItems : customerItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full items-center justify-between">
        {/* Top section: Logo + Nav */}
        <div className="w-full">
          {/* Logo */}
          <div className="pt-6 pb-4 flex flex-col items-center border-b border-border/30 w-full px-2">
            <img src={theme === "dark" ? equilinqLogoWhite : equilinqLogo} alt="Equilinq" className="h-8 w-auto object-contain" />
            <span className="mt-2 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
              Beta
            </span>
          </div>

          {/* Main nav */}
          <nav className="flex flex-col items-center gap-1 w-full px-2 pt-3">
            {mainItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.url === "/dashboard"}
                className="group flex flex-col items-center justify-center gap-1.5 w-full rounded-xl py-2.5 px-1 transition-all text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/40"
                activeClassName="!text-primary-foreground bg-primary/90 hover:bg-primary shadow-md"
              >
                <div className="relative">
                  <item.icon className="h-6 w-6" strokeWidth={1.7} />
                  {item.icon === MessageCircle && unreadMessages > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 h-4.5 min-w-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1 ring-2 ring-sidebar-background"
                    >
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </motion.span>
                  )}
                </div>
                {!collapsed && (
                  <span className="text-[13px] font-semibold leading-none text-center">{item.title}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-1 w-full px-2 pb-5 border-t border-border/30 pt-3">
          <NotificationBell collapsed={collapsed} />

          <NavLink
            to="/settings"
            className="group flex flex-col items-center justify-center gap-1.5 w-full rounded-xl py-2.5 px-1 transition-all text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/40"
            activeClassName="!text-primary-foreground bg-primary/90 hover:bg-primary shadow-md"
          >
            <Settings className="h-6 w-6" strokeWidth={1.7} />
            {!collapsed && (
              <span className="text-[13px] font-semibold leading-none text-center">Settings</span>
            )}
          </NavLink>

          <button
            onClick={signOut}
            className="group flex flex-col items-center justify-center gap-1.5 w-full rounded-xl py-2.5 px-1 transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <LogOut className="h-6 w-6" strokeWidth={1.7} />
            {!collapsed && (
              <span className="text-[13px] font-semibold leading-none text-center">Sign Out</span>
            )}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
