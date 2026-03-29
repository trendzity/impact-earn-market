import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, TrendingUp, ShoppingCart, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { day: "Mon", revenue: 12400, profit: 3100 },
  { day: "Tue", revenue: 15800, profit: 4200 },
  { day: "Wed", revenue: 11200, profit: 2800 },
  { day: "Thu", revenue: 18600, profit: 5100 },
  { day: "Fri", revenue: 22400, profit: 6700 },
  { day: "Sat", revenue: 19800, profit: 5400 },
  { day: "Sun", revenue: 16500, profit: 4500 },
];

const ordersData = [
  { day: "Mon", orders: 48 },
  { day: "Tue", orders: 62 },
  { day: "Wed", orders: 41 },
  { day: "Thu", orders: 73 },
  { day: "Fri", orders: 89 },
  { day: "Sat", orders: 76 },
  { day: "Sun", orders: 58 },
];

const stats = [
  { label: "Total Revenue", value: "₹4,85,200", change: "+18.2%", up: true, icon: IndianRupee },
  { label: "Total Profit", value: "₹1,42,600", change: "+12.5%", up: true, icon: TrendingUp },
  { label: "Active Orders", value: "234", change: "+8.1%", up: true, icon: ShoppingCart },
  { label: "Total Clients", value: "89", change: "+3", up: true, icon: Users },
];

const recentActivity = [
  { type: "order", text: "New order #4821 from Client Arjun — 5K IG Followers", time: "2 min ago" },
  { type: "complete", text: "Order #4818 completed — YouTube 10K Views", time: "15 min ago" },
  { type: "earning", text: "Profit ₹1,200 earned from Bulk Order Pack", time: "1 hr ago" },
  { type: "client", text: "New client registered — SocialBoost Agency", time: "2 hr ago" },
  { type: "order", text: "Order #4815 processing — Telegram 2K Members", time: "3 hr ago" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const ResellerHome = () => {
  return (
    <div className="space-y-6">
      <motion.div {...fadeUp}>
        <h1 className="text-2xl font-bold text-foreground">Reseller Dashboard</h1>
        <p className="text-muted-foreground text-sm">Track revenue, profits, and manage your SMM business.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.08 }}>
            <Card className="border-border/50 bg-card hover:border-accent/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-accent" />
                  </div>
                  <Badge variant="outline" className={stat.up ? "text-green-500 border-green-500/30 bg-green-500/10" : "text-red-500 border-red-500/30 bg-red-500/10"}>
                    {stat.up ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Revenue vs Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.15)" strokeWidth={2} />
                  <Area type="monotone" dataKey="profit" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Orders Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="orders" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...fadeUp} transition={{ delay: 0.4 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${item.type === "earning" ? "bg-green-500" : item.type === "complete" ? "bg-accent" : "bg-muted-foreground"}`} />
                  <div className="flex-1">
                    <p className="text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResellerHome;
