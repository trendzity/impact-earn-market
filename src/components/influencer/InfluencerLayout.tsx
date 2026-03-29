import { SidebarProvider } from "@/components/ui/sidebar";
import { InfluencerSidebar } from "./InfluencerSidebar";
import { InfluencerTopNav } from "./InfluencerTopNav";
import { Outlet } from "react-router-dom";

const InfluencerLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <InfluencerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <InfluencerTopNav />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default InfluencerLayout;
