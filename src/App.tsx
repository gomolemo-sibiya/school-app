import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import VerifyPage from "./pages/auth/VerifyPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import TimetablePage from "./pages/timetable/TimetablePage";
import AppointmentsPage from "./pages/appointments/AppointmentsPage";
import IssuesPage from "./pages/issues/IssuesPage";
import ProfilePage from "./pages/profile/ProfilePage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Authentication Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signin" element={<SignInPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="verify" element={<VerifyPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>
          
          {/* Main App Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="issues" element={<IssuesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
