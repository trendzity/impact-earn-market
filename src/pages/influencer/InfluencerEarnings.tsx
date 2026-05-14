import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, TrendingUp, Clock, ArrowDownRight, Loader2, 
  Wallet, ArrowDownToLine, IndianRupee, Filter, CheckCircle, 
  XCircle, ArrowUpRight, Plus, Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfluencerEarnings = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [txType, setTxType] = useState("ALL");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      // Fetch Wallet Stats
      const walletRes = await fetch(getApiUrl("/wallet/my"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const walletData = await walletRes.json();
      
      // Fetch Transactions
      const txRes = await fetch(getApiUrl(`/wallet/my/transactions?type=${txType}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const txData = await txRes.json();

      if (walletData.success && txData.success) {
        setWallet(walletData.wallet);
        setTransactions(txData.transactions || []);
      }
    } catch (error) {
      console.error("Failed to fetch earnings", error);
      toast.error("Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [txType]);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED": 
      case "SUCCESS":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">Completed</Badge>;
      case "PENDING": 
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200">Pending</Badge>;
      case "REJECTED":
      case "FAILED":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const balanceCards = [
    { 
      label: "Total Earnings", 
      value: wallet?.totalEarned || 0, 
      icon: DollarSign, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      desc: "Lifetime platform earnings" 
    },
    { 
      label: "Withdrawable", 
      value: wallet?.withdrawableBalance || 0, 
      icon: ArrowDownToLine, 
      color: "text-green-600", 
      bg: "bg-green-50",
      desc: "Available for payout" 
    },
    { 
      label: "Non-Withdrawable", 
      value: wallet?.nonWithdrawableBalance || 0, 
      icon: IndianRupee, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      desc: "Bonus / Locked funds" 
    },
    { 
      label: "Pending / Frozen", 
      value: wallet?.frozenBalance || 0, 
      icon: Clock, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      desc: "Under review" 
    },
  ];

  if (loading && !wallet) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-muted-foreground animate-pulse">Syncing your earnings...</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Earnings Center</h1>
          <p className="text-sm text-muted-foreground">Monitor your performance and manage your rewards.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-primary text-primary-foreground gap-2"
            onClick={() => navigate("/influencer/deposits")}
          >
            <Plus className="w-4 h-4" /> Add Funds
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/influencer/withdraw")}
          >
            <Send className="w-4 h-4" /> Request Payout
          </Button>
        </div>
      </motion.div>

      {/* Balance Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {balanceCards.map((card, i) => (
          <Card key={card.label} className="border-border/50 shadow-sm overflow-hidden relative group">
            <div className={`absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
              <card.icon className="w-16 h-16" />
            </div>
            <CardContent className="p-6">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">₹{Number(card.value).toLocaleString()}</h3>
              <p className="text-sm font-medium text-foreground/80">{card.label}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Transactions
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select 
                className="text-xs bg-transparent border-none focus:ring-0 font-medium"
                value={txType}
                onChange={(e) => setTxType(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="CREDIT">Earnings</option>
                <option value="DEBIT">Payouts</option>
              </select>
            </div>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Description</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">No transactions yet. Start earning!</TableCell></TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-muted/10">
                        <TableCell className="text-[11px] text-muted-foreground">
                          {format(new Date(tx.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-full ${tx.type === "CREDIT" ? "bg-green-50" : "bg-red-50"}`}>
                              {tx.type === "CREDIT" ? <ArrowUpRight className="w-3 h-3 text-green-600" /> : <ArrowDownRight className="w-3 h-3 text-red-600" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold">{tx.description || tx.source}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">{tx.category?.replace(/_/g, ' ') || "General"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={`text-sm font-bold ${tx.type === "CREDIT" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "CREDIT" ? "+" : "-"}₹{Number(tx.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Withdrawal Quick Action */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowDownToLine className="w-4 h-4 text-primary" /> Quick Payout
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Move your earnings to your bank account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-background border border-border/50 text-center">
                <p className="text-xs text-muted-foreground">Ready to Payout</p>
                <p className="text-3xl font-bold text-foreground">₹{Number(wallet?.withdrawableBalance || 0).toLocaleString()}</p>
              </div>
              <Button 
                className="w-full h-10 font-bold gap-2"
                onClick={() => navigate("/influencer/withdraw")}
              >
                Request Payout <ArrowDownRight className="w-4 h-4" />
              </Button>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                  <span>Min Withdrawal</span>
                  <span className="text-foreground">₹100</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                  <span>Processing Time</span>
                  <span className="text-foreground">24-48 Hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Earnings Guide</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                </div>
                <p className="text-[11px] text-muted-foreground">Rewards are credited instantly after Task Approval.</p>
              </div>
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                </div>
                <p className="text-[11px] text-muted-foreground">High-quality proof submissions get approved faster.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InfluencerEarnings;
