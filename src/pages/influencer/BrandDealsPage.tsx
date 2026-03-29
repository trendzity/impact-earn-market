import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Instagram, Youtube, Clock, DollarSign, Filter } from "lucide-react";
import { useState } from "react";

const deals = [
  { id: 1, brand: "StyleCo Fashion", campaign: "Summer Collection Launch", type: "Reel", platform: "Instagram", reward: 5000, deadline: "3 days", status: "new", logo: "SC" },
  { id: 2, brand: "FitBrand Health", campaign: "Protein Shake Review", type: "Video", platform: "YouTube", reward: 8000, deadline: "5 days", status: "new", logo: "FB" },
  { id: 3, brand: "TechGear Pro", campaign: "Gadget Unboxing", type: "Video", platform: "YouTube", reward: 12000, deadline: "7 days", status: "new", logo: "TG" },
  { id: 4, brand: "BeautyGlow", campaign: "Skincare Routine Post", type: "Story", platform: "Instagram", reward: 3500, deadline: "2 days", status: "new", logo: "BG" },
  { id: 5, brand: "FoodieApp", campaign: "App Install Campaign", type: "Post", platform: "Instagram", reward: 4500, deadline: "4 days", status: "accepted", logo: "FA" },
  { id: 6, brand: "EduLearn", campaign: "Course Promotion", type: "Reel", platform: "Instagram", reward: 6000, deadline: "6 days", status: "accepted", logo: "EL" },
];

const platformIcon = (platform: string) => {
  if (platform === "Instagram") return <Instagram className="h-4 w-4" />;
  if (platform === "YouTube") return <Youtube className="h-4 w-4" />;
  return null;
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const BrandDealsPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? deals : deals.filter((d) => d.status === statusFilter);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Brand Deals</h1>
          <p className="text-sm text-muted-foreground">Manage incoming brand collaboration requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deals</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((deal) => (
          <motion.div key={deal.id} variants={itemVariants}>
            <Card className="group hover:shadow-md hover:border-accent/30 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-sm font-bold text-accent shrink-0">
                    {deal.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{deal.brand}</p>
                    <p className="text-xs text-muted-foreground truncate">{deal.campaign}</p>
                  </div>
                  <Badge variant={deal.status === "new" ? "default" : "secondary"} className={deal.status === "new" ? "bg-accent text-accent-foreground text-[10px]" : "text-[10px]"}>
                    {deal.status === "new" ? "New" : "Accepted"}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      {platformIcon(deal.platform)} {deal.platform}
                    </span>
                    <Badge variant="outline" className="text-[10px]">{deal.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Reward
                    </span>
                    <span className="font-semibold text-foreground">₹{deal.reward.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Deadline
                    </span>
                    <span className="text-foreground">{deal.deadline}</span>
                  </div>
                </div>

                {deal.status === "new" ? (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-8 bg-accent hover:bg-accent/90 text-accent-foreground text-xs">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="secondary" className="w-full h-8 text-xs">
                    View Details
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BrandDealsPage;
