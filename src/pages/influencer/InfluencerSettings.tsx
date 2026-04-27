import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Youtube, Twitter, Check, Loader2, Save, ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

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
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    socialHandle: "",
    data: {} as any
  });
  const [originalForm, setOriginalForm] = useState<any>(null);

  const initials = form.name ? form.name.split(' ').map(n => n[0]).join('').toUpperCase() : "S";

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const profileInfo = await fetchProfile();
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
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

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
            bio: form.bio,
            socialHandle: form.socialHandle
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-3xl">
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <Link 
          to="/influencer" 
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors w-fit"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
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
        <motion.div variants={itemVariants}>
          <Card className="border border-accent/20 bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Star className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Creator Verified</p>
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

      {/* Profile Settings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={form.name} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-xl font-bold text-accent">
                  {initials}
                </div>
              )}
              <Button size="sm" variant="outline" className="text-xs h-8" disabled={!isEditing}>Change Photo</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                <Input 
                  value={form.name} 
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`h-9 text-sm ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} 
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <Input 
                  value={form.email} 
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`h-9 text-sm ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} 
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
              <Textarea 
                value={form.bio} 
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className={`text-sm min-h-[80px] ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} 
              />
            </div>
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
