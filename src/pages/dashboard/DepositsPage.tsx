import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, History, Wallet, CheckCircle, Clock, XCircle, 
  Upload, Info, ArrowLeft, Loader2, IndianRupee, ShieldCheck
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

const DepositsPage = () => {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("UPI");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [transactionRef, setTransactionRef] = useState("");

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(getApiUrl("/deposits/my"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
      toast.error("Failed to load deposit history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !paymentType || !screenshotUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const token = getToken();
      const response = await fetch(getApiUrl("/deposits/submit"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          amount,
          paymentType,
          screenshotUrl,
          transactionRef
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Request submitted! Our team will review it shortly.");
        setIsModalOpen(false);
        setAmount("");
        setScreenshotUrl("");
        setTransactionRef("");
        fetchDeposits();
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Add Funds</h1>
            <p className="text-muted-foreground">Submit your payment proof to top up your wallet.</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground gap-2 h-11 px-6 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> New Deposit Request
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deposit History */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Request History
          </h2>
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">Syncing history...</TableCell></TableRow>
                  ) : deposits.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">No deposit requests yet.</TableCell></TableRow>
                  ) : (
                    deposits.map((d) => (
                      <TableRow key={d.id} className="hover:bg-muted/10">
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(d.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="font-bold text-sm">₹{Number(d.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize text-[10px]">{d.paymentType}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(d.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" /> Verified Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-bold">How it works:</p>
                <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Transfer the amount to our UPI/Bank.</li>
                  <li>Take a screenshot of the confirmation.</li>
                  <li>Upload the screenshot here with the amount.</li>
                  <li>Admin will verify and credit your wallet.</li>
                </ol>
              </div>
              <div className="p-4 bg-background border rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Bank Details</p>
                <p className="text-xs font-bold">Trendzity Media Pvt Ltd</p>
                <p className="text-xs">A/C: 919876543210</p>
                <p className="text-xs font-mono text-primary">IFSC: HDFC0001234</p>
              </div>
              <div className="p-4 bg-background border rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">UPI ID</p>
                <p className="text-sm font-bold text-primary">trendzity@hdfcbank</p>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/30 flex gap-3">
            <Info className="w-5 h-5 text-muted-foreground shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Please ensure the screenshot clearly shows the **Transaction ID** and **Amount**. Unclear proof may be rejected.
            </p>
          </div>
        </div>
      </div>

      {/* New Deposit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Payment Proof</DialogTitle>
            <DialogDescription>
              Submit details of your transfer for manual verification.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Amount (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-9 h-11"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant={paymentType === "UPI" ? "default" : "outline"}
                  className="h-10 text-xs font-bold"
                  onClick={() => setPaymentType("UPI")}
                >
                  UPI
                </Button>
                <Button 
                  type="button" 
                  variant={paymentType === "BANK" ? "default" : "outline"}
                  className="h-10 text-xs font-bold"
                  onClick={() => setPaymentType("BANK")}
                >
                  Bank Transfer
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Screenshot URL</label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Paste image link from Cloudinary/Imgur" 
                  className="pl-9 h-11"
                  value={screenshotUrl}
                  onChange={(e) => setScreenshotUrl(e.target.value)}
                  required
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic">For now, please paste a URL to your screenshot image.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Transaction Ref (Optional)</label>
              <Input 
                placeholder="UTR / Transaction ID" 
                className="h-11"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="min-w-[120px]">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Submit Proof"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepositsPage;
