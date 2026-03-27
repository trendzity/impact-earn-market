import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

export default function AdminSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure platform parameters and permissions</p>
      </div>

      {/* Platform Controls */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Platform Controls</CardTitle>
          <CardDescription>Core platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Commission Percentage (%)</Label>
              <Input defaultValue="15" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Minimum Withdrawal (₹)</Label>
              <Input defaultValue="100" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Max Tasks per User/Day</Label>
              <Input defaultValue="50" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Referral Reward (₹)</Label>
              <Input defaultValue="25" className="bg-muted/50" />
            </div>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Feature Toggles</CardTitle>
          <CardDescription>Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Referral Program", desc: "Allow users to earn through referrals", enabled: true },
            { label: "Auto-approve Tasks", desc: "Automatically approve low-risk submissions", enabled: false },
            { label: "Reseller API Access", desc: "Allow resellers to access the API", enabled: true },
            { label: "Maintenance Mode", desc: "Put the platform in maintenance mode", enabled: false },
          ].map((f, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              <Switch defaultChecked={f.enabled} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Roles */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Roles & Permissions</CardTitle>
          <CardDescription>Admin team role management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { role: "Super Admin", perms: "Full access", count: 2 },
            { role: "Finance Admin", perms: "Wallet, Withdrawals, Reports", count: 3 },
            { role: "Moderator", perms: "Tasks, Submissions, Users", count: 5 },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{r.role}</p>
                  <Badge variant="outline" className="text-xs">{r.count} members</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{r.perms}</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs">Edit</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
