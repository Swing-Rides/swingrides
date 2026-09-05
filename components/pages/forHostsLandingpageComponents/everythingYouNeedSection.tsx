"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TabContentProps } from "./types";
import {
  bookingContent,
  fleetManagementContent,
  financesContent,
  maintenanceContent,
  reportsContent,
} from "@/constants/forHostPageContents";
import { Pill } from "./index";
import { TabContent } from "./tabContent";

const EverythingYouNeedSection = () => {
  const [activeTab, setActiveTab] = useState("fleet-management");

  const content = [
    {
      value: "fleet-management",
      label: "Fleet Management",
    },
    {
      value: "bookings",
      label: "Bookings",
    },
    {
      value: "finances",
      label: "Finances",
    },
    {
      value: "maintenance",
      label: "Maintenance",
    },
    {
      value: "reports",
      label: "Reports",
    },
  ];

  const tabContentMap: Record<string, TabContentProps> = {
    "fleet-management": fleetManagementContent,
    bookings: bookingContent,
    finances: financesContent,
    maintenance: maintenanceContent,
    reports: reportsContent,
  };

  return (
    <section className="section-bg-gradient">
      <div className="px-4 py-12.5 md:px-20 md:py-20 space-y-10.5">
        <div className="flex flex-col items-start max-w-120">
          <Pill label="Dashboard Features" />
          <h3 className="text-6xl font-bold leading-16.25 mt-5 mb-4">
            EVERYTHING YOU <br />
            <span className="text-[#1A56DB] font-sans"> NEED</span> TO RUN YOUR
            FLEET
          </h3>
          <span className="text-left text-[#333333] text-lg font-medium font-text">
            One dashboard. Every tool you need to manage, monitor, and grow your
            car rental business.
          </span>
        </div>
        <div className="flex justify-center mt-5 md:mt-17.5 w-full">
          {/* Mobile: native select + manual content rendering */}
          <div className="block md:hidden w-full">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-base font-semibold font-text text-[#333333] focus:border-[#1A56DB] focus:outline-none focus:ring-1 focus:ring-[#1A56DB] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
            >
              {content.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <div className="mt-5">
              <TabContent {...tabContentMap[activeTab]} />
            </div>
          </div>

          {/* Desktop: Radix Tabs with TabsList */}
          <div className="hidden md:block w-full">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="justify-center items-center w-full"
            >
              <TabsList className="divide-x py-6.25 border-y-2 rounded-none bg-transparent overflow-clip">
                {content.map((item) => (
                  <div key={item.value}>
                    <TabsTrigger
                      value={item.value}
                      className="text-center text-[#333333] data-active:text-[#1A56DB] bg-transparent data-active:bg-transparent text-base font-semibold font-text px-12.5 py-6.25 rounded-none cursor-pointer divide-x-[#6B7280] opacity-30 data-active:opacity-100 transition-colors duration-300"
                    >
                      {item.label}
                    </TabsTrigger>
                  </div>
                ))}
              </TabsList>

              <TabsContent value="fleet-management" className="mt-12.5">
                <TabContent {...fleetManagementContent} />
              </TabsContent>
              <TabsContent value="bookings" className="mt-12.5">
                <TabContent {...bookingContent} />
              </TabsContent>
              <TabsContent value="finances" className="mt-12.5">
                <TabContent {...financesContent} />
              </TabsContent>
              <TabsContent value="maintenance" className="mt-12.5">
                <TabContent {...maintenanceContent} />
              </TabsContent>
              <TabsContent value="reports" className="mt-12.5">
                <TabContent {...reportsContent} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EverythingYouNeedSection;
