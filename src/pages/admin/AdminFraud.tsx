import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Ban, ShieldCheck, Search as SearchIcon, AlertTriangle, Fingerprint, Monitor } from "lucide-react";
import { motion } from "framer-motion";

const flaggedUsers = [
  { user: "Sneha Patel", reason: "Duplicate proof submissions", score: 88, ip: "192.168.1.45", device: "Android" },
  { user: "Riya Gupta", reason: "Same IP cluster detected", score: 72, ip: "192.168.1.45", device: "Android" },
  { user: "Unknown #4821", reason: "Bot-like activity pattern", score: 95, ip: "10.0.0.12", device: "Chrome/Win" },
  { user: "Rajesh M.", reason: "Multiple accounts suspected", score: 65, ip: "172.16.0.8", device: "iOS" },
  { user: "Fake User 01", reason: "Automated proof generation", score: 98, ip: "10.0.0.12", device: "Chrome/Win" },
];

const alerts = [
  { type: "Duplicate Proof", desc: "3 users submitted identical screenshots for Campaign #128", severity: "High" },
  { type: "IP Cluster", desc: "5 accounts from same IP 192.168.1.45 in last hour", severity: "Medium" },
  { type: "Bot Activity", desc: "User #4821 completed 50 tasks in 10 minutes", severity: "Critical" },
  { type: "Device Fingerprint", desc: "Same device ID across 4 accounts", severity: "High" },
];

export default function AdminFraud() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Fraud & Risk Panel</h1>
        <p className="text-sm text-muted-foreground">Monitor and mitigate fraudulent activity</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Flagged Users", value: "23", icon: ShieldAlert, color: "text-accent" },
          { label: "Duplicate Proofs", value: "8", icon: Fingerprint, color: "text-yellow-500" },
          { label: "IP Clusters", value: "4", icon: Monitor, color: "text-blue-500" },
          { label: "Banned Today", value: "3", icon: Ban, color: "text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <div>
                <p className="text-lg font-bold font-display text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-accent" /> Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/50 border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">{a.type}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
              </div>
              <Badge className={`text-xs shrink-0 ${
                a.severity === "Critical" ? "bg-accent/10 text-accent border-accent/20" :
                a.severity === "High" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                "bg-blue-500/10 text-blue-500 border-blue-500/20"
              }`}>{a.severity}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Flagged Users */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Flagged Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">User</TableHead>
                <TableHead className="text-xs">Reason</TableHead>
                <TableHead className="text-xs">Risk Score</TableHead>
                <TableHead className="text-xs">IP</TableHead>
                <TableHead className="text-xs">Device</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flaggedUsers.map((u, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{u.user}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{u.reason}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${u.score > 80 ? "bg-accent" : "bg-yellow-500"}`} style={{ width: `${u.score}%` }} />
                      </div>
                      <span className="text-xs font-mono">{u.score}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{u.ip}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.device}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-accent"><Ban className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500"><ShieldCheck className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><SearchIcon className="h-3.5 w-3.5" /></Button>
                    </div>
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
