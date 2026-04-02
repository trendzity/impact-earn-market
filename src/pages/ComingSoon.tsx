import { motion } from "framer-motion";
import { ArrowLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center"
        >
          <Rocket className="w-10 h-10 text-accent" />
        </motion.div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Coming Soon</h1>
        <p className="text-muted-foreground text-lg mb-8">
          We're working hard to bring this feature to life. Stay tuned for something amazing!
        </p>
        <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
