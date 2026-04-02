import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { useRole } from "@/hooks/useRole";

// Customer pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import NewRequest from "./pages/customer/NewRequest";
import SourcingRequests from "./pages/customer/SourcingRequests";
import CustomerRequestDetail from "./pages/customer/CustomerRequestDetail";
import Messages from "./pages/customer/Messages";

// Agent pages
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentRequests from "./pages/agent/AgentRequests";
import AgentRequestDetail from "./pages/agent/AgentRequestDetail";
import AgentMessages from "./pages/agent/AgentMessages";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInsights from "./pages/admin/AdminInsights";

// Shared pages
import Auth from "./pages/Auth";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import InvoiceView from "./pages/InvoiceView";
import ResetPassword from "./pages/ResetPassword";
import Unsubscribe from "./pages/Unsubscribe";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Contact from "./pages/public/Contact";
import Insights from "./pages/public/Insights";
import InsightArticle from "./pages/public/InsightArticle";
import Customization from "./pages/public/Customization";
import Pricing from "./pages/public/Pricing";
import HowItWorks from "./pages/public/HowItWorks";
import HowItWorksStep from "./pages/public/HowItWorksStep";
import Privacy from "./pages/public/Privacy";
import CookiesPage from "./pages/public/Cookies";
import { CookieConsent } from "./components/CookieConsent";
const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (session) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// Role-aware dashboard router
function DashboardRouter() {
  const { primaryRole, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (primaryRole === "admin") return <AdminDashboard />;
  if (primaryRole === "agent") return <AgentDashboard />;
  return <CustomerDashboard />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Landing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/insights/:slug" element={<InsightArticle />} />
              <Route path="/customization" element={<Customization />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/how-it-works/:slug" element={<HowItWorksStep />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              
              {/* Role-aware dashboard */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
              
              {/* Customer routes */}
              <Route path="/new-request" element={<ProtectedRoute><NewRequest /></ProtectedRoute>} />
              <Route path="/sourcing-requests" element={<ProtectedRoute><SourcingRequests /></ProtectedRoute>} />
              <Route path="/sourcing-requests/:id" element={<ProtectedRoute><CustomerRequestDetail /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              
              {/* Agent routes */}
              <Route path="/agent/requests" element={<ProtectedRoute><AgentRequests /></ProtectedRoute>} />
              <Route path="/agent/requests/:id" element={<ProtectedRoute><AgentRequestDetail /></ProtectedRoute>} />
              <Route path="/agent/messages" element={<ProtectedRoute><AgentMessages /></ProtectedRoute>} />
              
              {/* Admin routes */}
              <Route path="/admin/requests" element={<ProtectedRoute><AdminRequests /></ProtectedRoute>} />
              <Route path="/admin/requests/:id" element={<ProtectedRoute><AgentRequestDetail /></ProtectedRoute>} />
              <Route path="/admin/quotes" element={<ProtectedRoute><AdminQuotes /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/insights" element={<ProtectedRoute><AdminInsights /></ProtectedRoute>} />
              
              {/* Shared routes */}
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/invoice/:id" element={<ProtectedRoute><InvoiceView /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
