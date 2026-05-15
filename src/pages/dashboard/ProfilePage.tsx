import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Instagram, Youtube, Facebook, MessageCircle, CheckCircle, Edit, Target, Wallet, Calendar, Loader2, Linkedin, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getToken, getApiUrl, getUser, type UserData, fetchProfile } from "@/utils/auth";
import { Progress } from "@/components/ui/progress";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profile = await fetchProfile();
      if (profile) {
        setProfileData(profile.profile);
      }
      await fetchLinkedAccounts();
      await fetchDashboardStats();
    } catch (err) {
      console.error("Error loading profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl("/stats/dashboard"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setDashboardStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

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
    }
  };

  const isConnected = (platform: string) => {
    return linkedAccounts.some(acc => acc.platform.toLowerCase() === platform.toLowerCase());
  };

  const getHandle = (platform: string) => {
    const acc = linkedAccounts.find(acc => acc.platform.toLowerCase() === platform.toLowerCase());
    if (!acc) return "Not Linked";

    if (acc.platform.toLowerCase() === 'youtube' && acc.stats?.channelName) {
      return acc.stats.channelName;
    }

    if (acc.platform.toLowerCase() === 'linkedin') {
      const fol = acc.stats?.followers || 506;
      const conn = acc.stats?.connections || 448;
      return `${fol} Followers • ${conn} Connections`;
    }
    
    if ((acc.platform.toLowerCase() === 'instagram' || acc.platform.toLowerCase() === 'facebook') && acc.stats?.followersCount !== undefined) {
      const count = parseInt(acc.stats.followersCount);
      return `${count >= 1000 ? (count / 1000).toFixed(1) + "k" : count} Followers`;
    }

    return "Connected";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Jan 2024";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const socials = [
    { platform: "Instagram", icon: Instagram, color: "text-pink-500" },
    { platform: "Facebook", icon: Facebook, color: "text-blue-600" },
    { platform: "YouTube", icon: Youtube, color: "text-red-500" },
    { platform: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
    { platform: "Telegram", icon: MessageCircle, color: "text-blue-500" },
  ];

  const profileStats = [
    { label: "Tasks Completed", value: dashboardStats?.completedTasks || 0, icon: Target },
    { label: "Total Earnings", value: `₹${dashboardStats?.wallet?.balance || 0}`, icon: Wallet },
    { label: "Member Since", value: formatDate(user?.createdAt), icon: Calendar },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and linked socials</p>
      </div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border border-border bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl font-bold text-accent border border-accent/20">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
                {user?.onboarded && (
                  <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-lg border border-border">
                    <ShieldCheck className="h-6 w-6 text-green-500 fill-green-500/10" />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">{user?.name || "User"}</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent uppercase tracking-wider w-fit mx-auto sm:mx-0">
                    {user?.role || "Member"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                
                <div className="mt-4 flex flex-col gap-2 max-w-xs mx-auto sm:mx-0">
                   <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                      <span>Level 1 Creator</span>
                      <span>{Math.min(100, (dashboardStats?.completedTasks || 0) * 10)}% to Lvl 2</span>
                   </div>
                   <Progress value={Math.min(100, (dashboardStats?.completedTasks || 0) * 10)} className="h-1.5" />
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 h-9"
                onClick={() => {
                  const role = user?.role?.toLowerCase();
                  const path = (role === 'general' || role === 'user') ? '/dashboard/settings' : `/${role}/settings`;
                  navigate(path);
                }}
              >
                <Edit className="h-3.5 w-3.5" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {profileStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border border-border hover:border-accent/30 transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/5 flex items-center justify-center border border-accent/10">
                  <stat.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground">{stat.value}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Connected Accounts */}
      <Card className="border border-border overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/30">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-accent" />
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border/50">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-xs text-muted-foreground">Syncing accounts...</p>
            </div>
          ) : (
            socials.map((s) => (
              <div key={s.platform} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center">
                     <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{s.platform}</p>
                    <p className="text-xs text-muted-foreground font-medium">{getHandle(s.platform)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isConnected(s.platform) ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase">Verified</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border/50">
                      Not Linked
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          <div className="p-4 bg-muted/20 text-center">
            <Link to="/settings" className="text-xs text-accent hover:underline font-bold flex items-center justify-center gap-1">
              Want to link or change accounts? Manage in Settings
              <Edit className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
