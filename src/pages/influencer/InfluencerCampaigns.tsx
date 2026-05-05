import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Clock, CheckCircle2, Loader2, IndianRupee } from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  active: { label: "Available", icon: Loader2, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  submitted: { label: "Submitted", icon: Clock, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  approved: { label: "Approved", icon: CheckCircle2, className: "bg-green-500/10 text-green-600 border-green-500/20" },
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfluencerCampaigns = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-display font-bold text-foreground">Available Campaigns</h1>
        <p className="text-sm text-muted-foreground">Discover and join active marketing collaborations</p>
      </motion.div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground italic">No brand deals available at the moment.</p>
          </div>
        ) : (
          campaigns.map((campaign) => {
            const config = statusConfig[campaign.status.toLowerCase()] || statusConfig.active;
            const StatusIcon = config.icon;
            return (
              <motion.div key={campaign.id} variants={itemVariants}>
                <Card className="hover:shadow-md hover:border-accent/20 transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{campaign.title}</h3>
                          <Badge variant="outline" className={`text-[10px] capitalize ${config.className}`}>
                            <StatusIcon className="h-2.5 w-2.5 mr-1" />
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-500 border-red-500/20 capitalize">
                            {campaign.platform}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground/80">{campaign.description || "No description provided."}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Just launched
                          </span>
                          <span className="flex items-center gap-1 font-bold text-accent">
                            <IndianRupee className="h-3 w-3" /> Reward: ₹{campaign.reward}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" className="h-8 bg-accent hover:bg-accent/90 text-accent-foreground text-xs gap-1">
                          Join Campaign
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs">
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default InfluencerCampaigns;
