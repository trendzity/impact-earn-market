import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Earn", href: "#earning" },
  { label: "Campaigns", href: "#campaigns" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const dashboardLinks = [
  { label: "Creator Dashboard", href: "/dashboard" },
  { label: "Business Dashboard", href: "/business" },
  { label: "Influencer Dashboard", href: "/influencer" },
  { label: "Reseller Dashboard", href: "/reseller" },
  { label: "Admin Panel", href: "/admin" },
];

const extraLinks = [
  { label: "About Us", href: "/coming-soon" },
  { label: "Blog", href: "/coming-soon" },
  { label: "Careers", href: "/coming-soon" },
  { label: "API Docs", href: "/coming-soon" },
  { label: "Help Center", href: "/coming-soon" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-bold text-sm text-accent-foreground shadow-glow group-hover:scale-110 transition-transform duration-300">T</div>
          <span className="text-xl font-bold font-[family-name:var(--font-display)] text-foreground">Trendzity</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="relative px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group">
              {l.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent rounded-full group-hover:w-4/5 transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Login</Button>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow hover:shadow-[0_0_30px_hsl(var(--accent)/0.25)] transition-all duration-300">
            Sign Up
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden glass-card border-t border-border/30 px-4"
          >
            <div className="py-4">
              {navLinks.map((l, i) => (
                <motion.a 
                  key={l.label} 
                  href={l.href} 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="block py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors" 
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </motion.a>
              ))}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                <ThemeToggle />
                <Button variant="ghost" size="sm" className="text-muted-foreground">Login</Button>
                <Button size="sm" className="bg-accent text-accent-foreground">Sign Up</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
