import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, TrendingUp, Eye } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, BarChart } from "recharts";

const growthData = [
  { month: "Jan", followers: 12400 }, { month: "Feb", followers: 14200 }, { month: "Mar", followers: 15800 },
  { month: "Apr", followers: 18100 }, { month: "May", followers: 21500 }, { month: "Jun", followers: 24800 },
];

const contentPerformance = [
  { post: "Reel 1", reach: 45000, impressions: 62000 },
  { post: "Reel 2", reach: 38000, impressions: 51000 },
  { post: "Story", reach: 22000, impressions: 35000 },
  { post: "Post", reach: 18000, impressions: 28000 },
  { post: "Video", reach: 52000, impressions: 71000 },
];

const platformBreakdown = [
  { platform: "Instagram", followers: "18.2K", engagement: "4.8%", growth: "+12%" },
  { platform: "YouTube", followers: "6.6K", engagement: "6.2%", growth: "+8%" },
  { platform: "Twitter/X", followers: "3.1K", engagement: "2.1%", growth: "+5%" },
];

const stats = [
  { label: "Total Followers", value: "24.8K", icon: Users, change: "+15%" },
  { label: "Engagement Rate", value: "4.8%", icon: Heart, change: "+0.6%" },
  { label: "Monthly Growth", value: "+3,300", icon: TrendingUp, change: "+15%" },
  { label: "Avg. Reach", value: "35K", icon: Eye, change: "+22%" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfluencerAnalytics = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Audience insights and content performance</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-accent" />
                </div>
                <Badge variant="secondary" className="text-[10px]">{stat.change}</Badge>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Follower Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="followerGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(0, 85%, 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(0, 85%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(0,0%,45%)" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="hsl(0,0%,45%)" tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={{ background: "hsl(0,0%,9%)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="followers" stroke="hsl(0, 85%, 50%)" strokeWidth={2} fill="url(#followerGrowth)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={contentPerformance}>
                  <XAxis dataKey="post" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(0,0%,45%)" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="hsl(0,0%,45%)" tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={{ background: "hsl(0,0%,9%)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                  <Bar dataKey="reach" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="impressions" fill="hsl(0, 0%, 70%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {platformBreakdown.map((p) => (
                <div key={p.platform} className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <p className="font-semibold text-foreground text-sm">{p.platform}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Followers</span>
                    <span className="text-foreground font-medium">{p.followers}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Engagement</span>
                    <span className="text-foreground font-medium">{p.engagement}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Growth</span>
                    <span className="text-green-500 font-medium">{p.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InfluencerAnalytics;
