import { motion } from "framer-motion";
import { ListChecks, Megaphone, TrendingUp } from "lucide-react";

const steps = [
  { icon: <ListChecks className="w-8 h-8" />, step: "01", title: "Complete Tasks", desc: "Users complete daily social media tasks and earn credits for every action." },
  { icon: <Megaphone className="w-8 h-8" />, step: "02", title: "Launch Campaigns", desc: "Businesses create micro marketing campaigns to grow their brand reach." },
  { icon: <TrendingUp className="w-8 h-8" />, step: "03", title: "Earn & Grow", desc: "Influencers promote brands and earn rewards based on their engagement." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="section-padding">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <span className="text-sm text-primary font-medium uppercase tracking-wider">How It Works</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Three Simple Steps</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Trendzity connects users, businesses, and influencers in one powerful ecosystem.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative glass-card rounded-2xl p-8 text-center group hover:border-primary/30 transition-colors"
          >
            <div className="text-6xl font-bold text-primary/10 absolute top-4 right-6">{s.step}</div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-5 group-hover:shadow-glow transition-shadow">
              {s.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{s.title}</h3>
            <p className="text-muted-foreground text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
