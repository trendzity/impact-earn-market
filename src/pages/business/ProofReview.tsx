import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, ExternalLink, Image as ImageIcon, Loader2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const ProofReview = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [brandDeals, setBrandDeals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("campaigns_general");
  const [loading, setLoading] = useState(true);
  const [previewProof, setPreviewProof] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const generalSubmissions = submissions.filter((s) => s.user.role !== "INFLUENCER");
  const influencerSubmissions = submissions.filter((s) => s.user.role === "INFLUENCER");

  useEffect(() => {
    if (activeTab.startsWith("campaigns")) {
      fetchSubmissions();
    } else {
      fetchBrandDeals();
    }
  }, [activeTab]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(getApiUrl("/campaigns/submissions"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandDeals = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(getApiUrl("/brand-deals/business"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBrandDeals(data.deals || []);
      }
    } catch (error) {
      toast.error("Failed to load brand deals");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: "approved" | "rejected", reason?: string) => {
    try {
      setIsProcessing(true);
      const token = getToken();

      if (activeTab.startsWith("campaigns")) {
        const response = await fetch(getApiUrl(`/campaigns/submissions/${id}/review`), {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ status, reason })
        });

        if (response.ok) {
          toast.success(status === "approved" ? "Influencer paid successfully!" : "Task rejected.");
          setRejectId(null);
          setRejectReason("");
          fetchSubmissions();
        } else {
          const err = await response.json();
          toast.error(err.message || "Action failed");
        }
      } else {
        const uppercaseStatus = status === "approved" ? "APPROVED" : "REJECTED";
        const response = await fetch(getApiUrl(`/brand-deals/${id}/review`), {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ status: uppercaseStatus, reason })
        });

        if (response.ok) {
          toast.success(status === "approved" ? "Direct offer approved and payment released!" : "Direct offer proof rejected.");
          setRejectId(null);
          setRejectReason("");
          fetchBrandDeals();
        } else {
          const err = await response.json();
          toast.error(err.message || "Action failed");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const timeAgo = (date: string) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 60) return `${min}m ago`;
    const hours = Math.floor(min / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sponsorship Proof Review</h1>
          <p className="text-sm text-muted-foreground">Approve influencer and creator proofs to release rewards</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-border/50 gap-6">
        <button
          onClick={() => setActiveTab("campaigns_general")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "campaigns_general" 
              ? "text-accent border-b-2 border-accent" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          User Campaigns
        </button>
        <button
          onClick={() => setActiveTab("campaigns_influencer")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "campaigns_influencer" 
              ? "text-accent border-b-2 border-accent" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Influencer Campaigns
        </button>
        <button
          onClick={() => setActiveTab("deals")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "deals" 
              ? "text-accent border-b-2 border-accent" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Direct 1-on-1 Deals
        </button>
      </div>

      <motion.div variants={item}>
        <Card className="border-border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="text-xs text-muted-foreground">
                  {activeTab.startsWith("campaigns") ? "Fetching task submissions..." : "Fetching direct brand deals..."}
                </p>
              </div>
            ) : (
              activeTab === "campaigns_general"
                ? generalSubmissions.length === 0
                : activeTab === "campaigns_influencer"
                  ? influencerSubmissions.length === 0
                  : brandDeals.length === 0
            ) ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground italic text-sm">
                  {activeTab === "campaigns_general" 
                    ? "No general user submissions to review yet." 
                    : activeTab === "campaigns_influencer"
                      ? "No influencer campaign submissions to review yet."
                      : "No direct 1-on-1 deals to review yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 bg-muted/20">
                      <TableHead>{activeTab.startsWith("campaigns") ? "Creator" : "Influencer"}</TableHead>
                      <TableHead>{activeTab.startsWith("campaigns") ? "Campaign" : "Offer Details"}</TableHead>
                      {activeTab === "deals" && <TableHead>Offer Amount</TableHead>}
                      <TableHead>Proof</TableHead>
                      <TableHead>{activeTab.startsWith("campaigns") ? "Submitted" : "Last Updated"}</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTab.startsWith("campaigns") ? (
                      (activeTab === "campaigns_general" ? generalSubmissions : influencerSubmissions).map((s) => (
                        <TableRow key={s.id} className="border-border/30 hover:bg-muted/5 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-[10px]">
                                {s.user.name?.[0] || "U"}
                              </div>
                              <div className="text-xs">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold">{s.user.name}</p>
                                  <Badge className={`text-[8px] h-3.5 px-1 uppercase border-none ${
                                    s.user.role === "INFLUENCER" ? "bg-purple-500/10 text-purple-600" : "bg-blue-500/10 text-blue-600"
                                  }`}>
                                    {s.user.role}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground">{s.user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-medium">{s.campaign.title}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setPreviewProof(s.proofUrl)}
                              className="h-7 gap-1.5 text-[10px] font-bold border-accent/20 text-accent hover:bg-accent hover:text-white"
                            >
                              <ImageIcon className="h-3 w-3" /> View Proof
                            </Button>
                          </TableCell>
                          <TableCell className="text-[10px] text-muted-foreground">{timeAgo(s.updatedAt)}</TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] font-bold ${
                              s.status === "submitted" ? "bg-yellow-500/10 text-yellow-600" :
                              s.status === "approved" ? "bg-green-500/10 text-green-600" :
                              "bg-red-500/10 text-red-600"
                            }`}>
                              {s.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {s.status === "submitted" && (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="icon" 
                                  onClick={() => handleReview(s.id, "approved")}
                                  disabled={isProcessing}
                                  className="h-7 w-7 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  onClick={() => setRejectId(s.id)}
                                  disabled={isProcessing}
                                  className="h-7 w-7 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      brandDeals.map((d) => (
                        <TableRow key={d.id} className="border-border/30 hover:bg-muted/5 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-[10px]">
                                {d.influencer.name?.[0] || "I"}
                              </div>
                              <div className="text-xs">
                                <p className="font-bold">{d.influencer.name}</p>
                                <p className="text-muted-foreground">{d.influencer.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-medium">
                            <div>
                              <p className="font-bold">{d.title}</p>
                              <p className="text-[10px] text-muted-foreground line-clamp-1">{d.description || "No description"}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-bold text-accent">₹{Number(d.price).toLocaleString()}</TableCell>
                          <TableCell>
                            {d.proofUrl ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setPreviewProof(d.proofUrl)}
                                className="h-7 gap-1.5 text-[10px] font-bold border-accent/20 text-accent hover:bg-accent hover:text-white"
                              >
                                <ImageIcon className="h-3 w-3" /> View Proof
                              </Button>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic">Awaiting submission</span>
                            )}
                          </TableCell>
                          <TableCell className="text-[10px] text-muted-foreground">{timeAgo(d.updatedAt)}</TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] font-bold ${
                              d.status === "SUBMITTED" ? "bg-yellow-500/10 text-yellow-600" :
                              d.status === "APPROVED" ? "bg-green-500/10 text-green-600" :
                              d.status === "ACCEPTED" ? "bg-blue-500/10 text-blue-600" :
                              d.status === "PENDING" ? "bg-gray-500/10 text-gray-600" :
                              "bg-red-500/10 text-red-600"
                            }`}>
                              {d.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {d.status === "SUBMITTED" && (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="icon" 
                                  onClick={() => handleReview(d.id, "approved")}
                                  disabled={isProcessing}
                                  className="h-7 w-7 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  onClick={() => setRejectId(d.id)}
                                  disabled={isProcessing}
                                  className="h-7 w-7 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Proof Preview */}
      <AnimatePresence>
        {previewProof && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10" 
            onClick={() => setPreviewProof(null)}
          >
            <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-4" onClick={e => e.stopPropagation()}>
              <Button onClick={() => setPreviewProof(null)} variant="ghost" className="text-white hover:text-accent font-bold self-end gap-2">
                <X className="h-5 w-5" /> CLOSE
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
              <p className="text-sm text-muted-foreground mb-4">Explain why this proof is invalid.</p>
              
              <textarea 
                className="w-full h-32 bg-muted border border-border rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-accent transition-all"
                placeholder="Reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setRejectId(null)} disabled={isProcessing}>Cancel</Button>
                <Button 
                  onClick={() => handleReview(rejectId, "rejected", rejectReason)} 
                  disabled={isProcessing}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Reject"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProofReview;
