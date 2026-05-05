import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  ClipboardCheck,
  BarChart3,
  CreditCard,
  Settings,
  Zap,
  LogOut,
  Building2,
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
  { title: "Dashboard", url: "/business", icon: LayoutDashboard },
  { title: "Brand Profile", url: "/business/profile", icon: Building2 },
  { title: "Campaigns", url: "/business/campaigns", icon: Megaphone },
  { title: "Create Campaign", url: "/business/create-campaign", icon: PlusCircle },
  { title: "Proof Review", url: "/business/proof-review", icon: ClipboardCheck },
  { title: "Analytics", url: "/business/analytics", icon: BarChart3 },
  { title: "Billing & Wallet", url: "/business/billing", icon: CreditCard },
  { title: "Settings", url: "/business/settings", icon: Settings },
];

export function BusinessSidebar() {
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
        <NavLink to="/business" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                Trendzity
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">Business</span>
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
                  item.url === "/business"
                    ? location.pathname === "/business"
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
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-red-500 hover:text-red-600 hover:bg-red-50/10"
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
            <p className="text-xs text-muted-foreground">Need more reach?</p>
            <p className="text-sm font-semibold text-accent">Upgrade Plan</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
