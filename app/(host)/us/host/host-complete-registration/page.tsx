"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HostVerifyAccount from "@/components/hostComponents/completeRegistration/hostVerifyAccount";
import { useGetProfileCompanySettingsQuery } from "@/app/store/services/settingsApi";
import { PLAN_FLEET_SIZE } from "@/constants/hostPlans";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";

const formatCurrency = (amount?: number, currency = "USD") => {
  if (typeof amount !== "number") {
    return "Custom pricing";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPlanName = (plan?: string) => {
  if (!plan) return "Flex";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
};

export default function Page() {
  const router = useRouter();
  const { data: hostProfileResponse, isLoading } =
    useGetProfileCompanySettingsQuery();
  const hostProfile = hostProfileResponse?.data;
  const payment = hostProfile?.payment;
  const verificationStatus = hostProfile?.businessVerification?.status;
  const isSoloPlan = payment?.plan?.toLowerCase() === "solo";

  const activePlan = formatPlanName(payment?.plan);
  const planFee =
    payment?.status === "paid"
      ? `${formatCurrency(payment.amountPerMonth, payment.currency)}/month`
      : "Pending payment";
  const fleetSize = PLAN_FLEET_SIZE[payment?.plan ?? "flex"] ?? "1 vehicle";

  // Skip business registration for Solo plan hosts
  // useEffect(() => {
  //   if (!isLoading && isSoloPlan) {
  //     router.replace(HOST_DASHBOARD_PATH);
  //   }
  // }, [isLoading, isSoloPlan, router]);

  // if (isLoading || isSoloPlan) {
  //   return (
  //     <div className="space-y-5 p-3">
  //       <div className="h-32 rounded-[10px] bg-gray-100 animate-pulse" />
  //       <div className="h-40 rounded-[10px] bg-gray-100 animate-pulse" />
  //       <div className="h-64 rounded-[10px] bg-gray-100 animate-pulse" />
  //     </div>
  //   );
  // }

  return (
    <div>
      <HostVerifyAccount
        activePlan={activePlan}
        planFee={planFee}
        fleetSize={fleetSize}
        userIsVerified={verificationStatus === "approved"}
      />
    </div>
  );
}
