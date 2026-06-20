import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Filter,
  DollarSign,
  Sparkles,
  Loader2,
  Users,
} from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

interface Influencer {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  profile: {
    primaryCategory: string;
    secondaryCategory?: string;
    data: {
      bio?: string;
      socialHandle?: string;
    };
  };
  linkedAccounts: Array<{
    platform: string;
    stats?: {
      followersCount?: number;
      subscriberCount?: number;
    };
  }>;
}

const InfluencerDirectory = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Wallet and Deal States
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [sendingDeal, setSendingDeal] = useState(false);

  const [dealForm, setDealForm] = useState({
    title: "",
    description: "",
    instructions: "1. \n2. \n3. ",
    price: "",
  });

  useEffect(() => {
    fetchInfluencers();
    fetchWalletBalance();
  }, [selectedCategory, selectedPlatform]);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (selectedCategory !== "all") queryParams.append("category", selectedCategory);
      if (selectedPlatform !== "all") queryParams.append("platform", selectedPlatform);

      const response = await fetch(getApiUrl(`/brand-deals/influencers?${queryParams.toString()}`), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setInfluencers(data.influencers);
      }
    } catch (error) {
      console.error("Error fetching directory:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const token = getToken();
      const response = await fetch(getApiUrl("/stats/dashboard"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.data?.wallet?.balance || 0);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const handleSendDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInfluencer) return;

    const priceVal = parseFloat(dealForm.price);
    if (isNaN(priceVal) || priceVal <= 0) {
      toast.error("Please enter a valid offer price");
      return;
    }

    // Temporarily disabled for testing
    /*
    if (priceVal > walletBalance) {
      toast.error("Insufficient wallet balance. Please add funds to your wallet first.");
      return;
    }
    */

    try {
      setSendingDeal(true);
      const token = getToken();
      const response = await fetch(getApiUrl("/brand-deals"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          influencerId: selectedInfluencer.id,
          title: dealForm.title,
          description: dealForm.description,
          instructions: dealForm.instructions,
          price: priceVal
        })
      });

      if (response.ok) {
        toast.success("Brand Deal sent to influencer successfully! Funds placed in escrow.");
        setDealModalOpen(false);
        setDealForm({ title: "", description: "", instructions: "1. \n2. \n3. ", price: "" });
        fetchWalletBalance();
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to send deal");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSendingDeal(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p === "instagram") return <Instagram className="h-3.5 w-3.5 text-pink-600" />;
    if (p === "youtube") return <Youtube className="h-3.5 w-3.5 text-red-600" />;
    if (p === "linkedin") return <Linkedin className="h-3.5 w-3.5 text-blue-700" />;
    if (p === "facebook") return <Facebook className="h-3.5 w-3.5 text-blue-800" />;
    return null;
  };

  const getInfluencerReach = (influencer: Influencer) => {
    let total = 0;
    influencer.linkedAccounts.forEach((acc) => {
      total += acc.stats?.followersCount || acc.stats?.subscriberCount || 0;
    });
    return total > 0 ? `${total.toLocaleString()} total reach` : "Connect platform";
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-accent" /> Creator Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Discover influencers and send direct 1-on-1 sponsorship deals</p>
        </div>
        <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-2 text-right">
          <p className="text-xs text-muted-foreground">Available Wallet Escrow</p>
          <p className="text-lg font-bold text-accent">₹{walletBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-muted/20 p-4 rounded-xl border border-border/50">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creator name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchInfluencers()}
            className="pl-9"
          />
        </div>
        
        <div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-background border-border/50">
              <SelectValue placeholder="Category Niche" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tech">Tech & AI</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="forex">Forex & Trading</SelectItem>
              <SelectItem value="food">Food & Cooking</SelectItem>
              <SelectItem value="lifestyle">Lifestyle & Fashion</SelectItem>
              <SelectItem value="beauty">Beauty & Cosmetics</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="fitness">Fitness & Health</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="bg-background border-border/50">
              <SelectValue placeholder="Social Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Influencer Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : influencers.length === 0 ? (
        <div className="py-20 text-center bg-muted/10 border border-dashed rounded-xl">
          <p className="text-muted-foreground text-lg italic">No creators match your active filter search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((creator) => (
            <Card key={creator.id} className="border border-border/50 bg-card/50 hover:shadow-md transition-all hover:border-accent/20 flex flex-col justify-between overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarImage src={creator.profileImage} />
                    <AvatarFallback className="bg-accent/15 text-accent font-bold uppercase">{creator.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground truncate">{creator.name || "Verified Creator"}</h3>
                    <p className="text-xs text-muted-foreground truncate">{creator.profile?.data?.socialHandle || creator.email}</p>
                    <p className="text-[10px] text-accent mt-0.5 font-bold uppercase tracking-tight">{getInfluencerReach(creator)}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">{creator.profile?.data?.bio || "No biography provided."}</p>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {creator.profile?.primaryCategory && (
                    <Badge variant="outline" className="text-[9px] bg-accent/5 text-accent border-accent/20 uppercase font-semibold">
                      {creator.profile.primaryCategory}
                    </Badge>
                  )}
                  {creator.profile?.secondaryCategory && (
                    <Badge variant="outline" className="text-[9px] uppercase font-semibold">
                      {creator.profile.secondaryCategory}
                    </Badge>
                  )}
                </div>

                {creator.linkedAccounts.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1">Platforms:</span>
                    {creator.linkedAccounts.map((acc, index) => (
                      <span key={index} title={acc.platform} className="p-1 rounded bg-muted">
                        {getPlatformIcon(acc.platform)}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    onClick={() => {
                      setSelectedInfluencer(creator);
                      setDealModalOpen(true);
                    }}
                    className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/10 text-xs font-bold"
                  >
                    Direct Sponsorship Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Direct Deal Dialog Modal */}
      {selectedInfluencer && (
        <Dialog open={dealModalOpen} onOpenChange={setDealModalOpen}>
          <DialogContent className="max-w-md bg-background border border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="h-5 w-5 text-accent" /> Offer Sponsorship
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Send a direct sponsorship offer to <strong>{selectedInfluencer.name}</strong>. Funds will be frozen in your wallet as escrow.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendDeal} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="dealTitle" className="text-xs font-semibold opacity-70">Campaign / Offer Title *</Label>
                <Input
                  id="dealTitle"
                  required
                  placeholder="e.g., Forex Trading Video Review"
                  value={dealForm.title}
                  onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dealDesc" className="text-xs font-semibold opacity-70">Brief Description</Label>
                <Textarea
                  id="dealDesc"
                  placeholder="Summarize the product/campaign details..."
                  rows={2}
                  value={dealForm.description}
                  onChange={(e) => setDealForm({ ...dealForm, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dealInst" className="text-xs font-semibold opacity-70">Task Instructions *</Label>
                <Textarea
                  id="dealInst"
                  required
                  placeholder="1. Post an Instagram Reel&#10;2. Link to our Forex broker app&#10;3. Share Reel link and screenshot of analytics"
                  rows={4}
                  className="font-mono text-xs"
                  value={dealForm.instructions}
                  onChange={(e) => setDealForm({ ...dealForm, instructions: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="dealPrice" className="text-xs font-semibold opacity-70">Sponsorship Price (INR) *</Label>
                  <span className="text-[10px] text-muted-foreground">Wallet: ₹{walletBalance.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dealPrice"
                    required
                    type="number"
                    placeholder="₹5000"
                    className="pl-9"
                    value={dealForm.price}
                    onChange={(e) => setDealForm({ ...dealForm, price: e.target.value })}
                  />
                </div>
                {/* Temporarily disabled warning for testing */}
                {/* {dealForm.price && parseFloat(dealForm.price) > walletBalance && (
                  <p className="text-[10px] text-red-500 font-semibold">⚠️ Offer price exceeds your wallet balance. Please add funds first.</p>
                )} */}
              </div>

              <DialogFooter className="pt-4 gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setDealModalOpen(false)}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={sendingDeal}
                  className="bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/10 font-bold"
                >
                  {sendingDeal ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Escrow Offer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InfluencerDirectory;
