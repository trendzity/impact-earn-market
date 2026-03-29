import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  Wallet,
  Code2,
  Palette,
  Settings,
  Zap,
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
  { title: "Dashboard", url: "/reseller", icon: LayoutDashboard },
  { title: "Orders", url: "/reseller/orders", icon: ShoppingCart },
  { title: "Services", url: "/reseller/services", icon: Package },
  { title: "Pricing Control", url: "/reseller/pricing", icon: DollarSign },
  { title: "Clients", url: "/reseller/clients", icon: Users },
  { title: "Wallet & Transactions", url: "/reseller/wallet", icon: Wallet },
  { title: "API & Integrations", url: "/reseller/api", icon: Code2 },
  { title: "White-label Settings", url: "/reseller/whitelabel", icon: Palette },
  { title: "Settings", url: "/reseller/settings", icon: Settings },
];

export function ResellerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <NavLink to="/reseller" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                Trendzity
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">Reseller</span>
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
                  item.url === "/reseller"
                    ? location.pathname === "/reseller"
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
            <p className="text-xs text-muted-foreground">Scale your business</p>
            <p className="text-sm font-semibold text-accent">Upgrade to Agency</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
