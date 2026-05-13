import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, IndianRupee, Megaphone, ListChecks, TrendingUp, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

// Icon mapping helper
const IconMap: Record<string, any> = {
  Users,
  IndianRupee,
  Megaphone,
  ListChecks,
  TrendingUp,
  Play,
};

const activityData = [
  { day: "Mon", tasks: 0, signups: 0 },
  { day: "Tue", tasks: 0, signups: 0 },
  { day: "Wed", tasks: 0, signups: 0 },
  { day: "Thu", tasks: 0, signups: 0 },
  { day: "Fri", tasks: 0, signups: 0 },
  { day: "Sat", tasks: 0, signups: 0 },
  { day: "Sun", tasks: 0, signups: 0 },
];

const revenueData = [
  { month: "Jan", revenue: 0, payouts: 0 },
  { month: "Feb", revenue: 0, payouts: 0 },
  { month: "Mar", revenue: 0, payouts: 0 },
  { month: "Apr", revenue: 0, payouts: 0 },
  { month: "May", revenue: 0, payouts: 0 },
  { month: "Jun", revenue: 0, payouts: 0 },
];

const chartConfig = {
  tasks: { label: "Tasks", color: "hsl(var(--accent))" },
  signups: { label: "Signups", color: "hsl(var(--foreground))" },
  revenue: { label: "Revenue", color: "hsl(var(--accent))" },
  payouts: { label: "Payouts", color: "hsl(var(--muted-foreground))" },
};

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch(getApiUrl("/admin/stats/overview"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const resData = await response.json();
          setData(resData.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
        toast.error("Failed to load platform overview");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-muted-foreground animate-pulse">Calculating platform metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground">Real-time platform metrics and activity</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {data?.metrics?.map((m: any, i: number) => {
          const Icon = IconMap[m.icon] || TrendingUp;
          return (
            <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border hover:border-accent/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-4 w-4 text-accent`} />
                    {m.change && <span className="text-xs text-green-500 font-medium">{m.change}</span>}
                  </div>
                  <p className="text-lg font-bold text-foreground font-display">{m.value}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{m.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="tasks" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.15)" strokeWidth={2} />
                <Area type="monotone" dataKey="signups" stroke="hsl(var(--foreground))" fill="hsl(var(--foreground) / 0.05)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue vs Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="payouts" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Live Feed */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 border-b border-border/50">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {data?.liveFeed?.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground italic text-sm">Waiting for platform activity...</p>
            ) : (
              data?.liveFeed?.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      item.type === "finance" ? "bg-accent" :
                      item.type === "signup" ? "bg-green-500" :
                      item.type === "campaign" ? "bg-blue-500" :
                      "bg-muted-foreground"
                    }`} />
                    <p className="text-sm text-foreground">{item.text}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(item.time)}</span>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
