import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, IndianRupee, TrendingUp, Clock, 
  Plus, History, BarChart3, ArrowUpRight, 
  Loader2, ShieldCheck, Info, Megaphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { getToken, getApiUrl } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BusinessWallet = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(getApiUrl("/campaigns/business/wallet-stats"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await res.json();
      if (resData.success) {
        setData(resData);
      }
    } catch (error) {
      toast.error("Failed to load wallet stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const statsCards = [
    { 
      label: "Available Budget", 
      value: data?.stats?.availableBalance || 0, 
      icon: Wallet, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      desc: "Ready for new campaigns" 
    },
    { 
      label: "Currently Allocated", 
      value: data?.stats?.allocatedBudget || 0, 
      icon: Clock, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      desc: "Reserved for active tasks" 
    },
    { 
      label: "Total Spent", 
      value: data?.stats?.totalSpent || 0, 
      icon: TrendingUp, 
      color: "text-green-600", 
      bg: "bg-green-50",
      desc: "Lifetime payouts" 
    },
    { 
      label: "Pending Deposits", 
      value: data?.stats?.frozenBalance || 0, 
      icon: IndianRupee, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      desc: "Awaiting verification" 
    },
  ];

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-muted-foreground animate-pulse font-display">Crunching the numbers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Campaign Wallet</h1>
          <p className="text-sm text-muted-foreground">Monitor your advertising budget and campaign spend.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-primary text-primary-foreground gap-2 h-11 px-6 shadow-lg shadow-primary/20"
            onClick={() => navigate("/business/deposits")}
          >
            <Plus className="w-5 h-5" /> Add Budget
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <Card key={card.label} className="border-border/50 shadow-sm overflow-hidden relative group">
            <CardContent className="p-6">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-foreground">₹{Number(card.value).toLocaleString()}</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{card.label}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Breakdown Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Campaign Spend Breakdown
            </h2>
          </div>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-[10px] uppercase font-black">Campaign</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Spent</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-right">Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.breakdown?.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">No campaigns found.</TableCell></TableRow>
                  ) : (
                    data?.breakdown?.map((item: any) => (
                      <TableRow key={item.id} className="hover:bg-muted/10 group cursor-pointer" onClick={() => navigate("/business/campaigns")}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                              <Megaphone className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-bold truncate max-w-[150px]">{item.title}</p>
                              <p className="text-[10px] text-muted-foreground font-medium">₹{item.reward} / task</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-widest h-5 ${
                            item.status === "active" ? "border-green-200 bg-green-50 text-green-700" : "border-border bg-muted"
                          }`}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-bold text-foreground">₹{item.spent.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">{item.completions} approved</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="text-sm font-bold text-foreground">₹{item.allocated.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">Budget left</p>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Security & Info */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-bold">
                <ShieldCheck className="w-5 h-5 text-primary" /> Budget Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our system uses a **Smart Escrow** logic. When you launch a campaign, the total potential reward is "Allocated" but stays in your control.
              </p>
              <div className="flex gap-3 items-start">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground font-medium italic">
                  Allocated funds are only deducted when you approve a submission.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground">Active Campaigns:</span>
                <span className="text-sm font-bold">{data?.breakdown?.filter((c:any) => c.status === "active").length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground">Avg. Reward:</span>
                <span className="text-sm font-bold">₹{Math.round(data?.breakdown?.reduce((a:any, b:any) => a + b.reward, 0) / (data?.breakdown?.length || 1))}</span>
              </div>
              <Button variant="outline" className="w-full h-10 text-xs font-bold gap-2 mt-2" onClick={() => navigate("/business/billing")}>
                <History className="w-4 h-4" /> View Full Transaction Log
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessWallet;
