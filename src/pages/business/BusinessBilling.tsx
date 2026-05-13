import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Download, Plus, Loader2 } from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const BusinessBilling = () => {
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch(getApiUrl("/stats/dashboard"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
          setTransactions(data.data.transactions || []);
        }
      } catch (error) {
        console.error("Failed to fetch billing data", error);
        toast.error("Failed to load billing information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const lastRecharge = transactions.find((t: any) => t.source === "RAZORPAY" || t.source === "ADMIN_CREDIT");

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Billing & Wallet</h1>
        <p className="text-sm text-muted-foreground">Manage funds and view transaction history</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Fetching your wallet details...</p>
        </div>
      ) : (
        <>
          {/* Wallet Summary */}
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-foreground mt-1">₹{stats?.wallet?.balance?.toLocaleString() || "0"}</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Budget Allocated</p>
                <p className="text-2xl font-bold text-foreground mt-1">₹{stats?.totalSpent?.toLocaleString() || "0"}</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Last Top-up</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ₹{lastRecharge ? Number(lastRecharge.amount).toLocaleString() : "0"}
                </p>
                {lastRecharge && (
                  <p className="text-xs text-muted-foreground">{formatDate(lastRecharge.createdAt)}</p>
                )}
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
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((t: any) => (
                        <TableRow key={t.id} className="border-border/30">
                          <TableCell className="text-sm text-muted-foreground">{formatDate(t.createdAt)}</TableCell>
                          <TableCell className="text-sm text-foreground">{t.description || t.source}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] uppercase">{t.type}</Badge>
                          </TableCell>
                          <TableCell className={`text-sm font-medium ${t.type === "CREDIT" ? "text-green-500" : "text-red-500"}`}>
                            {t.type === "CREDIT" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] border ${t.status === "COMPLETED" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}>
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
        </>
      )}
    </motion.div>
  );
};

export default BusinessBilling;
