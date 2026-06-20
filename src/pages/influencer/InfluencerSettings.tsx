import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Youtube, Twitter, Facebook, Check, Loader2, Save, ArrowLeft, Star, MessageCircle, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";
import { TelegramLoginButton } from "@/components/dashboard/TelegramLoginButton";

const notificationsList = [
  { label: "New brand deal requests", enabled: true },
  { label: "Campaign status updates", enabled: true },
  { label: "Payment notifications", enabled: true },
  { label: "Weekly analytics report", enabled: false },
  { label: "Platform announcements", enabled: false },
];
const categoryOptions = [
  { value: "tech", label: "Tech & AI" },
  { value: "finance", label: "Finance" },
  { value: "forex", label: "Forex & Trading" },
  { value: "food", label: "Food & Cooking" },
  { value: "lifestyle", label: "Lifestyle & Fashion" },
  { value: "beauty", label: "Beauty & Cosmetics" },
  { value: "gaming", label: "Gaming" },
  { value: "travel", label: "Travel" },
  { value: "fitness", label: "Fitness & Health" },
  { value: "education", label: "Education" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const InfluencerSettings = () => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [categories, setCategories] = useState({
    primaryCategory: "",
    secondaryCategory: "",
    lastCategoryUpdate: null as string | null,
    categoryVerificationStatus: "APPROVED"
  });
  const [tempCategories, setTempCategories] = useState({
    primaryCategory: "",
    secondaryCategory: ""
  });
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [savingCategories, setSavingCategories] = useState(false);

  
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    socialHandle: "",
    data: {} as any
  });
  const [originalForm, setOriginalForm] = useState<any>(null);

  const initials = form.name ? form.name.split(' ').map(n => n[0]).join('').toUpperCase() : "U";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchLinkedAccounts();
      const profileInfo = (await fetchProfile()) as any;
      if (profileInfo) {
        setUser(profileInfo.user);
        const formData = {
          name: profileInfo.user.name || "",
          email: profileInfo.user.email || "",
          bio: profileInfo.profile?.bio || profileInfo.user.bio || "",
          socialHandle: profileInfo.profile?.socialHandle || profileInfo.user.socialHandle || "",
          data: profileInfo.profile || {}
        };
        setForm(formData);
        setOriginalForm(formData);

        if (profileInfo.profile) {
          setCategories({
            primaryCategory: profileInfo.profile.primaryCategory || "",
            secondaryCategory: profileInfo.profile.secondaryCategory || "",
            lastCategoryUpdate: profileInfo.profile.lastCategoryUpdate || null,
            categoryVerificationStatus: profileInfo.profile.categoryVerificationStatus || "APPROVED"
          });
        }
      }

      setLoading(false);
    };
    loadData();
  }, []);

    const handleSaveCategories = async () => {
    if (!tempCategories.primaryCategory) {
      toast.error("Primary category is required");
      return;
    }
    setSavingCategories(true);
    try {
      const response = await fetch(getApiUrl("/profile/category"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          primaryCategory: tempCategories.primaryCategory,
          secondaryCategory: tempCategories.secondaryCategory || null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Categories submitted for verification successfully");
        setCategories({
          primaryCategory: data.profile.primaryCategory,
          secondaryCategory: data.profile.secondaryCategory || "",
          lastCategoryUpdate: data.profile.lastCategoryUpdate,
          categoryVerificationStatus: data.profile.categoryVerificationStatus,
        });
        setIsEditingCategories(false);
      } else {
        toast.error(data.message || "Failed to update categories");
      }
    } catch (error) {
      toast.error("An error occurred while saving categories");
    } finally {
      setSavingCategories(false);
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
      console.error("Error fetching accounts:", error);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    if (originalForm) setForm(originalForm);
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
          profileData: { ...form.data, bio: form.bio, socialHandle: form.socialHandle }
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Settings updated successfully");
        setUser(data.user);
        const newFormData = { ...form, name: data.user.name, email: data.user.email };
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
      if (platform.toLowerCase() === 'linkedin') {
        return acc.stats?.fullName ? acc.stats.fullName : "Connected";
      }
    }
    
    return acc ? "Connected" : "Not Linked";
  };

  const socials = [
    { platform: "Instagram", icon: Instagram, color: "text-pink-500" },
    { platform: "Facebook", icon: Facebook, color: "text-blue-600" },
    { platform: "YouTube", icon: Youtube, color: "text-red-500" },
    { platform: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
    { platform: "Telegram", icon: MessageCircle, color: "text-blue-500" },
    { platform: "Twitter/X", icon: Twitter, color: "text-blue-400" },
  ];

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-3xl">
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <Link to="/influencer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors w-fit">
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button onClick={handleEdit} className="bg-accent text-accent-foreground gap-2">
                <Save className="h-4 w-4" /> Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>Cancel</Button>
                <Button className="bg-accent text-accent-foreground gap-2" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {user?.onboarded && (
        <motion.div variants={itemVariants}>
          <Card className="border border-accent/20 bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Star className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Creator Verified</p>
                  <Link to="/onboarding?mode=review" className="text-xs text-accent hover:underline flex items-center gap-1">
                    View Onboarding Summary
                  </Link>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded">Verified</span>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Profile Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={form.name} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-xl font-bold text-accent">{initials}</div>
              )}
              <Button size="sm" variant="outline" className="text-xs h-8" disabled={!isEditing}>Change Photo</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                <Input value={form.name} disabled={!isEditing} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`h-9 text-sm ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <Input value={form.email} disabled={!isEditing} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`h-9 text-sm ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
              <Textarea value={form.bio} disabled={!isEditing} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={`text-sm min-h-[80px] ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

            <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Niche & Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/30">
              <div>
                <p className="text-xs text-muted-foreground">Verification Status</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {categories.categoryVerificationStatus === "PENDING" && (
                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-[10px]">
                      Awaiting Verification
                    </Badge>
                  )}
                  {categories.categoryVerificationStatus === "APPROVED" && (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">
                      Verified & Active
                    </Badge>
                  )}
                  {categories.categoryVerificationStatus === "REJECTED" && (
                    <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-[10px]">
                      Rejected
                    </Badge>
                  )}
                </p>
              </div>
              {categories.lastCategoryUpdate && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {new Date(categories.lastCategoryUpdate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {!isEditingCategories ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Primary Niche Category</p>
                  <p className="text-sm font-bold text-foreground mt-1 capitalize">
                    {categoryOptions.find(o => o.value === categories.primaryCategory)?.label || categories.primaryCategory || "Not Set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Secondary Niche Category</p>
                  <p className="text-sm font-bold text-foreground mt-1 capitalize">
                    {categoryOptions.find(o => o.value === categories.secondaryCategory)?.label || categories.secondaryCategory || "Not Set"}
                  </p>
                </div>
                <div className="sm:col-span-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (categories.lastCategoryUpdate) {
                        const cooldownPeriod = 30 * 24 * 60 * 60 * 1000;
                        const timeElapsed = Date.now() - new Date(categories.lastCategoryUpdate).getTime();
                        if (timeElapsed < cooldownPeriod) {
                          const daysLeft = Math.ceil((cooldownPeriod - timeElapsed) / (24 * 60 * 60 * 1000));
                          toast.error(`Categories are locked. You can edit them again in ${daysLeft} days.`);
                          return;
                        }
                      }
                      setTempCategories({
                        primaryCategory: categories.primaryCategory,
                        secondaryCategory: categories.secondaryCategory
                      });
                      setIsEditingCategories(true);
                    }}
                    className="text-xs h-8 border-accent/20 hover:bg-accent/5 hover:text-accent"
                  >
                    Update Categories
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-xs text-yellow-700 leading-normal">
                  ⚠️ <strong>Note:</strong> Changing your niche categories will reset your status to <strong>Pending</strong> for admin verification, and will lock updates for <strong>30 days</strong>.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">Primary Niche Category *</label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      value={tempCategories.primaryCategory}
                      onChange={(e) => setTempCategories({ ...tempCategories, primaryCategory: e.target.value })}
                    >
                      <option value="">Select Primary Category</option>
                      {categoryOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">Secondary Niche Category</label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      value={tempCategories.secondaryCategory}
                      onChange={(e) => setTempCategories({ ...tempCategories, secondaryCategory: e.target.value })}
                    >
                      <option value="">Select Secondary Category</option>
                      {categoryOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditingCategories(false)} disabled={savingCategories}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground"
                    onClick={handleSaveCategories}
                    disabled={savingCategories}
                  >
                    {savingCategories ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for Verification"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>


      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Connected Social Accounts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {socials.map((s) => (
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
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] gap-1 px-2 py-0.5 rounded-full"><Check className="h-2.5 w-2.5" /> Connected</Badge>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => handleDisconnect(s.platform)} disabled={actionLoading === s.platform}>
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
                  <Button size="sm" variant="outline" className="text-xs h-7 hover:bg-accent hover:text-accent-foreground" onClick={() => handleConnect(s.platform)} disabled={actionLoading === s.platform}>
                    {actionLoading === s.platform ? <Loader2 className="h-3 w-3 animate-spin" /> : "Connect"}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Notification Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {notificationsList.map((n) => (
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
