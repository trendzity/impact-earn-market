import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopNav } from "./DashboardTopNav";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser } from "@/utils/auth";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (user?.role === "business") {
      navigate("/business");
    } else if (user?.role === "influencer") {
      navigate("/influencer");
    }
  }, [user, navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopNav />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
