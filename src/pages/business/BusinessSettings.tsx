import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, Upload, Loader2, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const BusinessSettings = () => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    website: "",
    data: {} as any
  });
  const [originalForm, setOriginalForm] = useState<any>(null);

  useEffect(() => {
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
    </motion.div>
  );
};

export default BusinessSettings;
