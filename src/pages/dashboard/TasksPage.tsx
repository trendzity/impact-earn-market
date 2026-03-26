import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Youtube,
  MessageCircle,
  Filter,
  Search,
  Upload,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const allTasks = [
  { id: 1, platform: "Instagram", icon: Instagram, title: "Follow @trendzity", reward: 15, time: "2h left", category: "Follow", color: "text-pink-500", instructions: ["Go to Instagram", "Search @trendzity", "Click Follow", "Take a screenshot"] },
  { id: 2, platform: "YouTube", icon: Youtube, title: "Like & Subscribe Channel", reward: 25, time: "4h left", category: "Subscribe", color: "text-red-500", instructions: ["Open YouTube link", "Subscribe to channel", "Like the video", "Submit screenshot"] },
  { id: 3, platform: "Telegram", icon: MessageCircle, title: "Join Telegram Channel", reward: 10, time: "1h left", category: "Join", color: "text-blue-500", instructions: ["Open Telegram", "Join the channel", "Send /start", "Screenshot confirmation"] },
  { id: 4, platform: "Instagram", icon: Instagram, title: "Comment on Latest Post", reward: 20, time: "3h left", category: "Comment", color: "text-pink-500", instructions: ["Open post link", "Write a meaningful comment", "Take a screenshot", "Submit proof"] },
  { id: 5, platform: "YouTube", icon: Youtube, title: "Watch Full Video (5 min)", reward: 30, time: "5h left", category: "Watch", color: "text-red-500", instructions: ["Open video link", "Watch complete video", "Screenshot the end screen", "Submit proof"] },
  { id: 6, platform: "Instagram", icon: Instagram, title: "Like 3 Recent Posts", reward: 12, time: "2h left", category: "Like", color: "text-pink-500", instructions: ["Visit the profile", "Like 3 latest posts", "Screenshot each like", "Submit proof"] },
];

const platforms = ["All", "Instagram", "YouTube", "Telegram"];

const TasksPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedTask, setSelectedTask] = useState<typeof allTasks[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = allTasks.filter((t) => {
    const matchPlatform = selectedPlatform === "All" || t.platform === selectedPlatform;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchPlatform && matchSearch;
  });

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
        <div className="flex gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((task, i) => (
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
                      <task.icon className={`h-5 w-5 ${task.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{task.platform}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {task.time}
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
        ))}
      </div>

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
                    <selectedTask.icon className={`h-5 w-5 ${selectedTask.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{selectedTask.title}</p>
                    <p className="text-xs text-muted-foreground">{selectedTask.platform}</p>
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

              <h4 className="text-sm font-semibold text-foreground mb-3">Instructions</h4>
              <div className="space-y-2 mb-5">
                {selectedTask.instructions.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </div>
                ))}
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
