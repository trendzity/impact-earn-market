import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { getUser, updateUser, getToken, getApiUrl, fetchProfile } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, UserCircle, Star, Briefcase, ArrowRight, Sparkles } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Form State
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    website: "",
    industry: "",
    bio: "",
    campaignGoal: "",
    socialHandle: "",
    primaryCategory: "",   // New field
    secondaryCategory: "", // New field
  });


  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const initForm = async () => {
      // Fetch latest profile info to ensure form is current
      const profileInfo = await fetchProfile();
      if (profileInfo) {
        const u = profileInfo.user;
        const p = (profileInfo.profile || {}) as any;

        setUser(u); // Update local user state with fresh data from server
        
        // Only set form data if it hasn't been initialized yet to avoid overwriting user typing
        if (!isInitialized) {
            setFormData({
            name: u.name || "",
            email: u.email || "",
            phone: p.phone || "",
            companyName: p.companyName || "",
            website: p.website || "",
            industry: p.industry || "",
            bio: p.bio || "",
            campaignGoal: p.campaignGoal || "",
            socialHandle: p.socialHandle || "",
            primaryCategory: p.primaryCategory || "",   // New field
            secondaryCategory: p.secondaryCategory || "", // New field
          });
          setIsInitialized(true);
        }
      }
    };
    initForm();

    const normalizedRole = user?.role?.toLowerCase();
    if (user?.onboarded && mode !== "review") {
      // Already onboarded and not in review mode, send to their dashboard
      const rolePaths: Record<string, string> = {
        general: "/dashboard",
        business: "/business",
        influencer: "/influencer",
        reseller: "/reseller"
      };
      navigate(rolePaths[normalizedRole || "general"] || "/dashboard");
    }
  }, [user?.id, navigate, mode, isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = getToken();
      const url = getApiUrl("/profile");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: formData })
      });

      
      if (!res.ok) {
        throw new Error("Failed to save profile");
      }
      
      updateUser({ ...formData, onboarded: true } as any);
      toast.success("Profile setup complete!");
      
      const normalizedRole = user?.role?.toLowerCase();
      const rolePaths: Record<string, string> = {
        general: "/dashboard",
        business: "/business",
        influencer: "/influencer",
        reseller: "/reseller"
      };
      navigate(rolePaths[normalizedRole || "general"] || "/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const renderRoleIcon = () => {
    const role = user?.role?.toLowerCase();
    switch(role) {
      case 'business': return <Building2 className="w-6 h-6 text-accent" />;
      case 'influencer': return <Star className="w-6 h-6 text-purple-500" />;
      case 'reseller': return <Briefcase className="w-6 h-6 text-emerald-500" />;
      default: return <UserCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStepTitle = () => {
    const role = user?.role?.toLowerCase();
    switch(role) {
      case 'business': return "About your business";
      case 'influencer': return "Your creator profile";
      case 'reseller': return "Agency details";
      default: return "Complete your profile";
    }
  };

  const getStepSubtitle = () => {
    const role = user?.role?.toLowerCase();
    switch(role) {
      case 'business': return "So we can tailor your campaigns";
      case 'influencer': return "Connect with brands effectively";
      case 'reseller': return "Manage your clients better";
      default: return "Help us personalize your experience";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-8">
          <p className="text-accent text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Step 3 of 5</p>
          <h1 className="text-3xl font-bold font-display">Quick Onboarding</h1>
          <p className="text-muted-foreground text-sm mt-1">Takes less than a minute · core fields required</p>
        </div>

        <Card className="border-border/50 shadow-2xl glass-card overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                {renderRoleIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{getStepTitle()}</h2>
                <p className="text-sm text-muted-foreground">{getStepSubtitle()}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold opacity-70">Full Name *</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    readOnly 
                    className="bg-muted/50 border-white/5 cursor-not-allowed opacity-80" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold opacity-70">Email Address *</Label>
                  <Input 
                    id="email" 
                    value={formData.email} 
                    readOnly 
                    className="bg-muted/50 border-white/5 cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              {/* Role Specific Fields */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                {user.role === 'general' && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      placeholder="+91 XXXXX XXXXX" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                )}

                {(user.role === 'business' || user.role === 'reseller') && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">{user.role === 'business' ? 'Company Name *' : 'Agency Name *'}</Label>
                      <Input 
                        id="companyName" 
                        placeholder={user.role === 'business' ? 'e.g. FreshStyle Co.' : 'e.g. SMM Hub India'} 
                        required 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry *</Label>
                        <select 
                          id="industry"
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                          value={formData.industry}
                          onChange={(e) => setFormData({...formData, industry: e.target.value})}
                        >
                          <option value="">Select industry</option>
                          <option value="ecommerce">E-commerce</option>
                          <option value="saas">SaaS</option>
                          <option value="agency">Agency</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          placeholder="https://yourbrand.com" 
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                        />
                      </div>
                    </div>
                    {user.role === 'business' && (
                      <div className="space-y-2">
                        <Label htmlFor="goal">Primary campaign goal</Label>
                        <textarea 
                          id="goal" 
                          placeholder="e.g. Grow Instagram followers, drive app installs..." 
                          className="min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent outline-none"
                          value={formData.campaignGoal}
                          onChange={(e) => setFormData({...formData, campaignGoal: e.target.value})}
                        />
                      </div>
                    )}
                  </>
                )}

                                {user.role === 'influencer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="socialHandle">Primary Social Handle *</Label>
                      <Input 
                        id="socialHandle" 
                        placeholder="@yourhandle" 
                        required 
                        value={formData.socialHandle}
                        onChange={(e) => setFormData({...formData, socialHandle: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryCategory">Primary Niche Category *</Label>
                        <select 
                          id="primaryCategory"
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent outline-none"
                          required
                          value={formData.primaryCategory}
                          onChange={(e) => setFormData({...formData, primaryCategory: e.target.value})}
                        >
                          <option value="">Select Primary Category</option>
                          <option value="tech">Tech & AI</option>
                          <option value="finance">Finance</option>
                          <option value="forex">Forex & Trading</option>
                          <option value="food">Food & Cooking</option>
                          <option value="lifestyle">Lifestyle & Fashion</option>
                          <option value="beauty">Beauty & Cosmetics</option>
                          <option value="gaming">Gaming</option>
                          <option value="travel">Travel</option>
                          <option value="fitness">Fitness & Health</option>
                          <option value="education">Education</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondaryCategory">Secondary Niche Category (Optional)</Label>
                        <select 
                          id="secondaryCategory"
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent outline-none"
                          value={formData.secondaryCategory}
                          onChange={(e) => setFormData({...formData, secondaryCategory: e.target.value})}
                        >
                          <option value="">Select Secondary Category</option>
                          <option value="tech">Tech & AI</option>
                          <option value="finance">Finance</option>
                          <option value="forex">Forex & Trading</option>
                          <option value="food">Food & Cooking</option>
                          <option value="lifestyle">Lifestyle & Fashion</option>
                          <option value="beauty">Beauty & Cosmetics</option>
                          <option value="gaming">Gaming</option>
                          <option value="travel">Travel</option>
                          <option value="fitness">Fitness & Health</option>
                          <option value="education">Education</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea 
                        id="bio" 
                        placeholder="e.g. Tell brands what kind of content you create..." 
                        className="min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent outline-none"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto px-12 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Continue"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </div>
          <div className="p-4 bg-muted/20 border-t border-white/5 flex items-center gap-2 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] text-muted-foreground">You can edit these details anytime from Settings.</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Onboarding;
