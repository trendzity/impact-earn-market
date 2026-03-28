import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Download, Plus, CreditCard, Smartphone } from "lucide-react";

const transactions = [
  { date: "28 Mar 2026", campaign: "Instagram Followers Boost", amount: "₹5,000", type: "Campaign Spend", status: "Completed" },
  { date: "27 Mar 2026", campaign: "—", amount: "₹10,000", type: "Recharge", status: "Completed" },
  { date: "25 Mar 2026", campaign: "YouTube Review Campaign", amount: "₹8,200", type: "Campaign Spend", status: "Completed" },
  { date: "22 Mar 2026", campaign: "—", amount: "₹25,000", type: "Recharge", status: "Completed" },
  { date: "20 Mar 2026", campaign: "Telegram Channel Join", amount: "₹3,400", type: "Campaign Spend", status: "Processing" },
];

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const BusinessBilling = () => {
  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Billing & Wallet</h1>
        <p className="text-sm text-muted-foreground">Manage funds and view transaction history</p>
      </motion.div>

      {/* Wallet Summary */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold text-foreground mt-1">₹24,500</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-foreground mt-1">₹1,42,500</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Last Recharge</p>
            <p className="text-2xl font-bold text-foreground mt-1">₹25,000</p>
            <p className="text-xs text-muted-foreground">22 Mar 2026</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Funds */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Add Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Amount (₹)</Label>
                <Input type="number" placeholder="e.g., 5000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Payment Method</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Credit / Debit Card</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
              <Plus className="h-4 w-4" /> Add Funds
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction History */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Transaction History</CardTitle>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
              <Download className="h-3 w-3" /> Export
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t, i) => (
                  <TableRow key={i} className="border-border/30">
                    <TableCell className="text-sm text-muted-foreground">{t.date}</TableCell>
                    <TableCell className="text-sm text-foreground">{t.campaign}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{t.type}</Badge>
                    </TableCell>
                    <TableCell className={`text-sm font-medium ${t.type === "Recharge" ? "text-green-500" : "text-foreground"}`}>
                      {t.type === "Recharge" ? "+" : "-"}{t.amount}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border ${t.status === "Completed" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}>
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

      {/* Invoices */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["March 2026", "February 2026", "January 2026"].map((m) => (
              <div key={m} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <span className="text-sm text-foreground">{m}</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-accent">
                  <Download className="h-3 w-3" /> Download
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BusinessBilling;
