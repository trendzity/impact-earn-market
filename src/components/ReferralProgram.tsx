import { motion } from "framer-motion";
import { Gift, Users, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReferralProgram = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <div className="glass-card rounded-3xl p-8 md:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm text-primary font-medium uppercase tracking-wider">Referral Program</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Invite Friends, Earn More</h2>
            <p className="text-muted-foreground mb-6">Share your referral link and earn credits every time a friend joins and completes tasks. Climb the referral leaderboard for bonus rewards.</p>
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Get Referral Link <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid gap-4">
            {[
              { icon: <Gift className="w-6 h-6" />, title: "Earn Per Referral", desc: "Get 50 credits for each friend who signs up." },
              { icon: <Users className="w-6 h-6" />, title: "Team Bonuses", desc: "Unlock tier bonuses when your team reaches milestones." },
              { icon: <Trophy className="w-6 h-6" />, title: "Leaderboard Rewards", desc: "Top referrers earn exclusive rewards monthly." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ReferralProgram;
