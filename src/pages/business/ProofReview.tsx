import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, ExternalLink, Image } from "lucide-react";
import { useState } from "react";

const submissions = [
  { creator: "Rahul K.", campaign: "Instagram Followers Boost", proof: "screenshot_01.png", time: "2 min ago", status: "Pending", type: "image" },
  { creator: "Priya S.", campaign: "YouTube Review Campaign", proof: "https://youtube.com/watch?v=abc", time: "5 min ago", status: "Pending", type: "link" },
  { creator: "Amit D.", campaign: "Telegram Channel Join", proof: "screenshot_02.png", time: "12 min ago", status: "Pending", type: "image" },
  { creator: "Sneha R.", campaign: "Instagram Followers Boost", proof: "https://instagram.com/p/xyz", time: "18 min ago", status: "Pending", type: "link" },
  { creator: "Vikram T.", campaign: "YouTube Review Campaign", proof: "screenshot_03.png", time: "25 min ago", status: "Pending", type: "image" },
  { creator: "Neha M.", campaign: "Twitter Retweet Drive", proof: "https://twitter.com/status/123", time: "30 min ago", status: "Approved", type: "link" },
  { creator: "Karan J.", campaign: "Instagram Story Views", proof: "screenshot_04.png", time: "45 min ago", status: "Rejected", type: "image" },
];

const statusColor: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Approved: "bg-green-500/10 text-green-500 border-green-500/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const ProofReview = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (i: number) => {
    setSelected((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proof Review</h1>
          <p className="text-sm text-muted-foreground">Review and approve task submissions</p>
        </div>
        {selected.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white gap-1.5">
              <Check className="h-3.5 w-3.5" /> Bulk Approve ({selected.length})
            </Button>
            <Button size="sm" variant="destructive" className="h-8 gap-1.5">
              <X className="h-3.5 w-3.5" /> Bulk Reject ({selected.length})
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((s, i) => (
                  <TableRow key={i} className="border-border/30">
                    <TableCell>
                      {s.status === "Pending" && (
                        <Checkbox checked={selected.includes(i)} onCheckedChange={() => toggleSelect(i)} />
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{s.creator}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{s.campaign}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-accent">
                        {s.type === "image" ? <Image className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                        <span className="truncate max-w-[120px]">{s.proof}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.time}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs border ${statusColor[s.status]}`}>{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {s.status === "Pending" && (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" className="h-7 w-7 bg-green-600 hover:bg-green-700 text-white">
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="destructive" className="h-7 w-7">
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProofReview;
