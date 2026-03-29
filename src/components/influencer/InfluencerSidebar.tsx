import {
  LayoutDashboard,
  Handshake,
  Megaphone,
  DollarSign,
  BarChart3,
  Briefcase,
  Settings,
  Crown,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/influencer", icon: LayoutDashboard },
  { title: "Brand Deals", url: "/influencer/brand-deals", icon: Handshake },
  { title: "Campaigns", url: "/influencer/campaigns", icon: Megaphone },
  { title: "Earnings", url: "/influencer/earnings", icon: DollarSign },
  { title: "Analytics", url: "/influencer/analytics", icon: BarChart3 },
  { title: "Portfolio", url: "/influencer/portfolio", icon: Briefcase },
  { title: "Settings", url: "/influencer/settings", icon: Settings },
];

export function InfluencerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <NavLink to="/influencer" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Crown className="h-4 w-4 text-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                Trendzity
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">Creator Pro</span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive =
                  item.url === "/influencer"
                    ? location.pathname === "/influencer"
                    : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="rounded-lg bg-accent/10 border border-accent/20 p-3 text-center">
            <p className="text-xs text-muted-foreground">Unlock premium features</p>
            <p className="text-sm font-semibold text-accent">Go Pro ✨</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
