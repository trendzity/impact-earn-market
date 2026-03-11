import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import SocialProof from "@/components/SocialProof";
import HowItWorks from "@/components/HowItWorks";
import Ecosystem from "@/components/Ecosystem";
import DailyTasks from "@/components/DailyTasks";
import InfluencerMarketplace from "@/components/InfluencerMarketplace";
import CampaignBuilder from "@/components/CampaignBuilder";
import Gamification from "@/components/Gamification";
import PricingPlans from "@/components/PricingPlans";
import ReferralProgram from "@/components/ReferralProgram";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSlider />
    <SocialProof />
    <HowItWorks />
    <Ecosystem />
    <DailyTasks />
    <InfluencerMarketplace />
    <CampaignBuilder />
    <Gamification />
    <PricingPlans />
    <ReferralProgram />
    <Testimonials />
    <FinalCTA />
    <Footer />
  </div>
);

export default Index;
