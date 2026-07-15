import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function AddVehicleCard() {
        return (
                <div className="mt-8 p-5 md:p-6 rounded-md border border-gray-200 bg-white flex flex-col gap-4 lg:flex-row lg:items-center md:justify-between">
                        <div className="flex items-center justify-start gap-3">
                                <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <CheckCircleIcon className="size-6 text-blue-700" />
                                </div>
                                <div className="space-y-1">
                                        <h3 className="text-neutral-950 text-lg font-semibold font-text">
                                                Registration completed!
                                        </h3>
                                        <p className="text-sm text-gray-600 font-text">
                                                Now it is time to add your first vehicle to your fleet.
                                        </p>
                                </div>
                        </div>
                        <Link
                                href={`${HOST_DASHBOARD_PATH}fleet/add-vehicle`}
                                className="text-center text-nowrap py-2 px-6 text-sm border border-blue-700 rounded-xs bg-blue-700 hover:bg-blue-950 hover:border-blue-950 text-white transition-colors duration-300"
                        >
                                Add Vehicle
                        </Link>
                </div>
        )
}