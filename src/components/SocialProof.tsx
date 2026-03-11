import { motion } from "framer-motion";
import { Users, Megaphone, CheckCircle, UserCheck } from "lucide-react";

const stats = [
  { icon: <Users className="w-6 h-6" />, value: "10,000+", label: "Active Users" },
  { icon: <Megaphone className="w-6 h-6" />, value: "500+", label: "Marketing Campaigns" },
  { icon: <CheckCircle className="w-6 h-6" />, value: "2M+", label: "Tasks Completed" },
  { icon: <UserCheck className="w-6 h-6" />, value: "100+", label: "Influencers Onboarded" },
];

const SocialProof = () => (
  <section className="section-padding border-y border-border">
    <div className="container mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
              {s.icon}
            </div>
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
