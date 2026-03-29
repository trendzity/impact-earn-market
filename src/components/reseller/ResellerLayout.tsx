import { SidebarProvider } from "@/components/ui/sidebar";
import { ResellerSidebar } from "./ResellerSidebar";
import { ResellerTopNav } from "./ResellerTopNav";
import { Outlet } from "react-router-dom";

const ResellerLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ResellerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <ResellerTopNav />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResellerLayout;
