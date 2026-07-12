"use client";

import HostVerifyAccount from "@/components/hostComponents/completeRegistration/hostVerifyAccount";
import { useGetProfileCompanySettingsQuery } from "@/app/store/services/settingsApi";

const PLAN_FLEET_SIZE: Record<string, string> = {
  solo: "1 vehicle",
  flex: "Up to 5 vehicles",
  fleet: "Up to 15 vehicles",
};

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
  const { data: hostProfileResponse, isLoading } =
    useGetProfileCompanySettingsQuery();
  const hostProfile = hostProfileResponse?.data;
  const payment = hostProfile?.payment;
  const verificationStatus = hostProfile?.businessVerification?.status;
  const activePlan = formatPlanName(payment?.plan);
  const planFee =
    payment?.status === "paid"
      ? `${formatCurrency(payment.amountPerMonth, payment.currency)}/month`
      : "Pending payment";
  const fleetSize = PLAN_FLEET_SIZE[payment?.plan ?? "flex"] ?? "1 vehicle";

  return (
    <div>
      {isLoading ? (
        <div className="space-y-5 p-3">
          <div className="h-32 rounded-[10px] bg-gray-100 animate-pulse" />
          <div className="h-40 rounded-[10px] bg-gray-100 animate-pulse" />
          <div className="h-64 rounded-[10px] bg-gray-100 animate-pulse" />
        </div>
      ) : (
        <HostVerifyAccount
          activePlan={activePlan}
          planFee={planFee}
          fleetSize={fleetSize}
          userIsVerified={verificationStatus === "approved"}
        />
      )}
    </div>
  );
}
