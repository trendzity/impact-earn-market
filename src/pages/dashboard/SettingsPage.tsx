import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Globe, Loader2, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const SettingsPage = () => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    data: {} as any
  });
  const [originalForm, setOriginalForm] = useState<any>(null);

  useEffect(() => {
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
      </motion.div>
    </div>
  );
};

export default SettingsPage;
