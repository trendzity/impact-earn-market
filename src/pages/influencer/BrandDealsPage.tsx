import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Handshake,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Upload,
  Eye,
  X
} from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

interface BrandDeal {
  id: string;
  title: string;
  description: string;
  instructions: string;
  price: number;
  status: string;
  proofUrl?: string;
  adminNote?: string;
  createdAt: string;
  business: {
    name: string;
    email: string;
    profileImage?: string;
  };
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "New Invite", className: "bg-accent/10 text-accent border-accent/20" },
  ACCEPTED: { label: "In Progress", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  SUBMITTED: { label: "Under Review", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  APPROVED: { label: "Approved & Paid", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  REJECTED: { label: "Rejected / Declined", className: "bg-red-500/10 text-red-600 border-red-500/20" }
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } };

const BrandDealsPage = () => {
  const [deals, setDeals] = useState<BrandDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"invites" | "active">("invites");

  // Selection & Details Modal
  const [selectedDeal, setSelectedDeal] = useState<BrandDeal | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [submittingProof, setSubmittingProof] = useState(false);
  const [previewProof, setPreviewProof] = useState<string | null>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(getApiUrl("/brand-deals/influencer"), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setDeals(data.deals);
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (dealId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      setProcessingStatus(dealId);
      const token = getToken();
      const response = await fetch(getApiUrl(`/brand-deals/${dealId}/respond`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success(status === "ACCEPTED" ? "Deal accepted! Start promoting." : "Deal declined.");
        setDetailsModalOpen(false);
        fetchDeals();
      } else {
        const err = await response.json();
        toast.error(err.message || "Action failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setProcessingStatus(null);
    }
  };

  const handleSubmitProof = async (dealId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large! Maximum limit is 5MB.");
        return;
      }

      try {
        setSubmittingProof(true);
        const token = getToken();

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const proofUrl = reader.result as string;

          const response = await fetch(getApiUrl(`/brand-deals/${dealId}/submit-proof`), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ proofUrl })
          });

          if (response.ok) {
            toast.success("Proof submitted! Brand will verify and release payout.");
            setDetailsModalOpen(false);
            fetchDeals();
          } else {
            toast.error("Failed to submit proof");
          }
          setSubmittingProof(false);
        };
      } catch (error) {
        toast.error("An error occurred");
        setSubmittingProof(false);
      }
    };

    input.click();
  };

  const filteredDeals = deals.filter((deal) => {
    if (activeTab === "invites") return deal.status === "PENDING";
    return deal.status !== "PENDING";
  });

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
            <Handshake className="h-6 w-6 text-accent" /> Private Brand Deals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage private collaboration invites and sponsorships</p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
          <button
            onClick={() => setActiveTab("invites")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "invites" ? "bg-background text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            New Invites {deals.filter(d => d.status === 'PENDING').length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-accent/10 text-accent rounded-full text-[9px] font-bold">{deals.filter(d => d.status === 'PENDING').length}</span>}
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "active" ? "bg-background text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Active Deals
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-muted/10 border border-dashed rounded-xl">
          <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
            <Handshake className="h-5 w-5" />
          </div>
          <p className="text-muted-foreground text-sm italic">
            {activeTab === "invites" ? "No new direct invites right now." : "You do not have any active brand deals."}
          </p>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => {
            const config = statusConfig[deal.status] || { label: deal.status, className: "bg-muted text-muted-foreground" };
            return (
              <motion.div key={deal.id} variants={itemVariants}>
                <Card className="border border-border/50 hover:shadow-md transition-all hover:border-accent/20 overflow-hidden flex flex-col justify-between h-full bg-card/50">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarImage src={deal.business.profileImage} />
                          <AvatarFallback className="bg-accent/10 text-accent font-bold uppercase">{deal.business.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground leading-tight">{deal.business.name}</h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(deal.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[9px] uppercase font-bold h-5 ${config.className}`}>
                        {config.label}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-bold text-foreground text-sm tracking-tight">{deal.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[32px]">{deal.description || "No description provided."}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 border-y border-border/30">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-accent" /> Reward Payout
                      </span>
                      <span className="font-bold text-foreground">₹{Number(deal.price).toLocaleString()}</span>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDeal(deal);
                          setDetailsModalOpen(true);
                        }}
                        className="w-full text-xs h-8 border-accent/20 hover:bg-accent/5 hover:text-accent"
                      >
                        View Details & Action
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Details & Actions Modal */}
      {selectedDeal && (
        <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
          <DialogContent className="max-w-md bg-background border border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <Handshake className="h-5 w-5 text-accent" /> Sponsorship Details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Review this direct sponsorship proposal from <strong>{selectedDeal.business.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="bg-accent/5 border border-accent/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-extrabold text-accent">₹{Number(selectedDeal.price).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Offered Reward (Held in Escrow)</p>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Offer Title</Label>
                <p className="text-sm font-bold text-foreground">{selectedDeal.title}</p>
              </div>

              {selectedDeal.description && (
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Description</Label>
                  <p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg">{selectedDeal.description}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Step-by-Step Instructions
                </Label>
                <div className="bg-muted/30 border p-3.5 rounded-xl font-sans text-xs text-foreground/80 leading-relaxed max-h-[140px] overflow-y-auto whitespace-pre-wrap">
                  {selectedDeal.instructions}
                </div>
              </div>

              {selectedDeal.adminNote && (
                <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <Label className="text-[10px] uppercase font-bold text-red-500">Feedback Note</Label>
                  <p className="text-xs text-red-600 mt-1">{selectedDeal.adminNote}</p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/30">
              {selectedDeal.status === "PENDING" && (
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={() => handleRespond(selectedDeal.id, "REJECTED")}
                    disabled={processingStatus === selectedDeal.id}
                    variant="outline"
                    className="flex-1 text-xs font-bold text-red-500 border-red-500/10 hover:bg-red-500/5 h-9"
                  >
                    Decline Invite
                  </Button>
                  <Button
                    onClick={() => handleRespond(selectedDeal.id, "ACCEPTED")}
                    disabled={processingStatus === selectedDeal.id}
                    className="flex-1 text-xs font-bold bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/10 h-9"
                  >
                    {processingStatus === selectedDeal.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept Deal"}
                  </Button>
                </div>
              )}

              {selectedDeal.status === "ACCEPTED" && (
                <div className="flex gap-2 w-full">
                  <Button onClick={() => setDetailsModalOpen(false)} variant="outline" className="flex-1 text-xs h-9">Cancel</Button>
                  <Button
                    onClick={() => handleSubmitProof(selectedDeal.id)}
                    disabled={submittingProof}
                    className="flex-1 text-xs font-bold bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/10 h-9"
                  >
                    {submittingProof ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="flex items-center gap-1.5"><Upload className="h-3.5 w-3.5" /> Submit Proof</span>}
                  </Button>
                </div>
              )}

              {(selectedDeal.status === "SUBMITTED" || selectedDeal.status === "APPROVED") && (
                <div className="flex gap-2 w-full">
                  <Button onClick={() => setDetailsModalOpen(false)} variant="outline" className="w-full text-xs h-9">Close Panel</Button>
                  {selectedDeal.proofUrl && (
                    <Button
                      variant="secondary"
                      onClick={() => setPreviewProof(selectedDeal.proofUrl!)}
                      className="px-3 hover:text-accent h-9"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Proof Preview Modal */}
      {previewProof && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10" onClick={() => setPreviewProof(null)}>
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewProof(null)} className="absolute -top-10 right-0 text-white hover:text-accent flex items-center gap-2 font-bold text-sm">
              <X className="h-5 w-5" /> Close Preview
            </button>
            <div className="bg-background/10 border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-full">
              <img src={previewProof} alt="Sponsorship Proof" className="max-w-full max-h-[80vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandDealsPage;