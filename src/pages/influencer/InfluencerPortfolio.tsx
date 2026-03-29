import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Twitter, ExternalLink, Edit } from "lucide-react";

const pastWork = [
  { brand: "StyleCo Fashion", campaign: "Summer Collection", platform: "Instagram", type: "Reel", result: "45K views", color: "bg-pink-500/10" },
  { brand: "TechGear Pro", campaign: "Gadget Unboxing", platform: "YouTube", type: "Video", result: "28K views", color: "bg-red-500/10" },
  { brand: "FoodieApp", campaign: "App Promo", platform: "Instagram", type: "Story", result: "18K reach", color: "bg-orange-500/10" },
  { brand: "EduLearn", campaign: "Course Review", platform: "YouTube", type: "Video", result: "35K views", color: "bg-blue-500/10" },
  { brand: "BeautyGlow", campaign: "Skincare Routine", platform: "Instagram", type: "Post", result: "12K likes", color: "bg-purple-500/10" },
  { brand: "FitBrand", campaign: "Protein Review", platform: "YouTube", type: "Video", result: "22K views", color: "bg-green-500/10" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfluencerPortfolio = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Portfolio</h1>
          <p className="text-sm text-muted-foreground">Your public creator profile for brands</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1 text-xs h-8">
          <Edit className="h-3 w-3" /> Edit Profile
        </Button>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent shrink-0">
                S
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-bold text-foreground">Sarah Kapoor</h2>
                <p className="text-sm text-muted-foreground mt-1">Tech & Lifestyle Content Creator | 24.8K+ followers across platforms</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <Badge variant="secondary" className="text-xs">Tech</Badge>
                  <Badge variant="secondary" className="text-xs">Fashion</Badge>
                  <Badge variant="secondary" className="text-xs">Lifestyle</Badge>
                  <Badge variant="secondary" className="text-xs">Reviews</Badge>
                </div>
                <div className="flex items-center gap-4 mt-4 justify-center sm:justify-start">
                  <a href="#" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
                    <Instagram className="h-4 w-4" /> @sarahkapoor
                  </a>
                  <a href="#" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
                    <Youtube className="h-4 w-4" /> SarahKapoor
                  </a>
                  <a href="#" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
                    <Twitter className="h-4 w-4" /> @sarahk
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center shrink-0">
                <div>
                  <p className="text-lg font-bold text-foreground">42</p>
                  <p className="text-[10px] text-muted-foreground">Campaigns</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">24.8K</p>
                  <p className="text-[10px] text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">4.8%</p>
                  <p className="text-[10px] text-muted-foreground">Engagement</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Past Campaign Work */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Past Campaign Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastWork.map((work, i) => (
                <div key={i} className={`p-4 rounded-lg ${work.color} border border-border/50 hover:border-accent/30 transition-all group`}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[10px]">{work.platform}</Badge>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{work.brand}</p>
                  <p className="text-xs text-muted-foreground">{work.campaign}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="secondary" className="text-[10px]">{work.type}</Badge>
                    <span className="text-xs font-medium text-foreground">{work.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InfluencerPortfolio;
