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
  Linkedin,
  Facebook,
  Twitter,
  Eye,
  Video,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { ProfileOverviewCard } from "@/components/dashboard/ProfileOverviewCard";
import { Link } from "react-router-dom";

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

const platformIcons: Record<string, any> = {
  instagram: { icon: Instagram, color: "text-pink-500" },
  youtube: { icon: Youtube, color: "text-red-500" },
  linkedin: { icon: Linkedin, color: "text-blue-700" },
  telegram: { icon: MessageCircle, color: "text-blue-500" },
  twitter: { icon: Twitter, color: "text-blue-400" },
  facebook: { icon: Facebook, color: "text-blue-600" },
};

const DashboardHome = () => {
  const [user] = useState(getUser());
  const [profileData, setProfileData] = useState<any>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const profile = await fetchProfile();
      if (profile) {
        setProfileData(profile.profile);
      }
      fetchLinkedAccounts();
      fetchDashboardStats();
      fetchAvailableTasks();
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
    }
  };

  const fetchAvailableTasks = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl("/campaigns/available"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableTasks(data.tasks.slice(0, 5)); // Show only first 5 on home
      }
    } catch (error) {
      console.error("Error fetching available tasks:", error);
    }
  };

  const displayStats = [
    { label: "Today's Earnings", value: `₹${dashboardStats?.todayEarnings || 0}`, icon: TrendingUp, change: "+0%" },
    { label: "Total Earnings", value: `₹${dashboardStats?.wallet?.balance || 0}`, icon: Wallet, change: "+0%" },
    { label: "Pending Earnings", value: `₹${dashboardStats?.pendingEarnings || 0}`, icon: Clock, change: `${dashboardStats?.pendingTasks || 0} pending` },
    { label: "Tasks Completed", value: dashboardStats?.completedTasks || 0, icon: Target, change: "All time" },
  ];

  const youtubeAccount = linkedAccounts.find(acc => acc.platform === "youtube");
  const ytStats = youtubeAccount?.stats;

  const instagramAccount = linkedAccounts.find(acc => acc.platform === "instagram");
  const igStats = instagramAccount?.stats;

  const facebookAccount = linkedAccounts.find(acc => acc.platform === "facebook");
  const fbStats = facebookAccount?.stats;

  const linkedinAccount = linkedAccounts.find(acc => acc.platform === "linkedin");
  const liStats = linkedinAccount?.stats;

  const getPlatformInfo = (platform: string) => {
    return platformIcons[platform.toLowerCase()] || { icon: MessageCircle, color: "text-muted-foreground" };
  };

  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(n)) return "0";
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Welcome back, <span className="text-accent">{user?.name || "User"}</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's your earning overview for today
        </p>
      </div>

      <ProfileOverviewCard user={user} profileData={profileData} linkedAccounts={linkedAccounts} />

      {/* Social Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {youtubeAccount && (
          <Card className="border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Youtube className="h-4 w-4 text-red-500" />
                <span className="text-xs font-bold uppercase tracking-wider">YouTube</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-black">{formatNumber(ytStats?.subscribers || 0)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Subscribers</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatNumber(ytStats?.views || 0)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {instagramAccount && (
          <Card className="border border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Instagram className="h-4 w-4 text-pink-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Instagram</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-black">{formatNumber(igStats?.followersCount || 0)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Followers</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatNumber(igStats?.mediaCount || 0)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {facebookAccount && (
          <Card className="border border-blue-600/20 bg-gradient-to-br from-blue-600/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Facebook</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-black">{formatNumber(fbStats?.followersCount || 0)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Followers</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatNumber(fbStats?.likesCount || 0)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Page Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {linkedinAccount && (
          <Card className="border border-blue-700/20 bg-gradient-to-br from-blue-700/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Linkedin className="h-4 w-4 text-blue-700" />
                <span className="text-xs font-bold uppercase tracking-wider">LinkedIn</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-black">{formatNumber(liStats?.followers || 506)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Followers</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{liStats?.connections || "448"}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((stat, i) => (
          <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
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
        <div className="lg:col-span-2 space-y-6">
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
                  <Progress value={(dashboardStats?.todayTasks || 0) * 20} className="h-2 flex-1" />
                  <span className="text-sm font-semibold text-foreground whitespace-nowrap">{dashboardStats?.todayTasks || 0}/5</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Available Tasks</h3>
              <Link to="/dashboard/tasks">
                <Button variant="ghost" size="sm" className="text-accent text-xs">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {availableTasks.length > 0 ? (
                availableTasks.map((task, i) => {
                  const { icon: PlatformIcon, color } = getPlatformInfo(task.platform);
                  return (
                    <motion.div key={task.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                      <Link to={`/dashboard/tasks?taskId=${task.id}`}>
                        <Card className="border border-border hover:border-accent/20 transition-all hover:shadow-sm cursor-pointer">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                <PlatformIcon className={`h-5 w-5 ${color}`} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{task.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-muted-foreground capitalize">{task.platform}</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">{timeAgo(task.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-accent">₹{task.reward}</span>
                              <Button size="sm" className="h-8 bg-accent text-accent-foreground hover:bg-accent/90 text-xs">
                                Start
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-10 border border-dashed border-border rounded-xl">
                  <p className="text-sm text-muted-foreground italic">No tasks available right now. Check back later!</p>
                </div>
              )}
            </div>
          </div>
        </div>

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
