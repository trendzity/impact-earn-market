import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Youtube,
  MessageCircle,
  Twitter,
  Facebook,
  Search,
  Upload,
  X,
  CheckCircle,
  Clock,
  Loader2,
  Linkedin,
  Megaphone,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const platforms = ["All", "Instagram", "YouTube", "LinkedIn", "Telegram", "Twitter", "Facebook"];

const platformIcons: Record<string, any> = {
  instagram: { icon: Instagram, color: "text-pink-600", bg: "bg-pink-600/10", border: "border-pink-600/20" },
  youtube: { icon: Youtube, color: "text-red-600", bg: "bg-red-600/10", border: "border-red-600/20" },
  linkedin: { icon: Linkedin, color: "text-blue-700", bg: "bg-blue-700/10", border: "border-blue-700/20" },
  telegram: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  twitter: { icon: Twitter, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  facebook: { icon: Facebook, color: "text-blue-800", bg: "bg-blue-800/10", border: "border-blue-800/20" },
};



const TasksPage = () => {
  const location = useLocation();
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [previewProof, setPreviewProof] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl("/campaigns/available"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);

        // Auto-select task if ID is in URL
        const params = new URLSearchParams(location.search);
        const taskId = params.get("taskId");
        if (taskId) {
          const task = data.tasks.find((t: any) => t.id === taskId);
          if (task) setSelectedTask(task);
        }
      }
    } catch (error) {
      console.error("Error fetching available tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    try {
      setJoiningId(campaignId);
      const token = getToken();
      const response = await fetch(getApiUrl(`/campaigns/join/${campaignId}`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success("Joined campaign! You can now submit proof.");
        fetchTasks();
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to join");
      }
    } catch (error) {
      toast.error("Error joining campaign");
    } finally {
      setJoiningId(null);
    }
  };

  const handleSubmitProof = async (campaign: any) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setSubmittingId(campaign.id);
        const token = getToken();
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const proofUrl = reader.result as string;
          
          const response = await fetch(getApiUrl(`/campaigns/submit-proof/${campaign.userTaskId || campaign.id}`), {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ proofUrl })
          });

          if (response.ok) {
            toast.success("Proof submitted! Business will review it.");
            setSelectedTask(null);
            fetchTasks();
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

  const filtered = tasks.filter((t) => {
    const matchPlatform = selectedPlatform === "All" || t.platform.toLowerCase() === selectedPlatform.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchPlatform && matchSearch;
  });

  const getPlatformInfo = (platform: string) => {
    return platformIcons[platform.toLowerCase()] || { icon: MessageCircle, color: "text-muted-foreground" };
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Task Marketplace</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse and complete tasks to earn rewards</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {platforms.map((p) => (
            <Button
              key={p}
              variant={selectedPlatform === p ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlatform(p)}
              className={selectedPlatform === p ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground text-lg italic">No tasks available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((task, i) => {
            const platformInfo = getPlatformInfo(task.platform);
            const PlatformIcon = platformInfo.icon;
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border border-border hover:border-accent/20 transition-all hover:shadow-sm cursor-pointer"
                  onClick={() => setSelectedTask(task)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${platformInfo.bg || "bg-muted"} ${platformInfo.border || "border-border"}`}>
                          <PlatformIcon className={`h-5 w-5 ${platformInfo.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {timeAgo(task.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent">₹{task.reward}</p>
                        <div className="flex flex-col items-end gap-1">
                          <Button 
                            size="sm" 
                            disabled={joiningId === task.id || task.isJoined}
                            onClick={(e) => !task.isJoined && handleJoin(e, task.id)}
                            className={`mt-1 h-7 text-xs ${task.isJoined ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-accent text-accent-foreground hover:bg-accent/90"}`}
                          >
                            {joiningId === task.id ? <Loader2 className="h-3 w-3 animate-spin" /> : task.isJoined ? (task.isSubmitted ? "Submitted" : "Joined") : "Start Task"}
                          </Button>
                          {task.isSubmitted && task.proofUrl && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setPreviewProof(task.proofUrl); }}
                              className="text-[10px] text-muted-foreground hover:text-accent flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" /> View Proof
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border rounded-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    {(() => {
                      const { icon: PIcon, color: PColor } = getPlatformInfo(selectedTask.platform);
                      return <PIcon className={`h-5 w-5 ${PColor}`} />;
                    })()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{selectedTask.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{selectedTask.platform}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-accent/10 rounded-lg p-3 text-center mb-5">
                <p className="text-2xl font-bold text-accent">₹{selectedTask.reward}</p>
                <p className="text-xs text-muted-foreground">Reward</p>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Megaphone className="h-3 w-3" /> Target Links
              </h4>
              <div className="space-y-2 mb-6">
                {/* Primary Link */}
                {selectedTask.link && (
                  <div className="bg-accent/5 p-2 rounded border border-accent/10 flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {(() => {
                        const { icon: PIcon, color: PColor } = getPlatformInfo(selectedTask.platform);
                        return <PIcon className={`h-4 w-4 ${PColor}`} />;
                      })()}
                    </div>
                    <a href={selectedTask.link} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline font-medium truncate flex-1">
                      {selectedTask.link}
                    </a>
                  </div>
                )}

                {/* Extra Links (Multichannel) */}
                {selectedTask.socialStats?.extraLinks?.map((link: any, idx: number) => {
                  const { icon: EIcon, color: EColor } = getPlatformInfo(link.platform);
                  return (
                    <div key={idx} className="bg-accent/5 p-2 rounded border border-accent/10 flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <EIcon className={`h-4 w-4 ${EColor}`} />
                      </div>
                      <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline font-medium truncate flex-1">
                        {link.url}
                      </a>
                    </div>
                  );
                })}

                {(!selectedTask.link && (!selectedTask.socialStats?.extraLinks || selectedTask.socialStats.extraLinks.length === 0)) && (
                  <div className="bg-muted p-2 rounded text-[10px] text-muted-foreground italic">
                    Link pending... Please check back in a few minutes.
                  </div>
                )}
              </div>

              <h4 className="text-sm font-semibold text-foreground mb-3">Instructions</h4>
              <div className="space-y-2 mb-5 bg-accent/5 p-3 rounded-lg border border-accent/10">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{selectedTask.instructions || selectedTask.description || "No specific instructions provided."}</p>
                </div>
              </div>

              {selectedTask.isJoined ? (
                <>
                  <div className="border border-dashed border-border rounded-lg p-6 text-center mb-4 cursor-pointer hover:bg-muted/50 transition-all"
                    onClick={() => handleSubmitProof(selectedTask)}>
                    <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click here to upload proof (screenshot)</p>
                    <p className="text-[10px] text-red-500 font-medium mt-1">Max: 5MB (JPG, PNG) | 20MB (MP4)</p>
                    {submittingId === selectedTask.id && <Loader2 className="h-4 w-4 animate-spin mx-auto mt-2" />}
                  </div>

                  <Button 
                    onClick={() => handleSubmitProof(selectedTask)}
                    disabled={submittingId === selectedTask.id}
                    className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/10 font-bold"
                  >
                    {submittingId === selectedTask.id ? "Submitting..." : "Submit Task"}
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={(e) => handleJoin(e, selectedTask.id)}
                  disabled={joiningId === selectedTask.id}
                  className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/10 font-bold"
                >
                  {joiningId === selectedTask.id ? "Joining..." : "Join to Submit Proof"}
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
};

export default TasksPage;
