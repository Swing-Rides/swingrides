import { AlertTriangle } from "lucide-react";

type BookingsErrorStateProps = {
        onRetry: () => void;
        isRetrying?: boolean;
};

export default function BookingsErrorState({
        onRetry,
        isRetrying,
}: BookingsErrorStateProps) {
        return (
                <div className="p-10 md:p-16 bg-white rounded-md border border-gray-200 flex flex-col items-center justify-center text-center gap-4">
                        <div className="size-14 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="size-6 text-red-600" />
                        </div>
                        <div className="space-y-1">
                                <h3 className="text-neutral-950 text-base font-semibold font-text">
                                        We couldn&apos;t load your bookings
                                </h3>
                                <p className="text-gray-500 text-sm font-normal font-text max-w-sm">
                                        Something went wrong while fetching your bookings. Please check
                                        your connection and try again.
                                </p>
                        </div>
                        <button
                                type="button"
                                onClick={onRetry}
                                disabled={isRetrying}
                                className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                                {isRetrying ? "Retrying..." : "Try Again"}
                        </button>
                </div>
        );
}