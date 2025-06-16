
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useSimpleAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import AppLayout from "@/components/layouts/AppLayout";

// Pages
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Workspace from "./pages/Workspace";
import Tasks from "./pages/Tasks";
import ReferEarn from "./pages/ReferEarn";
import AchieveEarn from "./pages/AchieveEarn";
import Support from "./pages/Support";
import Tracker from "./pages/Tracker";
import VerificationSuccess from "./pages/VerificationSuccess";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminTasks from "./pages/AdminTasks";
import AdminAnalytics from "./pages/AdminAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verification-success" element={<VerificationSuccess />} />
            
            {/* Protected routes */}
            <Route path="/workspace" element={
              <ProtectedRoute>
                <AppLayout>
                  <Workspace />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <AppLayout>
                  <Tasks />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/refer-earn" element={
              <ProtectedRoute>
                <AppLayout>
                  <ReferEarn />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/achieve-earn" element={
              <ProtectedRoute>
                <AppLayout>
                  <AchieveEarn />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <AppLayout>
                  <Support />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/tracker" element={
              <ProtectedRoute>
                <AppLayout>
                  <Tracker />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </AdminRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AppLayout>
                  <AdminUsers />
                </AppLayout>
              </AdminRoute>
            } />
            <Route path="/admin/tasks" element={
              <AdminRoute>
                <AppLayout>
                  <AdminTasks />
                </AppLayout>
              </AdminRoute>
            } />
            <Route path="/admin/analytics" element={
              <AdminRoute>
                <AppLayout>
                  <AdminAnalytics />
                </AppLayout>
              </AdminRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
