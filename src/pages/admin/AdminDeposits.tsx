import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, CheckCircle, XCircle, Eye, Wallet, Calendar, User, IndianRupee 
} from "lucide-react";
import { getApiUrl, getToken } from "@/utils/auth";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  
  // Modals
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveRemarks, setApproveRemarks] = useState("");

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(getApiUrl(`/deposits/admin/all?status=${statusFilter}&search=${searchTerm}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
      toast.error("Failed to load deposit requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDeposits();
  };

  const handleApprove = async () => {
    try {
      const token = getToken();
      const response = await fetch(getApiUrl(`/deposits/${selectedDeposit.id}/approve`), {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ remarks: approveRemarks })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Deposit approved and wallet credited!");
        setIsApproveOpen(false);
        fetchDeposits();
      } else {
        toast.error(data.message || "Failed to approve deposit");
      }
    } catch (error) {
      toast.error("An error occurred during approval");
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      const token = getToken();
      const response = await fetch(getApiUrl(`/deposits/${selectedDeposit.id}/reject`), {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Deposit request rejected");
        setIsRejectOpen(false);
        fetchDeposits();
      } else {
        toast.error(data.message || "Failed to reject deposit");
      }
    } catch (error) {
      toast.error("An error occurred during rejection");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING": return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "APPROVED": return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
      case "REJECTED": return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Deposit Approvals</h1>
            <p className="text-muted-foreground">Review and approve manual fund deposit requests from users.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Pending</p>
              <p className="text-xl font-bold">{deposits.filter(d => d.status === "PENDING").length}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="PENDING">Pending</TabsTrigger>
                  <TabsTrigger value="APPROVED">Approved</TabsTrigger>
                  <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
                  <TabsTrigger value="ALL">All</TabsTrigger>
                </TabsList>
              </Tabs>
              <form onSubmit={handleSearch} className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search user or email..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">Loading deposits...</TableCell>
                    </TableRow>
                  ) : deposits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">No deposit requests found.</TableCell>
                    </TableRow>
                  ) : (
                    deposits.map((deposit) => (
                      <TableRow key={deposit.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{deposit.user?.name}</span>
                            <span className="text-xs text-muted-foreground">{deposit.user?.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          ₹{Number(deposit.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal capitalize">{deposit.paymentType}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs max-w-[150px] truncate">
                          {deposit.transactionRef || "N/A"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {format(new Date(deposit.createdAt), "MMM dd, hh:mm a")}
                        </TableCell>
                        <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => { setSelectedDeposit(deposit); setIsPreviewOpen(true); }}
                              title="View Screenshot"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {deposit.status === "PENDING" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => { setSelectedDeposit(deposit); setIsApproveOpen(true); }}
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => { setSelectedDeposit(deposit); setIsRejectOpen(true); }}
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Screenshot Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Payment Screenshot</DialogTitle>
              <DialogDescription>
                Uploaded by {selectedDeposit?.user?.name} for ₹{Number(selectedDeposit?.amount).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex items-center justify-center bg-muted rounded-lg overflow-hidden min-h-[300px]">
              {selectedDeposit?.screenshotUrl ? (
                <img 
                  src={selectedDeposit.screenshotUrl} 
                  alt="Payment Proof" 
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : (
                <p className="text-muted-foreground italic">No screenshot provided</p>
              )}
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                Ref: {selectedDeposit?.transactionRef || "None"}
              </div>
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approve Modal */}
        <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Deposit</DialogTitle>
              <DialogDescription>
                This will credit ₹{Number(selectedDeposit?.amount).toLocaleString()} to {selectedDeposit?.user?.name}'s wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Internal Remarks (Optional)</label>
                <Input 
                  placeholder="e.g. Verified in bank statement" 
                  value={approveRemarks}
                  onChange={(e) => setApproveRemarks(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>Confirm Approval</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Modal */}
        <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Deposit Request</DialogTitle>
              <DialogDescription>
                Provide a reason why this deposit is being rejected.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rejection Reason</label>
                <Input 
                  placeholder="e.g. Screenshot blurry / Transaction not found" 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject}>Reject Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminDeposits;
