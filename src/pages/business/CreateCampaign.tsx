import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Rocket, Loader2, Wand2, Image as ImageIcon, CheckCircle2,
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Video,
  Youtube, Play, Sparkles, Linkedin, Instagram, Facebook, Twitter
} from "lucide-react";
import { getToken, getApiUrl, getServerUrl } from "@/utils/auth";
import { toast } from "sonner";

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "1. \n2. \n3. ",
    platform: "instagram",
    objective: "engagement",
    link: "",
    budget: "",
    reward: "",
    totalLimit: "100",
    imageUrl: "",
    videoUrl: "",         // Full URL for browser preview
    videoLocalPath: "",  // Local path for YouTube upload
    isSocialSync: false,
    publishToYouTube: false,
    isLinkedInSync: false,
    hashtags: "",
  });

  const [suggestingHashtags, setSuggestingHashtags] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);

  // Fetch linked accounts to show status in multichannel promo
  const fetchLinkedAccounts = async () => {
    try {
      setFetchingAccounts(true);
      const token = getToken();
      const response = await fetch(getApiUrl("/auth/linked-accounts"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLinkedAccounts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching linked accounts:", err);
    } finally {
      setFetchingAccounts(false);
    }
  };

  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  const handleSuggestHashtags = async () => {
    if (!formData.description) return;
    
    try {
      setSuggestingHashtags(true);
      const token = getToken();
      const response = await fetch(getApiUrl("/campaigns/suggest-hashtags"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ description: formData.description })
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, hashtags: data.hashtags }));
        toast.success("AI Hashtags suggested!");
      }
    } catch (err) {
      console.error("Error suggesting hashtags:", err);
    } finally {
      setSuggestingHashtags(false);
    }
  };

  // ── AI Image Generation ──────────────────────────────────────────
  const handleGenerateAI = async () => {
    if (!formData.description) {
      toast.error("Please provide a social caption first to guide the AI");
      return;
    }

    try {
      setGeneratingAI(true);
      const token = getToken();
      
      const response = await fetch(getApiUrl("/campaigns/generate-image"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: formData.description }),
      });

      if (response.ok) {
        const data = await response.json();
        // The backend returns a relative URL like /images/ai-img-xxx.jpg
        // We need the root server URL for the preview (not the /api path)
        const fullUrl = getServerUrl(data.url);
        setFormData(prev => ({ ...prev, imageUrl: fullUrl, videoUrl: "" }));
        toast.success("AI Image generated successfully!");
      } else {
        const error = await response.json();
        toast.error(`Failed to generate AI Image: ${error.message}`);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("An error occurred during image generation.");
    } finally {
      setGeneratingAI(false);
    }
  };

  // ── AI Video Generation ──────────────────────────────────────────
  const handleGenerateVideo = async () => {
    if (!formData.description) {
      toast.error("Please provide a description first to guide the AI Video");
      return;
    }

    try {
      setGeneratingVideo(true);
      const token = getToken();

      const response = await fetch(getApiUrl("/video/generate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: formData.description }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          videoUrl: data.videoUrl,         // Full URL for preview
          videoLocalPath: data.localPath,  // Local path for YouTube upload
          imageUrl: "",
        }));
        toast.success("AI Video generated! Review it before launching.");
      } else {
        toast.error("Failed to generate AI Video. Try again.");
      }
    } catch (error) {
      console.error("Error generating video:", error);
      toast.error("An error occurred during video generation.");
    } finally {
      setGeneratingVideo(false);
    }
  };

  // ── Campaign Submit ──────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!formData.title || !formData.budget || !formData.reward) {
      toast.error("Please fill in basic details (Title, Budget, Reward)");
      return;
    }
    if (!formData.isSocialSync && !formData.link) {
      toast.error("A target link is required if Social Sync is disabled");
      return;
    }
    if (formData.isSocialSync && !formData.imageUrl && !formData.videoUrl) {
      toast.error("An image or video is required for Social Media Sync.");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      // Step 1: Create the campaign
      const response = await fetch(getApiUrl("/campaigns"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to launch campaign");
        return;
      }

      // Step 2: If YouTube publish is enabled, upload the video
      if (formData.publishToYouTube && formData.videoUrl) {
        toast.loading("Uploading video to YouTube... ⏳", { id: "yt-upload" });

        const ytResponse = await fetch(getApiUrl("/video/publish-youtube"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            videoUrl: formData.videoLocalPath || formData.videoUrl, // prefer local path
            title: formData.title,
            description: formData.description,
          }),
        });

      }
      
      if (!formData.publishToYouTube) {
        toast.success(formData.isSocialSync ? "Campaign launched & published to Social! 🚀" : "Campaign launched successfully!");
      }

      navigate("/business/campaigns");
    } catch (error) {
      console.error("Error launching campaign:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Derived state helpers ────────────────────────────────────────
  const hasMedia = formData.imageUrl || formData.videoUrl;
  const isGenerating = generatingAI || generatingVideo;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Left Column: Form ─────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="space-y-6 flex-1 w-full"
        >
          {/* Header */}
          <motion.div variants={item}>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 px-3 py-1">Business Studio</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Create Campaign</h1>
            <p className="text-sm text-muted-foreground mt-1">Design, generate visuals, and launch to social media in one click.</p>
          </motion.div>

          {/* Campaign Details Card */}
          <motion.div variants={item}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4 bg-muted/30 border-b border-border/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-accent" /> Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {/* Campaign Name */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Campaign Name *</Label>
                  <Input
                    placeholder="e.g., Summer Collection Launch"
                    value={formData.title}
                    className="bg-background/50 border-border/50 focus:border-accent/50 transition-all"
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                {/* Platform & Objective */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform *</Label>
                    <Select value={formData.platform} onValueChange={(v) => setFormData(prev => ({ ...prev, platform: v }))}>
                      <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Select platform" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-sm bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                              <Instagram className="h-2.5 w-2.5 text-white" />
                            </span>
                            Instagram
                          </span>
                        </SelectItem>
                        <SelectItem value="facebook">
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-sm bg-blue-600 flex items-center justify-center">
                              <Facebook className="h-2.5 w-2.5 text-white" />
                            </span>
                            Facebook
                          </span>
                        </SelectItem>
                        <SelectItem value="telegram">
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-sm bg-sky-500 flex items-center justify-center">
                              <Send className="h-2.5 w-2.5 text-white" />
                            </span>
                            Telegram
                          </span>
                        </SelectItem>
                        <SelectItem value="youtube">
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-sm bg-red-600 flex items-center justify-center">
                              <Youtube className="h-2.5 w-2.5 text-white" />
                            </span>
                            YouTube
                          </span>
                        </SelectItem>
                        <SelectItem value="linkedin">
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-sm bg-blue-700 flex items-center justify-center">
                              <Linkedin className="h-2.5 w-2.5 text-white" />
                            </span>
                            LinkedIn
                          </span>
                        </SelectItem>
                        <SelectItem value="twitter">
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-sm bg-black flex items-center justify-center">
                              <Twitter className="h-2.5 w-2.5 text-white" />
                            </span>
                            X (Twitter)
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Objective *</Label>
                    <Select value={formData.objective} onValueChange={(v) => setFormData(prev => ({ ...prev, objective: v }))}>
                      <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Select objective" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engagement">Post Engagement</SelectItem>
                        <SelectItem value="followers">Page Followers</SelectItem>
                        <SelectItem value="views">Video Views</SelectItem>
                        <SelectItem value="traffic">Website Traffic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Caption */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Social Media Caption *</Label>
                  <Textarea
                    placeholder="This text will appear on your social post and also guides the AI to generate matching visuals..."
                    rows={3}
                    value={formData.description}
                    className="bg-background/50 border-border/50 min-h-[80px]"
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hashtags</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[10px] gap-1 text-accent hover:text-accent hover:bg-accent/10 px-2"
                      onClick={handleSuggestHashtags}
                      disabled={suggestingHashtags || !formData.description}
                    >
                      {suggestingHashtags ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Sparkles className="h-2.5 w-2.5" />}
                      Suggest
                    </Button>
                  </div>
                  <Input
                    placeholder="e.g., #AI #Marketing #Trendzity"
                    value={formData.hashtags}
                    className="bg-background/50 border-border/50 focus:border-accent/50 transition-all"
                    onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.value }))}
                  />
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Task Instructions *</Label>
                  <Textarea
                    placeholder="1. Like the post&#10;2. Comment 'Awesome!'&#10;3. Upload screenshot"
                    rows={4}
                    value={formData.instructions}
                    className="bg-background/50 border-border/50 min-h-[100px] font-mono text-sm"
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  />
                  <p className="text-[10px] text-muted-foreground italic">List the numbered steps for the influencer to follow.</p>
                </div>

                {/* ── AI Creative Section ── */}
                <div className="space-y-3 pt-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                    Campaign Creative
                    <span className="text-[10px] normal-case font-normal text-muted-foreground">Image or Video</span>
                  </Label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button
                      type="button"
                      className="bg-[#ef4444] hover:bg-[#dc2626] text-white h-[42px] gap-1.5 shadow-lg shadow-red-500/10 text-xs border-none"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <ImageIcon className="h-3.5 w-3.5" /> Image
                    </Button>
                    <Input 
                      id="image-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/jpg" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("Image too large! Maximum size is 5MB.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, imageUrl: reader.result as string, videoUrl: "" }));
                            toast.success("Image uploaded!");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    <Button
                      type="button"
                      className="bg-[#ef4444] hover:bg-[#dc2626] text-white h-[42px] gap-1.5 shadow-lg shadow-red-500/10 text-xs border-none"
                      onClick={() => document.getElementById('video-upload')?.click()}
                    >
                      <Video className="h-3.5 w-3.5" /> Video
                    </Button>
                    <Input 
                      id="video-upload" 
                      type="file" 
                      className="hidden" 
                      accept="video/mp4, video/quicktime, video/x-msvideo" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 20 * 1024 * 1024) {
                            toast.error("Video too large! Maximum size is 20MB.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, videoUrl: reader.result as string, imageUrl: "" }));
                            toast.success("Video uploaded!");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    <Button
                      type="button"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white h-[42px] gap-1.5 shadow-lg shadow-purple-500/10 text-xs col-span-1"
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                    >
                      {generatingAI ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                      AI Image
                    </Button>

                    <Button
                      type="button"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-[42px] gap-1.5 shadow-lg shadow-blue-500/10 text-xs col-span-1"
                      onClick={handleGenerateVideo}
                      disabled={isGenerating}
                    >
                      {generatingVideo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Video className="h-3.5 w-3.5" />}
                      AI Video
                    </Button>
                  </div>

                  <AnimatePresence>
                    {isGenerating && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20 mb-3"
                      >
                        <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                        <span className="text-xs text-accent font-medium">
                          {generatingVideo
                            ? "AI is rendering your video... This may take 1-3 minutes."
                            : "AI is generating your image..."}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <p className="text-[10px] text-muted-foreground">
                        <strong className="text-foreground">Images:</strong> Max 5MB. High-quality JPG or PNG recommended.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <p className="text-[10px] text-muted-foreground">
                        <strong className="text-foreground">Videos:</strong> Max 20MB. Supports MP4, MOV, and AVI. Optimized for Social Reels/Shorts.
                      </p>
                    </div>
                  </div>

                  {formData.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-border/50 aspect-video group">
                      <div className="relative w-full h-full bg-muted animate-pulse flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        <img 
                          key={formData.imageUrl} 
                          src={formData.imageUrl} 
                          alt="Creative" 
                          className="absolute inset-0 w-full h-full object-cover" 
                          onLoad={(e) => {
                            (e.target as HTMLImageElement).parentElement?.classList.remove('animate-pulse');
                            (e.target as HTMLImageElement).classList.add('opacity-100');
                          }}
                          onError={() => toast.error("Failed to load creative preview. Try a different prompt.")}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <Button variant="secondary" size="sm" onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}>Remove</Button>
                      </div>
                    </div>
                  )}

                  {formData.videoUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-accent/30 aspect-video group">
                      <video src={formData.videoUrl} controls className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Button variant="destructive" size="sm" onClick={() => setFormData(prev => ({ ...prev, videoUrl: "" }))}>Remove</Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Publish Toggles ── */}
                <div className="space-y-3">
                  {/* Primary Social Sync Toggle */}
                  <div className={`rounded-xl border transition-all overflow-hidden ${
                    formData.platform === 'youtube' ? 'border-red-500/20 bg-red-500/5' :
                    formData.platform === 'linkedin' ? 'border-blue-700/20 bg-blue-700/5' :
                    formData.platform === 'facebook' ? 'border-blue-600/20 bg-blue-600/5' :
                    formData.platform === 'instagram' ? 'border-pink-500/20 bg-pink-500/5' :
                    'border-accent/20 bg-accent/5'
                  }`}>
                    <div className="flex items-center justify-between p-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-bold flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent" /> Social Media Sync
                        </Label>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-tight">
                          {formData.platform === 'youtube' && <Youtube className="h-3 w-3 inline mr-1 text-red-500" />}
                          {formData.platform === 'linkedin' && <Linkedin className="h-3 w-3 inline mr-1 text-blue-700" />}
                          {formData.platform === 'facebook' && <Facebook className="h-3 w-3 inline mr-1 text-blue-600" />}
                          {formData.platform === 'instagram' && <Instagram className="h-3 w-3 inline mr-1 text-pink-500" />}
                          Auto-publish to {formData.platform} and generate target link.
                        </p>
                      </div>
                      <Switch
                        checked={formData.isSocialSync}
                        onCheckedChange={(v) => setFormData(prev => ({ ...prev, isSocialSync: v }))}
                      />
                    </div>
                    {formData.isSocialSync && (
                      <div className={`mx-4 mb-4 flex items-start gap-2 p-3 rounded-lg text-[11px] font-medium ${
                        formData.platform === 'youtube' ? 'bg-red-500/10 text-red-700 border border-red-500/20' :
                        formData.platform === 'linkedin' ? 'bg-blue-700/10 text-blue-700 border border-blue-700/20' :
                        formData.platform === 'facebook' ? 'bg-blue-600/10 text-blue-600 border border-blue-600/20' :
                        formData.platform === 'instagram' ? 'bg-pink-500/10 text-pink-700 border border-pink-500/20' :
                        'bg-accent/10 text-accent border border-accent/20'
                      }`}>
                        <span className="mt-0.5 flex-shrink-0">
                          {formData.platform === 'youtube' && <Youtube className="h-3.5 w-3.5" />}
                          {formData.platform === 'linkedin' && <Linkedin className="h-3.5 w-3.5" />}
                          {formData.platform === 'facebook' && <Facebook className="h-3.5 w-3.5" />}
                          {formData.platform === 'instagram' && <Instagram className="h-3.5 w-3.5" />}
                          {!['youtube','linkedin','facebook','instagram'].includes(formData.platform) && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </span>
                        <span>
                          📢 <strong>Note:</strong> This campaign will be posted <strong>only on {formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1)}</strong>. The generated post link will be the target for <strong>influencers & general users</strong> on this platform only. A <strong>single task</strong> will be created for this platform.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Multichannel Cross-posting */}
                  <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-accent" /> Multichannel Promo
                        </Label>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-tight">Cross-post this campaign across all linked accounts simultaneously.</p>
                      </div>
                      <Switch
                        checked={formData.isLinkedInSync}
                        onCheckedChange={(v) => setFormData(prev => ({ ...prev, isLinkedInSync: v }))}
                      />
                    </div>
                    {formData.isLinkedInSync && (() => {
                      const allPlatforms = [
                        { name: 'Instagram', id: 'instagram' },
                        { name: 'Facebook', id: 'facebook' },
                        { name: 'LinkedIn', id: 'linkedin' }
                      ];
                      const selected = formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1);
                      const remaining = allPlatforms.filter(p => p.id !== formData.platform.toLowerCase());

                      const getStatusIcon = (platformId: string) => {
                        const isConnected = linkedAccounts.some(acc => acc.platform?.toLowerCase() === platformId?.toLowerCase());
                        return isConnected ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] h-4 px-1.5 font-bold">READY</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 text-[9px] h-4 px-1.5 font-bold">NOT CONNECTED</Badge>
                        );
                      };

                      // Case 1: Social Sync is OFF — all 3 channels post simultaneously with no primary
                      if (!formData.isSocialSync) {
                        return (
                          <div className="mx-4 mb-4 space-y-3">
                            <div className="flex items-start gap-2 p-3 rounded-lg text-[11px] font-medium bg-green-500/10 text-green-700 border border-green-500/20">
                              <Sparkles className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                              <span>
                                🌐 <strong>Multichannel Note:</strong> This campaign will be posted to <strong>all channels — Instagram, Facebook & LinkedIn — simultaneously</strong>. <strong>3 separate tasks</strong> will be created.
                              </span>
                            </div>
                            <div className="grid grid-cols-1 gap-1.5 px-1">
                              {allPlatforms.map(p => (
                                <div key={p.id} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
                                  <span className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                                    {p.id === 'instagram' && <Instagram className="h-3 w-3" />}
                                    {p.id === 'facebook' && <Facebook className="h-3 w-3" />}
                                    {p.id === 'linkedin' && <Linkedin className="h-3 w-3" />}
                                    {p.name}
                                  </span>
                                  {getStatusIcon(p.id)}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      // Case 2: Social Sync is ON — primary platform + remaining channels
                      return (
                        <div className="mx-4 mb-4 space-y-3">
                          <div className="flex items-start gap-2 p-3 rounded-lg text-[11px] font-medium bg-accent/10 text-accent border border-accent/20">
                            <Sparkles className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                            <span>
                              🌐 <strong>Multichannel Note:</strong> Primary post will go to <strong>{selected}</strong> via Social Sync. The remaining channels — <strong>{remaining.map(r => r.name).join(' & ')}</strong> — will also be posted <strong>simultaneously</strong>.
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-1.5 px-1">
                            <div className="flex items-center justify-between py-1 border-b border-border/30">
                              <span className="text-[10px] uppercase font-bold flex items-center gap-1.5 text-accent">
                                {formData.platform === 'instagram' && <Instagram className="h-3 w-3" />}
                                {formData.platform === 'facebook' && <Facebook className="h-3 w-3" />}
                                {formData.platform === 'linkedin' && <Linkedin className="h-3 w-3" />}
                                {selected} (Primary)
                              </span>
                              {getStatusIcon(formData.platform.toLowerCase())}
                            </div>
                            {remaining.map(p => (
                              <div key={p.id} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
                                <span className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                                  {p.id === 'instagram' && <Instagram className="h-3 w-3" />}
                                  {p.id === 'facebook' && <Facebook className="h-3 w-3" />}
                                  {p.id === 'linkedin' && <Linkedin className="h-3 w-3" />}
                                  {p.name}
                                </span>
                                {getStatusIcon(p.id)}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {!formData.isSocialSync && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 pt-2"
                  >
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Manual Target Link *</Label>
                    <Input
                      placeholder="https://your-social-post-link.com"
                      value={formData.link}
                      className="bg-background/50 border-border/50 focus:border-accent/50"
                      onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    />
                    <p className="text-[10px] text-muted-foreground italic">Paste the link to your existing social media post here.</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget Card */}
          <motion.div variants={item}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4 bg-muted/30 border-b border-border/50">
                <CardTitle className="text-sm font-semibold">Budget & Rewards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reward per Task (₹) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 10"
                      value={formData.reward}
                      className="bg-background/50 border-border/50"
                      onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Budget (₹) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.budget}
                      className="bg-background/50 border-border/50"
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Max Participants</Label>
                  <Input
                    type="number"
                    value={formData.totalLimit}
                    className="bg-background/50 border-border/50"
                    onChange={(e) => setFormData(prev => ({ ...prev, totalLimit: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Launch Button */}
          <motion.div variants={item} className="pt-2">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white h-[50px] text-base font-semibold shadow-xl shadow-red-500/20 gap-2 border-none"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
              {formData.publishToYouTube
                ? "Launch & Publish to YouTube 🎬"
                : formData.isSocialSync
                  ? "Launch & Publish to Social"
                  : "Launch Internal Campaign"}
            </Button>
          </motion.div>
        </motion.div>

        {/* ── Right Column: Live Preview ────────────────────────── */}
        <div className="lg:sticky lg:top-24 w-full lg:w-[380px] space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Live Preview</h2>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold">Real-time</Badge>
            </div>

            {/* Phone Mockup */}
            <div className="bg-card border border-border shadow-2xl rounded-[32px] overflow-hidden max-w-[320px] mx-auto ring-8 ring-muted/50 border-muted-foreground/20">
              {/* Header */}
              <div className="bg-card px-4 py-3 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-card border-2 border-card flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col -space-y-0.5">
                    <span className="text-[11px] font-bold">YourBusiness</span>
                    <span className="text-[9px] text-muted-foreground">Sponsored</span>
                  </div>
                </div>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Mockup Media */}
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden relative">
                {formData.videoUrl ? (
                  <video
                    src={formData.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : formData.imageUrl ? (
                  <div className="relative w-full h-full bg-muted animate-pulse">
                    <img
                      key={formData.imageUrl}
                      src={formData.imageUrl}
                      alt="Social Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      onLoad={(e) => {
                        (e.target as HTMLImageElement).parentElement?.classList.remove('animate-pulse');
                      }}
                      referrerPolicy="no-referrer"
                      onError={() => toast.error("Image failed to load. Try a different prompt.")}
                    />
                  </div>
                ) : isGenerating ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <span className="text-[10px] font-medium text-muted-foreground animate-pulse">
                      {generatingVideo ? "Rendering Video..." : "Generating Image..."}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground px-8 text-center">
                    <Play className="h-10 w-10 opacity-20" />
                    <p className="text-[10px] font-medium opacity-40">Your creative will appear here</p>
                  </div>
                )}

                {/* YouTube badge overlay on video */}
                {formData.videoUrl && formData.publishToYouTube && (
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1.5">
                    <Youtube className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                    <span className="text-[9px] text-white font-medium">Will be published to YouTube</span>
                  </div>
                )}
              </div>

              {/* Mockup Interactions */}
              <div className="px-3 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5" />
                    <MessageCircle className="h-5 w-5" />
                    <Send className="h-5 w-5" />
                  </div>
                  <Bookmark className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold">942 likes</p>
                  <p className="text-[11px] leading-relaxed line-clamp-3">
                    <span className="font-bold mr-1.5">YourBusiness</span>
                    {formData.description || "Your campaign description will appear here..."}
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Strategy tip */}
          <Card className="border-border/50 bg-accent/5 border-dashed">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-accent font-semibold text-xs">
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">i</Badge>
                Campaign Strategy
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Use <strong>AI Video</strong> for YouTube campaigns for the best engagement.
                Enable <strong>YouTube Publish</strong> to auto-upload directly to your channel.
                Enable <strong>Social Sync</strong> for Instagram/Facebook posting.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
