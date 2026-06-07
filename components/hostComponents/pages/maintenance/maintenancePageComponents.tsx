'use client'

import { Fragment, ReactNode, useState } from "react";
import PageWrapper from "../../dashboard/pageWrapper";
import { Activity, CheckCircle, Clock, DollarSign, Download, Settings2, TriangleAlert, Wrench, XCircle } from "lucide-react";
import { ColumnDef, DataTable, exportToCSV, TableToolbar, useTableRows } from "../../dashboard/customTable";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import LogMaintenanceServiceForm from "./logMaintenanceServiceForm";

interface serviceData {
        id: string;
        vehicleName: string;
        serviceType: string;
        lastServiceDate: string;
        mileage: string;
        dueDate: string;
        pastDue: string;
}

// type MaintenancePageComponentsProps = {
//         pastDueData: serviceData[]
// }

const pastDueData: serviceData[] = [
        {
                id: "PD-001",
                vehicleName: "Tesla Model 3",
                serviceType: "Tire Rotation",
                lastServiceDate: "2026-01-15",
                mileage: "12,500 miles",
                dueDate: "2026-05-15",
                pastDue: "17 days",
        },
        {
                id: "PD-002",
                vehicleName: "BMW X5",
                serviceType: "Oil Change",
                lastServiceDate: "2025-12-01",
                mileage: "28,000 miles",
                dueDate: "2026-05-01",
                pastDue: "31 days",
        },
        {
                id: "PD-003",
                vehicleName: "Honda Accord",
                serviceType: "State Inspection",
                lastServiceDate: "2025-05-20",
                mileage: "45,200 miles",
                dueDate: "2026-05-20",
                pastDue: "12 days",
        },
        {
                id: "PD-004",
                vehicleName: "Toyota RAV4",
                serviceType: "Battery Check",
                lastServiceDate: "2026-02-10",
                mileage: "15,800 miles",
                dueDate: "2026-05-25",
                pastDue: "7 days",
        },
];

export default function MaintenancePageComponents() {

        const [modelOpen, setModelOpen] = useState(false);

        return (
                <PageWrapper
                        pageTitle="Maintenance"
                        pageDescription="Track service history, alerts, and vehicle health across your fleet."
                        pageButton={
                                <PageButton 
                                        onClick={() => setModelOpen(true)}
                                />
                        }
                >
                        <div className="mt-4 md:mt-8">
                                <div className="flex flex-wrap items-center gap-4">
                                        <MaintenanceOverviewCard 
                                                icon={<Wrench className="size-6 text-blue-700" />}
                                                iconBgColor="bg-indigo-50"
                                                title="Total Services"
                                                number="147"
                                        />
                                        <MaintenanceOverviewCard 
                                                icon={<DollarSign className="size-6 text-red-500" />}
                                                iconBgColor="bg-rose-100"
                                                title="Total Maintenance Cost"
                                                number="$2,840,000"
                                        />
                                        <MaintenanceOverviewCard 
                                                icon={<Clock className="size-6 text-amber-500" />}
                                                iconBgColor="bg-orange-50"
                                                title="Vehicles Due Soon"
                                                number="8"
                                        />
                                        <MaintenanceOverviewCard 
                                                icon={<TriangleAlert className="size-6 text-red-500" />}
                                                iconBgColor="bg-red-100"
                                                title="Past-due Vehicles"
                                                number="3"
                                        />
                                </div>
                                <div className="mt-4 md:mt-10 space-y-4">
                                        <div>
                                                <span className="text-neutral-950 text-base font-semibold font-text leading-6">
                                                        Vehicle Health Overview
                                                </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4">
                                                <HealthOverviewCard 
                                                        icon={<CheckCircle className="size-6 text-emerald-500" />}
                                                        iconBgColor="bg-green-100"
                                                        title="Healthy"
                                                        number="12"
                                                        label="No service due within 30 days"
                                                />
                                                <HealthOverviewCard 
                                                        icon={<Clock className="size-6 text-amber-500" />}
                                                        iconBgColor="bg-orange-50"
                                                        title="Due Soon"
                                                        number="8"
                                                        label="Service due within 30 days"
                                                />
                                                <HealthOverviewCard 
                                                        icon={<XCircle className="size-6 text-red-500" />}
                                                        iconBgColor="bg-rose-100"
                                                        title="Past-due"
                                                        number="3"
                                                        label="Service past due date"
                                                />
                                        </div>
                                </div>
                                <div className="my-4 md:my-6 space-y-6">
                                        <div>
                                                <span className="text-neutral-950 text-base font-semibold font-text leading-6">
                                                        Service Alerts
                                                </span>
                                        </div>
                                        <ServiceAlertData 
                                                icon={<TriangleAlert className={`size-4 text-red-500`} />}
                                                title="past-due"
                                                serviceData={pastDueData}
                                                alertIconColor="text-red-500"
                                                alertIconBgColor="bg-red-500/10"
                                                alertBgColor="bg-red-500"
                                                alertBorderColor="border-red-500"
                                        />
                                        <ServiceAlertData 
                                                icon={<Clock className={`size-4 text-amber-500`} />}
                                                title="Due Soon"
                                                serviceData={pastDueData}
                                                alertIconColor="text-amber-500"
                                                alertIconBgColor="bg-amber-500/10"
                                                alertBgColor="bg-amber-500"
                                                alertBorderColor="border-amber-500"
                                        />
                                        <ServiceAlertData 
                                                icon={<Activity className={`size-4 text-blue-700`} />}
                                                title="upcoming"
                                                serviceData={pastDueData}
                                                alertIconColor="text-blue-700"
                                                alertIconBgColor="bg-blue-700/10"
                                                alertBgColor="bg-blue-700"
                                                alertBorderColor="border-blue-700"
                                        />
                                        
                                </div>
                                <div className="space-y-5">
                                        <div>
                                                <span className="text-neutral-950 text-base font-semibold font-text leading-6">
                                                        Service History
                                                </span>
                                        </div>
                                        <div>
                                                <ServiceHistoryTableSection />
                                        </div>
                                </div>
                        </div>
                        {modelOpen && <Modal
                                onClose={() => setModelOpen(false)}
                        >
                                <LogMaintenanceServiceForm 
                                       onClose={() => setModelOpen(false)} 
                                />
                        </Modal>}
                        
                </PageWrapper>
        )
}

const PageButton = ({ onClick }: { onClick: () => void }) => {
        return (
                <button
                        className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
                        onClick={onClick}
                >
                        Log Service
                </button>
        )
}

type MaintenanceOverviewCardProps = {
        icon: ReactNode;
        iconBgColor?: string
        title: string;
        number: string;
}

const MaintenanceOverviewCard = ({ icon, iconBgColor, title, number }: MaintenanceOverviewCardProps ) => {
        return (
                <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
                        <div className={`size-12 rounded-[10px] flex justify-center items-center overflow-clip ${iconBgColor ? iconBgColor : "bg-indigo-50"}`} >
                                {icon}
                        </div>
                        <div>
                                <span className="text-gray-500 text-xs font-semibold font-text uppercase">
                                        {title}
                                </span>
                        </div>
                        <div>
                                <span className="text-neutral-950 text-3xl font-medium font-text">
                                        {number}
                                </span>
                        </div>
                </div>
        )
}

const HealthOverviewCard = ({ icon, iconBgColor, title, number, label }: MaintenanceOverviewCardProps & {label: string} ) => {
        return (
                <div className="basis-95 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-3.5">
                        <div className="flex gap-3.5 items-center">
                                <div className={`size-12 rounded-[10px] flex justify-center items-center overflow-clip ${iconBgColor ? iconBgColor : "bg-indigo-50"}`} >
                                        {icon}
                                </div>
                                <div className="flex flex-col gap-2">
                                        <div>
                                                <span className="text-gray-500 text-xs font-semibold font-text uppercase">
                                                        {title}
                                                </span>
                                        </div>
                                        <div>
                                                <span className="text-neutral-950 text-3xl font-medium font-text">
                                                        {number}
                                                </span>
                                        </div>
                                </div>
                        </div>
                        <div>
                                <span className="text-gray-500 text-xs font-medium font-text">
                                        {label}
                                </span>
                        </div>
                </div>
        )
}

type ServiceAlertDataProps = {
        icon: ReactNode;
        title: string;
        serviceData: serviceData[];
        alertIconColor: string;
        alertIconBgColor: string;
        alertBgColor: string;
        alertBorderColor: string;
}

const ServiceAlertData = ({ icon, title, serviceData, alertIconColor, alertIconBgColor, alertBgColor, alertBorderColor }: ServiceAlertDataProps ) => {
        return (
                <div className="space-y-3">
                        <div className="flex items-center gap-2">
                                {icon}
                                <span className={`${alertIconColor} text-xs font-bold font-text uppercase leading-4`}>
                                        {title} ({serviceData.length})
                                </span>
                        </div>
                        <div className="space-y-3">
                                {serviceData.map((item) => (
                                        <Fragment key={item.id}>
                                                <ServiceDataList
                                                        icon={<span className={`flex items-center justify-center size-9 aspect-square rounded-full ${alertIconBgColor}`}><Settings2 className={`size-4 ${alertIconColor}`} /></span>}
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
        )
}

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
}

const ServiceDataList = ({ className, icon, vehicleName, serviceType, lastServiceDate, mileage, dueDate, dueBgColor, pastDue }: ServiceDataListProps ) => {
        return (
                <div className={`flex items-center gap-4 p-4 border rounded-[10px] ${className}`}>
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
                                        <span className={`py-1 px-3 text-white text-xs font-medium font-text leading-4 rounded-full ${dueBgColor}`}>
                                                {pastDue} PAST-DUE
                                        </span>
                                </div>
                        </div>
                </div>
        )
}

interface ServiceHistoryRow {
        id: string;
        vehicleName: string;
        serviceType: string;
        date: string;
        mileage: string;
        cost: string;
        workshop: string;
        nextDue: string;
}

const MOCK_HISTORY_DATA: ServiceHistoryRow[] = [
        { id: "SH-001", vehicleName: "Tesla Model 3", serviceType: "Tire Rotation", date: "2026-05-15", mileage: "15,000 km", cost: "$80.00", workshop: "Tesla Service Center", nextDue: "2026-11-15" },
        { id: "SH-002", vehicleName: "BMW X5", serviceType: "Oil Change", date: "2026-05-10", mileage: "30,500 km", cost: "$150.00", workshop: "EuroFix Motors", nextDue: "2026-11-10" },
        { id: "SH-003", vehicleName: "Honda Accord", serviceType: "Brake Pad Replacement", date: "2026-04-25", mileage: "42,000 km", cost: "$320.00", workshop: "City Auto Repair", nextDue: "2027-04-25" },
        { id: "SH-004", vehicleName: "Toyota RAV4", serviceType: "Battery Replacement", date: "2026-04-18", mileage: "22,100 km", cost: "$210.00", workshop: "Toyota Express", nextDue: "2028-04-18" },
        { id: "SH-005", vehicleName: "Ford F-150", serviceType: "Transmission Service", date: "2026-04-05", mileage: "55,000 km", cost: "$450.00", workshop: "Ford Fleet Services", nextDue: "2027-04-05" },
        { id: "SH-006", vehicleName: "Audi A4", serviceType: "Air Filter", date: "2026-03-20", mileage: "28,000 km", cost: "$65.00", workshop: "EuroFix Motors", nextDue: "2026-09-20" },
        { id: "SH-007", vehicleName: "Porsche 911", serviceType: "Full Inspection", date: "2026-03-12", mileage: "10,200 km", cost: "$800.00", workshop: "Porsche Specialists", nextDue: "2026-09-12" },
        { id: "SH-008", vehicleName: "Nissan Rogue", serviceType: "Wheel Alignment", date: "2026-03-05", mileage: "35,400 km", cost: "$120.00", workshop: "Precision Align", nextDue: "2026-09-05" },
        { id: "SH-009", vehicleName: "Chevrolet Tahoe", serviceType: "Oil Change", date: "2026-02-28", mileage: "62,000 km", cost: "$110.00", workshop: "Quick Lube Pro", nextDue: "2026-08-28" },
        { id: "SH-010", vehicleName: "Mercedes E-Class", serviceType: "Coolant Flush", date: "2026-02-15", mileage: "40,000 km", cost: "$190.00", workshop: "EuroFix Motors", nextDue: "2027-02-15" },
        { id: "SH-011", vehicleName: "Mazda Miata", serviceType: "Tire Rotation", date: "2026-02-01", mileage: "18,500 km", cost: "$75.00", workshop: "Zoom Zoom Auto", nextDue: "2026-08-01" },
        { id: "SH-012", vehicleName: "Jeep Wrangler", serviceType: "Suspension Repair", date: "2026-01-20", mileage: "50,000 km", cost: "$600.00", workshop: "Off-Road Garage", nextDue: "2027-01-20" },
        { id: "SH-013", vehicleName: "Subaru Outback", serviceType: "Oil Change", date: "2026-01-10", mileage: "25,000 km", cost: "$95.00", workshop: "Subie Clinic", nextDue: "2026-07-10" },
        { id: "SH-014", vehicleName: "Ford Mustang", serviceType: "Brake Fluid Flush", date: "2026-01-05", mileage: "32,000 km", cost: "$140.00", workshop: "Muscle Car Masters", nextDue: "2027-01-05" },
        { id: "SH-015", vehicleName: "Tesla Model S", serviceType: "Software Update/Check", date: "2025-12-20", mileage: "45,000 km", cost: "$0.00", workshop: "Tesla Service Center", nextDue: "2026-06-20" },
        { id: "SH-016", vehicleName: "Mini Cooper", serviceType: "Oil Change", date: "2025-12-15", mileage: "21,000 km", cost: "$130.00", workshop: "Mini Haven", nextDue: "2026-06-15" },
        { id: "SH-017", vehicleName: "Volkswagen Golf", serviceType: "Wiper Blade Replacement", date: "2025-12-05", mileage: "27,500 km", cost: "$40.00", workshop: "Auto Parts Depot", nextDue: "2026-06-05" }
];

const serviceHistoryColumns: ColumnDef<ServiceHistoryRow>[] = [
        {
                key: "vehicleName",
                header: "Vehicle",
                className: "w-56",
                cell: (row) => <span className="text-sm font-bold text-neutral-800">{row.vehicleName}</span>,
        },
        {
                key: "serviceType",
                header: "Service Type",
                cell: (row) => <span className="text-sm text-neutral-800">{row.serviceType}</span>,
        },
        {
                key: "date",
                header: "Date",
                cell: (row) => <span className="text-sm text-neutral-800">{row.date}</span>,
        },
        {
                key: "mileage",
                header: "Mileage",
                cell: (row) => <span className="text-sm text-neutral-800">{row.mileage}</span>,
        },
        {
                key: "cost",
                header: "Cost",
                cell: (row) => <span className="text-sm text-neutral-800">{row.cost}</span>,
        },
        {
                key: "workshop",
                header: "Workshop",
                cell: (row) => <span className="text-sm text-neutral-800">{row.workshop}</span>,
        },
        {
                key: "nextDue",
                header: "Next Due",
                cell: (row) => <span className="text-sm text-neutral-800">{row.nextDue}</span>,
        },
];

function getFilterOptions(rows: ServiceHistoryRow[]) {
        const types = [...new Set(rows.map((r) => r.serviceType))];
        const vehicleNames = [...new Set(rows.map((r) => r.vehicleName))];
        const workshops = [...new Set(rows.map((r) => r.workshop))];

        return { types, vehicleNames, workshops };
}

export function ServiceHistoryTableSection() {
        const data = MOCK_HISTORY_DATA;

        const { types, vehicleNames, workshops } = getFilterOptions(data);

        const { rows, pagination } = useTableRows({
                tableId: "ServiceHistory",
                data,
                searchFields: ["serviceType", "vehicleName", "id"],
                filters: [
                        { paramKey: "serviceType", field: "serviceType" },
                        { paramKey: "vehicleName", field: "vehicleName" },
                        { paramKey: "workshop", field: "workshop" },
                ], 
                sortField: "date",
                rowsPerPage: 10,
        });

        return (
                <DataTable
                        tableId="ServiceHistory"
                        columns={serviceHistoryColumns}
                        rows={rows}
                        pagination={pagination}
                        toolbar={
                                <TableToolbar
                                        search={{ placeholder: "Search by vehicle or service type..." }}
                                        filters={[
                                                {
                                                        title: "All Types",
                                                        paramKey: "serviceType",
                                                        items: types.map((t) => ({ label: t, value: t })),
                                                },
                                                {
                                                        title: "All Vehicles",
                                                        paramKey: "vehicleName",
                                                        items: vehicleNames.map((v) => ({ label: v, value: v })),
                                                },
                                                {
                                                        title: "All Workshops",
                                                        paramKey: "workshop",
                                                        items: workshops.map((w) => ({ label: w, value: w })),
                                                },
                                        ]}
                                        dateSort
                                        actions={
                                                <button
                                                        onClick={() =>
                                                                exportToCSV(rows, {
                                                                        filename: "ServiceHistory",
                                                                        columns: ["id", "vehicleName", "serviceType", "date", "mileage", "cost", "workshop", "nextDue"],
                                                                })
                                                        }
                                                        className="flex items-center gap-2 px-3 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 group duration-300 transition-colors cursor-pointer"
                                                >
                                                        <span className="text-blue-700 text-sm font-medium font-text group-hover:text-blue-200 transition-colors">
                                                                Export CSV
                                                        </span>
                                                        <Download className="size-4 text-blue-700 group-hover:text-blue-200 transition-colors" />
                                                </button>
                                        }
                                />
                        }

                        linkAction={{
                                label: "View",
                                href: (row) => `${HOST_DASHBOARD_PATH}maintenance/${row.id}`,
                                linkIcon: <Download className="size-3" />
                        }}
                />
        );
}

const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
        <div
                className='fixed inset-0 z-999 flex items-center justify-center backdrop-blur-md bg-black/50 px-4'
                onClick={onClose}
        >
                <div onClick={(e) => e.stopPropagation()}>
                        {children}
                </div>
        </div>
)