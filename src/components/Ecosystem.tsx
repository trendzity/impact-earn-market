import { motion } from "framer-motion";
import { Users, Building2, Star, ArrowRight, Zap } from "lucide-react";

const nodes = [
  { icon: <Users className="w-8 h-8" />, label: "Users", desc: "Complete tasks & earn credits", metric: "10K+" },
  { icon: <Building2 className="w-8 h-8" />, label: "Businesses", desc: "Launch micro campaigns", metric: "500+" },
  { icon: <Star className="w-8 h-8" />, label: "Influencers", desc: "Promote brands & earn", metric: "100+" },
];

const Ecosystem = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-glow opacity-40" />
    <div className="container mx-auto relative z-10">
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-accent font-medium uppercase tracking-wider border border-accent/20 bg-accent/5 mb-4">Platform Ecosystem</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight">One Marketplace, Three Pillars</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Trendzity connects users, businesses, and influencers into a unified social growth marketplace.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
        {nodes.map((n, i) => (
          <div key={n.label} className="flex items-center gap-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="glass-card-hover rounded-3xl p-8 text-center w-72 relative overflow-hidden group"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-4 group-hover:shadow-glow transition-all duration-500">
                  {n.icon}
                </div>
                <div className="text-2xl font-bold text-accent mb-1">{n.metric}</div>
                <h3 className="text-lg font-bold mb-2">{n.label}</h3>
                <p className="text-sm text-muted-foreground">{n.desc}</p>
              </div>
            </motion.div>
            
            {i < nodes.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.2 }}
                className="hidden md:flex items-center justify-center w-16"
              >
                <div className="w-full h-px bg-gradient-to-r from-accent/40 to-accent/40 relative">
                  <ArrowRight className="w-5 h-5 text-accent absolute -right-2 -top-2.5" />
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center"
      >
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-accent-foreground font-semibold shadow-glow hover:shadow-[0_0_60px_hsl(var(--accent)/0.3)] transition-all duration-300">
          <Zap className="w-5 h-5" />
          <span>Powered by Trendzity Marketplace</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Ecosystem;
