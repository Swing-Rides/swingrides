"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  TripCardProps,
  TripCardButtonProps,
  TripStatus,
  MainContentProps,
} from "./types";
import { getTripButtons, statusBadgeClass } from "./utils";

const ITEMS_PER_PAGE = 5;

export default function MainContent({ rentals }: MainContentProps) {
  const statuses: TripStatus[] = [
    "Upcoming",
    "Active",
    "Completed",
    "Cancelled",
  ];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") ?? "all";
  const currentPage = Number(searchParams.get("page") ?? 1);

  const filteredRentals =
    currentTab === "all"
      ? (rentals ?? [])
      : (rentals ?? []).filter((r) => r.status === currentTab);

  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);
  const paginatedRentals = filteredRentals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const createHref = (tab: string, page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  const handleTabChange = (tab: string) => {
    router.push(createHref(tab, 1));
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[#0B0B0B] text-2xl font-bold font-text leading-8">
          My Rentals
        </h3>
        <span className="text-[#333333] text-sm font-normal font-text leading-5">
          Your complete rental history
        </span>
      </div>
      <Suspense>
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="gap-6 md:gap-6"
        >
          <TabsList className="gap-3 overflow-y-hidden overflow-x-">
            {["all", ...statuses].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-center px-4 text-[#6B7280] text-sm font-medium font-text leading-5 cursor-pointer border border-[#E5E7EB] rounded-full data-active:bg-[#1A56DB] data-active:text-white data-active:hover:text-white"
              >
                {tab === "all" ? "All" : tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex flex-col gap-4">
            {paginatedRentals.map((rental) => (
              <TripCard key={rental.rentId} rentals={rental} />
            ))}
            {paginatedRentals.length === 0 && (
              <p className="text-[#6B7280] text-sm font-normal font-text">
                No rentals found.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href={createHref(currentTab, currentPage - 1)}
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={createHref(currentTab, page)}
                        isActive={page === currentPage}
                        className={`border ${page === currentPage ? "bg-[#1A56DB] text-white border-[#1A56DB] hover:bg-white" : "border-[#D1D5DB] hover:bg-[#6B7280] hover:text-white transition-colors duration-300"}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    href={createHref(currentTab, currentPage + 1)}
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </Tabs>
      </Suspense>
    </div>
  );
}

const TripCard = ({ rentals }: TripCardProps) => {
  const searchParams = useSearchParams();

  const buttons = getTripButtons(
    rentals.status,
    rentals.id,
    searchParams.toString(),
    rentals.host.contactNumber,
  );

  return (
    <div className="p-2.5 md:p-6 flex flex-col md:flex-row gap-6 bg-white rounded-[10px] shadow-[0px_1px_3px_1px_rgba(0,0,0,0.30)] overflow-clip">
      <div className="aspect-3/2 min-w-30 max-w-60 size-full object-center object-cover overflow-clip rounded-[10px]">
        <Image
          src={rentals.car.imageUrl}
          alt={rentals.car.carName}
          title={rentals.car.carName}
          width={240}
          height={160}
          className="aspect-3/2 w-auto object-cover object-center"
        />
      </div>
      <div className="grid gap-3 w-full">
        <div className="flex gap-4 justify-between items-center">
          <h4 className="text-[#1F2937] text-base font-bold font-text leading-6">
            {rentals.car.carName}
          </h4>
          <div>
            <Badge className={statusBadgeClass[rentals.status]}>
              {rentals.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-1.5 items-center">
          <span>{rentals.car.carType}</span>
          <span>·</span>
          <span>{rentals.car.manufactureYear}</span>
          <span>·</span>
          <span>{rentals.car.plateNumber}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline">Pickup: {rentals.pickUpDate}</Badge>
          <Badge variant="outline">Return: {rentals.returnDate}</Badge>
          <Badge variant="outline">{rentals.tripDurationDays} days</Badge>
          <Badge variant="outline">{rentals.tripCost}</Badge>
        </div>
        <div>
          <span className="text-cyan-600 text-xs font-normal font-text leading-4">
            {rentals.rentId}
          </span>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap gap-2">
          {buttons.map((btn) => (
            <TripCardButton
              key={btn.label}
              label={btn.label}
              href={btn.href}
              status={rentals.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TripCardButton = ({ label, href, status }: TripCardButtonProps) => {
  console.log(status, "status");
  const isCancel = label === "Cancel";
  const isCancelled = status === "Cancelled";

  const colorClass = isCancelled
    ? "border-[#6B7280] text-[#6B7280] hover:bg-[#6B7280]"
    : isCancel
      ? "border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]"
      : "border-[#1A56DB] text-[#1A56DB] hover:bg-[#1A56DB]";

  return (
    <Link href={href} title={label}>
      <button
        className={`text-sm w-full md:w-fit text-nowrap font-medium font-text leading-5 border rounded-xs py-2 px-4.25 bg-transparent ${colorClass} hover:text-white transition-colors duration-300 cursor-pointer`}
      >
        {label}
      </button>
    </Link>
  );
};