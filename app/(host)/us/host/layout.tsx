import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import "@/app/globals.css";
import { HostSidebar } from "@/components/hostComponents/dashboard/sidebar";
import { DashboardHeader } from "@/components/hostComponents/dashboard/header";
import { ChakraUIProvider } from "@/components/providers/chakraProvider";
import HostPackageModal from "@/components/hostComponents/modals/hostPackageModal";

export const metadata: Metadata = {
  title: "Swing Rides Host Dashboard",
  description: "Drive your fleet. Own your data.",
};

export default async function HostDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <ChakraUIProvider>
        <TooltipProvider>
          <HostSidebar />
          <div className="flex flex-col flex-1 min-w-0 overflow-x-clip bg-slate-100">
            <DashboardHeader />
            {children}
            <HostPackageModal/>
          </div>
        </TooltipProvider>
      </ChakraUIProvider>
    </SidebarProvider>
  );
}
