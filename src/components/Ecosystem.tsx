import { motion } from "framer-motion";
import { Users, Building2, Star, ArrowRight } from "lucide-react";

const nodes = [
  { icon: <Users className="w-8 h-8" />, label: "Users", desc: "Complete tasks & earn credits" },
  { icon: <Building2 className="w-8 h-8" />, label: "Businesses", desc: "Launch micro campaigns" },
  { icon: <Star className="w-8 h-8" />, label: "Influencers", desc: "Promote brands & earn" },
];

const Ecosystem = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <span className="text-sm text-primary font-medium uppercase tracking-wider">Platform Ecosystem</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">One Marketplace, Three Pillars</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Trendzity connects users, businesses, and influencers into a unified social growth marketplace.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
        {nodes.map((n, i) => (
          <div key={n.label} className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-card rounded-2xl p-8 text-center w-64 hover:border-primary/30 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                {n.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{n.label}</h3>
              <p className="text-sm text-muted-foreground">{n.desc}</p>
            </motion.div>
            {i < nodes.length - 1 && (
              <ArrowRight className="hidden md:block w-6 h-6 text-primary/40" />
            )}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-primary text-primary-foreground font-semibold">
          <span>Powered by Trendzity Marketplace</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Ecosystem;
