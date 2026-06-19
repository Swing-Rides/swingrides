"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

export const BookingsDonutChart = dynamic(
  () => import("@/components/hostComponents/charts/bookingDonutChart"),
    {
      ssr: false,
      loading: () => <Skeleton className="w-full h-116 rounded-lg bg-gray-300" />,
    },
);

export const RevenueBookingChart = dynamic(
  () => import("@/components/hostComponents/charts/revenueAndBookingChart"),
    {
      ssr: false,
      loading: () => <Skeleton className="w-full h-116 rounded-lg bg-gray-300" />,
    },
);

export const ExpensesCategoryChart = dynamic(
  () => import("@/components/hostComponents/charts/expensesByCategoryChart"),
    {
      ssr: false,
      loading: () => <Skeleton className="w-full h-116 rounded-lg bg-gray-300" />,
    },
);