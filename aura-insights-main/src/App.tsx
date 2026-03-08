import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const OrgDashboard = lazy(() => import("./pages/OrgDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PrivacyPage = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UniversityDashboard = lazy(() => import("./pages/UniversityDashboard"));
const CorporateDashboard = lazy(() => import("./pages/CorporateDashboard"));
const HealthcareDashboard = lazy(() => import("./pages/HealthcareDashboard"));
const GovernmentDashboard = lazy(() => import("./pages/GovernmentDashboard"));
const SettingsPage = lazy(() => import("./pages/Settings"));
import { useRole, UserRole } from "./hooks/useRole";

const queryClient = new QueryClient();

const RoleGuard = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: UserRole[] }) => {
  const { role, loading } = useRole();

  if (loading) return <div className="h-screen w-screen bg-background flex items-center justify-center font-display text-primary animate-pulse">SENTINEX Loading...</div>;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const DashboardRedirect = () => {
  const { role, loading } = useRole();
  if (loading) return <div className="h-screen w-screen bg-background flex items-center justify-center font-display text-primary/50 text-xs uppercase tracking-widest animate-pulse">Synchronizing Session...</div>;

  if (!role) return <Navigate to="/auth" replace />;
  if (role === "super_admin") return <Navigate to="/dashboard/admin" replace />;
  if (role === "university_admin") return <Navigate to="/dashboard/university" replace />;
  if (role === "corporate_admin") return <Navigate to="/dashboard/corporate" replace />;
  if (role === "healthcare_admin") return <Navigate to="/dashboard/healthcare" replace />;
  if (role === "government_admin") return <Navigate to="/dashboard/government" replace />;

  return <Navigate to="/dashboard/individual" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="h-screen w-screen bg-[#00010a] flex items-center justify-center font-display text-primary animate-pulse">Initializing SENTINEX...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Legacy redirect for breadcrumbs or direct links */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/org" element={<DashboardRedirect />} />
            <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />

            {/* Role-Based Routes */}
            <Route
              path="/dashboard/individual"
              element={
                <RoleGuard allowedRoles={["individual", "university_admin", "corporate_admin", "healthcare_admin", "government_admin"]}>
                  <Dashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/dashboard/university"
              element={
                <RoleGuard allowedRoles={["university_admin"]}>
                  <UniversityDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/dashboard/corporate"
              element={
                <RoleGuard allowedRoles={["corporate_admin"]}>
                  <CorporateDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/dashboard/healthcare"
              element={
                <RoleGuard allowedRoles={["healthcare_admin"]}>
                  <HealthcareDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/dashboard/government"
              element={
                <RoleGuard allowedRoles={["government_admin"]}>
                  <GovernmentDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <RoleGuard allowedRoles={["super_admin"]}>
                  <AdminDashboard />
                </RoleGuard>
              }
            />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route
              path="/settings"
              element={
                <RoleGuard allowedRoles={["individual", "university_admin", "corporate_admin", "healthcare_admin", "government_admin", "super_admin"]}>
                  <SettingsPage />
                </RoleGuard>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
