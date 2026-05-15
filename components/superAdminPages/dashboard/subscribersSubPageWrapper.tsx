import { ReactNode } from "react";
import { PageIntro } from "../pages/subscriberDetailPage";
import Link from "next/link";
import { ChevronRight as BreadcrumbChevron } from "lucide-react";
import { SubscriberStatus, BookingStatus, FleetStatus, BillingStatus } from "@/types/subscribers.type";

type PageWrapperProps = {
        pageTitle: string;
        pageDescription: string;
        status: SubscriberStatus | BookingStatus | FleetStatus | BillingStatus;
        dataType: "subscribers" | "booking" | "fleet" | "billing";
        parentSlug?: string;
        children: ReactNode;
}


export default function SubscribersSubPageWrapper({ pageTitle, pageDescription, status, dataType, parentSlug, children }: PageWrapperProps) {
        return (
                <div className='p-3 md:p-8'>
                        <div>
                                <div className="flex flex-col gap-4 md:gap-10">
                                        <div className="flex gap-2 items-center mb-3 md:mb-8">
                                                <Link
                                                        href='/admin/subscribers'
                                                        className="text-gray-500 text-sm font-normal font-text leading-5 hover:text-gray-700 transition-colors"
                                                >
                                                        Subscribers
                                                </Link>
                                                <BreadcrumbChevron className="size-4 text-[#6B7280]" />
                                                {parentSlug && (
                                                        <Link 
                                                                href={`/admin/subscribers/${parentSlug}`}
                                                                className="text-gray-500 text-sm font-normal font-text leading-5 hover:text-gray-700 transition-colors"
                                                        >
                                                                Subscribers Details
                                                        </Link>
                                                )}
                                                <BreadcrumbChevron className="size-4 text-[#6B7280]" />
                                                <span className="text-cyan-600 text-sm font-semibold font-text leading-5">
                                                        Booking Details
                                                </span>
                                        </div>
                                        <PageIntro 
                                                pageTitle={pageTitle}
                                                pageDesc={pageDescription}
                                                status={status}
                                                dataType={dataType}
                                        />
                                </div>

                                {children}
                        </div>
                </div>
        )
}
