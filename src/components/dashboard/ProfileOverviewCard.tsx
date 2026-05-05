import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Instagram, Youtube, Facebook, MessageCircle, Star, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileOverviewCardProps {
  user: any;
  profileData: any;
  linkedAccounts?: any[];
}

export const ProfileOverviewCard = ({ user, profileData, linkedAccounts = [] }: ProfileOverviewCardProps) => {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="h-3 w-3 text-pink-500" />;
      case 'facebook': return <Facebook className="h-3 w-3 text-blue-600" />;
      case 'youtube': return <Youtube className="h-3 w-3 text-red-500" />;
      case 'telegram': return <MessageCircle className="h-3 w-3 text-blue-500" />;
      default: return <Star className="h-3 w-3 text-accent" />;
    }
  };

  // Only show real linked accounts (YouTube, etc.)
  const handles: any[] = [];
  
  linkedAccounts.forEach(acc => {
    // If it's YouTube, show the channel name if available
    if (acc.platform === 'youtube') {
      handles.push({ 
        platform: 'YouTube', 
        value: acc.stats?.channelName || acc.accountId || 'YouTube connected' 
      });
    } else if (acc.platform === 'instagram') {
      handles.push({ 
        platform: 'Instagram', 
        value: acc.stats?.username || acc.accountId || 'Instagram connected' 
      });
    } else if (acc.platform === 'facebook') {
      handles.push({ 
        platform: 'Facebook', 
        value: acc.stats?.pageName || acc.accountId || 'Facebook connected' 
      });
    } else {
      handles.push({ platform: acc.platform, value: 'Connected' });
    }
  });

  // Unique by platform to avoid duplicates
  const uniqueHandles = Array.from(new Map(handles.map(h => [h.platform, h])).values());

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="border-none shadow-xl bg-gradient-to-br from-card to-card/50 overflow-hidden relative group">
        {/* Subtle Decorative Gradient */}
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-500" />
        
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Primary Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                  <User className="h-8 w-8 text-accent" />
                </div>
                {user?.onboarded && (
                  <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                    <ShieldCheck className="h-5 w-5 text-green-500 fill-green-500/10" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-5 bg-accent/5 text-accent border-accent/20">
                    {user?.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Connected Channels / Meta info */}
            <div className="flex flex-wrap items-center gap-3 md:border-l border-border md:pl-6">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest w-full mb-1">
                Connected Presence
              </div>
              {uniqueHandles.length > 0 ? (
                uniqueHandles.map((h, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 bg-muted/50 border border-border/50 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
                  >
                    {getSocialIcon(h.platform)}
                    <span className="text-xs font-medium text-foreground">{h.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">No channels linked yet. Setup in Settings.</p>
              )}
            </div>

            {/* Quick Stats / Action */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Account Status</p>
                <p className="text-sm font-bold text-green-500">Active & Verified</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
