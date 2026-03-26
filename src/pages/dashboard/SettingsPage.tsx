import { motion } from "framer-motion";
import { Bell, Shield, Globe, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Account */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" /> Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <Input value="arjun@email.com" readOnly />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
              <Input placeholder="+91 XXXXX XXXXX" />
            </div>
            <Button variant="outline" size="sm">Change Password</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["New task alerts", "Earnings updates", "Referral activity", "Promotional offers"].map((item) => (
              <div key={item} className="flex items-center justify-between py-1">
                <span className="text-sm text-foreground">{item}</span>
                <button className="h-5 w-9 bg-accent rounded-full relative transition-colors">
                  <span className="absolute right-0.5 top-0.5 h-4 w-4 bg-accent-foreground rounded-full transition-transform" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-accent" /> Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-foreground">Language</span>
              <span className="text-sm text-muted-foreground">English</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-foreground">Currency</span>
              <span className="text-sm text-muted-foreground">INR (₹)</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
