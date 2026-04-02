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
  const [dashOpen, setDashOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();

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

          {/* Dashboards Dropdown */}
          <div className="relative group" onMouseEnter={() => setDashOpen(true)} onMouseLeave={() => setDashOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
              Dashboards <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {dashOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-1 w-52 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl py-2 z-50"
                >
                  {dashboardLinks.map((l) => (
                    <button
                      key={l.label}
                      onClick={() => { navigate(l.href); setDashOpen(false); }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                    >
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More Dropdown */}
          <div className="relative group" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
              More <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-1 w-48 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl py-2 z-50"
                >
                  {extraLinks.map((l) => (
                    <button
                      key={l.label}
                      onClick={() => { navigate(l.href); setMoreOpen(false); }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                    >
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/coming-soon")}>Login</Button>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow hover:shadow-[0_0_30px_hsl(var(--accent)/0.25)] transition-all duration-300" onClick={() => navigate("/coming-soon")}>
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

              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mt-4 mb-2">Dashboards</p>
              {dashboardLinks.map((l, i) => (
                <motion.button
                  key={l.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (navLinks.length + i) * 0.05 }}
                  className="block w-full text-left py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => { navigate(l.href); setOpen(false); }}
                >
                  {l.label}
                </motion.button>
              ))}

              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mt-4 mb-2">More</p>
              {extraLinks.map((l, i) => (
                <motion.button
                  key={l.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (navLinks.length + dashboardLinks.length + i) * 0.05 }}
                  className="block w-full text-left py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => { navigate(l.href); setOpen(false); }}
                >
                  {l.label}
                </motion.button>
              ))}

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                <ThemeToggle />
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => { navigate("/coming-soon"); setOpen(false); }}>Login</Button>
                <Button size="sm" className="bg-accent text-accent-foreground" onClick={() => { navigate("/coming-soon"); setOpen(false); }}>Sign Up</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
