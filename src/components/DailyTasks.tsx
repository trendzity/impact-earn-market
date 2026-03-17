import { motion } from "framer-motion";
import { Instagram, Youtube, MessageCircle, Send, Share2, Heart, Coins } from "lucide-react";

const tasks = [
  { icon: <Instagram className="w-5 h-5" />, label: "Follow Instagram pages", credits: "+5", color: "from-pink-500/10 to-transparent" },
  { icon: <Youtube className="w-5 h-5" />, label: "Like YouTube videos", credits: "+3", color: "from-red-500/10 to-transparent" },
  { icon: <MessageCircle className="w-5 h-5" />, label: "Comment on posts", credits: "+8", color: "from-blue-500/10 to-transparent" },
  { icon: <Send className="w-5 h-5" />, label: "Join Telegram channels", credits: "+4", color: "from-sky-500/10 to-transparent" },
  { icon: <Share2 className="w-5 h-5" />, label: "Share social media content", credits: "+6", color: "from-green-500/10 to-transparent" },
  { icon: <Heart className="w-5 h-5" />, label: "Like & engage with posts", credits: "+2", color: "from-rose-500/10 to-transparent" },
];

const DailyTasks = () => (
  <section id="earning" className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 dot-pattern opacity-20" />
    <div className="container mx-auto relative z-10">
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-accent font-medium uppercase tracking-wider border border-accent/20 bg-accent/5 mb-4">
          <Coins className="w-4 h-4" /> Daily Task Engine
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight">Earn Credits Every Day</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Complete simple social media tasks and receive credits instantly. The more you do, the more you earn.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {tasks.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-accent/30 transition-all duration-300 group relative overflow-hidden cursor-pointer"
          >
            {/* Subtle gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-r ${t.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10 w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:shadow-glow group-hover:scale-110 transition-all duration-500">
              {t.icon}
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <div className="text-sm font-semibold text-foreground mb-0.5">{t.label}</div>
              <div className="inline-flex items-center gap-1 text-xs text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-full">
                <Coins className="w-3 h-3" /> {t.credits} credits
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DailyTasks;
