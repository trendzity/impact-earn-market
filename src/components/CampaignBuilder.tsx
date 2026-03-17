import { motion } from "framer-motion";
import { Instagram, Youtube, Send, Download, ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const campaigns = [
  { icon: <Instagram className="w-7 h-7" />, title: "Instagram Engagement", desc: "Boost likes, follows, and comments on Instagram.", stat: "2.5K+ campaigns" },
  { icon: <Youtube className="w-7 h-7" />, title: "YouTube Promotion", desc: "Increase views, subscribers, and watch time.", stat: "1K+ campaigns" },
  { icon: <Send className="w-7 h-7" />, title: "Telegram Growth", desc: "Grow your Telegram community with real members.", stat: "800+ campaigns" },
  { icon: <Download className="w-7 h-7" />, title: "App Downloads", desc: "Drive real installs for your mobile application.", stat: "500+ campaigns" },
];

const CampaignBuilder = () => (
  <section id="campaigns" className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-glow opacity-30" />
    <div className="container mx-auto relative z-10">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-accent font-medium uppercase tracking-wider border border-accent/20 bg-accent/5 mb-4">
            <Rocket className="w-4 h-4" /> Campaign Builder
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-5 tracking-tight">Launch Marketing Campaigns in Minutes</h2>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">Affordable micro campaigns powered by our global community. Perfect for startups and growing businesses.</p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow hover:shadow-[0_0_60px_hsl(var(--accent)/0.3)] transition-all duration-300 group">
            Start Campaign <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {campaigns.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="glass-card-hover rounded-2xl p-7 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:shadow-glow group-hover:scale-110 transition-all duration-500">
                  {c.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{c.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{c.desc}</p>
                <div className="text-xs text-accent font-bold">{c.stat}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CampaignBuilder;
