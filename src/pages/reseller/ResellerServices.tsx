import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, Youtube, Send, Globe, Clock, Zap, Star } from "lucide-react";

const services = [
  { name: "Instagram Followers", platform: "Instagram", icon: Instagram, basePrice: "₹150/1K", delivery: "0-6 hrs", quality: "High Quality", popular: true },
  { name: "Instagram Likes", platform: "Instagram", icon: Instagram, basePrice: "₹80/1K", delivery: "0-2 hrs", quality: "Premium", popular: true },
  { name: "Instagram Reels Views", platform: "Instagram", icon: Instagram, basePrice: "₹20/1K", delivery: "0-1 hr", quality: "Real Looking", popular: false },
  { name: "YouTube Views", platform: "YouTube", icon: Youtube, basePrice: "₹120/1K", delivery: "0-12 hrs", quality: "High Retention", popular: true },
  { name: "YouTube Subscribers", platform: "YouTube", icon: Youtube, basePrice: "₹2,500/1K", delivery: "1-3 days", quality: "Premium", popular: false },
  { name: "YouTube Likes", platform: "YouTube", icon: Youtube, basePrice: "₹200/1K", delivery: "0-6 hrs", quality: "Real", popular: false },
  { name: "Telegram Members", platform: "Telegram", icon: Send, basePrice: "₹300/1K", delivery: "0-24 hrs", quality: "High Quality", popular: true },
  { name: "Website Traffic", platform: "Web", icon: Globe, basePrice: "₹50/1K", delivery: "0-6 hrs", quality: "Worldwide", popular: false },
];

const ResellerServices = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Services</h1>
        <p className="text-muted-foreground text-sm">Browse available services and their base pricing.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map((service, i) => (
          <motion.div key={service.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50 hover:border-accent/30 transition-all hover:shadow-md group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <service.icon className="h-5 w-5 text-accent" />
                  </div>
                  {service.popular && (
                    <Badge className="bg-accent/10 text-accent border-accent/30 text-[10px]">
                      <Star className="h-2.5 w-2.5 mr-0.5" /> Popular
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{service.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{service.platform}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Zap className="h-3 w-3 text-accent" />
                    <span className="text-foreground font-medium">{service.basePrice}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{service.delivery}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] mt-1">{service.quality}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResellerServices;
