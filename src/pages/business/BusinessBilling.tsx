import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, ArrowDownToLine, Clock, IndianRupee, 
  Plus, History, Filter, ArrowUpRight, ArrowDownRight, 
  Loader2, Download, ShieldCheck, TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { getToken, getApiUrl } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const BusinessBilling = () => {
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
      console.error("Failed to fetch billing data", error);
      toast.error("Failed to load billing information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [txType]);

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "COMPLETED" || s === "SUCCESS") return <Badge className="bg-green-500/10 text-green-600 border-green-200">Completed</Badge>;
    if (s === "PENDING") return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Pending</Badge>;
    return <Badge className="bg-red-500/10 text-red-600 border-red-200">{status}</Badge>;
  };

  const balanceCards = [
    { 
      label: "Available Balance", 
      value: wallet?.balance || 0, 
      icon: Wallet, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      desc: "Funds for your campaigns" 
    },
    { 
      label: "Budget Allocated", 
      value: wallet?.nonWithdrawableBalance || 0, 
      icon: IndianRupee, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      desc: "Locked in active campaigns" 
    },
    { 
      label: "Total Spent", 
      value: wallet?.totalWithdrawn || 0, 
      icon: TrendingUp, 
      color: "text-green-600", 
      bg: "bg-green-50",
      desc: "Lifetime platform spend" 
    },
    { 
      label: "Pending Deposits", 
      value: wallet?.frozenBalance || 0, 
      icon: Clock, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      desc: "Requests under review" 
    },
  ];

  if (loading && !wallet) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-muted-foreground animate-pulse">Syncing your billing profile...</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Billing & Wallet</h1>
          <p className="text-sm text-muted-foreground">Manage your advertising budget and track spending.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-primary text-primary-foreground gap-2 h-11 px-6 shadow-lg shadow-primary/20"
            onClick={() => navigate("/business/deposits")}
          >
            <Plus className="w-5 h-5" /> Add Funds
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
              <History className="w-5 h-5 text-primary" /> Billing History
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select 
                className="text-xs bg-transparent border-none focus:ring-0 font-medium"
                value={txType}
                onChange={(e) => setTxType(e.target.value)}
              >
                <option value="ALL">All Transactions</option>
                <option value="CREDIT">Top-ups</option>
                <option value="DEBIT">Campaign Costs</option>
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
                    <TableRow><TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">No transactions found.</TableCell></TableRow>
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
                              <p className="text-[10px] text-muted-foreground uppercase">{tx.category?.replace(/_/g, ' ') || "Billing"}</p>
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

        {/* Info Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Wallet Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your advertising budget is held securely. Funds are only deducted when an influencer's task is approved by you.
              </p>
              <div className="pt-2">
                <Button variant="outline" className="w-full h-9 text-xs gap-2" onClick={() => navigate("/business/deposits")}>
                  View Top-up History <ArrowUpRight className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Min Top-up:</span>
                <span className="font-bold">₹500</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Verification:</span>
                <span className="font-bold">Instant to 24h</span>
              </div>
              <Button variant="ghost" className="w-full h-8 text-[10px] text-primary gap-1">
                Download Statement <Download className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BusinessBilling;
