import { motion } from "framer-motion";
import { UserCheck, Handshake, Award, Star, Zap, Crown } from "lucide-react";

const features = [
  { icon: <UserCheck className="w-6 h-6" />, title: "Influencer Profiles", desc: "Create your public profile showcasing your reach and niche." },
  { icon: <Handshake className="w-6 h-6" />, title: "Brand Collaborations", desc: "Get matched with brands looking for your audience." },
  { icon: <Award className="w-6 h-6" />, title: "Promotion Tasks", desc: "Complete brand campaigns and earn per engagement." },
];

const levels = [
  { icon: <Star className="w-6 h-6" />, name: "Starter Influencer", range: "0 – 1K followers", color: "text-muted-foreground" },
  { icon: <Zap className="w-6 h-6" />, name: "Pro Influencer", range: "1K – 50K followers", color: "text-accent" },
  { icon: <Crown className="w-6 h-6" />, name: "Elite Influencer", range: "50K+ followers", color: "text-accent" },
];

const InfluencerMarketplace = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <span className="text-sm text-accent font-medium uppercase tracking-wider">Influencer Marketplace</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Monetize Your Audience</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Partner with brands, promote campaigns, and level up as an influencer.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-8 text-center hover:border-accent/30 transition-colors"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-4">
              {f.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-center mb-8">Influencer Levels</h3>
        <div className="flex flex-col gap-4">
          {levels.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-5 flex items-center gap-4"
            >
              <div className={`${l.color}`}>{l.icon}</div>
              <div>
                <div className="font-semibold text-foreground">{l.name}</div>
                <div className="text-xs text-muted-foreground">{l.range}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default InfluencerMarketplace;
