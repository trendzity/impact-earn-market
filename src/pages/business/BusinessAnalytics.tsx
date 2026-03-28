import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const engagementData = [
  { date: "Week 1", tasks: 120, spend: 3600 },
  { date: "Week 2", tasks: 210, spend: 6300 },
  { date: "Week 3", tasks: 180, spend: 5400 },
  { date: "Week 4", tasks: 340, spend: 10200 },
];

const platformData = [
  { name: "Instagram", value: 45 },
  { name: "YouTube", value: 30 },
  { name: "Telegram", value: 15 },
  { name: "Twitter", value: 10 },
];

const COLORS = ["hsl(0,85%,50%)", "hsl(0,0%,40%)", "hsl(0,0%,60%)", "hsl(0,0%,75%)"];

const topCampaigns = [
  { name: "Instagram Followers Boost", tasks: 342, cost: "₹18,200", rate: "96%" },
  { name: "YouTube Review Campaign", tasks: 580, cost: "₹40,000", rate: "88%" },
  { name: "Telegram Channel Join", tasks: 128, cost: "₹6,400", rate: "92%" },
];

const metrics = [
  { label: "Total Tasks Completed", value: "3,847" },
  { label: "Avg Cost per Task", value: "₹37" },
  { label: "Completion Rate", value: "91%" },
  { label: "ROI Score", value: "4.2x" },
];

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const BusinessAnalytics = () => {
  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Track campaign performance and ROI</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,20%)" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(0,0%,45%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(0,0%,45%)" />
                <Tooltip contentStyle={{ background: "hsl(0,0%,10%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Line type="monotone" dataKey="tasks" stroke="hsl(0,85%,50%)" strokeWidth={2} dot={{ fill: "hsl(0,85%,50%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={platformData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {platformData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(0,0%,10%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex flex-wrap gap-3 justify-center">
            {platformData.map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                {p.name} ({p.value}%)
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Performing Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCampaigns.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.tasks} tasks · {c.cost}</p>
                </div>
                <span className="text-sm font-semibold text-accent">{c.rate}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BusinessAnalytics;
