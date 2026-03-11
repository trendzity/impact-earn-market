import { motion } from "framer-motion";
import { Target, Trophy, Medal, Flame } from "lucide-react";

const features = [
  { icon: <Target className="w-8 h-8" />, title: "Daily Missions", desc: "Complete daily challenges to earn bonus credits and unlock new tasks." },
  { icon: <Trophy className="w-8 h-8" />, title: "Leaderboards", desc: "Compete with other users for top spots and exclusive rewards." },
  { icon: <Medal className="w-8 h-8" />, title: "Reward Badges", desc: "Collect badges for milestones and showcase your achievements." },
  { icon: <Flame className="w-8 h-8" />, title: "Task Streaks", desc: "Maintain daily streaks for multiplied earnings and special bonuses." },
];

const Gamification = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <span className="text-sm text-primary font-medium uppercase tracking-wider">Gamification</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Make Earning Fun</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Level up, compete, and unlock rewards through our gamified experience.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-8 text-center hover:border-primary/30 transition-colors group"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-5 group-hover:shadow-glow transition-shadow">
              {f.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Gamification;
