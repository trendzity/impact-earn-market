import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, User, Lock, Bell } from "lucide-react";

const ResellerSettings = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your reseller account settings.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-accent" /> Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input defaultValue="Rajesh Kumar" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-sm">Email</Label>
                <Input defaultValue="rajesh@smmhub.in" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-sm">Company</Label>
                <Input defaultValue="SMMHub India" className="mt-1.5" />
              </div>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                <Save className="h-4 w-4" /> Update Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="h-4 w-4 text-accent" /> Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="mt-1.5" />
                </div>
                <Button variant="outline" className="gap-1.5">
                  <Lock className="h-4 w-4" /> Change Password
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-accent" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Order updates", desc: "New orders and status changes" },
                  { label: "Low balance alerts", desc: "When wallet drops below ₹1,000" },
                  { label: "New client signups", desc: "Via your white-label panel" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResellerSettings;
