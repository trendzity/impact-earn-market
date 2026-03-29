import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Clock, CheckCircle2, Loader2 } from "lucide-react";

const campaigns = [
  { id: 1, name: "Summer Collection Launch", brand: "StyleCo Fashion", task: "Create 1 Instagram Reel featuring summer outfits", deadline: "Jun 25, 2026", status: "in_progress", progress: 60 },
  { id: 2, name: "Protein Shake Review", brand: "FitBrand Health", task: "Record a 5-min YouTube review video", deadline: "Jun 28, 2026", status: "in_progress", progress: 30 },
  { id: 3, name: "App Install Campaign", brand: "FoodieApp", task: "Post an Instagram story with swipe-up link", deadline: "Jun 22, 2026", status: "submitted", progress: 100 },
  { id: 4, name: "Course Promotion", brand: "EduLearn", task: "Create 2 Reels about the course benefits", deadline: "Jun 30, 2026", status: "in_progress", progress: 45 },
  { id: 5, name: "Spring Fashion Haul", brand: "WearIt", task: "Create a try-on haul video for YouTube", deadline: "Jun 18, 2026", status: "approved", progress: 100 },
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  in_progress: { label: "In Progress", icon: Loader2, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  submitted: { label: "Submitted", icon: Clock, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  approved: { label: "Approved", icon: CheckCircle2, className: "bg-green-500/10 text-green-600 border-green-500/20" },
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfluencerCampaigns = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-display font-bold text-foreground">My Campaigns</h1>
        <p className="text-sm text-muted-foreground">Track and manage your active campaign tasks</p>
      </motion.div>

      <div className="space-y-4">
        {campaigns.map((campaign) => {
          const config = statusConfig[campaign.status];
          const StatusIcon = config.icon;
          return (
            <motion.div key={campaign.id} variants={itemVariants}>
              <Card className="hover:shadow-md hover:border-accent/20 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                        <Badge variant="outline" className={`text-[10px] ${config.className}`}>
                          <StatusIcon className="h-2.5 w-2.5 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Brand: {campaign.brand}</p>
                      <p className="text-sm text-foreground/80">{campaign.task}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {campaign.deadline}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 max-w-xs">
                        <Progress value={campaign.progress} className="h-1.5" />
                        <span className="text-xs text-muted-foreground">{campaign.progress}%</span>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {campaign.status === "in_progress" && (
                        <Button size="sm" className="h-8 bg-accent hover:bg-accent/90 text-accent-foreground text-xs gap-1">
                          <Upload className="h-3 w-3" /> Submit Proof
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default InfluencerCampaigns;
