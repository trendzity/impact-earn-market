import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, User, Lock, Bell, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const ResellerSettings = () => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
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
            companyName: form.companyName
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <Link 
          to="/reseller" 
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors w-fit"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your reseller account settings.</p>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-accent/20 bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Reseller Account Verified</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-accent" /> Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input 
                  value={form.name} 
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`mt-1.5 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} 
                />
              </div>
              <div>
                <Label className="text-sm">Email</Label>
                <Input 
                  value={form.email} 
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`mt-1.5 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} 
                />
              </div>
              <div>
                <Label className="text-sm">Company</Label>
                <Input 
                  value={form.companyName} 
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className={`mt-1.5 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`} 
                />
              </div>
              <Button variant="outline" size="sm" className="mt-4" disabled={!isEditing}>Change Password</Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="h-4 w-4 text-accent" /> Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="mt-1.5" />
                </div>
                <Button variant="outline" className="gap-1.5">
                  <Lock className="h-4 w-4" /> Change Password
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-accent" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Order updates", desc: "New orders and status changes" },
                  { label: "Low balance alerts", desc: "When wallet drops below ₹1,000" },
                  { label: "New client signups", desc: "Via your white-label panel" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResellerSettings;
