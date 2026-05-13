import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, Clock, ArrowDownRight, Loader2 } from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfluencerEarnings = () => {
  const [data, setData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch(getApiUrl("/stats/dashboard"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const res = await response.json();
          setData(res.data);
          setTransactions(res.data.transactions || []);
        }
      } catch (error) {
        console.error("Failed to fetch earnings", error);
        toast.error("Failed to load earnings data");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const stats = data ? [
    { label: "Total Earnings", value: `₹${Number(data.wallet?.totalEarned || 0).toLocaleString()}`, icon: DollarSign, color: "text-accent" },
    { label: "Today's Earnings", value: `₹${Number(data.todayEarnings || 0).toLocaleString()}`, icon: TrendingUp, color: "text-green-500" },
    { label: "Pending Payments", value: `₹${Number(data.pendingEarnings || 0).toLocaleString()}`, icon: Clock, color: "text-yellow-500" },
  ] : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-muted-foreground animate-pulse">Loading your financial summary...</p>
      </div>
    );
  }

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
                    <TableHead className="text-xs">Description</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground italic">
                        No transactions yet. Start earning!
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((t, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs text-muted-foreground">{formatDate(t.createdAt)}</TableCell>
                        <TableCell>
                          <p className="text-xs font-medium text-foreground">{t.description || t.source}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{t.category?.replace(/_/g, " ")}</p>
                        </TableCell>
                        <TableCell className={`text-xs font-semibold ${t.type === "CREDIT" ? "text-green-600" : "text-red-600"}`}>
                          {t.type === "CREDIT" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${t.status === "COMPLETED" ? "text-green-600 border-green-500/30" : "text-yellow-600 border-yellow-500/30"}`}>
                            {t.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                <p className="text-2xl font-bold text-foreground">₹{Number(data?.wallet?.withdrawableBalance || 0).toLocaleString()}</p>
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
