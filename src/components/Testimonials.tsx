import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Sarah M.", role: "Content Creator", text: "Trendzity helped me earn extra income just by doing what I love — engaging on social media. The daily tasks are easy and the credits add up fast!", stars: 5 },
  { name: "Raj P.", role: "Startup Founder", text: "We launched our first micro campaign for under $20 and got incredible engagement. It's the perfect marketing tool for bootstrapped startups.", stars: 5 },
  { name: "Amina K.", role: "Pro Influencer", text: "The influencer marketplace is a game-changer. I've collaborated with three brands already and the payouts are transparent and reliable.", stars: 5 },
  { name: "James L.", role: "Digital Marketer", text: "The campaign builder is intuitive and the community delivers real results. Way better than traditional ad platforms for micro budgets.", stars: 4 },
];

const Testimonials = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <span className="text-sm text-accent font-medium uppercase tracking-wider">Testimonials</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">What Our Users Say</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: t.stars }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
            <div>
              <div className="font-semibold text-foreground text-sm">{t.name}</div>
              <div className="text-xs text-accent">{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
