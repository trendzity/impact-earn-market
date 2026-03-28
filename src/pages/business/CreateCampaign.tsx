import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Rocket } from "lucide-react";

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const CreateCampaign = () => {
  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6 max-w-3xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Create Campaign</h1>
        <p className="text-sm text-muted-foreground">Launch a new micro-marketing campaign</p>
      </motion.div>

      {/* Basic Info */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Campaign Name</Label>
              <Input placeholder="e.g., Instagram Followers Boost" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Platform</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Objective</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select objective" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Task Instructions</Label>
              <Textarea placeholder="Describe the steps creators need to follow..." rows={4} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Budget */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Budget & Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Reward per Task (₹)</Label>
                <Input type="number" placeholder="e.g., 10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Total Budget (₹)</Label>
                <Input type="number" placeholder="e.g., 5000" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Targeting */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Creator Targeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Min Followers</Label>
                <Input type="number" placeholder="e.g., 100" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Language</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Proof */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Proof Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox id="screenshot" defaultChecked />
              <Label htmlFor="screenshot" className="text-sm">Screenshot</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="url" defaultChecked />
              <Label htmlFor="url" className="text-sm">URL Link</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="video" />
              <Label htmlFor="video" className="text-sm">Video (optional)</Label>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
          <Rocket className="h-4 w-4" />
          Launch Campaign
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CreateCampaign;
