const Footer = () => (
  <footer className="border-t border-border py-12 px-4">
    <div className="container mx-auto">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-sm text-accent-foreground">T</div>
            <span className="text-lg font-bold font-[family-name:var(--font-display)] text-foreground">Trendzity</span>
          </div>
          <p className="text-sm text-muted-foreground">Earn • Promote • Grow<br/>The Social Growth Marketplace</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">Daily Tasks</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Campaigns</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Influencer Hub</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Referral Program</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © 2026 Trendzity. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
