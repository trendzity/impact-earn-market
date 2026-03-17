import { motion } from "framer-motion";
import { Target, Trophy, Medal, Flame } from "lucide-react";

const features = [
  { icon: <Target className="w-8 h-8" />, title: "Daily Missions", desc: "Complete daily challenges to earn bonus credits and unlock new tasks.", stat: "50+ missions" },
  { icon: <Trophy className="w-8 h-8" />, title: "Leaderboards", desc: "Compete with other users for top spots and exclusive rewards.", stat: "Top 100" },
  { icon: <Medal className="w-8 h-8" />, title: "Reward Badges", desc: "Collect badges for milestones and showcase your achievements.", stat: "30+ badges" },
  { icon: <Flame className="w-8 h-8" />, title: "Task Streaks", desc: "Maintain daily streaks for multiplied earnings and special bonuses.", stat: "7-day max" },
];

const Gamification = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 dot-pattern opacity-20" />
    <div className="container mx-auto relative z-10">
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-accent font-medium uppercase tracking-wider border border-accent/20 bg-accent/5 mb-4">
          <Flame className="w-4 h-4" /> Gamification
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight">Make Earning Fun</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Level up, compete, and unlock rewards through our gamified experience.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="glass-card-hover rounded-3xl p-8 text-center group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-5 group-hover:shadow-glow group-hover:scale-110 transition-all duration-500">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{f.desc}</p>
              <div className="text-xs text-accent font-bold">{f.stat}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Gamification;
