import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, Clock, CheckCircle2, Loader2, IndianRupee, Megaphone, Users,
  Linkedin, Instagram, Youtube as YoutubeIcon, Facebook, Twitter, Send, Eye, X, Lock, ExternalLink
} from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  active: { label: "Available", icon: Loader2, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  submitted: { label: "Submitted", icon: Clock, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  approved: { label: "Approved", icon: CheckCircle2, className: "bg-green-500/10 text-green-600 border-green-500/20" },
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfluencerCampaigns = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [joinedTasks, setJoinedTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"explore" | "my-tasks">("explore");
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [previewProof, setPreviewProof] = useState<string | null>(null);
  const [linkedPlatforms, setLinkedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    fetchLinkedAccounts();
    if (activeTab === "explore") {
      fetchCampaigns();
    } else {
      fetchJoinedTasks();
    }
  }, [activeTab]);

  const fetchLinkedAccounts = async () => {
    try {
      const token = getToken();
      const response = await fetch(getApiUrl("/stats/dashboard"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const platforms = data.data.social.map((s: any) => s.platform.toLowerCase());
        setLinkedPlatforms(platforms);
      }
    } catch (error) {
      console.error("Error fetching linked accounts:", error);
    }
  };

  const handleUploadProof = async (taskId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setSubmittingId(taskId);
        const token = getToken();
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const proofUrl = reader.result as string;
          
          const response = await fetch(getApiUrl(`/campaigns/submit-proof/${taskId}`), {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ proofUrl })
          });

          if (response.ok) {
            toast.success("Proof submitted! Business will review it soon.");
            fetchJoinedTasks();
          } else {
            toast.error("Failed to submit proof");
          }
          setSubmittingId(null);
        };
      } catch (error) {
        toast.error("An error occurred");
        setSubmittingId(null);
      }
    };
    
    input.click();
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl("/campaigns/available"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching available campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedTasks = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl("/campaigns/my-tasks"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setJoinedTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching joined tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (campaignId: string) => {
    try {
      setJoiningId(campaignId);
      const token = getToken();
      const response = await fetch(getApiUrl(`/campaigns/join/${campaignId}`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success("Successfully joined the campaign! Check 'My Tasks'.");
        fetchCampaigns();
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to join campaign");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setJoiningId(null);
    }
  };

  const toggleDetails = (id: string) => {
    setSelectedCampaign(prev => prev === id ? null : id);
  };

  const renderInstructions = (text: string) => {
    if (!text) return <p className="text-sm text-muted-foreground italic">No specific instructions provided.</p>;
    const points = text.split(/\n|(?<=[.!?])\s+/).filter(p => p.trim().length > 0);
    return (
      <ul className="space-y-2 mt-3">
        {points.map((point, index) => (
          <li key={index} className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[10px]">
              {index + 1}
            </span>
            <span className="pt-0.5">{point.replace(/^\d+[.)]\s*/, '')}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Campaign Hub</h1>
          <p className="text-sm text-muted-foreground">Discover and manage your marketing collaborations</p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
          <button onClick={() => setActiveTab("explore")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "explore" ? "bg-background text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Explore</button>
          <button onClick={() => setActiveTab("my-tasks")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "my-tasks" ? "bg-background text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>My Tasks {joinedTasks.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-accent/10 rounded-full text-[9px]">{joinedTasks.length}</span>}</button>
        </div>
      </motion.div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (activeTab === "explore" ? campaigns : joinedTasks).length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
              <Megaphone className="h-6 w-6" />
            </div>
            <p className="text-muted-foreground italic text-sm">{activeTab === "explore" ? "No brand deals available at the moment." : "You haven't joined any campaigns yet."}</p>
          </div>
        ) : (
          (activeTab === "explore" ? campaigns : joinedTasks).map((campaign) => {
            const config = statusConfig[campaign.status.toLowerCase()] || statusConfig.active;
            const StatusIcon = config.icon;
            const isExpanded = selectedCampaign === campaign.id;
            const platform = campaign.platform.toLowerCase();
            const isLinked = linkedPlatforms.includes(platform) || platform === "other" || platform === "custom";

            const platformColors: Record<string, string> = {
              linkedin: "text-blue-600 bg-blue-600/10 border-blue-600/20 shadow-blue-500/10",
              instagram: "text-pink-600 bg-pink-600/10 border-pink-600/20 shadow-pink-500/10",
              facebook: "text-blue-800 bg-blue-800/10 border-blue-800/20 shadow-blue-800/10",
              youtube: "text-red-600 bg-red-600/10 border-red-600/20 shadow-red-500/10",
              twitter: "text-sky-500 bg-sky-500/10 border-sky-500/20 shadow-sky-500/10",
              telegram: "text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-blue-400/10",
            };

            const PlatformIcon = (() => {
              if (platform === "linkedin") return Linkedin;
              if (platform === "youtube") return YoutubeIcon;
              if (platform === "instagram") return Instagram;
              if (platform === "facebook") return Facebook;
              if (platform === "twitter") return Twitter;
              if (platform === "telegram") return Send;
              return Megaphone;
            })();

            return (
              <motion.div key={campaign.id} variants={itemVariants}>
                <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 ${isExpanded ? 'ring-1 ring-accent/30' : 'hover:border-accent/20'}`}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-[180px] h-[180px] md:h-auto bg-muted relative shrink-0 overflow-hidden group">
                        {campaign.imageUrl ? <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 italic text-[10px]">No visual</div>}
                        <div className="absolute top-2 left-2 z-10"><Badge className="bg-black/60 backdrop-blur-md text-[9px] border-white/10 shadow-lg">₹{campaign.reward}</Badge></div>
                        
                        {/* Platform Hero Overlay */}
                        <div className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-xl border border-white/20 shadow-xl z-10 ${platformColors[platform] || "bg-accent/20"}`}>
                          <PlatformIcon className="h-4 w-4" />
                        </div>

                        {!isLinked && activeTab === "explore" && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                            <div className="bg-background/90 p-2 rounded-lg border border-border shadow-xl flex items-center gap-2">
                              <Lock className="h-3 w-3 text-red-500" />
                              <span className="text-[9px] font-bold uppercase tracking-tighter">Link {campaign.platform}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-5 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-foreground tracking-tight">{campaign.title}</h3>
                              <Badge variant="outline" className={`text-[10px] h-5 ${config.className}`}><StatusIcon className="h-2.5 w-2.5 mr-1" /> {campaign.status}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">{campaign.description}</p>
                          </div>
                          
                          <div className="flex gap-2 shrink-0">
                            <Button size="sm" variant={isExpanded ? "secondary" : "outline"} onClick={() => toggleDetails(campaign.id)} className="h-8 text-xs px-4">{isExpanded ? "Close" : "Details"}</Button>
                            <div className="flex flex-col items-center">
                              {activeTab === "explore" ? (
                                 <Button 
                                  size="sm" 
                                  onClick={() => isLinked && !campaign.isJoined && handleJoin(campaign.id)} 
                                  disabled={joiningId === campaign.id || campaign.isJoined || !isLinked} 
                                  className={`h-8 text-xs px-4 font-bold shadow-lg transition-all ${campaign.isJoined ? "bg-green-500/20 text-green-600 border border-green-500/30 shadow-none" : !isLinked ? "bg-muted text-muted-foreground border border-border cursor-not-allowed shadow-none" : "bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-red-500/10"}`}
                                >
                                  {joiningId === campaign.id ? <Loader2 className="h-3 w-3 animate-spin" /> : campaign.isJoined ? <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Joined</span> : !isLinked ? <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Connect Account</span> : "Join Now"}
                                </Button>
                              ) : (
                                <div className="flex gap-2">
                                  {campaign.taskStatus === "pending" ? (
                                    <Button size="sm" onClick={() => handleUploadProof(campaign.taskId)} disabled={submittingId === campaign.taskId} className="h-8 text-xs px-4 font-bold shadow-lg bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-red-500/10">
                                      {submittingId === campaign.taskId ? <Loader2 className="h-3 w-3 animate-spin" /> : "Submit Proof"}
                                    </Button>
                                  ) : (
                                    <>
                                      <Button size="sm" variant="outline" className={`h-8 text-xs px-4 font-bold ${campaign.taskStatus === "submitted" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" : "bg-green-500/10 text-green-600 border-green-500/20"}`}>
                                        {campaign.taskStatus === "submitted" ? "Awaiting Review" : "Approved ✅"}
                                      </Button>
                                      {campaign.proofUrl && (
                                        <Button size="sm" variant="ghost" onClick={() => setPreviewProof(campaign.proofUrl)} className="h-8 px-2 text-muted-foreground hover:text-accent">
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                              {activeTab === "my-tasks" && campaign.taskStatus === "pending" && (
                                <p className="text-[9px] text-red-500 font-medium mt-1">Max: 5MB (JPG, PNG) | 20MB (MP4)</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="pt-4 border-t border-border/50 space-y-4">
                            {!isLinked && activeTab === "explore" && (
                              <div className="mt-2 p-2 bg-red-500/5 border border-red-500/10 rounded-lg flex items-center justify-between gap-3">
                                <p className="text-[10px] text-red-600 leading-tight">To join this task, you must first connect your <strong>{campaign.platform}</strong> account in Settings.</p>
                                <Button variant="outline" size="sm" className="h-6 text-[9px] px-2 gap-1 border-red-500/20 hover:bg-red-500/10" onClick={() => window.location.href='/dashboard/settings'}>
                                  <ExternalLink className="h-2 w-2" /> Link Now
                                </Button>
                              </div>
                            )}
                            <div className="space-y-2">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Megaphone className="h-3 w-3" /> Target Links</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {campaign.link && (
                                  <a href={campaign.link} target="_blank" rel="noreferrer" className="bg-accent/5 p-2 rounded-lg border border-accent/10 flex items-center gap-2 hover:bg-accent/10 transition-colors group">
                                    <div className="flex-shrink-0">
                                      <PlatformIcon className="h-3 w-3" />
                                    </div>
                                    <span className="text-[10px] text-accent font-medium truncate group-hover:underline">Visit {campaign.platform} Post</span>
                                  </a>
                                )}
                                {campaign.socialStats?.extraLinks?.map((xlink: any, idx: number) => (
                                  <a key={idx} href={xlink.url} target="_blank" rel="noreferrer" className="bg-accent/5 p-2 rounded-lg border border-accent/10 flex items-center gap-2 hover:bg-accent/10 transition-colors group">
                                    <div className="flex-shrink-0">
                                      {(() => {
                                        const p = xlink.platform.toLowerCase();
                                        if (p === "linkedin") return <Linkedin className="h-3 w-3 text-blue-600" />;
                                        if (p === "youtube") return <YoutubeIcon className="h-3 w-3 text-red-600" />;
                                        if (p === "instagram") return <Instagram className="h-3 w-3 text-pink-600" />;
                                        if (p === "facebook") return <Facebook className="h-3 w-3 text-blue-800" />;
                                        return <Megaphone className="h-3 w-3 text-accent" />;
                                      })()}
                                    </div>
                                    <span className="text-[10px] text-accent font-medium truncate group-hover:underline">Visit {xlink.platform} Post</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Step-by-Step Task Instructions</h4>
                              <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">{renderInstructions(campaign.instructions)}</div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1 pt-1">
                              <div className="flex items-center gap-2"><Clock className="h-3 w-3" /> Ends in 3 days</div>
                              <div className="flex items-center gap-2"><Users className="h-3 w-3" /> {campaign.totalLimit - 42} slots left</div>
                            </div>
                          </motion.div>
                        )}

                        {!isExpanded && (
                          <div className="flex items-center gap-4 text-[10px] text-muted-foreground pt-1">
                            <span className="flex items-center gap-1 font-bold text-accent"><IndianRupee className="h-2.5 w-2.5" /> Max Reward: ₹{campaign.reward}</span>
                            <span className="flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5 text-green-500" /> Auto-Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Proof Preview Modal */}
      {previewProof && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10" onClick={() => setPreviewProof(null)}>
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewProof(null)} className="absolute -top-10 right-0 text-white hover:text-accent flex items-center gap-2 font-bold text-sm">
              <X className="h-5 w-5" /> Close Preview
            </button>
            <div className="bg-background/10 border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-full">
              {previewProof.includes("video") || previewProof.includes(".mp4") ? (
                <video src={previewProof} controls className="max-w-full max-h-[80vh]" />
              ) : (
                <img src={previewProof} alt="Proof" className="max-w-full max-h-[80vh] object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InfluencerCampaigns;
