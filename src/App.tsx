import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { useRole } from "@/hooks/useRole";

import Landing from "./pages/Landing";
import Contact from "./pages/public/Contact";
import Insights from "./pages/public/Insights";
import InsightArticle from "./pages/public/InsightArticle";
import Customization from "./pages/public/Customization";
import Pricing from "./pages/public/Pricing";
import QualityControl from "./pages/public/QualityControl";
import OemOdm from "./pages/public/OemOdm";
import HowItWorks from "./pages/public/HowItWorks";
import HowItWorksStep from "./pages/public/HowItWorksStep";
import Privacy from "./pages/public/Privacy";
import CookiesPage from "./pages/public/Cookies";

const CustomerDashboard = lazy(() => import("./pages/customer/CustomerDashboard"));
const NewRequest = lazy(() => import("./pages/customer/NewRequest"));
const SourcingRequests = lazy(() => import("./pages/customer/SourcingRequests"));
const CustomerRequestDetail = lazy(() => import("./pages/customer/CustomerRequestDetail"));
const Messages = lazy(() => import("./pages/customer/Messages"));

const AgentDashboard = lazy(() => import("./pages/agent/AgentDashboard"));
const AgentRequests = lazy(() => import("./pages/agent/AgentRequests"));
const AgentRequestDetail = lazy(() => import("./pages/agent/AgentRequestDetail"));
const AgentMessages = lazy(() => import("./pages/agent/AgentMessages"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminRequests = lazy(() => import("./pages/admin/AdminRequests"));
const AdminQuotes = lazy(() => import("./pages/admin/AdminQuotes"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminInsights = lazy(() => import("./pages/admin/AdminInsights"));
const AdminContactSubmissions = lazy(() => import("./pages/admin/AdminContactSubmissions"));
const AdminAudit = lazy(() => import("./pages/admin/AdminAudit"));
const AdminAgents = lazy(() => import("./pages/admin/AdminAgents"));
const AdminAgentApplications = lazy(() => import("./pages/admin/AdminAgentApplications"));
const AdminQA = lazy(() => import("./pages/admin/AdminQA"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));

const Auth = lazy(() => import("./pages/Auth"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const Alerts = lazy(() => import("./pages/Alerts"));
const InvoiceView = lazy(() => import("./pages/InvoiceView"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CookieConsent = lazy(() => import("./components/CookieConsent").then(m => ({ default: m.CookieConsent })));
const AddressManagement = lazy(() => import("./pages/customer/AddressManagement"));
const HelpSupport = lazy(() => import("./pages/customer/HelpSupport"));

const LazyFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

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
            <Suspense fallback={<LazyFallback />}>
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<Landing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/insights/:slug" element={<InsightArticle />} />
                <Route path="/customization" element={<Customization />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/quality-control" element={<QualityControl />} />
                <Route path="/oem-odm" element={<OemOdm />} />
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
                <Route path="/admin/contact" element={<ProtectedRoute><AdminContactSubmissions /></ProtectedRoute>} />
                <Route path="/admin/audit" element={<ProtectedRoute><AdminAudit /></ProtectedRoute>} />
                
                {/* Shared routes */}
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/invoice/:id" element={<ProtectedRoute><InvoiceView /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieConsent />
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
