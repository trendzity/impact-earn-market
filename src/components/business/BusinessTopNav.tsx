import { Bell, Wallet, ChevronDown, Search, Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BusinessTopNav() {
  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 gap-4 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="hidden md:flex items-center relative max-w-xs">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-8 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-1.5">
          <Wallet className="h-3.5 w-3.5 text-accent" />
          <span className="text-sm font-semibold text-foreground">₹24,500</span>
        </div>

        <Button size="sm" className="h-8 bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Add Funds</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
        </Button>

        <button className="flex items-center gap-2 hover:bg-muted/50 rounded-lg px-2 py-1 transition-colors">
          <div className="h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
            B
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
        </button>
      </div>
    </header>
  );
}
