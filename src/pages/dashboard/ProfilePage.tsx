import { motion } from "framer-motion";
import { User, Instagram, Youtube, MessageCircle, CheckCircle, Edit, Target, Wallet, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const socials = [
  { platform: "Instagram", icon: Instagram, handle: "@arjun_creator", connected: true, color: "text-pink-500" },
  { platform: "YouTube", icon: Youtube, handle: "ArjunCreates", connected: true, color: "text-red-500" },
  { platform: "Telegram", icon: MessageCircle, handle: "@arjun_t", connected: false, color: "text-blue-500" },
];

const profileStats = [
  { label: "Tasks Completed", value: "156", icon: Target },
  { label: "Total Earnings", value: "₹12,450", icon: Wallet },
  { label: "Member Since", value: "Jan 2024", icon: Calendar },
];

const ProfilePage = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and linked socials</p>
      </div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                A
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-bold text-foreground">Arjun Patel</h2>
                <p className="text-sm text-muted-foreground">arjun@email.com</p>
                <p className="text-xs text-muted-foreground mt-1">Creator • Level 5</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-3 w-3" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {profileStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Connected Accounts */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {socials.map((s) => (
            <div key={s.platform} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{s.platform}</p>
                  <p className="text-xs text-muted-foreground">{s.handle}</p>
                </div>
              </div>
              {s.connected ? (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <CheckCircle className="h-3 w-3" /> Connected
                </span>
              ) : (
                <Button size="sm" variant="outline" className="text-xs h-7">Connect</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
