import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, Upload, Loader2, Save, ArrowLeft, Instagram, Youtube, Facebook, Check, MessageCircle, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { TelegramLoginButton } from "@/components/dashboard/TelegramLoginButton";

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const BusinessSettings = () => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    website: "",
    data: {} as any
  });
  const [originalForm, setOriginalForm] = useState<any>(null);

  useEffect(() => {
    fetchLinkedAccounts();
    const loadProfile = async () => {
      setLoading(true);
      const profileInfo = await fetchProfile();
      if (profileInfo) {
        setUser(profileInfo.user);
        const formData = {
          name: profileInfo.user.name || "",
          email: profileInfo.user.email || "",
          companyName: profileInfo.profile?.companyName || profileInfo.user.companyName || "",
          website: profileInfo.profile?.website || profileInfo.user.website || "",
          data: profileInfo.profile || {}
        };
        setForm(formData);
        setOriginalForm(formData);
      }
      setLoading(false);
    };
    loadProfile();
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
      console.error("Error fetching accounts:", error);
    }
  };

  const handleConnect = (platform: string) => {
    if (platform === "YouTube") {
      const token = getToken();
      window.location.href = `${getApiUrl("/auth/youtube")}?token=${token}`;
    } else if (platform === "Instagram") {
      const token = getToken();
      window.location.href = `${getApiUrl("/auth/instagram")}?token=${token}`;
    } else if (platform === "Facebook") {
      const token = getToken();
      window.location.href = `${getApiUrl("/auth/facebook-link")}?token=${token}`;
    } else if (platform === "LinkedIn") {
      const token = getToken();
      window.location.href = `${getApiUrl("/auth/linkedin")}?token=${token}`;
    } else {
      toast.info(`${platform} connection coming soon!`);
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Disconnect ${platform}?`)) return;
    setActionLoading(platform);
    try {
      const token = getToken();
      const response = await fetch(getApiUrl(`/auth/${platform.toLowerCase()}/disconnect`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success("Disconnected successfully");
        fetchLinkedAccounts();
      }
    } catch (error) {
      toast.error("Failed to disconnect");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTelegramAuth = async (telegramUser: any) => {
    setActionLoading("Telegram");
    try {
      const response = await fetch(getApiUrl("/auth/telegram/verify"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(telegramUser),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Telegram linked successfully!");
        fetchLinkedAccounts();
      } else {
        toast.error(data.message || "Telegram verification failed");
      }
    } catch (error) {
      console.error("Telegram Auth Error:", error);
      toast.error("Failed to connect Telegram");
    } finally {
      setActionLoading(null);
    }
  };

  const isConnected = (platform: string) => linkedAccounts.some(acc => acc.platform === platform.toLowerCase());
  const getStats = (platform: string) => {
    const acc = linkedAccounts.find(acc => acc.platform === platform.toLowerCase());
    if (!acc) return "Not Linked";

    if (acc.platform.toLowerCase() === 'youtube' && acc.stats?.subscribers) {
      const count = parseInt(acc.stats.subscribers);
      return count >= 1000 ? (count / 1000).toFixed(1) + "k Subs" : `${count} Subs`;
    }
    if ((acc.platform.toLowerCase() === 'instagram' || acc.platform.toLowerCase() === 'facebook') && acc.stats?.followersCount !== undefined) {
      const count = parseInt(acc.stats.followersCount);
      return count >= 1000 ? (count / 1000).toFixed(1) + "k Followers" : `${count} Followers`;
    }
    if (acc.platform.toLowerCase() === 'telegram') {
      if (acc.stats?.memberCount) {
        const count = parseInt(acc.stats.memberCount);
        return count >= 1000 ? (count / 1000).toFixed(1) + "k Members" : `${count} Members`;
      }
      return acc.stats?.username ? `@${acc.stats.username}` : "Connected";
    }
    if (acc.platform.toLowerCase() === 'linkedin') {
      return acc.stats?.fullName ? acc.stats.fullName : "Connected";
    }
    return acc ? "Connected" : "Not Linked";
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalForm) {
      setForm(originalForm);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = getApiUrl("/profile/account");
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          profileData: {
            ...form.data,
            companyName: form.companyName,
            website: form.website
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Settings updated successfully");
        setUser(data.user);
        const newFormData = {
          ...form,
          name: data.user.name,
          email: data.user.email
        };
        setForm(newFormData);
        setOriginalForm(newFormData);
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6 max-w-3xl">
      <motion.div variants={item} className="flex flex-col gap-4">
        <Link 
          to="/business" 
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors w-fit"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your business profile and preferences</p>
          </div>
          <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button 
              onClick={handleEdit}
              className="bg-accent text-accent-foreground gap-2"
            >
              <Save className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button 
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                className="bg-accent text-accent-foreground gap-2"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>

      {/* Profile Status */}
      {user?.onboarded && (
        <motion.div variants={item}>
          <Card className="border border-accent/20 bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">SaaS Verified</p>
                  <Link 
                    to="/onboarding?mode=review" 
                    className="text-xs text-accent hover:underline flex items-center gap-1"
                  >
                    View Onboarding Summary
                  </Link>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded">
                Verified
              </span>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Business Profile */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Business Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <Building2 className="h-6 w-6 text-accent" />
                )}
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" disabled={!isEditing}>
                <Upload className="h-3.5 w-3.5" /> Upload Logo
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Company Name</Label>
                <Input 
                  value={form.companyName} 
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className={!isEditing ? 'opacity-70 cursor-not-allowed' : ''}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Website</Label>
                <Input 
                  value={form.website} 
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className={!isEditing ? 'opacity-70 cursor-not-allowed' : ''}
                />
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
              <Label className="text-sm">Full Name</Label>
              <Input 
                value={form.name} 
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={!isEditing ? 'opacity-70 cursor-not-allowed' : ''}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Email</Label>
              <Input 
                value={form.email} 
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={!isEditing ? 'opacity-70 cursor-not-allowed' : ''}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Password</Label>
              <Input type="password" defaultValue="••••••••" disabled />
            </div>
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

      {/* Social Accounts */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Connected Social Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { platform: "Instagram", icon: Instagram, color: "text-pink-500" },
              { platform: "Facebook", icon: Facebook, color: "text-blue-600" },
              { platform: "YouTube", icon: Youtube, color: "text-red-500" },
              { platform: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
              { platform: "Telegram", icon: MessageCircle, color: "text-blue-500" },
            ].map((s) => (
              <div key={s.platform} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.platform}</p>
                    <p className="text-xs text-muted-foreground">{getStats(s.platform)}</p>
                  </div>
                </div>
                {isConnected(s.platform) ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] gap-1 px-2 py-0.5 rounded-full">
                      <Check className="h-2.5 w-2.5" /> Connected
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-[10px] text-destructive hover:bg-destructive/10"
                      onClick={() => handleDisconnect(s.platform)}
                      disabled={actionLoading === s.platform}
                    >
                      {actionLoading === s.platform ? <Loader2 className="h-3 w-3 animate-spin" /> : "Disconnect"}
                    </Button>
                  </div>
                ) : s.platform === "Telegram" ? (
                  <div className="scale-75 origin-right">
                    <TelegramLoginButton 
                      botName="Trendzity_Auth_bot" 
                      onAuth={handleTelegramAuth} 
                      buttonSize="medium"
                    />
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-7 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleConnect(s.platform)}
                    disabled={actionLoading === s.platform}
                  >
                    {actionLoading === s.platform ? <Loader2 className="h-3 w-3 animate-spin" /> : "Connect"}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BusinessSettings;
