import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, CheckCheck, Image } from "lucide-react";
import { motion } from "framer-motion";

const submissions = [
  { user: "Priya K.", campaign: "Instagram Follow Boost", proof: "screenshot_01.png", status: "Pending", flagged: false },
  { user: "Rahul S.", campaign: "YT Subscribe", proof: "link_proof.url", status: "Pending", flagged: true },
  { user: "Deepak V.", campaign: "Telegram Join", proof: "screenshot_02.png", status: "Approved", flagged: false },
  { user: "Sneha P.", campaign: "App Install Drive", proof: "screenshot_03.png", status: "Rejected", flagged: true },
  { user: "Amit K.", campaign: "IG Story Views", proof: "screenshot_04.png", status: "Pending", flagged: false },
  { user: "Riya G.", campaign: "Twitter Retweet", proof: "screenshot_05.png", status: "Pending", flagged: true },
];

export default function AdminTasks() {
  const pending = submissions.filter(s => s.status === "Pending").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Tasks & Submissions</h1>
          <p className="text-sm text-muted-foreground">Review task proofs and manage submissions</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <CheckCheck className="h-3.5 w-3.5" /> Bulk Approve
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs text-accent border-accent/20">
            <X className="h-3.5 w-3.5" /> Bulk Reject
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Submissions", value: "24,891" },
          { label: "Pending Review", value: String(pending) },
          { label: "Approved Today", value: "412" },
          { label: "Flagged", value: "18" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-lg font-bold font-display text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Submission Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">User</TableHead>
                <TableHead className="text-xs">Campaign</TableHead>
                <TableHead className="text-xs">Proof</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Flag</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{s.user}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.campaign}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                      <Image className="h-3 w-3" /> View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs font-normal ${
                      s.status === "Approved" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      s.status === "Rejected" ? "bg-accent/10 text-accent border-accent/20" :
                      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}>{s.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {s.flagged && <AlertTriangle className="h-4 w-4 text-accent" />}
                  </TableCell>
                  <TableCell className="text-right">
                    {s.status === "Pending" && (
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500"><Check className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-accent"><X className="h-3.5 w-3.5" /></Button>
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
  );
}
