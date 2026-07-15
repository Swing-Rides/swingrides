import { Wrench } from "lucide-react";

type EmptyMaintenanceStateProps = {
        onLogService: () => void;
};

export default function EmptyMaintenanceState({
        onLogService,
}: EmptyMaintenanceStateProps) {
        return (
                <div className="mt-4 md:mt-8 p-10 md:p-16 bg-white rounded-md border border-gray-200 flex flex-col items-center justify-center text-center gap-4">
                        <div className="size-14 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Wrench className="size-6 text-blue-700" />
                        </div>
                        <div className="space-y-1">
                                <h3 className="text-neutral-950 text-base font-semibold font-text">
                                        No maintenance records yet
                                </h3>
                                <p className="text-gray-500 text-sm font-normal font-text max-w-sm">
                                        Once you log a service for a vehicle, its history, alerts, and
                                        health status will show up here.
                                </p>
                        </div>
                        <button
                                type="button"
                                onClick={onLogService}
                                className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
                        >
                                Log Service
                        </button>
                </div>
        );
}