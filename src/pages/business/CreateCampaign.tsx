import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Rocket, Loader2 } from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "",
    objective: "",
    link: "",
    budget: "",
    reward: "",
    totalLimit: "100",
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.link || !formData.budget || !formData.reward) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(getApiUrl("/campaigns"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Campaign launched successfully!");
        navigate("/business/campaigns");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to launch campaign");
      }
    } catch (error) {
      console.error("Error launching campaign:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              <Label className="text-sm">Campaign Name *</Label>
              <Input 
                placeholder="e.g., Instagram Followers Boost" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Platform *</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, platform: v })}>
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
                <Label className="text-sm">Objective *</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, objective: v })}>
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
              <Label className="text-sm">Target URL (Post/Profile Link) *</Label>
              <Input 
                placeholder="https://instagram.com/p/..." 
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Task Instructions</Label>
              <Textarea 
                placeholder="Describe the steps creators need to follow..." 
                rows={4} 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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
                <Label className="text-sm">Reward per Task (₹) *</Label>
                <Input 
                  type="number" 
                  placeholder="e.g., 10" 
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Total Budget (₹) *</Label>
                <Input 
                  type="number" 
                  placeholder="e.g., 5000" 
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Max Participants (Total Limit)</Label>
              <Input 
                type="number" 
                value={formData.totalLimit}
                onChange={(e) => setFormData({ ...formData, totalLimit: e.target.value })}
              />
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
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Button 
          size="lg" 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4" />
          )}
          Launch Campaign
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CreateCampaign;
