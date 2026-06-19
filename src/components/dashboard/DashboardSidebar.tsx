import {
  LayoutDashboard,
  ListChecks,
  Wallet,
  Users,
  Trophy,
  User,
  Settings,
  Zap,
  LogOut,
  CreditCard
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/utils/auth";

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
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/dashboard/tasks", icon: ListChecks },
  { title: "Wallet", url: "/dashboard/wallet", icon: Wallet },
  { title: "Referrals", url: "/dashboard/referrals", icon: Users },
  { title: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Payout Settings", url: "/dashboard/payout-settings", icon: CreditCard },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center font-bold text-sm text-accent-foreground shrink-0 shadow-glow">
            T
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Trendzity
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-red-500 hover:text-red-600 hover:bg-muted"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="rounded-lg bg-accent/10 border border-accent/20 p-3 text-center">
            <p className="text-xs text-muted-foreground">Upgrade to Pro</p>
            <p className="text-sm font-semibold text-accent">Get 2x Rewards</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
