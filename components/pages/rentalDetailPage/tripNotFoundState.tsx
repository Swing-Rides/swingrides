import { AlertCircle } from "lucide-react";

export default function TripNotFoundState({
        title,
        message,
}: {
        title: string;
        message: string;
}) {
        return (
                <div className="flex flex-col items-center justify-center gap-3 py-24 px-4 text-center">
                        <AlertCircle className="size-10 text-gray-400" />
                        <h2 className="text-[#0B0B0B] text-lg font-semibold font-text">
                                {title}
                        </h2>
                        <p className="text-gray-500 text-sm font-normal font-text max-w-sm">
                                {message}
                        </p>
                </div>
        );
}