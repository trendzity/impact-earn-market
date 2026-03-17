import { motion } from "framer-motion";
import { ListChecks, Megaphone, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  { icon: <ListChecks className="w-8 h-8" />, step: "01", title: "Complete Tasks", desc: "Users complete daily social media tasks and earn credits for every action.", color: "from-accent/20 to-accent/5" },
  { icon: <Megaphone className="w-8 h-8" />, step: "02", title: "Launch Campaigns", desc: "Businesses create micro marketing campaigns to grow their brand reach.", color: "from-accent/15 to-accent/5" },
  { icon: <TrendingUp className="w-8 h-8" />, step: "03", title: "Earn & Grow", desc: "Influencers promote brands and earn rewards based on their engagement.", color: "from-accent/20 to-accent/5" },
];

const HowItWorks = () => (
  <section id="how-it-works" className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-30" />
    <div className="container mx-auto relative z-10">
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-accent font-medium uppercase tracking-wider border border-accent/20 bg-accent/5 mb-4">How It Works</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight">Three Simple Steps</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Trendzity connects users, businesses, and influencers in one powerful ecosystem.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px">
          <motion.div 
            className="h-full bg-gradient-to-r from-accent/40 via-accent/20 to-accent/40"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative glass-card-hover rounded-3xl p-10 text-center group"
          >
            {/* Step number with glow */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold shadow-glow">
                {s.step}
              </div>
            </div>
            
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10 pt-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-6 group-hover:shadow-glow group-hover:scale-110 transition-all duration-500">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
            
            {/* Arrow connector on mobile */}
            {i < steps.length - 1 && (
              <div className="md:hidden flex justify-center mt-6">
                <ArrowRight className="w-5 h-5 text-accent/40 rotate-90" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
