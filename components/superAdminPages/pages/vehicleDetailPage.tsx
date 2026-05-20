import { ReactNode } from "react";
import SubscribersSubPageWrapper from "../dashboard/subscribersSubPageWrapper";
import { DataList } from "./bookingDetailPage";
import GallerySlider from "@/components/slider/gallerySlider";
import { formatNumberToUSD } from "../utils/formatNumbertoUSD";
import { Progress } from "@/components/ui/progress";
import { Calendar, ExternalLink } from "lucide-react";
import {
  MaintenanceStatusPill,
  SubscriptionPlanPill,
} from "../dashboard/statusPill";
import Link from "next/link";
import {
  MaintenanceStatusType,
  SubscriberPlan,
} from "@/constants/superAdminSidebar";
import { FleetStatus } from "@/types/subscribers.type";

type CarGalleryType = {
  alt: string;
  src: string;
};

type VehicleDetailPageProps = {
  carName: string;
  parentSlug?: string;
  status: FleetStatus;
  bodyType: string;
  color: string;
  year: number;
  gallery: CarGalleryType[];
  make: string;
  model: string;
  transmission: string;
  fuelType: string;
  seats: number | string;
  plateNumber: string;
  vin: string;
  vehicleId?: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  mileage: number | string;
  totalTrips: number;
  totalRevenue: number;
  totalExpenses: number;
  lastService: string;
  nextService: string;
  maintenanceStatus: MaintenanceStatusType;
  organisationName: string;
  subscriptionPlan: SubscriberPlan;
  hostEmail: string;
};

export default function VehicleDetailPage({
  carName,
  parentSlug,
  status,
  bodyType,
  color,
  year,
  gallery,
  make,
  model,
  transmission,
  fuelType,
  seats,
  plateNumber,
  vin,
  vehicleId,
  dailyRate,
  weeklyRate,
  monthlyRate,
  mileage,
  totalTrips,
  totalRevenue,
  totalExpenses,
  lastService,
  nextService,
  maintenanceStatus,
  organisationName,
  subscriptionPlan,
  hostEmail,
}: VehicleDetailPageProps) {
  const netEarnings = totalRevenue - totalExpenses;

  const profitMargin = 80; //profit percentage

  return (
    <div>
      <SubscribersSubPageWrapper
        pageTitle={carName}
        pageDescription={`${bodyType} · ${color} · ${year}`}
        status={status}
        parentSlug={parentSlug}
        dataType="fleet"
      >
        <div>
          <div className="p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200">
            <GallerySlider gallery={gallery} />
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <BaseDetailCard
              title="Daily Rate"
              number={formatNumberToUSD(dailyRate)}
            />
            <BaseDetailCard
              title="Weekly Rate"
              number={formatNumberToUSD(weeklyRate)}
            />
            <BaseDetailCard
              title="Monthly Rate"
              number={formatNumberToUSD(monthlyRate)}
            />
            <BaseDetailCard title="Mileage" number={mileage} />
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <SectionWrapper title="Vehicle Information">
                <div className="grid md:grid-cols-2 gap-4">
                  <DataList title="Make" label={make} />
                  <DataList title="Model" label={model} />
                  <DataList title="Year" label={year} />
                  <DataList title="Color" label={color} />
                  <DataList title="Body Type" label={bodyType} />
                  <DataList title="Transmission" label={transmission} />
                  <DataList title="Fuel Type" label={fuelType} />
                  <DataList title="Seats" label={seats} />
                  <DataList title="Plate Number" label={plateNumber} />
                  <DataList title="VIN" label={vin} />
                  <DataList title="Fleet ID" label={vehicleId} />
                </div>
              </SectionWrapper>
              <SectionWrapper title="Pricing">
                <div className="grid gap-4">
                  <InLineDataListPrice label={"Per Day"} price={dailyRate} />
                  <InLineDataListPrice label={"Per Week"} price={weeklyRate} />
                  <InLineDataListPrice
                    label={"Per Month"}
                    price={monthlyRate}
                  />
                </div>
              </SectionWrapper>
            </div>
            <div className="lg:col-span-1">
              <SectionWrapper title="Performance">
                <div className="grid gap-4">
                  <DataList
                    title="Total Trips"
                    label={
                      totalTrips
                        ? totalTrips
                        : "This vehicle is yet to complete any trip"
                    }
                    labelClassName={
                      totalTrips
                        ? "text-neutral-950 text-2xl font-normal font-text leading-8"
                        : "text-red-500 text-xs font-normal font-text leading-5"
                    }
                  />
                  <DataList
                    title="Total Revenue"
                    label={
                      formatNumberToUSD(totalRevenue)
                        ? totalRevenue
                        : "This vehicle is yet to make a revenue"
                    }
                    labelClassName={
                      totalRevenue
                        ? "text-emerald-500 text-2xl font-normal font-text leading-8"
                        : "text-red-500 text-xs font-normal font-text leading-5"
                    }
                  />
                  <DataList
                    title="Total Expenses"
                    label={
                      formatNumberToUSD(totalExpenses)
                        ? totalExpenses
                        : "This vehicle is yet to incur expense"
                    }
                    labelClassName={
                      totalExpenses
                        ? "text-red-500 text-2xl font-normal font-text leading-8"
                        : "text-red-500 text-xs font-normal font-text leading-5"
                    }
                  />
                  <DataList
                    title="Net Earnings"
                    label={
                      formatNumberToUSD(netEarnings)
                        ? netEarnings
                        : "Not enough data to measure net earnings"
                    }
                    labelClassName={
                      netEarnings
                        ? "text-blue-700 text-2xl font-normal font-text leading-8"
                        : "text-red-500 text-xs font-normal font-text leading-5"
                    }
                  />
                  <div className="flex flex-col justify-start items-start gap-2">
                    <h4 className="text-gray-500 text-xs font-medium font-text uppercase leading-4 tracking-tight">
                      Profit Margin
                    </h4>
                    <div className="flex flex-col">
                      <Progress value={profitMargin} className="w-[60%]" />
                    </div>
                  </div>
                </div>
              </SectionWrapper>
              <SectionWrapper title="Maintenance">
                <div className="grid gap-4">
                  <DataList
                    title="Last Service"
                    label={lastService}
                    icon={<Calendar className="text-[#6B7280] size-4" />}
                  />
                  <DataList
                    title="Next Service Due"
                    label={nextService}
                    icon={<Calendar className="text-[#6B7280] size-4" />}
                  />
                  <DataList
                    title="Service Status"
                    status={
                      <MaintenanceStatusPill status={maintenanceStatus} />
                    }
                  />
                </div>
              </SectionWrapper>
              <SectionWrapper title="Host Organisation">
                <div className="grid gap-4">
                  <DataList
                    title="Organisation Name"
                    label={organisationName}
                    labelClassName="text-neutral-950 text-base font-semibold font-text leading-5"
                  />
                  <DataList
                    title="Subscription Plan"
                    status={<SubscriptionPlanPill status={subscriptionPlan} />}
                  />
                  <DataList title="Host Email" label={hostEmail} />
                  <div>
                    {parentSlug && (
                      <Link
                        href={`/admin/subscribers/${parentSlug}`}
                        className="flex items-center gap-1 text-blue-700 text-sm font-medium font-text leading-5 hover:text-blue-900 duration-300 transition-colors"
                      >
                        <span>View Subscriber Detail</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </SectionWrapper>
            </div>
          </div>
        </div>
      </SubscribersSubPageWrapper>
    </div>
  );
}

type SectionWrapperProps = {
  title: string;
  className?: string;
  children: ReactNode;
};

const SectionWrapper = ({
  title,
  className,
  children,
}: SectionWrapperProps) => {
  return (
    <div
      className={`p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200 ${className}`}
    >
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-neutral-950 text-lg font-semibold font-text leading-6">
            {title}
          </h3>
        </div>
        {children}
      </div>
    </div>
  );
};

type BaseDetailCardProps = {
  title: string;
  number: number | string;
};

const BaseDetailCard = ({ title, number }: BaseDetailCardProps) => {
  return (
    <div className="basis-50 grow shrink flex-1 p-3 md:p-5 bg-white rounded-lg border border-gray-200 flex flex-col justify-start items-start gap-2">
      <span className="text-gray-500 text-xs font-medium font-text uppercase leading-4 tracking-tight">
        {title}
      </span>
      <span className="text-neutral-950 text-2xl font-normal font-text leading-8">
        {number}
      </span>
      <span></span>
    </div>
  );
};

export const InLineDataListPrice = ({
  label,
  price,
  priceClassName,
}: {
  label: string;
  price: number;
  priceClassName?: string;
}) => {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-gray-500 text-sm font-normal font-text leading-5">
        {label}
      </span>
      <span
        className={
          priceClassName
            ? priceClassName
            : `text-neutral-950 text-lg font-normal font-text leading-6`
        }
      >
        {formatNumberToUSD(price)}
      </span>
    </div>
  );
};
