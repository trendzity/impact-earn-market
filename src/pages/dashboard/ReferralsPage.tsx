import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Copy, Share2, Gift, UserPlus, TrendingUp, Loader2, ExternalLink, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";
import { format } from "date-fns";

const ReferralsPage = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBonus, setTotalBonus] = useState(0);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      const walletRes = await fetch(getApiUrl("/wallet/my"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const walletData = await walletRes.json();
      
      const referralRes = await fetch(getApiUrl("/wallet/my/referrals"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const referralData = await referralRes.json();

      if (walletData.success) setWallet(walletData.wallet);
      if (referralData.success) {
        setReferrals(referralData.referrals);
        setTotalBonus(referralData.totalBonus);
      }
    } catch (error) {
      toast.error("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const referralCode = wallet?.user?.referralCode || "LOADING...";
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Trendzity',
          text: `Join me on Trendzity and start earning! Use my code: ${referralCode}`,
          url: referralLink,
        });
      } catch (err) {
        handleCopy(referralLink, "Link");
      }
    } else {
      handleCopy(referralLink, "Link");
    }
  };

  const referralStats = [
    { label: "Total Referrals", value: referrals.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Bonus Earned", value: `₹${totalBonus}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { label: "Wallet Balance", value: `₹${Number(wallet?.balance || 0).toLocaleString()}`, icon: Gift, color: "text-accent", bg: "bg-accent/10" },
  ];

  if (loading && !wallet) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-muted-foreground animate-pulse font-display">Loading your referral network...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">Referral Program</h1>
        <p className="text-sm text-muted-foreground mt-1">Invite your network and earn ₹100 for every successful join.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="h-full border-2 border-accent/20 bg-gradient-to-br from-accent/5 via-transparent to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Share Your Link</h3>
                  <p className="text-xs text-muted-foreground">Get rewarded when they sign up and complete a task.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Your Invite Link</label>
                  <div className="flex gap-2">
                    <Input value={referralLink} readOnly className="bg-background/50 font-medium text-sm h-11" />
                    <Button variant="secondary" className="h-11 px-4" onClick={() => handleCopy(referralLink, "Link")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Referral Code</label>
                    <div className="flex gap-2">
                      <Input value={referralCode} readOnly className="bg-background/50 font-black text-center h-11 tracking-wider" />
                      <Button variant="outline" className="h-11 px-4" onClick={() => handleCopy(referralCode, "Code")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <Button 
                      className="h-11 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 gap-2"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4" /> Share Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="h-full border-dashed border-2 bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest font-black text-muted-foreground">How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { step: "01", text: "Send your unique invite link to friends or post it on social media." },
                { step: "02", text: "When they sign up and verify their account, they'll be linked to you." },
                { step: "03", text: "Earn ₹100 instantly once they complete their first campaign task!" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="text-xl font-black text-accent/30">{item.step}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
              <div className="pt-2">
                <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-xs text-accent font-bold gap-1">
                      View Full Program Terms <ExternalLink className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Referral Program Terms</DialogTitle>
                      <DialogDescription>
                        Earn rewards by growing the Trendzity community.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-3">
                        <h4 className="font-bold text-sm">1. Eligibility</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Any registered user with a verified wallet can participate in the referral program. There is no limit to the number of friends you can invite.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-bold text-sm">2. Earning the Bonus</h4>
                        <ul className="space-y-2">
                          <li className="flex gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            Friend must sign up using your unique link or code.
                          </li>
                          <li className="flex gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            Friend must complete at least one campaign task.
                          </li>
                          <li className="flex gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            Bonus is credited instantly once their task is approved.
                          </li>
                        </ul>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                        <p className="text-[10px] text-muted-foreground italic">
                          Note: Multiple accounts or fraudulent activity will result in permanent ban and forfeiture of all earnings.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setIsTermsOpen(false)} className="w-full">Got it!</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {referralStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-border shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader className="bg-muted/10 border-b border-border/30">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-accent" /> Referral History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Bonus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground italic text-sm">
                      No referrals found. Start sharing your link to earn!
                    </td>
                  </tr>
                ) : (
                  referrals.map((r, i) => (
                    <tr key={r.id} className="hover:bg-muted/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{r.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-medium">{r.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-medium">{format(new Date(r.createdAt), "MMM dd, yyyy")}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-green-500/10 text-green-600 border-none h-5 px-2 text-[10px] uppercase font-bold tracking-widest">
                          {r.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-black text-foreground">₹{r.bonusEarned}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsPage;
