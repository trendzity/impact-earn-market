import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pause, Pencil, Play, Loader2 } from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  paused: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  completed: "bg-muted text-muted-foreground border-border",
};

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const BusinessCampaigns = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl("/campaigns/business"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLink = async (campaignId: string, currentLink: string) => {
    const newLink = prompt("Enter the correct social media post link:", currentLink || "");
    if (!newLink || newLink === currentLink) return;

    try {
      setUpdatingId(campaignId);
      const token = getToken();
      const response = await fetch(getApiUrl(`/campaigns/${campaignId}/update-link`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ link: newLink })
      });

      if (response.ok) {
        toast.success("Target link updated successfully!");
        fetchCampaigns(); // Refresh the list
      } else {
        toast.error("Failed to update link.");
      }
    } catch (err) {
      console.error("Error updating link:", err);
      toast.error("An error occurred.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage all your marketing campaigns</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-platform">
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-platform">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">No campaigns found. Launch your first one!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Target Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id} className="border-border/30">
                      <TableCell className="font-medium text-foreground">{c.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{c.platform}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">₹{c.budget}</TableCell>
                      <TableCell className="text-muted-foreground">₹{c.reward}</TableCell>
                      <TableCell>
                        {c.link ? (
                          <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs truncate max-w-[150px] block">
                            {c.link}
                          </a>
                        ) : (
                          <span className="text-red-500 text-[10px] font-bold">LINK MISSING</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs border capitalize ${statusColor[c.status.toLowerCase()]}`}>{c.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="View Details"><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Pause/Play">
                            {c.status.toLowerCase() === "paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            title="Update Target Link"
                            disabled={updatingId === c.id}
                            onClick={() => handleUpdateLink(c.id, c.link)}
                          >
                            {updatingId === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BusinessCampaigns;
