import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthOnlyRoute } from "./components/auth/AuthOnlyRoute";

// Auth & Layouts (Removed .tsx extensions)
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";
import BusinessLayout from "./components/business/BusinessLayout";
import InfluencerLayout from "./components/influencer/InfluencerLayout";
import ResellerLayout from "./components/reseller/ResellerLayout";

// Pages - Lazy Loaded (Removed .tsx extensions)
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const Login = lazy(() => import("./pages/login/Login"));
const SelectRole = lazy(() => import("./pages/login/SelectRole"));
const Onboarding = lazy(() => import("./pages/login/Onboarding"));

// Dashboard Pages
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const TasksPage = lazy(() => import("./pages/dashboard/TasksPage"));
const WalletPage = lazy(() => import("./pages/dashboard/WalletPage"));
const ReferralsPage = lazy(() => import("./pages/dashboard/ReferralsPage"));
const LeaderboardPage = lazy(() => import("./pages/dashboard/LeaderboardPage"));
const ProfilePage = lazy(() => import("./pages/dashboard/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"));
const DepositsPage = lazy(() => import("./pages/dashboard/DepositsPage"));
const WithdrawPage = lazy(() => import("./pages/dashboard/WithdrawPage"));
const BankDetailsPage = lazy(() => import("./pages/dashboard/BankDetailsPage"));
const BusinessWalletPage = lazy(() => import("./pages/business/BusinessWallet"));

// Admin Pages
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCampaigns = lazy(() => import("./pages/admin/AdminCampaigns"));
const AdminTasks = lazy(() => import("./pages/admin/AdminTasks"));
const AdminWithdrawals = lazy(() => import("./pages/admin/AdminWithdrawals"));
const AdminFinance = lazy(() => import("./pages/admin/AdminFinance"));
const AdminTransactions = lazy(() => import("./pages/admin/AdminTransactions"));
const AdminFraud = lazy(() => import("./pages/admin/AdminFraud"));
const AdminResellers = lazy(() => import("./pages/admin/AdminResellers"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminDeposits = lazy(() => import("./pages/admin/AdminDeposits"));

// Business Pages
const BusinessHome = lazy(() => import("./pages/business/BusinessHome"));
const BusinessCampaigns = lazy(() => import("./pages/business/BusinessCampaigns"));
const CreateCampaign = lazy(() => import("./pages/business/CreateCampaign"));
const ProofReview = lazy(() => import("./pages/business/ProofReview"));
const BusinessAnalytics = lazy(() => import("./pages/business/BusinessAnalytics"));
const BusinessBilling = lazy(() => import("./pages/business/BusinessBilling"));
const BusinessSettings = lazy(() => import("./pages/business/BusinessSettings"));
const BusinessProfile = lazy(() => import("./pages/business/BusinessProfile"));

// Influencer Pages
const InfluencerHome = lazy(() => import("./pages/influencer/InfluencerHome"));
const BrandDealsPage = lazy(() => import("./pages/influencer/BrandDealsPage"));
const InfluencerCampaigns = lazy(() => import("./pages/influencer/InfluencerCampaigns"));
const InfluencerEarnings = lazy(() => import("./pages/influencer/InfluencerEarnings"));
const InfluencerAnalytics = lazy(() => import("./pages/influencer/InfluencerAnalytics"));
const InfluencerPortfolio = lazy(() => import("./pages/influencer/InfluencerPortfolio"));
const InfluencerSettings = lazy(() => import("./pages/influencer/InfluencerSettings"));

// Reseller Pages
const ResellerHome = lazy(() => import("./pages/reseller/ResellerHome"));
const ResellerOrders = lazy(() => import("./pages/reseller/ResellerOrders"));
const ResellerServices = lazy(() => import("./pages/reseller/ResellerServices"));
const ResellerPricing = lazy(() => import("./pages/reseller/ResellerPricing"));
const ResellerClients = lazy(() => import("./pages/reseller/ResellerClients"));
const ResellerWallet = lazy(() => import("./pages/reseller/ResellerWallet"));
const ResellerAPI = lazy(() => import("./pages/reseller/ResellerAPI"));
const ResellerWhitelabel = lazy(() => import("./pages/reseller/ResellerWhitelabel"));
const ResellerSettings = lazy(() => import("./pages/reseller/ResellerSettings"));

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
            
            {/* Protected Routes */}
            <Route element={<AuthOnlyRoute />}>
  <Route
    path="/select-role"
    element={<SelectRole />}
  />

  <Route
    path="/onboarding"
    element={<Onboarding />}
  />
</Route>

<Route element={<ProtectedRoute />}>

              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="referrals" element={<ReferralsPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="deposits" element={<DepositsPage />} />
                <Route path="withdraw" element={<WithdrawPage />} />
                <Route path="payout-settings" element={<BankDetailsPage />} />
              </Route>

              <Route path="/business" element={<BusinessLayout />}>
                <Route index element={<BusinessHome />} />
                <Route path="campaigns" element={<BusinessCampaigns />} />
                <Route path="create-campaign" element={<CreateCampaign />} />
                <Route path="proof-review" element={<ProofReview />} />
                <Route path="analytics" element={<BusinessAnalytics />} />
                <Route path="wallet" element={<BusinessWalletPage />} />
                <Route path="billing" element={<BusinessBilling />} />
                <Route path="settings" element={<BusinessSettings />} />
                <Route path="profile" element={<BusinessProfile />} />
                <Route path="deposits" element={<DepositsPage />} />
                <Route path="withdraw" element={<WithdrawPage />} />
                <Route path="payout-settings" element={<BankDetailsPage />} />
              </Route>

              <Route element={<AdminRoute />}>
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
                  <Route path="deposits" element={<AdminDeposits />} />
                </Route>
              </Route>

              <Route path="/influencer" element={<InfluencerLayout />}>
                <Route index element={<InfluencerHome />} />
                <Route path="brand-deals" element={<BrandDealsPage />} />
                <Route path="campaigns" element={<InfluencerCampaigns />} />
                <Route path="earnings" element={<InfluencerEarnings />} />
                <Route path="analytics" element={<InfluencerAnalytics />} />
                <Route path="portfolio" element={<InfluencerPortfolio />} />
                <Route path="settings" element={<InfluencerSettings />} />
                <Route path="deposits" element={<DepositsPage />} />
                <Route path="withdraw" element={<WithdrawPage />} />
                <Route path="payout-settings" element={<BankDetailsPage />} />
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
