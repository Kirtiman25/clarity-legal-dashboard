
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useSimpleAuth";
import SecurityHeaders from "./components/SecurityHeaders";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Workspace from "./pages/Workspace";
import Tasks from "./pages/Tasks";
import AchieveEarn from "./pages/AchieveEarn";
import ReferEarn from "./pages/ReferEarn";
import Support from "./pages/Support";
import Tracker from "./pages/Tracker";
import VerificationSuccess from "./pages/VerificationSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminTasks from "./pages/AdminTasks";
import AdminAnalytics from "./pages/AdminAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityHeaders />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/achieve-earn" element={<AchieveEarn />} />
            <Route path="/refer-earn" element={<ReferEarn />} />
            <Route path="/support" element={<Support />} />
            <Route path="/tracker" element={<Tracker />}  />
            <Route path="/verification-success" element={<VerificationSuccess />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
