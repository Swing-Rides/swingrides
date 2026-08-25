import { HostPlanType } from "@/types/host-profile.type";

export type PlanTier = "solo" | "flex" | "fleet" | "enterprise" | string;

export interface PlanVehicleLimit {
  min: number;
  max: number;
  display: string;
}

export interface HostPlanConfig {
  id: HostPlanType;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  badge?: string;
  vehicleLimit: PlanVehicleLimit;
  description: string;
  features: string[];
}

/**
 * Single source of truth for Host Subscription Plans, Limits, and Features.
 * Structured so that it can be easily updated or replaced by a server API response in the future.
 */
export const HOST_PLANS: Record<HostPlanType, HostPlanConfig> = {
  solo: {
    id: "solo",
    name: "Solo",
    price: 99,
    currency: "USD",
    interval: "month",
    vehicleLimit: {
      min: 1,
      max: 1,
      display: "1 Vehicle",
    },
    description: "Everything you need to list and manage a single rental vehicle.",
    features: [
      "Booking management",
      "Mileage tracking",
      "Basic maintenance alerts",
      "Expense capture",
      "Toll records",
      "Basic reports",
    ],
  },
  flex: {
    id: "flex",
    name: "Flex",
    price: 249,
    currency: "USD",
    interval: "month",
    badge: "Most Popular",
    vehicleLimit: {
      min: 2,
      max: 5,
      display: "2 – 5 Vehicles",
    },
    description: "Scale your rental business with advanced financial tools and a branded customer experience.",
    features: [
      "Everything in Solo",
      "Expense capture + invoicing",
      "Toll record history",
      "10 custom fields",
      "Financial reports + audit export",
      "Customer portal",
      "White label branding",
    ],
  },
  fleet: {
    id: "fleet",
    name: "Fleet",
    price: 499,
    currency: "USD",
    interval: "month",
    vehicleLimit: {
      min: 6,
      max: 15,
      display: "6 – 15 Vehicles",
    },
    description: "Full operational control for serious fleet hosts with audit-ready exports and priority support.",
    features: [
      "Everything in Flex",
      "Maintenance scheduling + vendor tracking",
      "MRR dashboard & revenue analytics",
      "Unlimited custom fields",
      "Full CSV export (all data for audit & tax)",
      "P/L statements & advanced reports",
      "Odometer history per vehicle",
      "Priority escalation support",
    ],
  },
};

/** List of all plans in standard tier order */
export const HOST_PLANS_LIST: HostPlanConfig[] = [
  HOST_PLANS.solo,
  HOST_PLANS.flex,
  HOST_PLANS.fleet,
];

/** Map of plan ID to fleet size text representation */
export const PLAN_FLEET_SIZE: Record<string, string> = {
  solo: HOST_PLANS.solo.vehicleLimit.display,
  flex: HOST_PLANS.flex.vehicleLimit.display,
  fleet: HOST_PLANS.fleet.vehicleLimit.display,
};

/**
 * Retrieves the configuration for a given plan tier.
 * Defaults to 'solo' if unspecified or unrecognized.
 */
export function getPlanConfig(planTier?: string): HostPlanConfig {
  if (!planTier) return HOST_PLANS.solo;
  const key = planTier.toLowerCase().trim() as HostPlanType;
  return HOST_PLANS[key] ?? HOST_PLANS.solo;
}

/**
 * Returns the maximum allowed vehicles for a given plan.
 */
export function getVehicleLimitForPlan(planTier?: string): number {
  return getPlanConfig(planTier).vehicleLimit.max;
}

export interface VehicleUploadLimitCheck {
  allowed: boolean;
  isLimitReached: boolean;
  maxVehicles: number;
  currentCount: number;
  remainingSlots: number;
  planName: string;
  planId: string;
  nextUpgradePlan?: HostPlanConfig;
  message?: string;
}

/**
 * Evaluates whether a host is permitted to upload an additional vehicle
 * based on their current active plan and current vehicle count.
 */
export function checkVehicleUploadLimit({
  plan,
  currentVehicleCount = 0,
}: {
  plan?: string;
  currentVehicleCount: number;
}): VehicleUploadLimitCheck {
  const planConfig = getPlanConfig(plan);
  const maxVehicles = planConfig.vehicleLimit.max;
  const isLimitReached = currentVehicleCount >= maxVehicles;
  const allowed = !isLimitReached;
  const remainingSlots = Math.max(0, maxVehicles - currentVehicleCount);

  let nextUpgradePlan: HostPlanConfig | undefined;
  if (planConfig.id === "solo") {
    nextUpgradePlan = HOST_PLANS.flex;
  } else if (planConfig.id === "flex") {
    nextUpgradePlan = HOST_PLANS.fleet;
  }

  const message = isLimitReached
    ? `You have reached the maximum limit of ${maxVehicles} vehicle${
        maxVehicles > 1 ? "s" : ""
      } allowed on the ${planConfig.name} plan.${
        nextUpgradePlan
          ? ` Upgrade to ${nextUpgradePlan.name} (${nextUpgradePlan.vehicleLimit.display}) to add more.`
          : ""
      }`
    : undefined;

  return {
    allowed,
    isLimitReached,
    maxVehicles,
    currentCount: currentVehicleCount,
    remainingSlots,
    planName: planConfig.name,
    planId: planConfig.id,
    nextUpgradePlan,
    message,
  };
}

/**
 * Abstraction layer to fetch host plans.
 * Currently reads from the local config, but can be seamlessly updated
 * to fetch dynamically from a server API endpoint when ready.
 */
export async function fetchHostPlans(): Promise<HostPlanConfig[]> {
  return HOST_PLANS_LIST;
}
