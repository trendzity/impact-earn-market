import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coins, Megaphone, Star, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    icon: <Coins className="w-5 h-5" />,
    badge: "Earning Engine",
    headline: "Earn Daily by Completing Social Tasks",
    description: "Complete simple social media tasks like likes, follows, comments, and shares to earn credits and rewards every day.",
    cta1: "Start Earning",
    cta2: "Join Free",
    highlights: ["Daily tasks", "Instant rewards", "Referral bonuses"],
  },
  {
    icon: <Megaphone className="w-5 h-5" />,
    badge: "Business Growth",
    headline: "Launch Micro Marketing Campaigns Instantly",
    description: "Businesses and startups can promote their brands using affordable micro campaigns powered by a global community.",
    cta1: "Start Campaign",
    cta2: "View Services",
    highlights: ["Instagram engagement", "YouTube promotion", "Telegram growth", "Affordable marketing"],
  },
  {
    icon: <Star className="w-5 h-5" />,
    badge: "Influencer Hub",
    headline: "Turn Your Influence into Income",
    description: "Influencers and creators can partner with brands, promote campaigns, and earn rewards based on engagement.",
    cta1: "Become Influencer",
    cta2: "Explore Opportunities",
    highlights: ["Paid promotion tasks", "Brand collaborations", "Campaign rewards"],
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden pt-16">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
              {slide.icon}
              <span className="text-sm text-primary font-medium">{slide.badge}</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              {slide.headline.split(" ").map((word, i) => {
                const greenWords = ["Earn", "Daily", "Launch", "Micro", "Turn", "Influence", "Income"];
                return greenWords.includes(word) ? (
                  <span key={i} className="text-gradient-primary">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                );
              })}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {slide.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 text-base px-8">
                {slide.cta1} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 text-base px-8">
                {slide.cta2}
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {slide.highlights.map((h) => (
                <span key={h} className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">
                  {h}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`} />
            ))}
          </div>
          <button onClick={() => setCurrent((p) => (p + 1) % slides.length)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
