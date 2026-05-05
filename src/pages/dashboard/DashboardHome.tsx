import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Wallet,
  Clock,
  Target,
  Instagram,
  Youtube,
  MessageCircle,
  ArrowRight,
  Trophy,
  Star,
  Flame,
  LayoutDashboard,
  Users,
  Eye,
  Video,
  Facebook,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { ProfileOverviewCard } from "@/components/dashboard/ProfileOverviewCard";
import { toast } from "sonner";

const stats = [
  { label: "Today's Earnings", value: "₹320", icon: TrendingUp, change: "+12%" },
  { label: "Total Earnings", value: "₹12,450", icon: Wallet, change: "+8.2%" },
  { label: "Pending Earnings", value: "₹580", icon: Clock, change: "3 tasks" },
  { label: "Tasks Completed", value: "156", icon: Target, change: "This month" },
];

const tasks = [
  { platform: "Instagram", icon: Instagram, title: "Follow @trendzity", reward: "₹15", time: "2h left", color: "text-pink-500" },
  { platform: "YouTube", icon: Youtube, title: "Like & Subscribe", reward: "₹25", time: "4h left", color: "text-red-500" },
  { platform: "Telegram", icon: MessageCircle, title: "Join Channel", reward: "₹10", time: "1h left", color: "text-blue-500" },
  { platform: "Instagram", icon: Instagram, title: "Comment on Post", reward: "₹20", time: "3h left", color: "text-pink-500" },
  { platform: "YouTube", icon: Youtube, title: "Watch Full Video", reward: "₹30", time: "5h left", color: "text-red-500" },
];

const topUsers = [
  { name: "Priya S.", earnings: "₹45,200", rank: 1 },
  { name: "Rahul K.", earnings: "₹38,900", rank: 2 },
  { name: "Sneha M.", earnings: "₹32,100", rank: 3 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};


const DashboardHome = () => {
  const [user] = useState(getUser());
  const [profileData, setProfileData] = useState<any>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const profile = await fetchProfile();
      if (profile) {
        setProfileData(profile.profile);
      }
      fetchLinkedAccounts();
      fetchDashboardStats();
    };
    loadData();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl("/stats/dashboard"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setDashboardStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchLinkedAccounts = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl("/auth/linked-accounts"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLinkedAccounts(data);
      }
    } catch (error) {
      console.error("Error fetching linked accounts:", error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Map real data to display stats
  const displayStats = [
    { label: "Today's Earnings", value: `₹${dashboardStats?.todayEarnings || 0}`, icon: TrendingUp, change: "+0%" },
    { label: "Total Earnings", value: `₹${dashboardStats?.wallet?.balance || 0}`, icon: Wallet, change: "+0%" },
    { label: "Pending Earnings", value: `₹${dashboardStats?.pendingEarnings || 0}`, icon: Clock, change: "0 tasks" },
    { label: "Tasks Completed", value: dashboardStats?.completedTasks || 0, icon: Target, change: "This month" },
  ];

  const youtubeAccount = linkedAccounts.find(acc => acc.platform === "youtube");
  const ytStats = youtubeAccount?.stats;

  const instagramAccount = linkedAccounts.find(acc => acc.platform === "instagram");
  const igStats = instagramAccount?.stats;

  const facebookAccount = linkedAccounts.find(acc => acc.platform === "facebook");
  const fbStats = facebookAccount?.stats;

  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(n)) return "0";
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Welcome back, <span className="text-accent">{user?.name || "User"}</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's your earning overview for today
        </p>
      </div>

      {/* Profile Identity Card */}
      <ProfileOverviewCard user={user} profileData={profileData} linkedAccounts={linkedAccounts} />

      {/* YouTube Channel Insights (Only if connected) */}
      {youtubeAccount && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border border-red-500/20 bg-gradient-to-br from-red-500/5 via-transparent to-transparent overflow-hidden">
            <CardHeader className="pb-2 border-b border-border/50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Channel Insights: {ytStats?.channelName}</CardTitle>
              </div>
              <span className="text-[10px] text-muted-foreground">Updated: {ytStats?.lastUpdated ? new Date(ytStats.lastUpdated).toLocaleDateString() : 'Just now'}</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-3 w-3" />
                    <span className="text-xs uppercase font-medium">Subscribers</span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">{formatNumber(ytStats?.subscribers || 0)}</p>
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Eye className="h-3 w-3" />
                    <span className="text-xs uppercase font-medium">Total Views</span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">{formatNumber(ytStats?.views || 0)}</p>
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Video className="h-3 w-3" />
                    <span className="text-xs uppercase font-medium">Videos</span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">{formatNumber(ytStats?.videos || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instagram Profile Insights (Only if connected) */}
      {instagramAccount && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border border-pink-500/20 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent overflow-hidden mt-4">
            <CardHeader className="pb-2 border-b border-border/50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-pink-500" />
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Instagram Insights: @{igStats?.username}</CardTitle>
              </div>
              <span className="text-[10px] text-muted-foreground">Updated: {igStats?.lastUpdated ? new Date(igStats.lastUpdated).toLocaleDateString() : 'Just now'}</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-3 w-3" />
                    <span className="text-xs uppercase font-medium">Followers</span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">{formatNumber(igStats?.followersCount || 0)}</p>
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Video className="h-3 w-3" />
                    <span className="text-xs uppercase font-medium">Media Posts</span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">{formatNumber(igStats?.mediaCount || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Facebook Page Insights (Only if connected) */}
      {facebookAccount && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent overflow-hidden mt-4">
            <CardHeader className="pb-2 border-b border-border/50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Facebook Insights: {fbStats?.pageName}</CardTitle>
              </div>
              <span className="text-[10px] text-muted-foreground">Updated: {fbStats?.lastUpdated ? new Date(fbStats.lastUpdated).toLocaleDateString() : 'Just now'}</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-3 w-3" />
                    <span className="text-xs uppercase font-medium">Followers</span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">{formatNumber(fbStats?.followersCount || 0)}</p>
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs uppercase font-medium">Page Likes</span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">{formatNumber(fbStats?.likesCount || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Card className="border border-border hover:border-accent/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Daily Mission + Task Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Mission */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold text-foreground">Daily Mission</h3>
                  </div>
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                    +₹50 Bonus
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete 5 tasks today to unlock your daily bonus
                </p>
                <div className="flex items-center gap-3">
                  <Progress value={60} className="h-2 flex-1" />
                  <span className="text-sm font-semibold text-foreground whitespace-nowrap">3/5</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Task Feed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Available Tasks</h3>
              <Button variant="ghost" size="sm" className="text-accent text-xs">
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                >
                  <Card className="border border-border hover:border-accent/20 transition-all hover:shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <task.icon className={`h-5 w-5 ${task.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">{task.platform}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{task.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-accent">{task.reward}</span>
                        <Button size="sm" className="h-8 bg-accent text-accent-foreground hover:bg-accent/90 text-xs">
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Leaderboard */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Leaderboard</CardTitle>
                  <Trophy className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-center mb-4">
                  <p className="text-xs text-muted-foreground">Your Rank</p>
                  <p className="text-2xl font-bold text-accent">#45</p>
                </div>
                {topUsers.map((user) => (
                  <div key={user.rank} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.rank === 1
                          ? "bg-yellow-500/20 text-yellow-600"
                          : user.rank === 2
                          ? "bg-gray-300/30 text-gray-500"
                          : "bg-orange-500/20 text-orange-500"
                      }`}>
                        {user.rank}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.earnings}</p>
                      </div>
                    </div>
                    <Star className="h-4 w-4 text-accent/40" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Streak */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border border-border">
              <CardContent className="p-5 text-center">
                <Flame className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">7 Days</p>
                <p className="text-xs text-muted-foreground">Current Streak 🔥</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
