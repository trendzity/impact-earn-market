import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, CheckCheck, Image as ImageIcon, Loader2, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function AdminTasks() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [previewProof, setPreviewProof] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("submitted");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubmissions();
    fetchPendingCount();
  }, [filterStatus]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(getApiUrl(`/admin/submissions?status=${filterStatus}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      }
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const token = getToken();
      const response = await fetch(getApiUrl("/admin/submissions/pending-count"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.count);
      }
    } catch (error) {}
  };

  const handleApprove = async (taskId: string) => {
    try {
      const token = getToken();
      const response = await fetch(getApiUrl(`/admin/tasks/${taskId}/approve`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Task approved and wallet credited!");
        fetchSubmissions();
        fetchPendingCount();
      } else {
        toast.error("Failed to approve task");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setIsRejecting(true);
      const token = getToken();
      const response = await fetch(getApiUrl(`/admin/tasks/${rejectId}/reject`), {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: rejectReason })
      });

      if (response.ok) {
        toast.success("Task rejected successfully");
        setRejectId(null);
        setRejectReason("");
        fetchSubmissions();
        fetchPendingCount();
      } else {
        toast.error("Failed to reject task");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsRejecting(false);
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    s.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Task Review Center</h1>
          <p className="text-sm text-muted-foreground">Approve proofs and manage platform payouts</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search user or campaign..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs w-[200px] md:w-[250px]"
            />
          </div>
          <div className="flex bg-muted p-1 rounded-lg">
            <button 
              onClick={() => setFilterStatus("submitted")}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${filterStatus === "submitted" ? "bg-background text-accent shadow-sm" : "text-muted-foreground"}`}
            >
              Pending ({pendingCount})
            </button>
            <button 
              onClick={() => setFilterStatus("approved")}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${filterStatus === "approved" ? "bg-background text-accent shadow-sm" : "text-muted-foreground"}`}
            >
              Approved
            </button>
            <button 
              onClick={() => setFilterStatus("rejected")}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${filterStatus === "rejected" ? "bg-background text-accent shadow-sm" : "text-muted-foreground"}`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Submissions", value: "Real-time" },
          { label: "Pending Review", value: String(pendingCount) },
          { label: "Platform Health", value: "Optimal" },
          { label: "Review Status", value: "Active" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <p className="text-lg font-bold font-display text-foreground">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-md overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Filter className="h-4 w-4 text-accent" />
            {filterStatus.toUpperCase()} SUBMISSIONS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-xs text-muted-foreground animate-pulse">Loading secure submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <CheckCheck className="h-10 w-10 text-muted-foreground/20 mx-auto" />
              <p className="text-sm text-muted-foreground italic">No submissions found in this category.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/30">
                    <TableHead className="text-[10px] font-bold uppercase">User Info</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Campaign Details</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-center">Proof</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-right">Review Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((s) => (
                    <TableRow key={s.id} className="hover:bg-muted/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                            {s.user.name?.[0] || "U"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-foreground">{s.user.name || "Anonymous"}</p>
                              <Badge className={`text-[8px] h-3.5 px-1 uppercase font-bold border-none ${
                                s.user.role === "INFLUENCER" ? "bg-purple-500/10 text-purple-600" : "bg-blue-500/10 text-blue-600"
                              }`}>
                                {s.user.role}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground">{s.user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-medium text-foreground">{s.campaign.title}</p>
                        <Badge variant="outline" className="text-[9px] h-4 mt-1 bg-accent/5 text-accent border-accent/10">
                          {s.campaign.platform.toUpperCase()} • ₹{s.campaign.reward}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setPreviewProof(s.proofUrl)}
                          className="h-7 gap-1.5 text-[10px] font-bold hover:bg-accent hover:text-white transition-all shadow-sm"
                        >
                          <ImageIcon className="h-3 w-3" /> View
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.status === "approved" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                          s.status === "rejected" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                          "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        }`}>
                          {s.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {s.status === "submitted" ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => handleApprove(s.id)}
                              className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              onClick={() => setRejectId(s.id)}
                              className="h-8 w-8 rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/20 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground font-medium italic">
                            Processed {new Date(s.updatedAt).toLocaleDateString()}
                          </span>
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

      {/* Proof Preview Modal */}
      <AnimatePresence>
        {previewProof && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10" 
            onClick={() => setPreviewProof(null)}
          >
            <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-4" onClick={e => e.stopPropagation()}>
              <Button onClick={() => setPreviewProof(null)} variant="ghost" className="text-white hover:text-accent font-bold self-end gap-2">
                <X className="h-5 w-5" /> CLOSE PREVIEW
              </Button>
              <div className="bg-background/10 border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] w-full flex items-center justify-center">
                {previewProof.includes("video") || previewProof.includes(".mp4") ? (
                  <video src={previewProof} controls className="max-w-full max-h-full" />
                ) : (
                  <img src={previewProof} alt="Proof" className="max-w-full max-h-full object-contain" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Modal */}
      <AnimatePresence>
        {rejectId && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" /> Reject Submission
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Please provide a reason why this proof was rejected. This will be shown to the user.</p>
              
              <textarea 
                className="w-full h-32 bg-muted border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
                placeholder="e.g. Image is blurry, account doesn't match, task not completed correctly..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => { setRejectId(null); setRejectReason(""); }} disabled={isRejecting}>Cancel</Button>
                <Button 
                  onClick={handleReject} 
                  disabled={isRejecting}
                  className="bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/10 px-6"
                >
                  {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
