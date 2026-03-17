import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Sarah M.", role: "Content Creator", text: "Trendzity helped me earn extra income just by doing what I love — engaging on social media. The daily tasks are easy and the credits add up fast!", stars: 5, avatar: "S" },
  { name: "Raj P.", role: "Startup Founder", text: "We launched our first micro campaign for under $20 and got incredible engagement. It's the perfect marketing tool for bootstrapped startups.", stars: 5, avatar: "R" },
  { name: "Amina K.", role: "Pro Influencer", text: "The influencer marketplace is a game-changer. I've collaborated with three brands already and the payouts are transparent and reliable.", stars: 5, avatar: "A" },
  { name: "James L.", role: "Digital Marketer", text: "The campaign builder is intuitive and the community delivers real results. Way better than traditional ad platforms for micro budgets.", stars: 4, avatar: "J" },
];

const Testimonials = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-glow opacity-30" />
    <div className="container mx-auto relative z-10">
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-accent font-medium uppercase tracking-wider border border-accent/20 bg-accent/5 mb-4">Testimonials</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight">What Our Users Say</h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="glass-card-hover rounded-3xl p-7 relative overflow-hidden group"
          >
            {/* Quote icon */}
            <Quote className="w-8 h-8 text-accent/15 absolute top-6 right-6" />
            
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.stars }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">"{t.text}"</p>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-sm flex items-center justify-center">
                {t.avatar}
              </div>
              <div>
                <div className="font-bold text-foreground text-sm">{t.name}</div>
                <div className="text-xs text-accent font-medium">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
