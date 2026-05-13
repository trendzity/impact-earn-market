import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Handshake,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Youtube,
  Star,
  Users,
  Eye,
  Video,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, BarChart } from "recharts";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { ProfileOverviewCard } from "@/components/dashboard/ProfileOverviewCard";

const earningsData = [
  { week: "W1", earnings: 2400 },
  { week: "W2", earnings: 3800 },
  { week: "W3", earnings: 2900 },
  { week: "W4", earnings: 5200 },
  { week: "W5", earnings: 4100 },
  { week: "W6", earnings: 6800 },
  { week: "W7", earnings: 5500 },
];

const engagementData = [
  { day: "Mon", likes: 320, comments: 85 },
  { day: "Tue", likes: 450, comments: 120 },
  { day: "Wed", likes: 280, comments: 65 },
  { day: "Thu", likes: 520, comments: 150 },
  { day: "Fri", likes: 610, comments: 180 },
  { day: "Sat", likes: 400, comments: 95 },
  { day: "Sun", likes: 350, comments: 110 },
];

const recentActivity = [
  { type: "deal", text: "New brand deal from StyleCo", time: "2 min ago", color: "bg-accent" },
  { type: "approved", text: "Campaign 'Summer Vibes' approved", time: "1 hr ago", color: "bg-green-500" },
  { type: "payment", text: "Payment of ₹3,200 credited", time: "3 hrs ago", color: "bg-blue-500" },
  { type: "deal", text: "FitBrand sent collaboration request", time: "5 hrs ago", color: "bg-accent" },
  { type: "completed", text: "Completed 'Tech Review' campaign", time: "1 day ago", color: "bg-green-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const InfluencerHome = () => {
  const [user] = useState(getUser());
  const [profileData, setProfileData] = useState<any>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProfile();
      if (data) {
        setProfileData(data.profile);
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
        const linked = await response.json();
        setLinkedAccounts(linked);
      }
    } catch (error) {
      console.error("Error fetching linked accounts:", error);
    }
  };

  const displayStats = [
    { label: "Total Earnings", value: `₹${dashboardStats?.wallet?.balance || 0}`, icon: DollarSign, change: "+0%" },
    { label: "Active Deals", value: dashboardStats?.activeCampaigns || "0", icon: Handshake, change: "Current" },
    { label: "Completed Campaigns", value: dashboardStats?.completedTasks || "0", icon: CheckCircle2, change: "Total" },
    { label: "Pending Payments", value: `₹${dashboardStats?.pendingEarnings || 0}`, icon: Clock, change: "0 pending" },
  ];

  const youtubeAccount = linkedAccounts.find(acc => acc.platform === "youtube");
  const ytStats = youtubeAccount?.stats;

  const instagramAccount = linkedAccounts.find(acc => acc.platform === "instagram");
  const igStats = instagramAccount?.stats;

  const facebookAccount = linkedAccounts.find(acc => acc.platform === "facebook");
  const fbStats = facebookAccount?.stats;

  const linkedinAccount = linkedAccounts.find(acc => acc.platform === "linkedin");
  const liStats = linkedinAccount?.stats;

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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-display font-bold text-foreground">Creator Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here's your performance overview.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ProfileOverviewCard user={user} profileData={profileData} linkedAccounts={linkedAccounts} />
      </motion.div>

      {/* Social Insights Grid (Neat Cards) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((stat) => (
          <Card key={stat.label} className="group hover:shadow-md transition-all duration-300 hover:border-accent/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <stat.icon className="h-4 w-4 text-accent" />
                </div>
                <Badge variant="secondary" className="text-[10px] font-medium gap-1">
                  <TrendingUp className="h-2.5 w-2.5" />
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="influencerEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(0, 85%, 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(0, 85%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(0,0%,45%)" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="hsl(0,0%,45%)" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip contentStyle={{ background: "hsl(0,0%,9%)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="earnings" stroke="hsl(0, 85%, 50%)" strokeWidth={2} fill="url(#influencerEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Engagement Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={engagementData}>
                  <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(0,0%,45%)" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="hsl(0,0%,45%)" />
                  <Tooltip contentStyle={{ background: "hsl(0,0%,9%)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                  <Bar dataKey="likes" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="comments" fill="hsl(0, 0%, 70%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardStats?.activities?.length > 0 ? (
                dashboardStats.activities.map((activity: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <div className={`h-2 w-2 rounded-full ${activity.color} shrink-0`} />
                    <p className="text-sm text-foreground flex-1">{activity.text}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(activity.time)}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground italic">
                  No recent activity found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InfluencerHome;
