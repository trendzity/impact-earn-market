import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coins, Megaphone, Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const slides = [
  {
    icon: <Coins className="w-5 h-5" />,
    badge: "Earning Engine",
    headline: "Earn Daily by Completing Social Tasks",
    description: "Complete simple social media tasks like likes, follows, comments, and shares to earn credits and rewards every day.",
    cta1: "Start Earning",
    cta2: "Join Free",
    highlights: ["Daily tasks", "Instant rewards", "Referral bonuses"],
    accentWords: ["Earn", "Daily", "Social"],
  },
  {
    icon: <Megaphone className="w-5 h-5" />,
    badge: "Business Growth",
    headline: "Launch Micro Marketing Campaigns Instantly",
    description: "Businesses and startups can promote their brands using affordable micro campaigns powered by a global community.",
    cta1: "Start Campaign",
    cta2: "View Services",
    highlights: ["Instagram engagement", "YouTube promotion", "Telegram growth", "Affordable marketing"],
    accentWords: ["Launch", "Micro", "Campaigns"],
  },
  {
    icon: <Star className="w-5 h-5" />,
    badge: "Influencer Hub",
    headline: "Turn Your Influence into Income",
    description: "Influencers and creators can partner with brands, promote campaigns, and earn rewards based on engagement.",
    cta1: "Become Influencer",
    cta2: "Explore Opportunities",
    highlights: ["Paid promotion tasks", "Brand collaborations", "Campaign rewards"],
    accentWords: ["Turn", "Influence", "Income"],
  },
];

// Floating particle component
const FloatingOrb = ({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) => (
  <motion.div
    className="absolute rounded-full bg-accent/10 blur-xl"
    style={{ width: size, height: size, left: x, top: y }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setCurrent(c => (c + 1) % slides.length);
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(progressInterval);
  }, [current]);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden pt-16">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      
      {/* Floating orbs */}
      <FloatingOrb delay={0} size={300} x="10%" y="20%" />
      <FloatingOrb delay={2} size={200} x="70%" y="60%" />
      <FloatingOrb delay={4} size={250} x="80%" y="10%" />
      <FloatingOrb delay={1} size={180} x="20%" y="70%" />
      
      {/* Radial glow behind content */}
      <div className="absolute inset-0 bg-gradient-glow opacity-60" />
      
      {/* Animated accent line */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge with shimmer */}
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/30 bg-accent/10 mb-8 shimmer"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-semibold tracking-wide">{slide.badge}</span>
            </motion.div>

            {/* Headline with staggered word animation */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
              {slide.headline.split(" ").map((word, i) => (
                <motion.span
                  key={`${current}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                  className={`inline-block mr-[0.3em] ${slide.accentWords.includes(word) ? "text-gradient-accent animate-gradient-text" : ""}`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p 
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {slide.description}
            </motion.p>

            {/* CTA buttons with hover effects */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 shadow-glow hover:shadow-[0_0_60px_hsl(var(--accent)/0.3)] transition-all duration-300 group">
                {slide.cta1} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/5 text-base px-8 hover:border-accent/40 transition-all duration-300">
                {slide.cta2}
              </Button>
            </motion.div>

            {/* Highlights with stagger */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {slide.highlights.map((h, i) => (
                <motion.span 
                  key={h} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="px-4 py-2 rounded-full text-xs font-medium bg-secondary/80 text-muted-foreground border border-border/50 backdrop-blur-sm"
                >
                  {h}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation with progress bars */}
        <div className="flex justify-center items-center gap-6 mt-14">
          <button onClick={() => { setCurrent((current - 1 + slides.length) % slides.length); setProgress(0); }} className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/50 hover:bg-accent/5 transition-all duration-300">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => { setCurrent(i); setProgress(0); }}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === current ? 48 : 16 }}
              >
                <div className="absolute inset-0 bg-muted-foreground/20 rounded-full" />
                {i === current && (
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-accent rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {i < current && <div className="absolute inset-0 bg-accent/40 rounded-full" />}
              </button>
            ))}
          </div>
          
          <button onClick={() => { setCurrent((current + 1) % slides.length); setProgress(0); }} className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/50 hover:bg-accent/5 transition-all duration-300">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSlider;
