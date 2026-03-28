import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, Upload } from "lucide-react";

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const BusinessSettings = () => {
  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6 max-w-3xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your business profile and preferences</p>
      </motion.div>

      {/* Business Profile */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Business Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Upload className="h-3.5 w-3.5" /> Upload Logo
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Company Name</Label>
                <Input defaultValue="Acme Marketing" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Website</Label>
                <Input defaultValue="https://acme.com" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Email</Label>
              <Input defaultValue="admin@acme.com" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Password</Label>
              <Input type="password" defaultValue="••••••••" />
            </div>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "New task submissions", desc: "Get notified when creators submit proofs" },
              { label: "Campaign milestones", desc: "Alerts when campaigns reach 50%, 100%" },
              { label: "Low balance warning", desc: "Notify when wallet balance drops below ₹1,000" },
              { label: "Weekly reports", desc: "Receive weekly performance summaries" },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BusinessSettings;
