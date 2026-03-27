import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import DashboardHome from "./pages/dashboard/DashboardHome.tsx";
import TasksPage from "./pages/dashboard/TasksPage.tsx";
import WalletPage from "./pages/dashboard/WalletPage.tsx";
import ReferralsPage from "./pages/dashboard/ReferralsPage.tsx";
import LeaderboardPage from "./pages/dashboard/LeaderboardPage.tsx";
import ProfilePage from "./pages/dashboard/ProfilePage.tsx";
import SettingsPage from "./pages/dashboard/SettingsPage.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminCampaigns from "./pages/admin/AdminCampaigns.tsx";
import AdminTasks from "./pages/admin/AdminTasks.tsx";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals.tsx";
import AdminFinance from "./pages/admin/AdminFinance.tsx";
import AdminFraud from "./pages/admin/AdminFraud.tsx";
import AdminResellers from "./pages/admin/AdminResellers.tsx";
import AdminReports from "./pages/admin/AdminReports.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="referrals" element={<ReferralsPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
