import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, TrendingUp, TrendingDown, CreditCard, Plus } from "lucide-react";

const walletStats = [
  { label: "Available Balance", value: "₹1,85,400", icon: Wallet, color: "text-accent" },
  { label: "Total Spent", value: "₹3,42,600", icon: TrendingDown, color: "text-muted-foreground" },
  { label: "Total Earned", value: "₹4,85,200", icon: TrendingUp, color: "text-green-500" },
];

const transactions = [
  { date: "29 Mar 2026", order: "#4821", type: "Order Payment", amount: "-₹750", status: "Completed" },
  { date: "29 Mar 2026", order: "-", type: "Funds Added", amount: "+₹10,000", status: "Completed" },
  { date: "28 Mar 2026", order: "#4820", type: "Order Payment", amount: "-₹1,200", status: "Completed" },
  { date: "28 Mar 2026", order: "#4819", type: "Order Payment", amount: "-₹600", status: "Processing" },
  { date: "27 Mar 2026", order: "-", type: "Funds Added", amount: "+₹25,000", status: "Completed" },
];

const ResellerWallet = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Wallet & Transactions</h1>
        <p className="text-muted-foreground text-sm">Manage your funds and track all transactions.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {walletStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
              <div className="w-full sm:w-48">
                <label className="text-sm text-muted-foreground mb-1 block">Amount (₹)</label>
                <Input placeholder="Enter amount" className="h-9" />
              </div>
              <div className="flex gap-2">
                {["₹5,000", "₹10,000", "₹25,000"].map((amt) => (
                  <Button key={amt} variant="outline" size="sm" className="h-9">{amt}</Button>
                ))}
              </div>
              <Button className="h-9 bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                <Plus className="h-4 w-4" /> Add Funds
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, i) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="font-medium">{tx.order}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell className={`font-semibold ${tx.amount.startsWith("+") ? "text-green-500" : "text-foreground"}`}>
                      {tx.amount}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={tx.status === "Completed" ? "bg-green-500/10 text-green-500 border-green-500/30" : "bg-blue-500/10 text-blue-500 border-blue-500/30"}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResellerWallet;
