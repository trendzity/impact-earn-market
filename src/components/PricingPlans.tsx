import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "Perfect for getting started",
    features: ["10 daily tasks", "Basic earning credits", "Referral program access", "Community support"],
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    desc: "For power users & creators",
    features: ["50 daily tasks", "2x earning multiplier", "Campaign creation tools", "Priority support", "Badge rewards"],
    featured: true,
  },
  {
    name: "Agency",
    price: "$49",
    period: "/mo",
    desc: "For businesses & agencies",
    features: ["Unlimited tasks", "5x earning multiplier", "Advanced campaign builder", "API access", "Dedicated manager", "Analytics dashboard"],
    featured: false,
  },
];

const PricingPlans = () => (
  <section id="pricing" className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-20" />
    <div className="container mx-auto relative z-10">
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-accent font-medium uppercase tracking-wider border border-accent/20 bg-accent/5 mb-4">Pricing</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Scale your social growth with flexible plans for everyone.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            whileHover={{ y: -8 }}
            className={`rounded-3xl p-8 relative overflow-hidden transition-all duration-500 ${
              p.featured 
                ? "bg-accent text-accent-foreground shadow-glow md:scale-105 border-2 border-accent" 
                : "glass-card-hover"
            }`}
          >
            {p.featured && (
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-foreground/10 backdrop-blur-sm rounded-bl-2xl text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> POPULAR
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-1">{p.name}</h3>
            <p className={`text-sm mb-6 ${p.featured ? "text-accent-foreground/70" : "text-muted-foreground"}`}>{p.desc}</p>
            
            <div className="mb-8">
              <span className="text-5xl font-bold tracking-tight">{p.price}</span>
              {p.period && <span className={`text-lg ${p.featured ? "text-accent-foreground/60" : "text-muted-foreground"}`}>{p.period}</span>}
            </div>
            
            <ul className="space-y-3.5 mb-8">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${p.featured ? "bg-accent-foreground/20" : "bg-accent/10"}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            
            <Button className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
              p.featured 
                ? "bg-accent-foreground text-accent hover:bg-accent-foreground/90 shadow-lg" 
                : "bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow hover:shadow-[0_0_40px_hsl(var(--accent)/0.25)]"
            }`}>
              Get Started
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingPlans;
