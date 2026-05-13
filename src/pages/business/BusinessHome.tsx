import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, IndianRupee, Users, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { ProfileOverviewCard } from "@/components/dashboard/ProfileOverviewCard";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const performanceData = [
  { day: "Mon", spend: 2400, engagement: 180 },
  { day: "Tue", spend: 3200, engagement: 240 },
  { day: "Wed", spend: 2800, engagement: 210 },
  { day: "Thu", spend: 4100, engagement: 320 },
  { day: "Fri", spend: 3600, engagement: 290 },
  { day: "Sat", spend: 2900, engagement: 220 },
  { day: "Sun", spend: 3400, engagement: 260 },
];

const recentActivity = [
  { action: "Campaign launched", detail: "Instagram Followers Boost", time: "2 min ago", type: "launch" },
  { action: "Proof approved", detail: "YouTube Review Campaign — 12 tasks", time: "15 min ago", type: "approve" },
  { action: "Proofs rejected", detail: "Telegram Join — 3 invalid submissions", time: "1 hr ago", type: "reject" },
  { action: "Funds added", detail: "₹5,000 via UPI", time: "3 hrs ago", type: "fund" },
  { action: "Campaign completed", detail: "Twitter Retweet Drive", time: "5 hrs ago", type: "complete" },
];

const BusinessHome = () => {
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

  const displayStats = [
    { title: "Active Campaigns", value: dashboardStats?.activeCampaigns || "0", change: "Current", icon: Megaphone, color: "text-accent" },
    { title: "Wallet Balance", value: `₹${dashboardStats?.wallet?.balance || 0}`, change: "Available", icon: IndianRupee, color: "text-accent" },
    { title: "Total Engagement", value: dashboardStats?.totalEngagement || "0", change: "Tasks completed", icon: Users, color: "text-accent" },
    { title: "Pending Approvals", value: dashboardStats?.pendingApprovals || "0", change: "Awaiting review", icon: Clock, color: "text-accent" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Business Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your campaigns and performance</p>
      </motion.div>

      <motion.div variants={item}>
        <ProfileOverviewCard user={user} profileData={profileData} linkedAccounts={linkedAccounts} />
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((s) => (
          <Card key={s.title} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Campaign Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0,85%,50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0,85%,50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,20%)" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(0,0%,45%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(0,0%,45%)" />
                <Tooltip contentStyle={{ background: "hsl(0,0%,10%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Area type="monotone" dataKey="spend" stroke="hsl(0,85%,50%)" fill="url(#spendGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,20%)" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(0,0%,45%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(0,0%,45%)" />
                <Tooltip contentStyle={{ background: "hsl(0,0%,10%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Bar dataKey="engagement" fill="hsl(0,85%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!dashboardStats?.activities || dashboardStats.activities.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-4">No recent activity to show.</p>
            ) : (
              dashboardStats.activities.map((a: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${a.color || 'bg-accent'}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.text}</p>
                      <p className="text-xs text-muted-foreground">{a.detail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {new Date(a.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BusinessHome;
