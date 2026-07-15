import { BarChart3 } from "lucide-react";

export default function EmptyReportState() {
        return (
                <div className="mt-4 md:mt-8 p-10 md:p-16 bg-white rounded-md border border-gray-200 flex flex-col items-center justify-center text-center gap-4">
                        <div className="size-14 rounded-full bg-indigo-50 flex items-center justify-center">
                                <BarChart3 className="size-7 text-blue-700" />
                        </div>
                        <div className="space-y-1">
                                <h3 className="text-neutral-950 text-base font-semibold font-text">
                                        Nothing to report yet
                                </h3>
                                <p className="text-gray-500 text-sm font-normal font-text max-w-sm">
                                        There&apos;s no revenue, booking, or vehicle data for this time range
                                        yet. Try a longer date range, or check back once you have some
                                        activity.
                                </p>
                        </div>
                </div>
        );
}