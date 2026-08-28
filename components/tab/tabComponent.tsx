"use client";

import { memo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ReusableTabProps, TabVariant } from "./types";

const variantListStyles: Record<TabVariant, string> = {
  underline:
    "justify-start border-b pb-0 border-black rounded-none gap-8 w-full bg-white overflow-y-clip overflow-x-auto",
  pills:
    "justify-start bg-gray-100 p-1 rounded-lg gap-2 w-auto overflow-y-clip overflow-x-auto",
  bordered:
    "justify-start border-b border-gray-200 gap-2 w-full bg-transparent overflow-y-clip overflow-x-auto",
};

const variantTriggerStyles: Record<TabVariant, string> = {
  underline:
    "max-w-fit p-0 pb-3.5 -mb-0.5 text-gray-500 text-sm font-medium font-text leading-5 border-b-2 border-b-transparent shadow-none shadow-transparent data-active:rounded-none data-active:text-blue-700 data-active:border-b-blue-700 data-[state=active]:rounded-none data-[state=active]:text-blue-700 data-[state=active]:border-b-blue-700 data-active:shadow-none data-[state=active]:shadow-none cursor-pointer transition-colors duration-200",
  pills:
    "px-4 py-2 text-sm font-medium rounded-md text-gray-600 data-active:bg-blue-700 data-active:text-white data-[state=active]:bg-blue-700 data-[state=active]:text-white transition-all cursor-pointer",
  bordered:
    "px-4 py-2 text-sm font-medium border-t border-x border-transparent rounded-t-md text-gray-500 data-active:bg-white data-active:border-gray-200 data-active:text-blue-700 data-[state=active]:bg-white data-[state=active]:border-gray-200 data-[state=active]:text-blue-700 cursor-pointer",
};

export const ReusableTab = memo(
  ({
    items,
    defaultValue,
    value,
    onValueChange,
    className = "space-y-5",
    listClassName,
    triggerClassName,
    contentClassName,
    variant = "underline",
    fullWidth = false,
    headerRight,
    children,
  }: ReusableTabProps) => {
    const defaultVal = defaultValue ?? items?.[0]?.value;

    return (
      <Tabs
        defaultValue={defaultVal}
        value={value}
        onValueChange={onValueChange}
        className={cn("w-full", className)}
      >
        <div className="flex items-center justify-between gap-4 overflow-hidden">
          <TabsList
            className={cn(
              variantListStyles[variant],
              listClassName,
            )}
          >
            {items?.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                disabled={item.disabled}
                className={cn(
                  variantTriggerStyles[variant],
                  fullWidth && "flex-1 max-w-none",
                  triggerClassName,
                )}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 group-data-[state=active]:bg-blue-100 group-data-[state=active]:text-blue-700">
                      {item.badge}
                    </span>
                  )}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </div>

        {items?.map(
          (item) =>
            item.content !== undefined && (
              <TabsContent
                key={item.value}
                value={item.value}
                className={cn("outline-none", contentClassName)}
              >
                {item.content}
              </TabsContent>
            ),
        )}

        {children}
      </Tabs>
    );
  },
);

ReusableTab.displayName = "ReusableTab";
export default ReusableTab;

