import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const periods = ["Daily", "Weekly", "Monthly"];

const leaderboard = [
  { rank: 1, name: "Priya Sharma", earnings: "₹4,520", tasks: 87, badge: "🥇" },
  { rank: 2, name: "Rahul Kumar", earnings: "₹3,890", tasks: 72, badge: "🥈" },
  { rank: 3, name: "Sneha Mehta", earnings: "₹3,210", tasks: 65, badge: "🥉" },
  { rank: 4, name: "Vikram Singh", earnings: "₹2,980", tasks: 58 },
  { rank: 5, name: "Ananya Patel", earnings: "₹2,750", tasks: 52 },
  { rank: 6, name: "Karan Gupta", earnings: "₹2,400", tasks: 48 },
  { rank: 7, name: "Riya Das", earnings: "₹2,100", tasks: 42 },
  { rank: 8, name: "Amit Joshi", earnings: "₹1,890", tasks: 38 },
  { rank: 9, name: "Neha Verma", earnings: "₹1,650", tasks: 33 },
  { rank: 10, name: "Rohit Saxena", earnings: "₹1,420", tasks: 28 },
];

const LeaderboardPage = () => {
  const [period, setPeriod] = useState("Weekly");

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Leaderboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Compete with top earners</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {periods.map((p) => (
            <Button
              key={p}
              variant="ghost"
              size="sm"
              className={`text-xs h-7 ${period === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* Your Rank */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-lg font-bold text-accent">
                #45
              </div>
              <div>
                <p className="font-semibold text-foreground">Arjun (You)</p>
                <p className="text-sm text-muted-foreground">₹1,240 earned • 23 tasks</p>
              </div>
            </div>
            <Trophy className="h-6 w-6 text-accent" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {leaderboard.slice(0, 3).map((user, i) => (
          <motion.div key={user.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`border text-center ${i === 0 ? "border-yellow-500/30 bg-yellow-500/5" : "border-border"}`}>
              <CardContent className="p-4 pt-5">
                <div className="text-3xl mb-2">{user.badge}</div>
                <p className="font-semibold text-foreground text-sm">{user.name}</p>
                <p className="text-lg font-bold text-accent mt-1">{user.earnings}</p>
                <p className="text-xs text-muted-foreground">{user.tasks} tasks</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full List */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.map((user, i) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  user.rank <= 3 ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                }`}>
                  {user.badge || `#${user.rank}`}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.tasks} tasks completed</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">{user.earnings}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
