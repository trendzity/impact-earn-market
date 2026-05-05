import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";
import Login from "./pages/login/Login.tsx";
import SelectRole from "./pages/login/SelectRole.tsx";
import Onboarding from "./pages/login/Onboarding.tsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
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
import BusinessLayout from "./components/business/BusinessLayout.tsx";
import BusinessHome from "./pages/business/BusinessHome.tsx";
import BusinessCampaigns from "./pages/business/BusinessCampaigns.tsx";
import CreateCampaign from "./pages/business/CreateCampaign.tsx";
import ProofReview from "./pages/business/ProofReview.tsx";
import BusinessAnalytics from "./pages/business/BusinessAnalytics.tsx";
import BusinessBilling from "./pages/business/BusinessBilling.tsx";
import BusinessSettings from "./pages/business/BusinessSettings.tsx";
import BusinessProfile from "./pages/business/BusinessProfile.tsx";
import InfluencerLayout from "./components/influencer/InfluencerLayout.tsx";
import InfluencerHome from "./pages/influencer/InfluencerHome.tsx";
import BrandDealsPage from "./pages/influencer/BrandDealsPage.tsx";
import InfluencerCampaigns from "./pages/influencer/InfluencerCampaigns.tsx";
import InfluencerEarnings from "./pages/influencer/InfluencerEarnings.tsx";
import InfluencerAnalytics from "./pages/influencer/InfluencerAnalytics.tsx";
import InfluencerPortfolio from "./pages/influencer/InfluencerPortfolio.tsx";
import InfluencerSettings from "./pages/influencer/InfluencerSettings.tsx";
import ResellerLayout from "./components/reseller/ResellerLayout.tsx";
import ResellerHome from "./pages/reseller/ResellerHome.tsx";
import ResellerOrders from "./pages/reseller/ResellerOrders.tsx";
import ResellerServices from "./pages/reseller/ResellerServices.tsx";
import ResellerPricing from "./pages/reseller/ResellerPricing.tsx";
import ResellerClients from "./pages/reseller/ResellerClients.tsx";
import ResellerWallet from "./pages/reseller/ResellerWallet.tsx";
import ResellerAPI from "./pages/reseller/ResellerAPI.tsx";
import ResellerWhitelabel from "./pages/reseller/ResellerWhitelabel.tsx";
import ResellerSettings from "./pages/reseller/ResellerSettings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/select-role" element={<SelectRole />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="/business" element={<BusinessLayout />}>
              <Route index element={<BusinessHome />} />
              <Route path="campaigns" element={<BusinessCampaigns />} />
              <Route path="create-campaign" element={<CreateCampaign />} />
              <Route path="proof-review" element={<ProofReview />} />
              <Route path="analytics" element={<BusinessAnalytics />} />
              <Route path="billing" element={<BusinessBilling />} />
              <Route path="settings" element={<BusinessSettings />} />
              <Route path="profile" element={<BusinessProfile />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="tasks" element={<AdminTasks />} />
              <Route path="withdrawals" element={<AdminWithdrawals />} />
              <Route path="finance" element={<AdminFinance />} />
              <Route path="fraud" element={<AdminFraud />} />
              <Route path="resellers" element={<AdminResellers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="/influencer" element={<InfluencerLayout />}>
              <Route index element={<InfluencerHome />} />
              <Route path="brand-deals" element={<BrandDealsPage />} />
              <Route path="campaigns" element={<InfluencerCampaigns />} />
              <Route path="earnings" element={<InfluencerEarnings />} />
              <Route path="analytics" element={<InfluencerAnalytics />} />
              <Route path="portfolio" element={<InfluencerPortfolio />} />
              <Route path="settings" element={<InfluencerSettings />} />
            </Route>

            <Route path="/reseller" element={<ResellerLayout />}>
              <Route index element={<ResellerHome />} />
              <Route path="orders" element={<ResellerOrders />} />
              <Route path="services" element={<ResellerServices />} />
              <Route path="pricing" element={<ResellerPricing />} />
              <Route path="clients" element={<ResellerClients />} />
              <Route path="wallet" element={<ResellerWallet />} />
              <Route path="api" element={<ResellerAPI />} />
              <Route path="whitelabel" element={<ResellerWhitelabel />} />
              <Route path="settings" element={<ResellerSettings />} />
            </Route>
          </Route>

          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
