import { ReactNode } from "react";
import { X } from "lucide-react";

type ModalWrapperProps = {
    handleClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    maxWidthStyle?: string;
}

export default function HostModalWrapper({ handleClose, title, description, children, maxWidthStyle }: ModalWrapperProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                    className={`relative bg-white rounded-[10px] shadow-xl w-full ${maxWidthStyle || "max-w-3xl"} mx-4 flex flex-col gap-5 max-h-[90vh] overflow-clip`}
                    onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 p-3 md:p-6 space-y-2.5 bg-white border-b border-gray-300">
                    <div className="flex items-center justify-between gap-5">
                        <div className="flex flex-col justify-start items-start gap-3 space-y-1">
                            <h2 className="text-neutral-950 text-lg font-bold font-text leading-6">
                                    {title}
                            </h2>                                                
                            {description ?? <span className="text-gray-300 text-xs font-normal font-text leading-5">
                                    {description}
                            </span>}
                        </div>
                        <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-neutral-950 transition-colors duration-200 cursor-pointer"
                                aria-label="Close modal"
                        >
                                <X className="size-4" />
                        </button>
                    </div>
                </div>

                <div className={`p-3 md:p-6 overflow-y-auto`}>
                        {children}               
                </div>
            </div>
        </div>
    )
}
