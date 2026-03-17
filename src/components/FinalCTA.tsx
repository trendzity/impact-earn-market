import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FinalCTA = () => (
  <section id="contact" className="section-padding">
    <div className="container mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-accent p-12 md:p-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(0_0%_0%/0.3),transparent_50%)]" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-accent-foreground mb-4">Start Growing with Trendzity Today</h2>
          <p className="text-accent-foreground/70 max-w-xl mx-auto mb-8">Join thousands of users, businesses, and influencers on the social growth marketplace.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 text-base px-8">
              Join Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10 text-base px-8">
              Launch Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FinalCTA;
