import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, IndianRupee, Megaphone, ListChecks, TrendingUp, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

const metrics = [
  { label: "Total Users", value: "12,847", change: "+8.2%", icon: Users, color: "text-foreground" },
  { label: "Active Today", value: "3,291", change: "+12.5%", icon: TrendingUp, color: "text-accent" },
  { label: "Total Revenue", value: "₹18,42,500", change: "+15.3%", icon: IndianRupee, color: "text-green-500" },
  { label: "GMV", value: "₹45,60,000", change: "+9.1%", icon: IndianRupee, color: "text-foreground" },
  { label: "Active Campaigns", value: "187", change: "+4.7%", icon: Megaphone, color: "text-accent" },
  { label: "Tasks Today", value: "8,412", change: "+22.1%", icon: ListChecks, color: "text-green-500" },
];

const activityData = [
  { day: "Mon", tasks: 1200, signups: 85 },
  { day: "Tue", tasks: 1800, signups: 120 },
  { day: "Wed", tasks: 1600, signups: 95 },
  { day: "Thu", tasks: 2200, signups: 140 },
  { day: "Fri", tasks: 2800, signups: 180 },
  { day: "Sat", tasks: 2400, signups: 160 },
  { day: "Sun", tasks: 1900, signups: 110 },
];

const revenueData = [
  { month: "Jan", revenue: 120000, payouts: 85000 },
  { month: "Feb", revenue: 145000, payouts: 98000 },
  { month: "Mar", revenue: 180000, payouts: 125000 },
  { month: "Apr", revenue: 210000, payouts: 148000 },
  { month: "May", revenue: 250000, payouts: 172000 },
  { month: "Jun", revenue: 285000, payouts: 195000 },
];

const liveFeed = [
  { type: "task", text: "User @priya_k submitted proof for Instagram Follow campaign", time: "2m ago" },
  { type: "signup", text: "New user registered: rahul.sharma@gmail.com", time: "5m ago" },
  { type: "campaign", text: "Campaign 'YT Subscribe Boost' launched by TechBrand", time: "8m ago" },
  { type: "withdrawal", text: "₹2,500 withdrawal request from @creator_dev", time: "12m ago" },
  { type: "fraud", text: "⚠ Duplicate proof detected: User #4821", time: "15m ago" },
  { type: "signup", text: "New reseller registered: GrowthAgency", time: "20m ago" },
];

const chartConfig = {
  tasks: { label: "Tasks", color: "hsl(var(--accent))" },
  signups: { label: "Signups", color: "hsl(var(--foreground))" },
  revenue: { label: "Revenue", color: "hsl(var(--accent))" },
  payouts: { label: "Payouts", color: "hsl(var(--muted-foreground))" },
};

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground">Real-time platform metrics and activity</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-card border-border hover:border-accent/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                  <span className="text-xs text-green-500 font-medium">{m.change}</span>
                </div>
                <p className="text-lg font-bold text-foreground font-display">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {liveFeed.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0"
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    item.type === "fraud" ? "bg-accent" :
                    item.type === "signup" ? "bg-green-500" :
                    item.type === "campaign" ? "bg-blue-500" :
                    "bg-muted-foreground"
                  }`} />
                  <p className="text-sm text-foreground">{item.text}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
