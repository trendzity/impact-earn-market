import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Globe, Youtube, Instagram, Facebook, Star, Users, Eye, Video, ExternalLink, ShieldCheck, Mail, Linkedin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { getUser, fetchProfile, getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const BusinessProfile = () => {
  const [user] = useState(getUser());
  const [profileData, setProfileData] = useState<any>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const warning = searchParams.get("warning");
    
    if (success === "youtube_connected") {
      toast.success("YouTube channel connected successfully!");
    }
    if (success === "linkedin_connected") {
      toast.success("LinkedIn account connected successfully!");
    }
    if (warning === "stats_delayed") {
      toast.info("Channel connected! Stats are being fetched and will appear shortly.");
    }

    const loadData = async () => {
      setLoading(true);
      const profile = await fetchProfile();
      if (profile) setProfileData(profile.profile);

      try {
        const token = getToken();
        if (token) {
          const response = await fetch(getApiUrl("/auth/linked-accounts"), {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setLinkedAccounts(data);
          }
        }
      } catch (error) {
        console.error("Error fetching linked accounts:", error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const youtubeAccount = linkedAccounts.find(acc => acc.platform === "youtube");
  const ytStats = youtubeAccount?.stats;

  const instagramAccount = linkedAccounts.find(acc => acc.platform === "instagram");
  const igStats = instagramAccount?.stats;

  const facebookAccount = linkedAccounts.find(acc => acc.platform === "facebook");
  const fbStats = facebookAccount?.stats;

  const linkedinAccount = linkedAccounts.find(acc => acc.platform === "linkedin");
  const liStats = linkedinAccount?.stats;

  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseInt(num) : num;
    if (isNaN(n)) return "0";
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 max-w-5xl">
      {/* Header Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-card border border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-50" />
        <div className="p-8 relative flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="h-32 w-32 rounded-3xl bg-accent/10 border-2 border-accent/20 flex items-center justify-center overflow-hidden shrink-0 shadow-xl">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.companyName} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-14 w-14 text-accent" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-display font-bold text-foreground">
                {profileData?.companyName || user?.companyName || user?.name}
              </h1>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1 rounded-full gap-1">
                <ShieldCheck className="h-3 w-3" /> Brand Verified
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground mb-4">
              {profileData?.website && (
                <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                  <Globe className="h-4 w-4" /> {profileData.website.replace(/^https?:\/\//, '')} <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> {user?.email}
              </div>
            </div>
            
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {profileData?.bio || "Official brand account on Trendzity. Connect with top-tier influencers and grow your presence across multiple social platforms."}
            </p>
          </div>
          
          <Link to="/business/settings">
            <Button variant="outline" className="rounded-xl px-6">Edit Profile</Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Social Presence */}
        <div className="lg:col-span-2 space-y-6">
          {/* YouTube Stats */}
          {youtubeAccount ? (
            <motion.div variants={itemVariants}>
              <Card className="border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Youtube className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold uppercase tracking-widest">{ytStats?.channelName || 'YouTube Channel'}</CardTitle>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Verified Official Channel</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Active</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-3 divide-x divide-border/50">
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase">Subs</span>
                      </div>
                      <p className="text-2xl font-black text-foreground">{formatNumber(ytStats?.subscribers || 0)}</p>
                    </div>
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                        <Eye className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase">Views</span>
                      </div>
                      <p className="text-2xl font-black text-foreground">{formatNumber(ytStats?.views || 0)}</p>
                    </div>
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                        <Video className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase">Videos</span>
                      </div>
                      <p className="text-2xl font-black text-foreground">{formatNumber(ytStats?.videos || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="border-dashed border-2 bg-muted/20">
                <CardContent className="p-10 text-center flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                    <Youtube className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Link your YouTube</h3>
                    <p className="text-sm text-muted-foreground mt-1">Connect your official channel to display metrics on your profile.</p>
                  </div>
                  <Link to="/business/settings">
                    <Button variant="outline" size="sm">Connect Channel</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Instagram Stats */}
          {instagramAccount ? (
            <motion.div variants={itemVariants}>
              <Card className="border border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                      <Instagram className="h-6 w-6 text-pink-500" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold uppercase tracking-widest">@{igStats?.username || 'Instagram'}</CardTitle>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Business Account Insights</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-pink-500/10 text-pink-600 border-pink-500/20">Active</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x divide-border/50">
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase">Followers</span>
                      </div>
                      <p className="text-2xl font-black text-foreground">{formatNumber(igStats?.followersCount || 0)}</p>
                    </div>
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                        <Video className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase">Media</span>
                      </div>
                      <p className="text-2xl font-black text-foreground">{formatNumber(igStats?.mediaCount || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="border border-pink-500/10 bg-muted/10 opacity-60">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                      <Instagram className="h-6 w-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Instagram Integration</h3>
                      <p className="text-xs text-muted-foreground">Connect in settings to show metrics</p>
                    </div>
                  </div>
                  <Link to="/business/settings">
                    <Button variant="ghost" size="sm" className="text-xs">Connect</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Facebook Stats */}
          {facebookAccount ? (
            <motion.div variants={itemVariants}>
              <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                      <Facebook className={`h-6 w-6 text-blue-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold uppercase tracking-widest">{fbStats?.pageName || 'Facebook Page'}</CardTitle>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Facebook Page Insights</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Active</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x divide-border/50">
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase">Followers</span>
                      </div>
                      <p className="text-2xl font-black text-foreground">{formatNumber(fbStats?.followersCount || 0)}</p>
                    </div>
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                        <Star className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase">Likes</span>
                      </div>
                      <p className="text-2xl font-black text-foreground">{formatNumber(fbStats?.likesCount || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="border border-blue-500/10 bg-muted/10 opacity-60">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <Facebook className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Facebook Integration</h3>
                      <p className="text-xs text-muted-foreground">Connect in settings to show metrics</p>
                    </div>
                  </div>
                  <Link to="/business/settings">
                    <Button variant="ghost" size="sm" className="text-xs">Connect</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* LinkedIn Stats */}
          {linkedinAccount ? (
            <motion.div variants={itemVariants}>
              <Card className="border border-blue-700/20 bg-gradient-to-br from-blue-700/5 to-transparent overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-700/10 flex items-center justify-center">
                      <Linkedin className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold uppercase tracking-widest">{liStats?.fullName || 'LinkedIn Profile'}</CardTitle>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{liStats?.headline || 'LinkedIn Account'}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-700/10 text-blue-700 border-blue-700/20">Active</Badge>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">{liStats?.email || 'Account connected successfully'}</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="border border-blue-700/10 bg-muted/10 opacity-60">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-700/10 flex items-center justify-center">
                      <Linkedin className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">LinkedIn Integration</h3>
                      <p className="text-xs text-muted-foreground">Connect in settings to show metrics</p>
                    </div>
                  </div>
                  <Link to="/business/settings">
                    <Button variant="ghost" size="sm" className="text-xs">Connect</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Column: Company Info */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent" /> Campaign Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Campaigns</span>
                  <span className="text-sm font-bold text-foreground">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Influencer Reach</span>
                  <span className="text-sm font-bold text-foreground">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Engagement</span>
                  <span className="text-sm font-bold text-foreground">0</span>
                </div>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl mt-2">
                  Create New Campaign
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Platform Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <p className="text-xs text-muted-foreground">Account active since {new Date(user?.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <p className="text-xs text-muted-foreground">Profile 100% Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessProfile;
