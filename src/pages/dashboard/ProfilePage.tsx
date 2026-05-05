import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Instagram, Youtube, Facebook, MessageCircle, CheckCircle, Edit, Target, Wallet, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getToken, getApiUrl, getUser, type UserData } from "@/utils/auth";
import { toast } from "sonner";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    setUser(getUser());
    fetchLinkedAccounts();
  }, []);

  const fetchLinkedAccounts = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl("/auth/linked-accounts"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLinkedAccounts(data);
      }
    } catch (error) {
      console.error("Error fetching linked accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const isConnected = (platform: string) => {
    return linkedAccounts.some(acc => acc.platform.toLowerCase() === platform.toLowerCase());
  };

  const getHandle = (platform: string) => {
    const acc = linkedAccounts.find(acc => acc.platform.toLowerCase() === platform.toLowerCase());
    if (!acc) return "Not Linked";

    if (acc.platform.toLowerCase() === 'youtube' && acc.stats?.subscribers) {
      const count = parseInt(acc.stats.subscribers);
      return `${count >= 1000 ? (count / 1000).toFixed(1) + "k" : count} Subscribers`;
    }
    
    if ((acc.platform.toLowerCase() === 'instagram' || acc.platform.toLowerCase() === 'facebook') && acc.stats?.followersCount !== undefined) {
      const count = parseInt(acc.stats.followersCount);
      return `${count >= 1000 ? (count / 1000).toFixed(1) + "k" : count} Followers`;
    }

    return "Connected";
  };

  const socials = [
    { platform: "Instagram", icon: Instagram, color: "text-pink-500" },
    { platform: "Facebook", icon: Facebook, color: "text-blue-600" },
    { platform: "YouTube", icon: Youtube, color: "text-red-500" },
    { platform: "Telegram", icon: MessageCircle, color: "text-blue-500" },
  ];

  const profileStats = [
    { label: "Tasks Completed", value: "156", icon: Target },
    { label: "Total Earnings", value: "₹12,450", icon: Wallet },
    { label: "Member Since", value: "Jan 2024", icon: Calendar },
  ];

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
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-bold text-foreground">{user?.name || "User"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{user?.role || "Member"} • Level 1</p>
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
          {loading ? (
            <div className="py-4 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : (
            socials.map((s) => (
              <div key={s.platform} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.platform}</p>
                    <p className="text-xs text-muted-foreground">{getHandle(s.platform)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isConnected(s.platform) ? (
                    <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                      <CheckCircle className="h-3.5 w-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Not Linked</span>
                  )}
                </div>
              </div>
            ))
          )}
          <div className="pt-4 mt-2 border-t border-border/50 text-center">
            <Link to="/settings" className="text-xs text-accent hover:underline font-medium">
              Want to link or change accounts? Manage in Settings
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
