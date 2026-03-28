import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pause, Pencil, Play } from "lucide-react";

const campaigns = [
  { name: "Instagram Followers Boost", platform: "Instagram", budget: "₹25,000", spent: "₹18,200", status: "Active", tasks: 342 },
  { name: "YouTube Review Campaign", platform: "YouTube", budget: "₹40,000", spent: "₹40,000", status: "Completed", tasks: 580 },
  { name: "Telegram Channel Join", platform: "Telegram", budget: "₹10,000", spent: "₹6,400", status: "Active", tasks: 128 },
  { name: "Twitter Retweet Drive", platform: "Twitter", budget: "₹15,000", spent: "₹15,000", status: "Completed", tasks: 450 },
  { name: "Instagram Story Views", platform: "Instagram", budget: "₹20,000", spent: "₹8,900", status: "Paused", tasks: 178 },
  { name: "YouTube Subscribe Push", platform: "YouTube", budget: "₹30,000", spent: "₹12,300", status: "Active", tasks: 205 },
];

const statusColor: Record<string, string> = {
  Active: "bg-green-500/10 text-green-500 border-green-500/20",
  Paused: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Completed: "bg-muted text-muted-foreground border-border",
};

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const BusinessCampaigns = () => {
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
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Campaign</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c, i) => (
                  <TableRow key={i} className="border-border/30">
                    <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{c.platform}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.budget}</TableCell>
                    <TableCell className="text-muted-foreground">{c.spent}</TableCell>
                    <TableCell className="text-muted-foreground">{c.tasks}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs border ${statusColor[c.status]}`}>{c.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          {c.status === "Paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      </div>
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

export default BusinessCampaigns;
