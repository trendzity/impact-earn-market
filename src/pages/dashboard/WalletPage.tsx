import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, ArrowDownToLine, Clock, CheckCircle, XCircle, 
  Plus, Send, Copy, Share2, Users, IndianRupee, ArrowUpRight, 
  ArrowDownRight, Filter, ExternalLink, Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const WalletPage = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState<any>({ count: 0 });
  const [loading, setLoading] = useState(true);
  const [txType, setTxType] = useState("ALL");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      // Fetch Wallet Stats
      const walletRes = await fetch(getApiUrl("/wallet/my"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const walletData = await walletRes.json();
      if (walletData.success) {
        setWallet(walletData.wallet);
        setReferralStats(walletData.referralStats);
      }

      // Fetch Transactions
      const txRes = await fetch(getApiUrl(`/wallet/my/transactions?type=${txType}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const txData = await txRes.json();
      if (txData.success) {
        setTransactions(txData.transactions);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [txType]);

  const copyReferralLink = () => {
    const code = wallet?.user?.referralCode || "USER123";
    const link = `${window.location.origin}/signup?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied to clipboard!");
  };

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
      label: "Total Balance", 
      value: wallet?.balance || 0, 
      icon: Wallet, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      desc: "Combined platform funds" 
    },
    { 
      label: "Withdrawable", 
      value: wallet?.withdrawableBalance || 0, 
      icon: ArrowDownToLine, 
      color: "text-green-600", 
      bg: "bg-green-50",
      desc: "Ready for payout" 
    },
    { 
      label: "Non-Withdrawable", 
      value: wallet?.nonWithdrawableBalance || 0, 
      icon: IndianRupee, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      desc: "For campaign budgets" 
    },
    { 
      label: "Frozen / Pending", 
      value: wallet?.frozenBalance || 0, 
      icon: Clock, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      desc: "Processing funds" 
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Wallet</h1>
          <p className="text-muted-foreground mt-1">Track your earnings and manage financial operations.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-primary text-primary-foreground gap-2"
            onClick={() => navigate("/dashboard/deposits")}
          >
            <Plus className="w-4 h-4" /> Add Funds
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/dashboard/withdraw")}
          >
            <Send className="w-4 h-4" /> Request Payout
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {balanceCards.map((card, i) => (
          <motion.div 
            key={card.label} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-border/50 shadow-sm overflow-hidden relative group">
              <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <card.icon className="w-12 h-12" />
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
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Transaction History
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select 
                className="text-xs bg-transparent border-none focus:ring-0 font-medium"
                value={txType}
                onChange={(e) => setTxType(e.target.value)}
              >
                <option value="ALL">All Transactions</option>
                <option value="CREDIT">Credits</option>
                <option value="DEBIT">Debits</option>
              </select>
            </div>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <div className="rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={4} className="h-40 text-center">Loading transactions...</TableCell></TableRow>
                    ) : transactions.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">No history found</TableCell></TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx.id} className="hover:bg-muted/20">
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(tx.createdAt), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-full ${tx.type === "CREDIT" ? "bg-green-50" : "bg-red-50"}`}>
                                {tx.type === "CREDIT" ? <ArrowUpRight className="w-3 h-3 text-green-600" /> : <ArrowDownRight className="w-3 h-3 text-red-600" />}
                              </div>
                              <div>
                                <p className="text-xs font-bold">{tx.description || tx.source}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">{tx.category?.replace('_', ' ') || "General"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className={`font-bold ${tx.type === "CREDIT" ? "text-green-600" : "text-red-600"}`}>
                            {tx.type === "CREDIT" ? "+" : "-"}₹{Number(tx.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Referral Card */}
          <Card className="border-primary/20 bg-primary/5 shadow-none relative overflow-hidden">
            <div className="absolute -top-6 -right-6 opacity-10">
              <Share2 className="w-24 h-24 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Refer & Earn
              </CardTitle>
              <CardDescription className="text-xs">
                Invite friends and earn ₹50 for each successful signup.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-2 bg-background border rounded-lg">
                <code className="text-xs font-mono font-bold flex-1 truncate">
                  {wallet?.user?.referralCode || "---"}
                </code>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={copyReferralLink}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-background border rounded-lg text-center">
                  <p className="text-lg font-bold">{referralStats.count}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Invited</p>
                </div>
                <div className="p-3 bg-background border rounded-lg text-center">
                  <p className="text-lg font-bold text-green-600">₹{referralStats.count * 50}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Earned</p>
                </div>
              </div>
              <Button className="w-full h-8 text-xs font-bold gap-2" onClick={copyReferralLink}>
                Copy Referral Link <ExternalLink className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Help */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" /> Payment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-bold">Withdrawal Limits</p>
                <p className="text-[11px] text-muted-foreground">Min: ₹100 • Max: ₹50,000 / day</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold">Processing Time</p>
                <p className="text-[11px] text-muted-foreground">24 to 48 hours for most payments.</p>
              </div>
              <div className="pt-2">
                <p className="text-[10px] italic text-muted-foreground">
                  * All withdrawals are subject to verification.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
