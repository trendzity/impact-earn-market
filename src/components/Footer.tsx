import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/50 py-16 px-4 relative overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-10" />
    <div className="container mx-auto relative z-10">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-bold text-sm text-accent-foreground shadow-glow">T</div>
            <span className="text-xl font-bold font-[family-name:var(--font-display)] text-foreground">Trendzity</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">Earn • Promote • Grow<br/>The Social Growth Marketplace</p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Platform</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {["Daily Tasks", "Campaigns", "Influencer Hub", "Referral Program"].map(item => (
              <li key={item}>
                <a href="#" className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group">
                  {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {["About", "Blog", "API", "Contact"].map(item => (
              <li key={item}>
                <a href="#" className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group">
                  {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Legal</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {/* {["Terms of Service", "Privacy Policy", "Cookie Policy"].map(item => (
              <li key={item}>
                <a href="#" className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group">
                  {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))} */}
            <li>
              <a href="#" className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group">
                Terms of Service <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group">
                Privacy Policy <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group">
                Cookie Policy <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <motion.div 
        className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="text-sm text-muted-foreground">© 2026 Trendzity. All rights reserved.</div>
        <div className="text-xs text-muted-foreground/60">Earn • Promote • Grow</div>
      </motion.div>
    </div>
  </footer>
);

export default Footer;
