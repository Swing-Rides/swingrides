import Link from "next/link";
import { Car } from "lucide-react";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";

export default function EmptyFleetState() {
        return (
                <div className="mt-4 md:mt-8 p-10 md:p-16 bg-white rounded-md border border-gray-200 flex flex-col items-center justify-center text-center gap-4">
                        <div className="size-14 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Car className="size-7 text-blue-700" />
                        </div>
                        <div className="space-y-1">
                                <h3 className="text-neutral-950 text-base font-semibold font-text">
                                        No vehicles yet
                                </h3>
                                <p className="text-gray-500 text-sm font-normal font-text max-w-sm">
                                        You haven&apos;t added any vehicles to your fleet. Add your first
                                        vehicle to start accepting bookings.
                                </p>
                        </div>
                        <Link
                                href={`${HOST_DASHBOARD_PATH}fleet/add-vehicle`}
                                className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300"
                        >
                                Add Vehicle
                        </Link>
                </div>
        );
}