import { motion } from "framer-motion";
import { UserCheck, Handshake, Award, Star, Zap, Crown } from "lucide-react";

const features = [
  { icon: <UserCheck className="w-7 h-7" />, title: "Influencer Profiles", desc: "Create your public profile showcasing your reach and niche." },
  { icon: <Handshake className="w-7 h-7" />, title: "Brand Collaborations", desc: "Get matched with brands looking for your audience." },
  { icon: <Award className="w-7 h-7" />, title: "Promotion Tasks", desc: "Complete brand campaigns and earn per engagement." },
];

const levels = [
  { icon: <Star className="w-6 h-6" />, name: "Starter Influencer", range: "0 – 1K followers", bg: "bg-muted/50", iconColor: "text-muted-foreground" },
  { icon: <Zap className="w-6 h-6" />, name: "Pro Influencer", range: "1K – 50K followers", bg: "bg-accent/10", iconColor: "text-accent" },
  { icon: <Crown className="w-6 h-6" />, name: "Elite Influencer", range: "50K+ followers", bg: "bg-accent/20", iconColor: "text-accent" },
];

const InfluencerMarketplace = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-20" />
    <div className="container mx-auto relative z-10">
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-accent font-medium uppercase tracking-wider border border-accent/20 bg-accent/5 mb-4">Influencer Marketplace</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight">Monetize Your Audience</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Partner with brands, promote campaigns, and level up as an influencer.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="glass-card-hover rounded-3xl p-10 text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-5 group-hover:shadow-glow group-hover:scale-110 transition-all duration-500">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.h3 
          className="text-2xl font-bold text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Influencer Levels
        </motion.h3>
        <div className="flex flex-col gap-4">
          {levels.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ x: 8, scale: 1.02 }}
              className={`glass-card rounded-2xl p-6 flex items-center gap-5 hover:border-accent/30 transition-all duration-300 cursor-pointer`}
            >
              <div className={`w-12 h-12 rounded-xl ${l.bg} ${l.iconColor} flex items-center justify-center shrink-0`}>
                {l.icon}
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground text-lg">{l.name}</div>
                <div className="text-sm text-muted-foreground">{l.range}</div>
              </div>
              {i === 2 && (
                <div className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                  TOP
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default InfluencerMarketplace;
