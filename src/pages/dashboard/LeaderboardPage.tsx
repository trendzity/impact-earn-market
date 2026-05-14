import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Loader2, Star, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myPosition, setMyPosition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(getApiUrl("/stats/leaderboard"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.data.leaderboard);
        setMyPosition(data.data.myPosition);
      }
    } catch (error) {
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground font-display">Updating rankings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md mx-auto sm:mx-0">
      <Card className="border border-border/40 shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground font-display tracking-tight">Leaderboard</h2>
            <Trophy className="w-5 h-5 text-red-500" />
          </div>

          {/* Your Rank Box - Pinkish Style */}
          {myPosition && (
            <div className="bg-[#FFF1F1] border border-red-100 rounded-2xl p-6 text-center mb-8">
              <p className="text-muted-foreground text-sm font-medium mb-1">Your Rank</p>
              <h3 className="text-4xl font-bold text-red-500 tracking-tight">#{myPosition.rank}</h3>
            </div>
          )}

          {/* Rank List */}
          <div className="space-y-6">
            {leaderboard.length === 0 ? (
              <p className="text-center text-muted-foreground py-10 italic">No data yet</p>
            ) : (
              leaderboard.slice(0, 10).map((user, i) => (
                <div key={user.userId} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      i === 0 ? "bg-yellow-50 border-yellow-100 text-yellow-700" :
                      i === 1 ? "bg-slate-50 border-slate-100 text-slate-700" :
                      i === 2 ? "bg-orange-50 border-orange-100 text-orange-700" :
                      "bg-transparent border-transparent text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">₹{Number(user.totalEarned).toLocaleString()}</p>
                    </div>
                  </div>
                  <Star className="w-4 h-4 text-red-200 group-hover:text-red-400 transition-colors" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Streak Card */}
      <Card className="border border-border/40 shadow-sm rounded-3xl overflow-hidden bg-muted/20">
        <CardContent className="p-10 text-center">
          <div className="flex justify-center mb-4">
            <Flame className="w-10 h-10 text-red-500 fill-red-500" />
          </div>
          <h3 className="text-4xl font-bold text-foreground tracking-tight">7 Days</h3>
          <p className="text-muted-foreground text-sm mt-1">Current Streak 🔥</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
