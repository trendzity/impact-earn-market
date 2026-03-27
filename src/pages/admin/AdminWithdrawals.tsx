import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

const withdrawals = [
  { user: "Priya Kumari", amount: "₹2,500", method: "UPI", status: "Pending", date: "27 Mar 2026" },
  { user: "Rahul Sharma", amount: "₹5,000", method: "Bank Transfer", status: "Processing", date: "27 Mar 2026" },
  { user: "Deepak Verma", amount: "₹12,000", method: "UPI", status: "Completed", date: "26 Mar 2026" },
  { user: "Vikash Singh", amount: "₹3,200", method: "UPI", status: "Pending", date: "27 Mar 2026" },
  { user: "Pooja Reddy", amount: "₹1,800", method: "Bank Transfer", status: "Pending", date: "27 Mar 2026" },
  { user: "Sneha Patel", amount: "₹8,500", method: "UPI", status: "Completed", date: "25 Mar 2026" },
];

export default function AdminWithdrawals() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Withdrawals</h1>
          <p className="text-sm text-muted-foreground">Manage payout requests</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs bg-accent hover:bg-accent/90">
          <CheckCheck className="h-3.5 w-3.5" /> Bulk Process
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Pending Queue", value: "₹1,42,300" },
          { label: "Processing", value: "₹85,000" },
          { label: "Paid Today", value: "₹3,24,500" },
          { label: "Total Paid", value: "₹28.5L" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-lg font-bold font-display text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Withdrawal Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">User</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Method</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((w, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{w.user}</TableCell>
                  <TableCell className="text-sm font-bold">{w.amount}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{w.method}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{w.date}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs font-normal ${
                      w.status === "Completed" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      w.status === "Processing" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}>{w.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {w.status === "Pending" && (
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500"><Check className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-accent"><X className="h-3.5 w-3.5" /></Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
