import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FinalCTA = () => (
  <section id="contact" className="section-padding">
    <div className="container mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-primary p-12 md:p-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(160_60%_35%/0.4),transparent_50%)]" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Start Growing with Trendzity Today</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">Join thousands of users, businesses, and influencers on the social growth marketplace.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8">
              Join Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8">
              Launch Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FinalCTA;
