import { motion } from "framer-motion";
import { Instagram, Youtube, MessageCircle, Send, Share2, Heart } from "lucide-react";

const tasks = [
  { icon: <Instagram className="w-5 h-5" />, label: "Follow Instagram pages", credits: "+5 credits" },
  { icon: <Youtube className="w-5 h-5" />, label: "Like YouTube videos", credits: "+3 credits" },
  { icon: <MessageCircle className="w-5 h-5" />, label: "Comment on posts", credits: "+8 credits" },
  { icon: <Send className="w-5 h-5" />, label: "Join Telegram channels", credits: "+4 credits" },
  { icon: <Share2 className="w-5 h-5" />, label: "Share social media content", credits: "+6 credits" },
  { icon: <Heart className="w-5 h-5" />, label: "Like & engage with posts", credits: "+2 credits" },
];

const DailyTasks = () => (
  <section id="earning" className="section-padding">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <span className="text-sm text-accent font-medium uppercase tracking-wider">Daily Task Engine</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Earn Credits Every Day</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Complete simple social media tasks and receive credits instantly. The more you do, the more you earn.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {tasks.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-accent/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:shadow-glow transition-shadow">
              {t.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">{t.label}</div>
              <div className="text-xs text-accent font-semibold">{t.credits}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DailyTasks;
