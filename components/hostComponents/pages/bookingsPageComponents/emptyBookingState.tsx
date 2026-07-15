import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";

export default function EmptyBookingsState() {
        return (
                <div className="p-10 md:p-16 bg-white rounded-md border border-gray-200 flex flex-col items-center justify-center text-center gap-4">
                        <div className="size-14 rounded-full bg-indigo-50 flex items-center justify-center">
                                <CalendarClock className="size-7 text-blue-700" />
                        </div>
                        <div className="space-y-1">
                                <h3 className="text-neutral-950 text-base font-semibold font-text">
                                        No bookings yet
                                </h3>
                                <p className="text-gray-500 text-sm font-normal font-text max-w-sm">
                                        You don&apos;t have any rentals or reservations yet. Create your first
                                        booking to get started.
                                </p>
                        </div>
                        <Link
                                href={`${HOST_DASHBOARD_PATH}bookings/new-booking`}
                                className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300"
                        >
                                New Booking
                        </Link>
                </div>
        );
}