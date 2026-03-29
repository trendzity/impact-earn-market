import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Youtube, Twitter, Check } from "lucide-react";

const socialAccounts = [
  { platform: "Instagram", icon: Instagram, handle: "@sarahkapoor", connected: true },
  { platform: "YouTube", icon: Youtube, handle: "SarahKapoor", connected: true },
  { platform: "Twitter/X", icon: Twitter, handle: "@sarahk", connected: true },
];

const notifications = [
  { label: "New brand deal requests", enabled: true },
  { label: "Campaign status updates", enabled: true },
  { label: "Payment notifications", enabled: true },
  { label: "Weekly analytics report", enabled: false },
  { label: "Platform announcements", enabled: false },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfluencerSettings = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-3xl">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-xl font-bold text-accent">
                S
              </div>
              <Button size="sm" variant="outline" className="text-xs h-8">Change Photo</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                <Input defaultValue="Sarah Kapoor" className="h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <Input defaultValue="sarah@example.com" className="h-9 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
              <Textarea defaultValue="Tech & Lifestyle Content Creator passionate about honest reviews and creative storytelling." className="text-sm min-h-[80px]" />
            </div>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-8">Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Social Accounts */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connected Social Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {socialAccounts.map((account) => (
              <div key={account.platform} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <account.icon className="h-5 w-5 text-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{account.platform}</p>
                    <p className="text-xs text-muted-foreground">{account.handle}</p>
                  </div>
                </div>
                {account.connected ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] gap-1">
                    <Check className="h-2.5 w-2.5" /> Connected
                  </Badge>
                ) : (
                  <Button size="sm" variant="outline" className="text-xs h-7">Connect</Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((n) => (
              <div key={n.label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{n.label}</span>
                <Switch defaultChecked={n.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InfluencerSettings;
