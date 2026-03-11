import { motion } from "framer-motion";
import { Check } from "lucide-react";
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
    price: "$19/mo",
    desc: "For power users & creators",
    features: ["50 daily tasks", "2x earning multiplier", "Campaign creation tools", "Priority support", "Badge rewards"],
    featured: true,
  },
  {
    name: "Agency",
    price: "$49/mo",
    desc: "For businesses & agencies",
    features: ["Unlimited tasks", "5x earning multiplier", "Advanced campaign builder", "API access", "Dedicated manager", "Analytics dashboard"],
    featured: false,
  },
];

const PricingPlans = () => (
  <section id="pricing" className="section-padding">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <span className="text-sm text-primary font-medium uppercase tracking-wider">Pricing</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Scale your social growth with flexible plans for everyone.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-8 ${p.featured ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105" : "glass-card"} transition-transform`}
          >
            <h3 className="text-xl font-bold mb-1">{p.name}</h3>
            <p className={`text-sm mb-4 ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{p.desc}</p>
            <div className="text-4xl font-bold mb-6">{p.price}</div>
            <ul className="space-y-3 mb-8">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button className={`w-full ${p.featured ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : "bg-gradient-primary text-primary-foreground hover:opacity-90"}`}>
              Get Started
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingPlans;
