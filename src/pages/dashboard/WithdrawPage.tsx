import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Wallet, Send, History, IndianRupee,
  Building2, Smartphone, Plus, Clock, CheckCircle,
  XCircle, Info, Loader2, ArrowDownToLine, ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";
import { format } from "date-fns";

const WithdrawPage = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [savedAccounts, setSavedAccounts] = useState<{ banks: any[], upis: any[] }>({ banks: [], upis: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"BANK" | "UPI">("UPI");
  const [selectedAccountId, setSelectedAccountId] = useState("");

  // New Account Modals
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [newBank, setNewBank] = useState({ bankName: "", accountNumber: "", ifscCode: "" });
  const [newUpi, setNewUpi] = useState({ upiId: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const [walletRes, withdrawRes, accountRes] = await Promise.all([
        fetch(getApiUrl("/wallet/my"), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(getApiUrl("/withdrawals/my"), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(getApiUrl("/wallet/my/accounts"), { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const walletData = await walletRes.json();
      const withdrawData = await withdrawRes.json();
      const accountData = await accountRes.json();

      if (walletData.success) setWallet(walletData.wallet);
      if (withdrawData.success) setWithdrawals(withdrawData.withdrawals);
      if (accountData.success) setSavedAccounts({ banks: accountData.banks, upis: accountData.upis });

    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) < 100) {
      toast.error("Minimum withdrawal is ₹100");
      return;
    }

    const selectedAccount = method === "BANK"
      ? savedAccounts.banks.find(b => b.id === selectedAccountId)
      : savedAccounts.upis.find(u => u.id === selectedAccountId);

    if (!selectedAccount) {
      toast.error("Please select a payout account");
      return;
    }

    try {
      setSubmitting(true);
      const token = getToken();
      const res = await fetch(getApiUrl("/withdrawals/submit"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount,
          paymentMode: method,
          ...selectedAccount // Spreads bankName, accountNumber, ifscCode or upiId
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Withdrawal request submitted!");
        setAmount("");
        fetchData();
      } else {
        toast.error(data.message || "Failed to submit");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBank = async () => {
    try {
      const token = getToken();
      const res = await fetch(getApiUrl("/wallet/my/bank"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newBank)
      });
      if (res.ok) {
        toast.success("Bank account saved!");
        setIsBankModalOpen(false);
        fetchData();
      }
    } catch { toast.error("Failed to save"); }
  };

  const handleAddUpi = async () => {
    try {
      const token = getToken();
      const res = await fetch(getApiUrl("/wallet/my/upi"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newUpi)
      });
      if (res.ok) {
        toast.success("UPI ID saved!");
        setIsUpiModalOpen(false);
        fetchData();
      }
    } catch { toast.error("Failed to save"); }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED": return <Badge className="bg-green-500/10 text-green-600 border-green-200">Approved</Badge>;
      case "PENDING": return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Pending</Badge>;
      case "REJECTED": return <Badge className="bg-red-500/10 text-red-600 border-red-200">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Withdraw Funds</h1>
          <p className="text-muted-foreground mt-1">Get your earnings transferred to your bank or UPI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Withdrawal Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Request Payout</CardTitle>
                  <CardDescription className="text-xs">Enter amount and select your destination.</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Available to Withdraw</p>
                  <p className="text-2xl font-bold text-primary">₹{Number(wallet?.withdrawableBalance || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Min ₹100"
                      className="pl-9 h-12 text-lg font-bold"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Withdrawal Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={method === "UPI" ? "default" : "outline"}
                      className="h-12 gap-2"
                      onClick={() => { setMethod("UPI"); setSelectedAccountId(""); }}
                    >
                      <Smartphone className="w-4 h-4" /> UPI
                    </Button>
                    <Button
                      type="button"
                      variant={method === "BANK" ? "default" : "outline"}
                      className="h-12 gap-2"
                      onClick={() => { setMethod("BANK"); setSelectedAccountId(""); }}
                    >
                      <Building2 className="w-4 h-4" /> Bank Account
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Select {method === "BANK" ? "Bank Account" : "UPI ID"}</label>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs text-primary font-bold"
                      onClick={() => method === "BANK" ? setIsBankModalOpen(true) : setIsUpiModalOpen(true)}
                    >
                      + Add New
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {method === "UPI" ? (
                      savedAccounts.upis.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic py-2">No UPI IDs saved. Please add one.</p>
                      ) : (
                        savedAccounts.upis.map(upi => (
                          <div
                            key={upi.id}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAccountId === upi.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                            onClick={() => setSelectedAccountId(upi.id)}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-sm">{upi.upiId}</p>
                              {selectedAccountId === upi.id && <CheckCircle className="w-4 h-4 text-primary" />}
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      savedAccounts.banks.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic py-2">No Bank accounts saved. Please add one.</p>
                      ) : (
                        savedAccounts.banks.map(bank => (
                          <div
                            key={bank.id}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAccountId === bank.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                            onClick={() => setSelectedAccountId(bank.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-sm">{bank.bankName}</p>
                                <p className="text-[10px] text-muted-foreground">A/C: {bank.accountNumber} • IFSC: {bank.ifscCode}</p>
                              </div>
                              {selectedAccountId === bank.id && <CheckCircle className="w-4 h-4 text-primary" />}
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                    disabled={submitting || !selectedAccountId || Number(amount) > Number(wallet?.withdrawableBalance || 0) || Number(amount) < 100}
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Confirm Withdrawal"}
                  </Button>
                  
                  {/* Dynamic Error Note */}
                  <AnimatePresence>
                    {(Number(amount) > 0 || !selectedAccountId) && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="flex items-center justify-center gap-1.5 p-2"
                      >
                        <Info className="w-3.5 h-3.5 text-red-500" />
                        <p className="text-[11px] font-medium text-red-600 italic">
                          {!selectedAccountId ? "Please select a Bank or UPI account" :
                           Number(amount) < 100 ? "Minimum withdrawal amount is ₹100" :
                           Number(amount) > Number(wallet?.withdrawableBalance || 0) ? "Insufficient withdrawable balance" :
                           "Ready to withdraw"}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-center text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">
                    No fees applied • You receive full ₹{amount || "0"}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* History */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Payout History
            </h2>
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">Syncing history...</TableCell></TableRow>
                    ) : withdrawals.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">No payout requests yet.</TableCell></TableRow>
                    ) : (
                      withdrawals.map((w) => (
                        <TableRow key={w.id} className="hover:bg-muted/10">
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(w.createdAt), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="font-bold text-sm">₹{Number(w.amount).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold uppercase">{w.paymentMode}</span>
                              <span className="text-[9px] text-muted-foreground">{w.upiId || w.accountNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(w.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-accent/20 bg-accent/5 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4" /> Payout Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <div className="flex gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                <p>Withdrawals are processed within **24-48 hours** on business days.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                <p>Ensure your Bank/UPI details are correct. Failed transfers may take 7 days to revert.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                <p>Minimum payout amount is **₹100**.</p>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-muted/30 border border-dashed border-border flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
              <ArrowDownToLine className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold">Need Help?</p>
              <p className="text-[11px] text-muted-foreground">Contact our support if your payout is delayed more than 72 hours.</p>
            </div>
            <Button variant="outline" size="sm" className="w-full h-8 text-[10px] font-bold">Contact Support</Button>
          </div>
        </div>
      </div>

      {/* Add Bank Modal */}
      <Dialog open={isBankModalOpen} onOpenChange={setIsBankModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Bank Account</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Bank Name</label>
              <Input placeholder="e.g. HDFC Bank" value={newBank.bankName} onChange={e => setNewBank({ ...newBank, bankName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Account Number</label>
              <Input placeholder="Enter Account Number" value={newBank.accountNumber} onChange={e => setNewBank({ ...newBank, accountNumber: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">IFSC Code</label>
              <Input placeholder="e.g. HDFC0001234" value={newBank.ifscCode} onChange={e => setNewBank({ ...newBank, ifscCode: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsBankModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBank}>Save Bank Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add UPI Modal */}
      <Dialog open={isUpiModalOpen} onOpenChange={setIsUpiModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add UPI ID</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">UPI ID</label>
              <Input placeholder="e.g. yourname@upi" value={newUpi.upiId} onChange={e => setNewUpi({ upiId: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsUpiModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUpi}>Save UPI ID</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawPage;
