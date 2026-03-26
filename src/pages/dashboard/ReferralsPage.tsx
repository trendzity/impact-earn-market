import { motion } from "framer-motion";
import { Users, Copy, Share2, Gift, UserPlus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const referralStats = [
  { label: "Total Referrals", value: "24", icon: Users },
  { label: "Active Referrals", value: "18", icon: UserPlus },
  { label: "Referral Earnings", value: "₹2,400", icon: TrendingUp },
];

const referrals = [
  { name: "Sneha M.", date: "Mar 24", status: "Active", earned: "₹150" },
  { name: "Vikram R.", date: "Mar 22", status: "Active", earned: "₹120" },
  { name: "Priya K.", date: "Mar 20", status: "Inactive", earned: "₹50" },
  { name: "Arjun S.", date: "Mar 18", status: "Active", earned: "₹200" },
];

const ReferralsPage = () => {
  const { toast } = useToast();
  const code = "TRENDZ-ARJ2024";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Referral code copied to clipboard" });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Referral Program</h1>
        <p className="text-sm text-muted-foreground mt-1">Invite friends and earn credits for every referral</p>
      </div>

      {/* Referral Code */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="h-6 w-6 text-accent" />
              <div>
                <p className="font-semibold text-foreground">Your Referral Code</p>
                <p className="text-xs text-muted-foreground">Share and earn ₹100 per active referral</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input value={code} readOnly className="font-mono font-bold text-center" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {referralStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Referral List */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {referrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">Joined {r.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">{r.earned}</p>
                  <span className={`text-xs ${r.status === "Active" ? "text-green-500" : "text-muted-foreground"}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsPage;
