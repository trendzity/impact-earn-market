import { SidebarProvider } from "@/components/ui/sidebar";
import { BusinessSidebar } from "./BusinessSidebar";
import { BusinessTopNav } from "./BusinessTopNav";
import { Outlet } from "react-router-dom";

const BusinessLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <BusinessSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <BusinessTopNav />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BusinessLayout;
