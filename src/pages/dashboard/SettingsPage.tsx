import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Globe, Loader2, Save, ArrowLeft, Instagram, Youtube, Facebook, Check, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";
import { TelegramLoginButton } from "@/components/dashboard/TelegramLoginButton";

const SettingsPage = () => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
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
        const pData = profileInfo.profile || {};
        const formData = {
          name: profileInfo.user.name || pData.name || "",
          email: profileInfo.user.email || pData.email || "",
          phone: pData.phone || profileInfo.user.phone || "",
          data: pData
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
    
    if (acc?.stats) {
      if (platform.toLowerCase() === 'youtube' && acc.stats.subscribers) {
        const count = parseInt(acc.stats.subscribers);
        return count >= 1000 ? (count / 1000).toFixed(1) + "k Subs" : `${count} Subs`;
      }
      if (platform.toLowerCase() === 'instagram' && acc.stats.followersCount !== undefined) {
        const count = parseInt(acc.stats.followersCount);
        return count >= 1000 ? (count / 1000).toFixed(1) + "k Followers" : `${count} Followers`;
      }
      if (platform.toLowerCase() === 'facebook' && acc.stats.followersCount !== undefined) {
        const count = parseInt(acc.stats.followersCount);
        return count >= 1000 ? (count / 1000).toFixed(1) + "k Followers" : `${count} Followers`;
      }
      if (platform.toLowerCase() === 'telegram') {
        if (acc.stats.memberCount) {
          const count = parseInt(acc.stats.memberCount);
          return count >= 1000 ? (count / 1000).toFixed(1) + "k Members" : `${count} Members`;
        }
        return acc.stats.username ? `@${acc.stats.username}` : "Connected";
      }
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
            phone: form.phone
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
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col gap-4">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors w-fit"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your preferences</p>
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
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Profile Status */}
        {user?.onboarded && (
          <Card className="border border-accent/20 bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Account Verified</p>
                  <Link 
                    to="/onboarding?mode=review" 
                    className="text-xs text-accent hover:underline flex items-center gap-1"
                  >
                    View Onboarding Summary
                  </Link>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded">
                Onboarded
              </span>
            </CardContent>
          </Card>
        )}

        {/* Account */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
              <Input 
                value={form.name} 
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`bg-background ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <Input 
                value={form.email} 
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`bg-background ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
              <Input 
                value={form.phone} 
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX" 
                className={!isEditing ? 'opacity-70 cursor-not-allowed' : ''}
              />
            </div>
            <Button variant="outline" size="sm" disabled={!isEditing}>Change Password</Button>
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

        {/* Social Accounts */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Youtube className="h-4 w-4 text-red-500" /> Connected Social Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { platform: "Instagram", icon: Instagram, color: "text-pink-500" },
              { platform: "Facebook", icon: Facebook, color: "text-blue-600" },
              { platform: "YouTube", icon: Youtube, color: "text-red-500" },
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
    </div>
  );
};

export default SettingsPage;
