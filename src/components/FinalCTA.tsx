import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const FinalCTA = () => (
  <section id="contact" className="section-padding">
    <div className="container mx-auto">
      <motion.div 
        className="relative rounded-[2rem] overflow-hidden bg-accent p-12 md:p-20 text-center"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(0_0%_0%/0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(0_0%_100%/0.05),transparent_50%)]" />
        <div className="absolute inset-0 noise-overlay" />
        
        {/* Animated glow */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-foreground/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-8 h-8 mx-auto mb-6 text-accent-foreground/80" />
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-accent-foreground mb-5 tracking-tight">
              Start Growing with Trendzity Today
            </h2>
            <p className="text-accent-foreground/70 max-w-xl mx-auto mb-10 text-lg">
              Join thousands of users, businesses, and influencers on the social growth marketplace.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button size="lg" className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-300 group">
              Join Free <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="ghost" className="border border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground hover:text-accent text-base px-8 h-12 transition-all duration-300">
              Launch Campaign
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
