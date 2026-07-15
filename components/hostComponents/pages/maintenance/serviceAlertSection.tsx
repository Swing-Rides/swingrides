import { Fragment, ReactNode } from "react";
import { Settings2 } from "lucide-react";

export interface ServiceAlertRow {
        id: string;
        vehicleName: string;
        serviceType: string;
        lastServiceDate: string;
        mileage: string;
        dueDate: string;
        pastDue: string;
        badge?: string;
        currentMileageKm?: number;
}

type ServiceAlertDataProps = {
        icon: ReactNode;
        title: string;
        serviceData: ServiceAlertRow[];
        alertIconColor: string;
        alertIconBgColor: string;
        alertBgColor: string;
        alertBorderColor: string;
};

export const ServiceAlertData = ({
        icon,
        title,
        serviceData,
        alertIconColor,
        alertIconBgColor,
        alertBgColor,
        alertBorderColor,
}: ServiceAlertDataProps) => {
        return (
                <div className="space-y-3">
                        <div className="flex items-center gap-2">
                                {icon}
                                <span
                                        className={`${alertIconColor} text-xs font-bold font-text uppercase leading-4`}
                                >
                                        {title} ({serviceData.length})
                                </span>
                        </div>
                        <div className="space-y-3">
                                {serviceData.map((item) => (
                                        <Fragment key={item.id}>
                                                <ServiceDataList
                                                        icon={
                                                                <span
                                                                        className={`flex items-center justify-center size-9 aspect-square rounded-full ${alertIconBgColor}`}
                                                                >
                                                                        <Settings2 className={`size-4 ${alertIconColor}`} />
                                                                </span>
                                                        }
                                                        vehicleName={item.vehicleName}
                                                        serviceType={item.serviceType}
                                                        lastServiceDate={item.lastServiceDate}
                                                        mileage={item.mileage}
                                                        dueDate={item.dueDate}
                                                        dueBgColor={alertBgColor}
                                                        className={alertBorderColor}
                                                        pastDue={item.pastDue}
                                                />
                                        </Fragment>
                                ))}
                        </div>
                </div>
        );
};

type ServiceDataListProps = {
        className?: string;
        icon: ReactNode;
        vehicleName: string;
        serviceType: string;
        lastServiceDate: string;
        mileage: string;
        dueDate: string;
        dueBgColor: string;
        pastDue: string;
};

const ServiceDataList = ({
        className,
        icon,
        vehicleName,
        serviceType,
        lastServiceDate,
        mileage,
        dueDate,
        dueBgColor,
        pastDue,
}: ServiceDataListProps) => {
        return (
                <div
                        className={`flex items-center gap-4 p-4 border rounded-[10px] ${className}`}
                >
                        {icon}
                        <div className="w-full flex flex-wrap md:justify-between justify-start gap-4 md:items-center item-start">
                                <div className="flex flex-col gap-0.5">
                                        <span className="text-neutral-950 text-sm font-bold font-text leading-5">
                                                {vehicleName}
                                        </span>
                                        <span className="text-gray-500 text-xs font-normal font-['DM_Sans'] leading-4">
                                                {serviceType}
                                        </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                        <span className="text-gray-500 text-xs font-normal font-text leading-4">
                                                Last Service
                                        </span>
                                        <span className="text-neutral-950 text-xs font-medium font-text leading-4">
                                                {lastServiceDate}
                                        </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                        <span className="text-gray-500 text-xs font-normal font-text leading-4">
                                                Current Mileage
                                        </span>
                                        <span className="text-neutral-950 text-xs font-medium font-text leading-4">
                                                {mileage}
                                        </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                        <span className="text-gray-500 text-xs font-normal font-text leading-4">
                                                Was Due
                                        </span>
                                        <span className="text-neutral-950 text-xs font-medium font-text leading-4">
                                                {dueDate}
                                        </span>
                                </div>
                                <div>
                                        <span
                                                className={`py-1 px-3 text-white text-xs font-medium font-text leading-4 rounded-full ${dueBgColor}`}
                                        >
                                                {pastDue} PAST-DUE
                                        </span>
                                </div>
                        </div>
                </div>
        );
};