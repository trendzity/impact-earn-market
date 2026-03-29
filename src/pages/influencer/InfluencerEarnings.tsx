import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, Clock, ArrowDownRight } from "lucide-react";

const transactions = [
  { date: "Jun 20, 2026", brand: "StyleCo Fashion", campaign: "Summer Launch", amount: 5000, status: "Credited" },
  { date: "Jun 18, 2026", brand: "FoodieApp", campaign: "App Install", amount: 4500, status: "Credited" },
  { date: "Jun 15, 2026", brand: "EduLearn", campaign: "Course Promo", amount: 6000, status: "Pending" },
  { date: "Jun 12, 2026", brand: "WearIt", campaign: "Fashion Haul", amount: 8000, status: "Credited" },
  { date: "Jun 10, 2026", brand: "TechGear Pro", campaign: "Gadget Review", amount: 12000, status: "Credited" },
  { date: "Jun 8, 2026", brand: "BeautyGlow", campaign: "Skincare Post", amount: 3500, status: "Pending" },
];

const stats = [
  { label: "Total Earnings", value: "₹1,84,500", icon: DollarSign, color: "text-accent" },
  { label: "This Month", value: "₹35,500", icon: TrendingUp, color: "text-green-500" },
  { label: "Pending Payments", value: "₹9,500", icon: Clock, color: "text-yellow-500" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfluencerEarnings = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-display font-bold text-foreground">Earnings</h1>
        <p className="text-sm text-muted-foreground">Track your income and request withdrawals</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Brand</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                      <TableCell>
                        <p className="text-xs font-medium text-foreground">{t.brand}</p>
                        <p className="text-[10px] text-muted-foreground">{t.campaign}</p>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">₹{t.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${t.status === "Credited" ? "text-green-600 border-green-500/30" : "text-yellow-600 border-yellow-500/30"}`}>
                          {t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Withdraw Section */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Withdrawable Balance</p>
                <p className="text-2xl font-bold text-foreground">₹1,75,000</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Amount (₹)</label>
                  <Input type="number" placeholder="Enter amount" className="h-9 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">UPI ID</label>
                  <Input placeholder="yourname@upi" className="h-9 text-sm" />
                </div>
                <Button className="w-full h-9 bg-accent hover:bg-accent/90 text-accent-foreground text-sm gap-1">
                  <ArrowDownRight className="h-3.5 w-3.5" /> Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InfluencerEarnings;
