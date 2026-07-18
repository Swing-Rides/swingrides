import { AlertTriangle, type LucideIcon } from "lucide-react";

type CheckoutErrorStateProps = {
        title: string;
        message?: string;
        icon?: LucideIcon;
        primaryAction?: { label: string; onClick: () => void };
        secondaryAction?: { label: string; onClick: () => void };
};

export default function CheckoutErrorState({
        title,
        message,
        icon: Icon = AlertTriangle,
        primaryAction,
        secondaryAction,
}: CheckoutErrorStateProps) {
        return (
                <div className="min-h-[70dvh] bg-gray-200 grid place-content-center px-4">
                        <div className="flex flex-col items-center text-center gap-3 max-w-sm">
                                <div className="rounded-full bg-red-100 p-3">
                                        <Icon className="size-6 text-red-500" />
                                </div>
                                <h2 className="text-lg font-semibold font-text text-neutral-950">
                                        {title}
                                </h2>
                                {message && (
                                        <p className="text-sm font-text text-gray-500">{message}</p>
                                )}

                                {(primaryAction || secondaryAction) && (
                                        <div className="flex items-center gap-3 mt-2">
                                                {secondaryAction && (
                                                        <button
                                                                type="button"
                                                                onClick={secondaryAction.onClick}
                                                                className="px-4 py-2 text-sm font-medium font-text text-gray-700 rounded-xs border border-gray-300 hover:bg-gray-100 transition-colors"
                                                        >
                                                                {secondaryAction.label}
                                                        </button>
                                                )}
                                                {primaryAction && (
                                                        <button
                                                                type="button"
                                                                onClick={primaryAction.onClick}
                                                                className="px-4 py-2 text-sm font-medium font-text text-white bg-blue-700 rounded-xs hover:bg-blue-900 transition-colors"
                                                        >
                                                                {primaryAction.label}
                                                        </button>
                                                )}
                                        </div>
                                )}
                        </div>
                </div>
        );
}