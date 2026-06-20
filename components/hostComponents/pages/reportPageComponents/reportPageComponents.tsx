'use client'

import { useState, Dispatch, SetStateAction, ReactNode } from "react";
import PageWrapper from "../../dashboard/pageWrapper";
import { ArrowDownRight, ArrowUpRight, DollarSign, Download, FileText, Star, TrendingUp } from "lucide-react";
import { BookingsDonutChart, ExpensesCategoryChart, RevenueBookingChart } from "../../dashboard/dynamicImport";
import { sampleBookingDonutData, sampleExpensesCategoryData, sampleRevenueAndBookingData } from "@/constants/saleschartdata";
import { ColumnDef, DataTable, exportToCSV, TableToolbar, useTableRows } from "../../dashboard/customTable";


const MOCK_PERFORMANCE: VehiclePeformanceRow[] = [
        { id: "VP-001", vehicleName: "Tesla Model 3", trips: 45, revenue: "$5,400.00", averageRentalDays: 3.5, lastRentalDate: "2026-06-18", totalMilageDriven: "820 km" },
        { id: "VP-002", vehicleName: "BMW X5", trips: 32, revenue: "$5,760.00", averageRentalDays: 4.2, lastRentalDate: "2026-06-15", totalMilageDriven: "650 km" },
        { id: "VP-003", vehicleName: "Audi A4", trips: 28, revenue: "$3,080.00", averageRentalDays: 2.8, lastRentalDate: "2026-06-10", totalMilageDriven: "410 km" },
        { id: "VP-004", vehicleName: "Honda Accord", trips: 55, revenue: "$4,400.00", averageRentalDays: 2.5, lastRentalDate: "2026-06-19", totalMilageDriven: "980 km" },
        { id: "VP-005", vehicleName: "Ford F-150", trips: 20, revenue: "$3,000.00", averageRentalDays: 5.0, lastRentalDate: "2026-06-12", totalMilageDriven: "520 km" },
        { id: "VP-006", vehicleName: "Toyota RAV4", trips: 48, revenue: "$4,560.00", averageRentalDays: 3.2, lastRentalDate: "2026-06-18", totalMilageDriven: "740 km" },
        { id: "VP-007", vehicleName: "Porsche 911", trips: 12, revenue: "$4,800.00", averageRentalDays: 1.5, lastRentalDate: "2026-06-05", totalMilageDriven: "120 km" },
        { id: "VP-008", vehicleName: "Nissan Rogue", trips: 38, revenue: "$3,230.00", averageRentalDays: 3.8, lastRentalDate: "2026-06-14", totalMilageDriven: "610 km" },
        { id: "VP-009", vehicleName: "Chevrolet Tahoe", trips: 25, revenue: "$5,000.00", averageRentalDays: 4.5, lastRentalDate: "2026-06-08", totalMilageDriven: "580 km" },
        { id: "VP-010", vehicleName: "Mercedes E-Class", trips: 22, revenue: "$4,840.00", averageRentalDays: 3.0, lastRentalDate: "2026-06-16", totalMilageDriven: "350 km" },
        { id: "VP-011", vehicleName: "Mazda Miata", trips: 18, revenue: "$2,340.00", averageRentalDays: 2.2, lastRentalDate: "2026-06-02", totalMilageDriven: "210 km" },
        { id: "VP-012", vehicleName: "Jeep Wrangler", trips: 30, revenue: "$4,200.00", averageRentalDays: 4.0, lastRentalDate: "2026-06-17", totalMilageDriven: "490 km" }
];

export default function ReportPageComponents() {

        const [filterDuration, setFilterDuration] = useState('6m')

        return (
                <PageWrapper 
                        pageTitle="Reports & Analytics"
                        pageDescription="Track financial performance, bookings, and vehicle insights"
                        pageButton={
                                <PageButtons
                                        filterDuration={filterDuration}
                                        setFilterDuration={setFilterDuration}
                                />
                        }
                >
                        <div className="mt-4 md:mt-8 space-y-6">
                                <div className="flex flex-wrap items-center gap-4">
                                        <OverviewCard 
                                                icon={<DollarSign className="size-4 md:size-6 text-green-500"/>}
                                                iconBg="bg-green-100"
                                                trendPositive={true}
                                                trendPercentage="+12.5%"
                                                label="Total Revenue"
                                                number="$18.4M"
                                        />
                                        <OverviewCard 
                                                icon={<TrendingUp className="size-4 md:size-6 text-blue-700"/>}
                                                iconBg="bg-blue-100"
                                                trendPositive={true}
                                                trendPercentage="+8.3%"
                                                label="Net Profit"
                                                number="$12,580,000"
                                        />
                                        <OverviewCard 
                                                icon={<FileText className="size-4 md:size-6 text-cyan-600"/>}
                                                iconBg="bg-cyan-100"
                                                trendPositive={true}
                                                trendPercentage="+15.2%"
                                                label="Total Bookings"
                                                number="224"
                                        />
                                        <OverviewCard 
                                                icon={<Star className="size-4 md:size-6 stroke-amber-500 fill-transparent"/>}
                                                iconBg="bg-amber-100"
                                                trendPositive={true}
                                                trendPercentage="+0.2"
                                                label="Average Star Rating"
                                                number="4.8"
                                        />
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2 overflow-clip">
                                                <RevenueBookingChart
                                                        data={sampleRevenueAndBookingData} 
                                                />
                                        </div>
                                        <div className="col-span-1 overflow-clip">
                                                <BookingsDonutChart
                                                        chartData={sampleBookingDonutData}
                                                />
                                        </div>
                                </div>
                                <ExpensesCategoryChart 
                                        data={sampleExpensesCategoryData}
                                />
                                <VehiclePeformanceTable 
                                        tableData={MOCK_PERFORMANCE}
                                />
                        </div>
                </PageWrapper>
        )
}

type PageButtonsProps = {
        filterDuration: string;
        setFilterDuration: Dispatch<SetStateAction<string>>;
};

const PageButtons = ({
        filterDuration,
        setFilterDuration,
}: PageButtonsProps) => {

        return (
                <div>
                        <PageTabButtons
                                filterDuration={filterDuration}
                                setFilterDuration={setFilterDuration}
                        />
                </div>
        );
};

const PageTabButtons = ({
        filterDuration,
        setFilterDuration,
}: PageButtonsProps) => {

        const durations = [
                {
                        label: "3 months",
                        value: "3m",
                },
                {
                        label: "6 months",
                        value: "6m",
                },
                {
                        label: "1 Year",
                        value: "1y",
                },
        ];

        return (
                <div className="bg-white p-1 rounded-xs flex gap-2">
                        {durations.map((item) => {
                                const isActive = filterDuration === item.value;

                                return (
                                        <button
                                                key={item.value}
                                                onClick={() => setFilterDuration(item.value)}
                                                className={`py-2 px-4 rounded-xs transition-colors duration-300 cursor-pointer ${isActive
                                                                ? "bg-blue-700 text-white hover:bg-blue-900"
                                                                : "bg-transparent text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                aria-pressed={isActive}
                                        >
                                                {item.label}
                                        </button>
                                );
                        })}
                </div>
        );
};

type OverviewCardProps = {
        iconBg: string;
        icon: ReactNode;
        trendPositive: boolean;
        trendPercentage: string;
        label: string;
        number: string;
}

const OverviewCard = ({ iconBg, icon, trendPositive, trendPercentage, label, number } : OverviewCardProps ) => {
        return (
                <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2 space-y-2">
                        <div className="flex justify-between items-center gap-2 w-full">
                                <div className={`size-12 p-3 rounded-[10px] flex justify-center items-center ${iconBg}`}>
                                        {icon}
                                </div>
                                <div className={`flex gap-1 items-center justify-start py-1 px-2 rounded-sm ${trendPositive ? "text-emerald-500 bg-green-100" : "text-red-500 bg-rose-100"}`}>
                                        {trendPositive ? <ArrowUpRight className="size-1 text-current" /> : <ArrowDownRight className="size-1 text-current" />}
                                        <span className="text-xs text-current font-semibold font-text leading-4">
                                                {trendPercentage}
                                        </span>
                                </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-start items-start">
                                <h4 className="text-gray-500 text-xs font-semibold font-text uppercase">
                                        {label}
                                </h4>
                                <span className="text-neutral-950 text-lg md:text-3xl font-medium font-text">
                                        {number}
                                </span>
                        </div>
                </div>
        )
}

interface VehiclePeformanceRow {
        id: string;
        vehicleName: string;
        trips: number;
        revenue: string;
        averageRentalDays: number;
        lastRentalDate: string;
        totalMilageDriven: string;
}

const vehiclePeformanceColumns: ColumnDef<VehiclePeformanceRow>[] = [
        { 
                key: "vehicleName", 
                header: "Vehicle Name",
                cell: (row) => (
                        <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                                {row.vehicleName}
                        </span>
                ),

        },
        { 
                key: "trips", 
                header: "trips",
                cell: (row) => (
                        <span className="text-neutral-950 text-sm font-normal font-text leading-5">
                                {row.trips}
                        </span>
                ),
        },
        { 
                key: "revenue", 
                header: "revenue",
                cell: (row) => (
                        <span className="text-emerald-500 text-sm font-medium font-text leading-5">
                                {row.revenue}
                        </span>
                ),
        },
        {
                key: "averageRentalDays",
                header: "Avg Rental Days",
                cell: (row) => (
                        <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                                {row.averageRentalDays}
                        </span>
                ),

        },
        {
                key: "lastRentalDate",
                header: "Last Rental Date",
                cell: (row) => (
                        <span className="text-neutral-950 text-sm font-normal font-text leading-5">
                                {row.lastRentalDate}
                        </span>
                ),
        },
        {
                key: "totalMilageDriven",
                header: "Total Mileage Driven",
                cell: (row) => (
                        <span className="text-neutral-950 text-sm font-normal font-text leading-5">
                                {row.totalMilageDriven}
                        </span>
                ),
        },
];


const VehiclePeformanceTable = ({ tableData }: { tableData: VehiclePeformanceRow[] }) => {

        const data = tableData
                
        const { rows, pagination } = useTableRows({
                tableId: "vehiclePeformance",
                data,
                rowsPerPage: 10,
                searchFields: ["vehicleName",  "id"],
                sortField: "lastRentalDate",
        });

        return (
                <div className="bg-white p-3 md:p-6 rounded-[10px]">
                        <h3 className='font-semibold text-base font-text mb-3'>
                                Vehicle Peformance
                        </h3>
                        <DataTable
                                tableId="vehiclePeformance"
                                columns={vehiclePeformanceColumns}
                                rows={rows}
                                pagination={pagination}
                                emptyMessage="No patment history found."
                                toolbar={
                                        <TableToolbar
                                                search={{ placeholder: "Search by vechile name or ID..." }}
                                                dateSort
                                                actions={
                                                        <button
                                                                onClick={() =>
                                                                        exportToCSV(rows, {
                                                                                filename: "VehiclePeformanceReport",
                                                                                columns: ["id", "vehicleName", "trips", "revenue", "averageRentalDays", "lastRentalDate", "totalMilageDriven"],
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
                        />
                </div>
        )
}