import { motion } from "framer-motion";
import { Gift, Users, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: <Gift className="w-6 h-6" />, title: "Earn Per Referral", desc: "Get 50 credits for each friend who signs up.", value: "50 credits" },
  { icon: <Users className="w-6 h-6" />, title: "Team Bonuses", desc: "Unlock tier bonuses when your team reaches milestones.", value: "Up to 5x" },
  { icon: <Trophy className="w-6 h-6" />, title: "Leaderboard Rewards", desc: "Top referrers earn exclusive rewards monthly.", value: "Monthly" },
];

const ReferralProgram = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <motion.div 
        className="glass-card rounded-[2rem] p-8 md:p-16 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-glow opacity-40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-accent font-medium uppercase tracking-wider border border-accent/20 bg-accent/5 mb-4">
              <Sparkles className="w-4 h-4" /> Referral Program
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-5 tracking-tight">Invite Friends, Earn More</h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">Share your referral link and earn credits every time a friend joins and completes tasks. Climb the referral leaderboard for bonus rewards.</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow hover:shadow-[0_0_60px_hsl(var(--accent)/0.3)] transition-all duration-300 group">
              Get Referral Link <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid gap-4">
            {benefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ x: 4, scale: 1.02 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/50 backdrop-blur-sm hover:bg-secondary/80 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:shadow-glow transition-all duration-500">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-foreground mb-0.5">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                </div>
                <div className="text-xs text-accent font-bold bg-accent/10 px-3 py-1.5 rounded-full shrink-0">
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ReferralProgram;
