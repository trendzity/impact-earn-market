import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken, getApiUrl } from "@/utils/auth";

const platforms = ["All", "Instagram", "YouTube", "Telegram", "Twitter", "Facebook"];

const platformIcons: Record<string, any> = {
  instagram: { icon: Instagram, color: "text-pink-500" },
  youtube: { icon: Youtube, color: "text-red-500" },
  telegram: { icon: MessageCircle, color: "text-blue-500" },
  twitter: { icon: Twitter, color: "text-blue-400" },
  facebook: { icon: Facebook, color: "text-blue-600" },
};

const TasksPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      console.error("Error fetching available tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tasks.filter((t) => {
    const matchPlatform = selectedPlatform === "All" || t.platform.toLowerCase() === selectedPlatform.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchPlatform && matchSearch;
  });

  const getPlatformInfo = (platform: string) => {
    return platformIcons[platform.toLowerCase()] || { icon: MessageCircle, color: "text-muted-foreground" };
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Task Marketplace</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse and complete tasks to earn rewards</p>
      </div>

      {/* Filters */}
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

      {/* Task Grid */}
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
            const { icon: PlatformIcon, color } = getPlatformInfo(task.platform);
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
                        <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center">
                          <PlatformIcon className={`h-5 w-5 ${color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground capitalize">{task.platform}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Just now
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent">₹{task.reward}</p>
                        <Button size="sm" className="mt-1 h-7 text-xs bg-accent text-accent-foreground hover:bg-accent/90">
                          Start Task
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Task Detail Modal */}
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
              className="bg-background border border-border rounded-xl w-full max-w-md p-6"
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

              <h4 className="text-sm font-semibold text-foreground mb-3">Target Link</h4>
              <div className="bg-muted p-2 rounded mb-5 overflow-hidden text-ellipsis whitespace-nowrap">
                <a href={selectedTask.link} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
                  {selectedTask.link}
                </a>
              </div>

              <h4 className="text-sm font-semibold text-foreground mb-3">Instructions</h4>
              <div className="space-y-2 mb-5">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{selectedTask.description || "No specific instructions provided."}</p>
                </div>
              </div>

              <div className="border border-dashed border-border rounded-lg p-6 text-center mb-4">
                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Upload proof (screenshot or link)</p>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Submit Task
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasksPage;
