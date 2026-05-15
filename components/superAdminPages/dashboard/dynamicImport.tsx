"use client"

import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

export const UsersDonutChart = dynamic(
        () => import("@/components/superAdminPages/charts/usersDonutChart"),
        {
                ssr: false,
                loading: () => <Skeleton className="w-full h-80 rounded-lg" />,
        }
)

export const RevenueByPlanChart = dynamic(
        () => import("@/components/superAdminPages/charts/revenueByPlanChart"),
        {
                ssr: false,
                loading: () => <Skeleton className="w-full h-80 rounded-lg" />,
        }
)

export const SalesChart = dynamic(
        () => import("@/components/superAdminPages/charts/salesChart"),
        {
                ssr: false,
                loading: () => <Skeleton className="w-full h-100 rounded-lg" />,
        }
)