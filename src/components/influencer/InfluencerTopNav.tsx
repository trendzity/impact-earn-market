
import { Bell, Wallet, ChevronDown, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

export function InfluencerTopNav() {
  const [user, setUser] = useState(getUser());
  const navigate = useNavigate();

  useEffect(() => {
    const handleUpdate = () => setUser(getUser());
    window.addEventListener('user-updated', handleUpdate);
    return () => window.removeEventListener('user-updated', handleUpdate);
  }, []);

  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() 
    : "I";

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 gap-4 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="hidden md:flex items-center relative max-w-xs">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search deals & campaigns..."
            className="pl-8 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-1.5">
          <Wallet className="h-3.5 w-3.5 text-accent" />
          <span className="text-sm font-semibold text-foreground">₹18,450</span>
        </div>

        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
        </Button>

        {/* Profile */}
        <button 
          onClick={() => navigate("/influencer/settings")}
          className="flex items-center gap-2 hover:bg-muted/50 rounded-lg px-2 py-1 transition-colors"
        >
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="h-7 w-7 rounded-full object-cover border border-accent/20"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent border border-accent/20">
              {initials}
            </div>
          )}
          <div className="hidden md:flex flex-col items-start leading-none">
            <span className="text-xs font-semibold text-foreground">{user?.name || "Influencer"}</span>
            <span className="text-[10px] text-muted-foreground capitalize">{user?.role || "Influencer"}</span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
        </button>
      </div>
    </header>
  );
}
