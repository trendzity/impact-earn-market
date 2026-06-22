import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pause, Pencil, Play, Loader2 } from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusColor: Record<string, string> = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  paused: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  admin_paused: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  blocked: "bg-red-700/10 text-red-700 border-red-700/20",
  completed: "bg-muted text-muted-foreground border-border",
};

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

interface Campaign {
  id: string;
  title: string;
  platform: string;
  budget: string | number;
  reward: string | number;
  link: string;
  status: string;
  totalLimit?: number;
  description?: string;
  instructions?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  hashtags?: string | null;
  targetRole?: string;
  targetCategories?: string[];
  objective?: string;
}

const BusinessCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all-platform");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editBudget, setEditBudget] = useState("");
  const [editReward, setEditReward] = useState("");
  const [editTotalLimit, setEditTotalLimit] = useState("");
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [activeCampaignTab, setActiveCampaignTab] = useState("general");

   const filteredCampaigns = campaigns.filter((c) => {
    const matchesStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPlatform = platformFilter === "all-platform" || c.platform.toLowerCase() === platformFilter.toLowerCase();
    return matchesStatus && matchesPlatform;
  });

  const generalCampaigns = filteredCampaigns.filter((c) => c.targetRole !== "INFLUENCER");
  const influencerCampaigns = filteredCampaigns.filter((c) => c.targetRole === "INFLUENCER");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl("/campaigns/business"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    const budgetVal = parseFloat(editBudget);
    const rewardVal = parseFloat(editReward);
    const totalLimitVal = parseInt(editTotalLimit, 10);

    if (isNaN(budgetVal) || budgetVal <= 0) {
      toast.error("Budget must be a positive number.");
      return;
    }
    if (isNaN(rewardVal) || rewardVal <= 0) {
      toast.error("Reward must be a positive number.");
      return;
    }
    if (isNaN(totalLimitVal) || totalLimitVal <= 0) {
      toast.error("Max participants must be a positive integer.");
      return;
    }

    if (budgetVal < rewardVal * totalLimitVal) {
      toast.error(`Total budget (₹${budgetVal}) must be at least reward * max participants (₹${(rewardVal * totalLimitVal).toFixed(2)})`);
      return;
    }

    try {
      setUpdatingId(editingCampaign.id);
      const token = getToken();
      const response = await fetch(getApiUrl(`/campaigns/${editingCampaign.id}/update-details`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          budget: budgetVal,
          reward: rewardVal,
          totalLimit: totalLimitVal
        })
      });

      if (response.ok) {
        toast.success("Campaign updated successfully!");
        setIsEditDialogOpen(false);
        setEditingCampaign(null);
        fetchCampaigns(); // Refresh the list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update campaign details.");
      }
    } catch (err) {
      console.error("Error updating campaign details:", err);
      toast.error("An error occurred.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTogglePause = async (campaignId: string, currentStatus: string) => {
    const isPaused = currentStatus.toLowerCase() === "paused";
    const nextStatus = isPaused ? "active" : "paused";

    try {
      setUpdatingId(campaignId);
      const token = getToken();
      const response = await fetch(getApiUrl(`/campaigns/${campaignId}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      if (response.ok) {
        toast.success(isPaused ? "Campaign resumed successfully!" : "Campaign paused successfully!");
        fetchCampaigns(); // Refresh the list
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to update campaign status.");
      }
    } catch (err) {
      console.error("Error toggling campaign status:", err);
      toast.error("An error occurred.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage all your marketing campaigns</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="admin_paused">Admin Paused</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-platform">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="linkedin">Linkedin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-border/50 gap-6">
        <button
          onClick={() => setActiveCampaignTab("general")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeCampaignTab === "general" 
              ? "text-accent border-b-2 border-accent" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          General Users
        </button>
        <button
          onClick={() => setActiveCampaignTab("influencer")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeCampaignTab === "influencer" 
              ? "text-accent border-b-2 border-accent" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Influencers
        </button>
      </div>

      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">No campaigns found. Launch your first one!</p>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">No campaigns match the selected filters.</p>
              </div>
            ) : (activeCampaignTab === "general" ? generalCampaigns.length === 0 : influencerCampaigns.length === 0) ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">
                  {activeCampaignTab === "general" 
                    ? "No general user campaigns found." 
                    : "No influencer campaigns found."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Target Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(activeCampaignTab === "general" ? generalCampaigns : influencerCampaigns).map((c) => (
                    <TableRow key={c.id} className="border-border/30">
                      <TableCell className="font-medium text-foreground">{c.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{c.platform}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">₹{c.budget}</TableCell>
                      <TableCell className="text-muted-foreground">₹{c.reward}</TableCell>
                      <TableCell>
                        {c.link ? (
                          <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs truncate max-w-[150px] block">
                            {c.link}
                          </a>
                        ) : c.status.toLowerCase().startsWith("pending") ? (
                          <span className="text-yellow-500 text-[10px] font-bold uppercase">VERIFICATION PENDING</span>
                          ) : (
                          <span className="text-red-500 text-[10px] font-bold">LINK MISSING</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs border capitalize ${statusColor[c.status.toLowerCase()] || statusColor.completed}`}>
                          {c.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            title="View Details"
                            disabled={c.status.toLowerCase() === "admin_paused"}
                            onClick={() => setViewingCampaign(c)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            title="Pause/Play"
                            disabled={
                              updatingId === c.id || 
                              c.status.toLowerCase() === "admin_paused" || 
                              (c.status.toLowerCase() !== "active" && c.status.toLowerCase() !== "paused" && c.status.toLowerCase() !== "admin_paused")
                            }
                            onClick={() => handleTogglePause(c.id, c.status)}
                          >
                            {(c.status.toLowerCase() === "paused" || c.status.toLowerCase() === "admin_paused") ? (
                              <Play className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Pause className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            title="Edit Details"
                            disabled={c.status.toLowerCase() === "paused" || c.status.toLowerCase() === "admin_paused" || updatingId === c.id}
                            onClick={() => {
                              setEditingCampaign(c);
                              setEditBudget(c.budget.toString());
                              setEditReward(c.reward.toString());
                              setEditTotalLimit((c.totalLimit || 0).toString());
                              setIsEditDialogOpen(true);
                            }}
                          >
                            {updatingId === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Campaign Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md bg-background border border-border/80 p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Edit Campaign Details</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Update the financial parameters and maximum participants for your campaign.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCampaign} className="space-y-4 py-3">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Budget (₹)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="Enter total budget"
                className="h-10 text-sm"
                value={editBudget}
                onChange={(e) => setEditBudget(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Reward Per User (₹)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="Enter reward per user"
                className="h-10 text-sm"
                value={editReward}
                onChange={(e) => setEditReward(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Max Participants (Limit)
              </Label>
              <Input
                type="number"
                step="1"
                placeholder="Enter maximum participants"
                className="h-10 text-sm"
                value={editTotalLimit}
                onChange={(e) => setEditTotalLimit(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                className="text-sm h-10"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingCampaign(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updatingId !== null} 
                className="min-w-[100px] h-10 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {updatingId !== null ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detailed View Modal */}
      <Dialog open={viewingCampaign !== null} onOpenChange={(open) => !open && setViewingCampaign(null)}>
        <DialogContent className="max-w-2xl bg-background border border-border/80 p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          {viewingCampaign && (
            <>
              <DialogHeader className="border-b border-border/50 pb-4 bg-muted/10">
                <DialogTitle className="text-xl font-bold text-foreground">
                  {viewingCampaign.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  {viewingCampaign.platform} Campaign
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Media Preview */}
                {(viewingCampaign.imageUrl || viewingCampaign.videoUrl) && (
                  <div className="rounded-lg overflow-hidden border border-border bg-muted/30 flex items-center justify-center min-h-[200px]">
                    {viewingCampaign.videoUrl ? (
                      <video src={viewingCampaign.videoUrl} controls className="max-w-full max-h-[300px]" />
                    ) : (
                      <img src={viewingCampaign.imageUrl || undefined} alt="Campaign" className="max-w-full max-h-[300px] object-contain" />
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Targeting</p>
                    <p className="text-xs font-bold text-foreground">
                      Role: <span className="capitalize">{viewingCampaign.targetRole?.toLowerCase() || "General"}</span>
                    </p>
                    {viewingCampaign.targetCategories && viewingCampaign.targetCategories.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Niches: {viewingCampaign.targetCategories.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Financials</p>
                    <p className="text-xs font-bold text-foreground">Budget: ₹{viewingCampaign.budget}</p>
                    <p className="text-xs text-accent font-bold">Reward/User: ₹{viewingCampaign.reward}</p>
                    <p className="text-xs text-muted-foreground">Limit: {viewingCampaign.totalLimit || 0} participants</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {viewingCampaign.description || "No description provided."}
                  </p>
                </div>

                {viewingCampaign.hashtags && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hashtags</p>
                    <p className="text-xs text-accent font-mono">{viewingCampaign.hashtags}</p>
                  </div>
                )}

                {viewingCampaign.instructions && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Instructions</p>
                    <div className="text-xs bg-muted/40 p-4 rounded-lg border border-border/50 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                      {viewingCampaign.instructions}
                    </div>
                  </div>
                )}

                {viewingCampaign.link && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Link</p>
                    <a 
                      href={viewingCampaign.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-accent hover:underline flex items-center gap-1.5"
                    >
                      {viewingCampaign.link}
                    </a>
                  </div>
                )}
              </div>

              <DialogFooter className="border-t border-border/50 pt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="capitalize text-xs">
                    Objective: {viewingCampaign.objective}
                  </Badge>
                  <Badge className={`text-xs border capitalize ${statusColor[viewingCampaign.status.toLowerCase()] || statusColor.completed}`}>
                    {viewingCampaign.status.replace("_", " ")}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setViewingCampaign(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default BusinessCampaigns;
