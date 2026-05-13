import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, XCircle, Clock, ExternalLink, Loader2, 
  Search, Filter, ArrowUpRight, Check, X, IndianRupee 
} from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: "approve" | "reject"; request: any } | null>(null);
  const [remarks, setRemarks] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const params = new URLSearchParams();
      if (filter !== "ALL") params.set("status", filter);

      const res = await fetch(getApiUrl(`/admin/withdrawals?${params.toString()}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data.withdrawals);
      }
    } catch {
      toast.error("Failed to load withdrawal requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [filter]);

  const handleProcess = async () => {
    if (!modal) return;
    try {
      setProcessingId(modal.request.id);
      const token = getToken();
      const res = await fetch(getApiUrl(`/admin/withdrawals/${modal.request.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: modal.type === "approve" ? "APPROVED" : "REJECTED",
          remarks,
          transactionId: modal.type === "approve" ? transactionId : undefined
        })
      });

      if (res.ok) {
        toast.success(`Withdrawal ${modal.type}d successfully`);
        setModal(null);
        setRemarks("");
        setTransactionId("");
        fetchWithdrawals();
      } else {
        const err = await res.json();
        toast.error(err.message || "Action failed");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredData = withdrawals.filter(w => 
    w.user.name.toLowerCase().includes(search.toLowerCase()) || 
    w.user.email.toLowerCase().includes(search.toLowerCase()) ||
    w.upiId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Withdrawal Management</h1>
          <p className="text-sm text-muted-foreground">Review and process user payout requests</p>
        </div>
        <div className="flex gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filter === s ? "default" : "outline"}
              onClick={() => setFilter(s)}
              className="text-[10px] font-bold h-8"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or UPI ID..."
          className="pl-9 bg-muted border-border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">Loading requests...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-muted-foreground italic">No withdrawal requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-[10px] font-bold uppercase">Date</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">User</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Amount</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Payment Info</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((w) => (
                    <TableRow key={w.id} className="hover:bg-muted/5 border-border/30">
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(w.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-bold">{w.user.name}</p>
                        <p className="text-[10px] text-muted-foreground">{w.user.email}</p>
                      </TableCell>
                      <TableCell className="font-bold text-sm">₹{Number(w.amount).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] mb-1">{w.paymentMode}</Badge>
                        <p className="text-[10px] font-medium text-foreground">{w.upiId || w.accountNumber}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] font-bold ${
                          w.status === "PENDING" ? "bg-orange-500/10 text-orange-600" :
                          w.status === "APPROVED" ? "bg-green-500/10 text-green-600" :
                          "bg-red-500/10 text-red-600"
                        }`}>
                          {w.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {w.status === "PENDING" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white gap-1 text-[10px] font-bold"
                              onClick={() => setModal({ type: "approve", request: w })}
                            >
                              <Check className="h-3 w-3" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-7 px-2 gap-1 text-[10px] font-bold"
                              onClick={() => setModal({ type: "reject", request: w })}
                            >
                              <X className="h-3 w-3" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <div className="text-[10px] text-muted-foreground italic">
                            Processed {new Date(w.processedAt).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-3">
                  {modal.type === "approve" ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                  <h2 className="text-lg font-bold">{modal.type === "approve" ? "Approve Payout" : "Reject Request"}</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setModal(null)}><X className="h-4 w-4" /></Button>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">User:</span>
                    <span className="font-bold">{modal.request.user.name}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-accent">₹{Number(modal.request.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">UPI ID:</span>
                    <span className="font-mono text-[11px]">{modal.request.upiId}</span>
                  </div>
                </div>

                {modal.type === "approve" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Transaction ID / Ref Number</label>
                    <Input 
                      placeholder="Paste ID from your banking app" 
                      className="bg-muted border-border"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground italic">Provide this so the user can verify the payment.</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Admin Note (Private)</label>
                  <Input 
                    placeholder="Internal note for this action..." 
                    className="bg-muted border-border"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <Button className="flex-1" variant="outline" onClick={() => setModal(null)}>Cancel</Button>
                <Button 
                  className={`flex-1 ${modal.type === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"} text-white`}
                  onClick={handleProcess}
                  disabled={processingId !== null}
                >
                  {processingId ? <Loader2 className="h-4 w-4 animate-spin" /> : `Confirm ${modal.type}`}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
