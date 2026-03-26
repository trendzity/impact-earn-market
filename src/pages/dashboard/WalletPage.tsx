import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowDownToLine, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const walletStats = [
  { label: "Total Balance", value: "₹12,450", icon: Wallet },
  { label: "Withdrawable", value: "₹10,200", icon: ArrowDownToLine },
  { label: "Pending", value: "₹2,250", icon: Clock },
];

const transactions = [
  { date: "Mar 25", name: "Follow @brand_xyz", amount: "+₹15", status: "completed" },
  { date: "Mar 25", name: "Like YouTube Video", amount: "+₹25", status: "completed" },
  { date: "Mar 24", name: "Withdrawal - UPI", amount: "-₹500", status: "completed" },
  { date: "Mar 24", name: "Join Telegram Channel", amount: "+₹10", status: "pending" },
  { date: "Mar 23", name: "Comment on Post", amount: "+₹20", status: "completed" },
  { date: "Mar 23", name: "Withdrawal - UPI", amount: "-₹1,000", status: "failed" },
];

const tabs = ["Earnings", "Pending", "Withdrawals"];

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState("Earnings");

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (s === "pending") return <Clock className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your earnings and withdrawals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {walletStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Transactions</CardTitle>
                <div className="flex gap-1">
                  {tabs.map((tab) => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? "default" : "ghost"}
                      size="sm"
                      className={`text-xs h-7 ${activeTab === tab ? "bg-accent text-accent-foreground" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {transactions.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      {statusIcon(tx.status)}
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.name}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${tx.amount.startsWith("+") ? "text-green-500" : "text-foreground"}`}>
                        {tx.amount}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Withdraw */}
        <Card className="border border-border h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Amount (₹)</label>
              <Input type="number" placeholder="Enter amount" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">UPI ID</label>
              <Input placeholder="yourname@upi" />
            </div>
            <p className="text-xs text-muted-foreground">Min withdrawal: ₹100 • Processing: 24-48 hrs</p>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Withdraw
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;
