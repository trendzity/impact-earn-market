import {
  LayoutDashboard, Users, Megaphone, ListChecks, ArrowDownToLine,
  Wallet, ShieldAlert, Store, BarChart3, Settings, Zap, LogOut, ArrowUpDown
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/utils/auth";

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Campaigns", url: "/admin/campaigns", icon: Megaphone },
  { title: "Tasks & Submissions", url: "/admin/tasks", icon: ListChecks },
  { title: "Withdrawals", url: "/admin/withdrawals", icon: ArrowDownToLine },
  { title: "Wallet & Finance", url: "/admin/finance", icon: Wallet },
  { title: "Transaction Ledger", url: "/admin/transactions", icon: ArrowUpDown },
  { title: "Fraud & Risk", url: "/admin/fraud", icon: ShieldAlert },
  { title: "Resellers", url: "/admin/resellers", icon: Store },
  { title: "Reports & Analytics", url: "/admin/reports", icon: BarChart3 },
  { title: "System Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <NavLink to="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-foreground leading-none">
                Trendzity
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(0, 1).map((item) => (
                <MenuItem key={item.title} item={item} collapsed={collapsed} location={location} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(1, 7).map((item) => (
                <MenuItem key={item.title} item={item} collapsed={collapsed} location={location} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(7).map((item) => (
                <MenuItem key={item.title} item={item} collapsed={collapsed} location={location} />
              ))}
              
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
    </Sidebar>
  );
}

function MenuItem({ item, collapsed, location }: { item: typeof menuItems[0]; collapsed: boolean; location: { pathname: string } }) {
  const isActive = item.url === "/admin"
    ? location.pathname === "/admin"
    : location.pathname.startsWith(item.url);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <NavLink to={item.url} className="flex items-center gap-3">
          <item.icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
