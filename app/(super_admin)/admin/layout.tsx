import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Metadata } from "next";
import '@/app/globals.css'
import { SuperAdminSidebar } from "@/components/superAdminPages/dashboard/sidebar";
import { DashboardHeader } from "@/components/superAdminPages/dashboard/header";
import { ChakraUIProvider } from "@/components/providers/chakraProvider";

export const metadata: Metadata = {
        title: "Swing Rides Admin Dashboard",
        description: "Drive your fleet. Own your data.",
};

export default async function SuperAdminLayout({
        children,
}: Readonly<{
        children: React.ReactNode;
}>) {

        const cookieStore = await cookies()
        const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false"

        return (
                <SidebarProvider defaultOpen={sidebarOpen}>
                        <ChakraUIProvider>
                                <TooltipProvider>
                                        <SuperAdminSidebar />
                                        <div className="flex flex-col flex-1 min-w-0 overflow-x-clip bg-slate-100">
                                                <DashboardHeader />
                                                {children}
                                        </div>
                                </TooltipProvider>
                        </ChakraUIProvider>
                </SidebarProvider> 
        );
}