import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Auth & Layouts
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import BusinessLayout from "./components/business/BusinessLayout.tsx";
import InfluencerLayout from "./components/influencer/InfluencerLayout.tsx";
import ResellerLayout from "./components/reseller/ResellerLayout.tsx";

// Pages - Lazy Loaded
const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const ComingSoon = lazy(() => import("./pages/ComingSoon.tsx"));
const Login = lazy(() => import("./pages/login/Login.tsx"));
const SelectRole = lazy(() => import("./pages/login/SelectRole.tsx"));
const Onboarding = lazy(() => import("./pages/login/Onboarding.tsx"));

// Dashboard Pages
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome.tsx"));
const TasksPage = lazy(() => import("./pages/dashboard/TasksPage.tsx"));
const WalletPage = lazy(() => import("./pages/dashboard/WalletPage.tsx"));
const ReferralsPage = lazy(() => import("./pages/dashboard/ReferralsPage.tsx"));
const LeaderboardPage = lazy(() => import("./pages/dashboard/LeaderboardPage.tsx"));
const ProfilePage = lazy(() => import("./pages/dashboard/ProfilePage.tsx"));
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage.tsx"));

// Admin Pages
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.tsx"));
const AdminCampaigns = lazy(() => import("./pages/admin/AdminCampaigns.tsx"));
const AdminTasks = lazy(() => import("./pages/admin/AdminTasks.tsx"));
const AdminWithdrawals = lazy(() => import("./pages/admin/AdminWithdrawals.tsx"));
const AdminFinance = lazy(() => import("./pages/admin/AdminFinance.tsx"));
const AdminTransactions = lazy(() => import("./pages/admin/AdminTransactions.tsx"));
const AdminFraud = lazy(() => import("./pages/admin/AdminFraud.tsx"));
const AdminResellers = lazy(() => import("./pages/admin/AdminResellers.tsx"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports.tsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.tsx"));

// Business Pages
const BusinessHome = lazy(() => import("./pages/business/BusinessHome.tsx"));
const BusinessCampaigns = lazy(() => import("./pages/business/BusinessCampaigns.tsx"));
const CreateCampaign = lazy(() => import("./pages/business/CreateCampaign.tsx"));
const ProofReview = lazy(() => import("./pages/business/ProofReview.tsx"));
const BusinessAnalytics = lazy(() => import("./pages/business/BusinessAnalytics.tsx"));
const BusinessBilling = lazy(() => import("./pages/business/BusinessBilling.tsx"));
const BusinessSettings = lazy(() => import("./pages/business/BusinessSettings.tsx"));
const BusinessProfile = lazy(() => import("./pages/business/BusinessProfile.tsx"));

// Influencer Pages
const InfluencerHome = lazy(() => import("./pages/influencer/InfluencerHome.tsx"));
const BrandDealsPage = lazy(() => import("./pages/influencer/BrandDealsPage.tsx"));
const InfluencerCampaigns = lazy(() => import("./pages/influencer/InfluencerCampaigns.tsx"));
const InfluencerEarnings = lazy(() => import("./pages/influencer/InfluencerEarnings.tsx"));
const InfluencerAnalytics = lazy(() => import("./pages/influencer/InfluencerAnalytics.tsx"));
const InfluencerPortfolio = lazy(() => import("./pages/influencer/InfluencerPortfolio.tsx"));
const InfluencerSettings = lazy(() => import("./pages/influencer/InfluencerSettings.tsx"));

// Reseller Pages
const ResellerHome = lazy(() => import("./pages/reseller/ResellerHome.tsx"));
const ResellerOrders = lazy(() => import("./pages/reseller/ResellerOrders.tsx"));
const ResellerServices = lazy(() => import("./pages/reseller/ResellerServices.tsx"));
const ResellerPricing = lazy(() => import("./pages/reseller/ResellerPricing.tsx"));
const ResellerClients = lazy(() => import("./pages/reseller/ResellerClients.tsx"));
const ResellerWallet = lazy(() => import("./pages/reseller/ResellerWallet.tsx"));
const ResellerAPI = lazy(() => import("./pages/reseller/ResellerAPI.tsx"));
const ResellerWhitelabel = lazy(() => import("./pages/reseller/ResellerWhitelabel.tsx"));
const ResellerSettings = lazy(() => import("./pages/reseller/ResellerSettings.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }>
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
                <Route path="transactions" element={<AdminTransactions />} />
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

export default App;
