import { motion } from "framer-motion";
import { Instagram, Youtube, Send, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const campaigns = [
  { icon: <Instagram className="w-6 h-6" />, title: "Instagram Engagement", desc: "Boost likes, follows, and comments on Instagram." },
  { icon: <Youtube className="w-6 h-6" />, title: "YouTube Promotion", desc: "Increase views, subscribers, and watch time." },
  { icon: <Send className="w-6 h-6" />, title: "Telegram Growth", desc: "Grow your Telegram community with real members." },
  { icon: <Download className="w-6 h-6" />, title: "App Downloads", desc: "Drive real installs for your mobile application." },
];

const CampaignBuilder = () => (
  <section id="campaigns" className="section-padding">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-sm text-primary font-medium uppercase tracking-wider">Campaign Builder</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Launch Marketing Campaigns in Minutes</h2>
          <p className="text-muted-foreground mb-6">Affordable micro campaigns powered by our global community. Perfect for startups and growing businesses.</p>
          <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            Start Campaign <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {campaigns.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                {c.icon}
              </div>
              <h3 className="font-bold mb-1">{c.title}</h3>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CampaignBuilder;
