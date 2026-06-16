"use client"

import { useState } from "react";
import { useTableRows, DataTable, TableToolbar, ColumnDef, exportToCSV } from "../../dashboard/customTable";
import { Download } from "lucide-react";

interface FleetRow {
        id: string;
        licensePlate: string;
        vehicleName: string;
        vehicleType: string;
        vehicleColor: string;
        status: string;
        dailyPrice: string;
        monthlyEarnings: string;
        availability: string;
}

const MOCK_FLEET: FleetRow[] = [
        { id: "V-001", licensePlate: "ABC-1234", vehicleName: "Tesla Model 3", vehicleType: "Sedan", vehicleColor: "Midnight Silver", status: "available", dailyPrice: "$120.00", monthlyEarnings: "$3,600.00", availability: "In service" },
        { id: "V-002", licensePlate: "XYZ-9876", vehicleName: "BMW X5", vehicleType: "SUV", vehicleColor: "Black", status: "rented", dailyPrice: "$180.00", monthlyEarnings: "$4,200.00", availability: "5 days" },
        { id: "V-003", licensePlate: "LMN-5566", vehicleName: "Audi A4", vehicleType: "Sedan", vehicleColor: "White", status: "unlisted", dailyPrice: "$110.00", monthlyEarnings: "$2,800.00", availability: "In service" },
        { id: "V-004", licensePlate: "QWE-4433", vehicleName: "Honda Accord", vehicleType: "Sedan", vehicleColor: "Silver", status: "rented", dailyPrice: "$80.00", monthlyEarnings: "$1,200.00", availability: "30 days" },
        { id: "V-005", licensePlate: "RTY-7788", vehicleName: "Ford F-150", vehicleType: "Truck", vehicleColor: "Blue", status: "available", dailyPrice: "$150.00", monthlyEarnings: "$3,900.00", availability: "2 days" },
        { id: "V-006", licensePlate: "UIO-1122", vehicleName: "Toyota RAV4", vehicleType: "SUV", vehicleColor: "Grey", status: "snoozed", dailyPrice: "$95.00", monthlyEarnings: "$2,500.00", availability: "In service" },
        { id: "V-007", licensePlate: "PAS-9900", vehicleName: "Porsche 911", vehicleType: "Coupe", vehicleColor: "Red", status: "rented", dailyPrice: "$400.00", monthlyEarnings: "$8,500.00", availability: "1 day" },
        { id: "V-008", licensePlate: "DFG-2233", vehicleName: "Nissan Rogue", vehicleType: "SUV", vehicleColor: "White", status: "maintenance", dailyPrice: "$85.00", monthlyEarnings: "$2,100.00", availability: "In service" },
        { id: "V-009", licensePlate: "HJK-5544", vehicleName: "Chevrolet Tahoe", vehicleType: "SUV", vehicleColor: "Black", status: "rented", dailyPrice: "$200.00", monthlyEarnings: "$4,800.00", availability: "12 days" },
        { id: "V-010", licensePlate: "ZXK-8877", vehicleName: "Mercedes E-Class", vehicleType: "Sedan", vehicleColor: "Silver", status: "rented", dailyPrice: "$220.00", monthlyEarnings: "$5,200.00", availability: "In service" },
        { id: "V-011", licensePlate: "CVB-6655", vehicleName: "Mazda Miata", vehicleType: "Convertible", vehicleColor: "Blue", status: "available", dailyPrice: "$130.00", monthlyEarnings: "$3,100.00", availability: "7 days" },
        { id: "V-012", licensePlate: "BNM-3344", vehicleName: "Jeep Wrangler", vehicleType: "SUV", vehicleColor: "Green", status: "rented", dailyPrice: "$140.00", monthlyEarnings: "$900.00", availability: "45 days" },
        { id: "V-013", licensePlate: "QAZ-1100", vehicleName: "Subaru Outback", vehicleType: "Wagon", vehicleColor: "Brown", status: "available", dailyPrice: "$100.00", monthlyEarnings: "$2,700.00", availability: "In service" },
        { id: "V-014", licensePlate: "WSX-9988", vehicleName: "Ford Mustang", vehicleType: "Coupe", vehicleColor: "Yellow", status: "maintenance", dailyPrice: "$160.00", monthlyEarnings: "$3,500.00", availability: "3 days" },
        { id: "V-015", licensePlate: "EDC-7766", vehicleName: "Tesla Model S", vehicleType: "Sedan", vehicleColor: "White", status: "available", dailyPrice: "$250.00", monthlyEarnings: "$6,000.00", availability: "In service" },
        { id: "V-016", licensePlate: "RFV-5544", vehicleName: "Mini Cooper", vehicleType: "Hatchback", vehicleColor: "Orange", status: "snoozed", dailyPrice: "$70.00", monthlyEarnings: "$1,800.00", availability: "In service" },
        { id: "V-017", licensePlate: "TGB-3322", vehicleName: "Volkswagen Golf", vehicleType: "Hatchback", vehicleColor: "White", status: "rented", dailyPrice: "$75.00", monthlyEarnings: "$2,000.00", availability: "4 days" },
        { id: "V-018", licensePlate: "YHN-1100", vehicleName: "Volvo XC90", vehicleType: "SUV", vehicleColor: "Silver", status: "unlisted", dailyPrice: "$190.00", monthlyEarnings: "$4,500.00", availability: "In service" },
        { id: "V-019", licensePlate: "UJM-9988", vehicleName: "Range Rover", vehicleType: "SUV", vehicleColor: "Black", status: "available", dailyPrice: "$300.00", monthlyEarnings: "$7,200.00", availability: "10 days" },
        { id: "V-020", licensePlate: "IKM-7766", vehicleName: "Hyundai Elantra", vehicleType: "Sedan", vehicleColor: "Grey", status: "rented", dailyPrice: "$60.00", monthlyEarnings: "$400.00", availability: "60 days" },
        { id: "V-021", licensePlate: "OLP-5544", vehicleName: "BMW M4", vehicleType: "Coupe", vehicleColor: "Matte Grey", status: "unlisted", dailyPrice: "$280.00", monthlyEarnings: "$6,800.00", availability: "In service" }
];


const fleetColumns: ColumnDef<FleetRow>[] = [
        {
                key: "vehicle",
                header: "Vehicle",
                cell: (row) => (
                        <div className="flex flex-col">
                                <span className="text-neutral-950 text-sm font-semibold leading-5">{row.vehicleName}</span>
                                <span className="text-gray-500 font-normal">{row.vehicleType} • {row.vehicleColor}</span>
                        </div>
                ),
        },
        {
                key: "licensePlate",
                header: "License Plate",
                cell: (row) => <span className="text-cyan-600 font-medium">{row.licensePlate}</span>,
        },
        {
                key: "Type",
                header: "Type",
                cell: (row) => <span className="text-gray-500 font-normal">{row.vehicleType}</span>,
        },
        {
                key: "status",
                header: "Status",
                cell: (row) => <StatusBadge status={row.status} />,
        },
        {
                key: "dailyPrice",
                header: "Daily Price",
                cell: (row) => (
                        <span className="text-neutral-950 font-medium">
                                {row.dailyPrice}/day
                        </span>
                ),
        },
        {
                key: "monthlyEarnings",
                header: "Monthly Earnings",
                cell: (row) => (
                        <span className="text-emerald-500 font-medium">
                                {row.monthlyEarnings}
                        </span>
                ),
        },
        {
                key: "availability",
                header: "Availability",
                cell: (row) => (
                        <span className="text-gray-500 font-normal">
                                {row.availability}
                        </span>
                ),
        },
];

export default function FleetTable() {
        const [data, setData] = useState<FleetRow[]>(MOCK_FLEET);
        
        const { rows, pagination } = useTableRows({
                tableId: "fleet",
                data,
                searchFields: ["vehicleName", "licensePlate"],
                filters: [
                        { paramKey: "status", field: "status" },
                        { paramKey: "type", field: "vehicleType" },
                ],
                rowsPerPage: 10,
        });

        return (
                <DataTable
                        tableId="fleet"
                        columns={fleetColumns}
                        rows={rows}
                        pagination={pagination}
                        toolbar={
                                <TableToolbar
                                        search={{ placeholder: "Search vehicle name or plate number..." }}
                                        filters={[
                                                {
                                                        title: "All Status",
                                                        paramKey: "status",
                                                        items: [
                                                                { label: "Available", value: "available" },
                                                                { label: "Rented", value: "rented" },
                                                                { label: "unlisted", value: "unlisted" },
                                                                { label: "Snoozed", value: "snoozed" },
                                                                { label: "Maintenance", value: "maintenance" },
                                                        ],
                                                },
                                                {
                                                        title: "All Types",
                                                        paramKey: "type",
                                                        items: [
                                                                { label: "Sedan", value: "sedan" },
                                                                { label: "Electric", value: "electric" },
                                                                { label: "Truck", value: "truck" },
                                                        ],
                                                },
                                        ]}
                                        actions={
                                                <button
                                                        onClick={() =>
                                                                exportToCSV(rows, {
                                                                        filename: "subscribers",
                                                                        columns: ["id", "organization", "ownerEmail", "plan", "vehicles", "status", "monthlyRevenue", "joinedDate"],
                                                                })
                                                        }
                                                        className="flex items-center gap-2 px-5 py-2 rounded-xs bg-transparent border border-blue-700 hover:bg-blue-700 group duration-300 transition-colors cursor-pointer"
                                                >
                                                        <span className="text-blue-700 text-sm font-medium font-text group-hover:text-white transition-colors">
                                                                Export CSV
                                                        </span>
                                                        <Download className="size-4 text-blue-700 group-hover:text-white transition-colors" />
                                                </button>
                                        }
                                />
                        }

                        // Eye → navigate to subscriber detail page
                        viewAction={{
                                type: "link",
                                href: (row) => `/subscribers/${row.id}`,
                        }}

                        // Pencil → edit dialog; parent supplies the form fields as ReactNode
                        editAction={{
                                confirmLabel: "Save changes",
                                onConfirm: (row) => {
                                        console.log("save subscriber", row.id);
                                        // In a real app: call your API, then refresh data
                                },
                                dialogContent: (row) => (
                                        <div className="space-y-4">
                                                <p className="text-gray-500 text-sm">
                                                        Update the details for <span className="font-semibold text-neutral-800">{row.vehicleName}</span>.
                                                </p>
                                                <div className="space-y-3">
                                                        <div>
                                                                <label className="block text-xs font-medium text-gray-600 mb-1">Vehicle name</label>
                                                                <input
                                                                        defaultValue={row.vehicleName}
                                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                        </div>
                                                        <div>
                                                                <label className="block text-xs font-medium text-gray-600 mb-1">Vechile Type</label>
                                                                <input
                                                                        defaultValue={row.vehicleType}
                                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                        </div>
                                                </div>
                                        </div>
                                ),
                        }}

                        // Trash → delete dialog; parent supplies warning copy
                        deleteAction={{
                                dataType: "Fleet",
                                onConfirm: (row) => {
                                        setData((prev) => prev.filter((r) => r.id !== row.id));
                                },
                                dialogContent: (row) => (
                                        <div className="flex flex-col space-y-3">
                                                <span>
                                                        You are about to permanently delete{" "}
                                                        <span className="font-semibold text-neutral-800">{row.vehicleName}</span>.
                                                </span>
                                                <span className="text-gray-400 text-xs">
                                                        This will remove all associated vehicles, billing history, and user access.
                                                        This action cannot be undone.
                                                </span>
                                        </div>
                                ),
                        }}
                />
        );
}

function StatusBadge({ status }: { status: string }) {
        const styles: Record<string, string> = {
                available: "bg-green-100 text-emerald-500",
                rented: "bg-sky-100 text-blue-700",
                unlisted: "bg-gray-200 text-gray-500",
                snoozed: "bg-amber-50 text-amber-700",
                maintenance: "bg-orange-50 text-amber-500",
                inactive: "bg-gray-100 text-gray-500",
        };
        return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? styles.inactive}`}>
                        {status}
                </span>
        );
}