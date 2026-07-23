
import { PageIntro } from '../connectToHostPage'
import { PageIntroProps } from "@/constants/connectToHost";
import RequestRefundForm from '@/components/forms/requestRefundForm';
import Link from 'next/link';

type CancelTripPageProps = {
        tripId: string;
        upcomingTrip: boolean;
}

const pageIntro: PageIntroProps = {
        imageSrc: "/images/circle-x.svg",
        pageTitle: "Cancellation Refund Request",
        description: `Submitting this request will cancel your booking. A 50% cancellation fee will be deducted according to the cancellation policy. Any eligible refund will be processed to your selected refund method after review.`,
};

export default function CancelTripPage({ tripId, upcomingTrip }: CancelTripPageProps) {
        return (
                <div className="w-full mx-auto py-12.5 px-4 overflow-clip section-bg-gradient space-y-10">
                        <PageIntro {...pageIntro} />
                        <div className="flex flex-col gap-10 max-w-146 mx-auto w-full">
                                <div className="p-4 bg-white rounded-[10px] border border-gray-200 flex flex-col justify-start items-start">
                                        <RequestRefundForm 
                                                tripId={tripId}
                                                upcomingTrip={upcomingTrip}
                                        />
                                </div>
                        </div>
                        <div className="flex flex-col gap-4">
                                <Link
                                        href={`/trip/${tripId}`}
                                        className="text-center justify-start text-neutral-950 hover:text-blue-700 duration-300 transition-colors text-sm font-semibold font-text leading-5"
                                >
                                        Resume Trip
                                </Link>
                        </div>
                </div>
        )
}