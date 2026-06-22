import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Pause, Play, Eye, Loader2, Megaphone, Target, ExternalLink, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(getApiUrl("/admin/campaigns"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      toast.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = getToken();
      const response = await fetch(getApiUrl(`/admin/campaigns/${id}/status`), {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success(`Campaign marked as ${status}`);
        if (selectedCampaign?.id === id) {
          setSelectedCampaign({ ...selectedCampaign, status });
        }
        fetchCampaigns();
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === "active").length,
    pending: campaigns.filter(c => c.status === "pending").length,
    budget: campaigns.reduce((acc, c) => acc + Number(c.budget), 0),
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Campaign Command Center</h1>
          <p className="text-sm text-muted-foreground">Approve, monitor, and regulate platform advertising</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Campaigns", value: stats.total, icon: Megaphone },
          { label: "Live Now", value: stats.active, icon: Play },
          { label: "Pending", value: stats.pending, icon: Pause },
          { label: "Total Volume", value: `₹${(stats.budget / 1000).toFixed(1)}k`, icon: Target },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold font-display text-foreground">{s.value}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{s.label}</p>
                </div>
                <s.icon className="h-4 w-4 text-accent/40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-md overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <CardTitle className="text-sm font-bold">Platform Wide Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-xs text-muted-foreground">Analyzing campaign data...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground italic text-sm">No campaigns found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/30">
                    <TableHead className="text-[10px] font-bold uppercase py-3">Campaign</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Business / Brand</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Budget</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Reward/User</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/5 transition-colors">
                      <TableCell className="py-3">
                        <div>
                          <p className="text-xs font-bold text-foreground">{c.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{c.platform}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-medium text-foreground">{c.business.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.business.email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-bold text-foreground">₹{c.budget}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-accent font-bold">₹{c.reward}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === "active" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                          c.status === "pending" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                          c.status === "rejected" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                          c.status === "admin_paused" ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                          "bg-slate-500/10 text-slate-600 border-slate-500/20"
                        }`}>
                          {c.status === "admin_paused" ? "ADMIN PAUSED" : c.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {c.status === "pending" && (
                            <>
                              <Button onClick={() => updateStatus(c.id, "active")} variant="ghost" size="icon" className="h-8 w-8 text-green-500"><Check className="h-4 w-4" /></Button>
                              <Button onClick={() => updateStatus(c.id, "rejected")} variant="ghost" size="icon" className="h-8 w-8 text-red-500"><X className="h-4 w-4" /></Button>
                            </>
                          )}
                          {c.status === "active" && (
                            <Button onClick={() => updateStatus(c.id, "paused")} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Pause className="h-4 w-4" /></Button>
                          )}
                          {(c.status === "paused" || c.status === "admin_paused") && (
                            <Button onClick={() => updateStatus(c.id, "active")} variant="ghost" size="icon" className="h-8 w-8 text-green-500"><Play className="h-4 w-4" /></Button>
                          )}
                          <Button onClick={() => setSelectedCampaign(c)} variant="ghost" size="icon" className="h-8 w-8 hover:text-accent"><Eye className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
                <div>
                  <h2 className="text-xl font-bold">{selectedCampaign.title}</h2>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{selectedCampaign.platform} Campaign</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedCampaign(null)} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Media Preview */}
                {(selectedCampaign.imageUrl || selectedCampaign.videoUrl) && (
                  <div className="rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center min-h-[200px]">
                    {selectedCampaign.videoUrl ? (
                      <video src={selectedCampaign.videoUrl} controls className="max-w-full max-h-[400px]" />
                    ) : (
                      <img src={selectedCampaign.imageUrl} alt="Campaign" className="max-w-full max-h-[400px] object-contain" />
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Business Details</p>
                    <p className="text-sm font-bold">{selectedCampaign.business.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedCampaign.business.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Financials</p>
                    <p className="text-sm font-bold">Budget: ₹{selectedCampaign.budget}</p>
                    <p className="text-xs text-accent font-bold">Reward/User: ₹{selectedCampaign.reward}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedCampaign.description || "No description provided."}</p>
                </div>

                {selectedCampaign.hashtags && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Hashtags</p>
                    <p className="text-sm text-accent font-medium">{selectedCampaign.hashtags}</p>
                  </div>
                )}

                {selectedCampaign.instructions && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Influencer Instructions</p>
                    <div className="text-sm bg-muted/30 p-4 rounded-xl border border-border/50 whitespace-pre-wrap">
                      {selectedCampaign.instructions}
                    </div>
                  </div>
                )}

                {selectedCampaign.link && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Target Link</p>
                    <a href={selectedCampaign.link} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1.5">
                      {selectedCampaign.link} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border bg-muted/10 flex justify-between gap-3">
                <div className="flex gap-2">
                  <Badge className="bg-accent/10 text-accent border-none">{selectedCampaign.objective}</Badge>
                  <Badge variant="outline" className="border-border">{selectedCampaign.status.toUpperCase()}</Badge>
                </div>
                <div className="flex gap-2">
                  {selectedCampaign.status === "pending" && (
                    <>
                      <Button onClick={() => updateStatus(selectedCampaign.id, "active")} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                        <Check className="h-4 w-4" /> APPROVE & GO LIVE
                      </Button>
                      <Button onClick={() => updateStatus(selectedCampaign.id, "rejected")} variant="destructive" className="gap-2">
                        <X className="h-4 w-4" /> REJECT
                      </Button>
                    </>
                  )}
                  {selectedCampaign.status === "active" && (
                    <Button onClick={() => updateStatus(selectedCampaign.id, "paused")} variant="outline" className="gap-2">
                      <Pause className="h-4 w-4" /> PAUSE CAMPAIGN
                    </Button>
                  )}
                  {(selectedCampaign.status === "paused" || selectedCampaign.status === "admin_paused") && (
                    <Button onClick={() => updateStatus(selectedCampaign.id, "active")} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                      <Play className="h-4 w-4" /> RESUME CAMPAIGN
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
