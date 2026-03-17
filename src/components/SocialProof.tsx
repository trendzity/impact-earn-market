import { motion, useInView } from "framer-motion";
import { Users, Megaphone, CheckCircle, UserCheck } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const stats = [
  { icon: <Users className="w-6 h-6" />, value: 10000, suffix: "+", label: "Active Users", prefix: "" },
  { icon: <Megaphone className="w-6 h-6" />, value: 500, suffix: "+", label: "Marketing Campaigns", prefix: "" },
  { icon: <CheckCircle className="w-6 h-6" />, value: 2, suffix: "M+", label: "Tasks Completed", prefix: "" },
  { icon: <UserCheck className="w-6 h-6" />, value: 100, suffix: "+", label: "Influencers Onboarded", prefix: "" },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value >= 1000 ? count.toLocaleString() : count}{suffix}
    </span>
  );
};

const SocialProof = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 dot-pattern opacity-30" />
    <div className="container mx-auto relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center group"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent mb-4 group-hover:shadow-glow group-hover:scale-110 transition-all duration-500 pulse-ring">
              {s.icon}
            </div>
            <div className="text-3xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
