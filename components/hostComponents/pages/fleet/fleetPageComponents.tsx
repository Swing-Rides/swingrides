"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageWrapper from "../../dashboard/pageWrapper";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import FleetTable, { type FleetRow } from "./fleetTable";
import PopupWrapper from "./popupWrapper";
import RequestRelistVehicleForm from "../../forms/requestRelistVehicleForm";
import UnlistVehicleForm from "../../forms/unlistVehicleForm";
import SnoozeForm from "../../forms/snoozeForm";

// ─────────────────────────────────────────────────────────────────────────────
// TODO: swap this out for a real fetch (server action, route handler, SWR /
// react-query, etc). FleetRow's shape is the contract — as long as the API
// returns something that matches it, nothing else here needs to change.
//
// Only a few rows below carry the optional detail fields (vehicleInfo,
// maintenance, images, snoozeStart/snoozeEnd…) on purpose — it shows that the
// detail Sheet degrades gracefully when those fields aren't there yet,
// which will likely be true for at least some real records early on.
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_FLEET: FleetRow[] = [
        {
                id: "V-001", licensePlate: "ABC-1234", vehicleName: "Tesla Model 3", vehicleType: "Sedan", vehicleColor: "Midnight Silver", year: "2023",
                status: "available", dailyPrice: "$120.00", monthlyEarnings: "$3,600.00", availability: "In service",
                mileage: "12,480 mi",
                totalTrips: "58", totalRevenue: "$10,440.00", totalExpenses: "$1,920.00", netEarnings: "$8,520.00",
                vehicleInfo: {
                        make: "Tesla", model: "Model 3", color: "Midnight Silver", body: "Sedan",
                        transmission: "Automatic", fuelType: "Electric", seats: "5",
                        vin: "5YJ3E1EA7PF000001", vehicleId: "V-001",
                },
        },
        { id: "V-002", licensePlate: "XYZ-9876", vehicleName: "BMW X5", vehicleType: "SUV", vehicleColor: "Black", year: "2022", status: "rented", dailyPrice: "$180.00", monthlyEarnings: "$4,200.00", availability: "5 days" },
        { id: "V-003", licensePlate: "LMN-5566", vehicleName: "Audi A4", vehicleType: "Sedan", vehicleColor: "White", year: "2021", status: "unlisted", dailyPrice: "$110.00", monthlyEarnings: "$2,800.00", availability: "In service" },
        { id: "V-004", licensePlate: "QWE-4433", vehicleName: "Honda Accord", vehicleType: "Sedan", vehicleColor: "Silver", year: "2020", status: "rented", dailyPrice: "$80.00", monthlyEarnings: "$1,200.00", availability: "30 days" },
        { id: "V-005", licensePlate: "RTY-7788", vehicleName: "Ford F-150", vehicleType: "Truck", vehicleColor: "Blue", year: "2023", status: "available", dailyPrice: "$150.00", monthlyEarnings: "$3,900.00", availability: "2 days" },
        {
                id: "V-006", licensePlate: "UIO-1122", vehicleName: "Toyota RAV4", vehicleType: "SUV", vehicleColor: "Grey", year: "2022",
                status: "snoozed", dailyPrice: "$95.00", monthlyEarnings: "$2,500.00", availability: "In service",
                snoozeStart: "2026-06-25", snoozeEnd: "2026-07-10",
        },
        { id: "V-007", licensePlate: "PAS-9900", vehicleName: "Porsche 911", vehicleType: "Coupe", vehicleColor: "Red", year: "2023", status: "rented", dailyPrice: "$400.00", monthlyEarnings: "$8,500.00", availability: "1 day" },
        {
                id: "V-008", licensePlate: "DFG-2233", vehicleName: "Nissan Rogue", vehicleType: "SUV", vehicleColor: "White", year: "2021",
                status: "maintenance", dailyPrice: "$85.00", monthlyEarnings: "$2,100.00", availability: "In service",
                vehicleInfo: { make: "Nissan", model: "Rogue", body: "SUV", transmission: "Automatic", fuelType: "Gasoline", seats: "5", vin: "JN8AT2MV0MW000008", vehicleId: "V-008" },
                maintenance: { lastService: "2026-05-12", maintenanceType: "Oil change & brake check", nextDue: "2026-06-22", remainDuration: "Due in 2 days", status: "In progress" },
        },
        { id: "V-009", licensePlate: "HJK-5544", vehicleName: "Chevrolet Tahoe", vehicleType: "SUV", vehicleColor: "Black", year: "2022", status: "rented", dailyPrice: "$200.00", monthlyEarnings: "$4,800.00", availability: "12 days" },
        { id: "V-010", licensePlate: "ZXK-8877", vehicleName: "Mercedes E-Class", vehicleType: "Sedan", vehicleColor: "Silver", year: "2023", status: "rented", dailyPrice: "$220.00", monthlyEarnings: "$5,200.00", availability: "In service" },
        { id: "V-011", licensePlate: "CVB-6655", vehicleName: "Mazda Miata", vehicleType: "Convertible", vehicleColor: "Blue", year: "2021", status: "available", dailyPrice: "$130.00", monthlyEarnings: "$3,100.00", availability: "7 days" },
        { id: "V-012", licensePlate: "BNM-3344", vehicleName: "Jeep Wrangler", vehicleType: "SUV", vehicleColor: "Green", year: "2020", status: "rented", dailyPrice: "$140.00", monthlyEarnings: "$900.00", availability: "45 days" },
        { id: "V-013", licensePlate: "QAZ-1100", vehicleName: "Subaru Outback", vehicleType: "Wagon", vehicleColor: "Brown", year: "2022", status: "available", dailyPrice: "$100.00", monthlyEarnings: "$2,700.00", availability: "In service" },
        { id: "V-014", licensePlate: "WSX-9988", vehicleName: "Ford Mustang", vehicleType: "Coupe", vehicleColor: "Yellow", year: "2023", status: "maintenance", dailyPrice: "$160.00", monthlyEarnings: "$3,500.00", availability: "3 days" },
        { id: "V-015", licensePlate: "EDC-7766", vehicleName: "Tesla Model S", vehicleType: "Sedan", vehicleColor: "White", year: "2024", status: "available", dailyPrice: "$250.00", monthlyEarnings: "$6,000.00", availability: "In service" },
        { id: "V-016", licensePlate: "RFV-5544", vehicleName: "Mini Cooper", vehicleType: "Hatchback", vehicleColor: "Orange", year: "2019", status: "snoozed", dailyPrice: "$70.00", monthlyEarnings: "$1,800.00", availability: "In service", snoozeStart: "2026-06-15", snoozeEnd: "2026-06-29" },
        { id: "V-017", licensePlate: "TGB-3322", vehicleName: "Volkswagen Golf", vehicleType: "Hatchback", vehicleColor: "White", year: "2020", status: "rented", dailyPrice: "$75.00", monthlyEarnings: "$2,000.00", availability: "4 days" },
        { id: "V-018", licensePlate: "YHN-1100", vehicleName: "Volvo XC90", vehicleType: "SUV", vehicleColor: "Silver", year: "2023", status: "unlisted", dailyPrice: "$190.00", monthlyEarnings: "$4,500.00", availability: "In service" },
        { id: "V-019", licensePlate: "UJM-9988", vehicleName: "Range Rover", vehicleType: "SUV", vehicleColor: "Black", year: "2024", status: "available", dailyPrice: "$300.00", monthlyEarnings: "$7,200.00", availability: "10 days" },
        { id: "V-020", licensePlate: "IKM-7766", vehicleName: "Hyundai Elantra", vehicleType: "Sedan", vehicleColor: "Grey", year: "2021", status: "rented", dailyPrice: "$60.00", monthlyEarnings: "$400.00", availability: "60 days" },
        { id: "V-021", licensePlate: "OLP-5544", vehicleName: "BMW M4", vehicleType: "Coupe", vehicleColor: "Matte Grey", year: "2023", status: "unlisted", dailyPrice: "$280.00", monthlyEarnings: "$6,800.00", availability: "In service" },
];

type PopupType = "relist" | "unlist" | "createSnooze" | "editSnooze" | null;

export default function FleetPageComponents() {

        const router = useRouter();

        const [fleet, setFleet] = useState<FleetRow[]>(MOCK_FLEET);
        const [activePopup, setActivePopup] = useState<PopupType>(null);
        const [selectedVehicle, setSelectedVehicle] = useState<FleetRow | null>(null);

        const closePopup = () => {
                setActivePopup(null);
                setSelectedVehicle(null);
        };

        // ── Row-level actions — these decide *which* popup opens and *for which
        // vehicle*. Swap the body of any of these for a real API call later;
        // FleetTable never needs to know the difference. ──
        const handleUnlistVehicle = (vehicle: FleetRow) => {
                setSelectedVehicle(vehicle);
                setActivePopup("unlist");
        };

        const handleRelistVehicle = (vehicle: FleetRow) => {
                setSelectedVehicle(vehicle);
                setActivePopup("relist");
        };

        const handleSnoozeVehicle = (vehicle: FleetRow) => {
                setSelectedVehicle(vehicle);
                setActivePopup("createSnooze");
        };

        const handleEditSnoozeVehicle = (vehicle: FleetRow) => {
                setSelectedVehicle(vehicle);
                setActivePopup("editSnooze");
        };

        const handleDeleteVehicle = (vehicle: FleetRow) => {
                // TODO: DELETE /api/fleet/:id — optimistic update shown here, roll
                // back on failure once the real request is wired in.
                setFleet((prev) => prev.filter((v) => v.id !== vehicle.id));
        };

        const handleCreateBooking = (vehicle: FleetRow) => {
                // TODO: route to your booking flow, e.g.
                // router.push(`${HOST_DASHBOARD_PATH}bookings/new?vehicleId=${vehicle.id}`)
                console.log("Create booking for", vehicle.id);
        };

        const handleEndSnoozeEarly = async (vehicle: FleetRow) => {
                // TODO: PATCH the snooze record, then trust the server response
                // instead of guessing the next status client-side.
                setFleet((prev) =>
                        prev.map((v) => (v.id === vehicle.id ? { ...v, status: "available" } : v))
                );

                router.refresh();
        };

        // ── Form submit handlers — replace the console.log + local state update
        // with real requests. selectedVehicle is in scope, so you have the id. ──
        const submitRelistRequest = async (values: unknown) => {
                // TODO: POST to your relist-request endpoint
                console.log("Relist request:", selectedVehicle?.id, values);
                closePopup();
        };

        const submitUnlistVehicle = async (values: unknown) => {
                // TODO: POST to your unlist endpoint
                console.log("Unlist vehicle:", selectedVehicle?.id, values);
                if (selectedVehicle) {
                        setFleet((prev) =>
                                prev.map((v) => (v.id === selectedVehicle.id ? { ...v, status: "unlisted" } : v))
                        );
                }
                closePopup();
        };

        const submitCreateSnooze = async (values: unknown) => {
                // TODO: POST the new snooze window
                console.log("Create snooze:", selectedVehicle?.id, values);
                if (selectedVehicle) {
                        setFleet((prev) =>
                                prev.map((v) => (v.id === selectedVehicle.id ? { ...v, status: "snoozed" } : v))
                        );
                }
                closePopup();
        };

        const submitEditSnooze = async (values: unknown) => {
                // TODO: PATCH the existing snooze window
                console.log("Edit snooze:", selectedVehicle?.id, values);
                closePopup();
        };

        // ── Derived overview metrics — always in sync with the actual data,
        // recomputed only when fleet changes. ──
        const overview = useMemo(() => {
                const total = fleet.length;
                const available = fleet.filter((v) => v.status === "available").length;
                const rented = fleet.filter((v) => v.status === "rented").length;
                const inService = fleet.filter((v) => v.status === "maintenance").length;
                return { total, available, rented, inService };
        }, [fleet]);

        return (
                <>
                        <PageWrapper
                                pageTitle="Fleet"
                                pageDescription="Manage all your vehicles in one place"
                                pageButton={<PageButton />}
                        >
                                <div className="mt-4 md:mt-8">
                                        <div className="flex flex-wrap items-center gap-4">
                                                <OverviewCard
                                                        title="Total Vehicles"
                                                        number={String(overview.total)}
                                                        numberColor="text-blue-700"
                                                />
                                                <OverviewCard
                                                        title="Available"
                                                        number={String(overview.available)}
                                                        numberColor="text-cyan-600"
                                                />
                                                <OverviewCard
                                                        title="Currently Rented"
                                                        number={String(overview.rented)}
                                                        numberColor="text-blue-500"
                                                />
                                                <OverviewCard
                                                        title="In Service"
                                                        number={String(overview.inService)}
                                                        numberColor="text-amber-500"
                                                />
                                                <OverviewCard
                                                        title="Fleet Value"
                                                        number="$842K"
                                                        numberColor="text-emerald-500"
                                                />
                                        </div>
                                        <FleetTable
                                                data={fleet}
                                                onDeleteVehicle={handleDeleteVehicle}
                                                onUnlistVehicle={handleUnlistVehicle}
                                                onRelistVehicle={handleRelistVehicle}
                                                onSnoozeVehicle={handleSnoozeVehicle}
                                                onEditSnoozeVehicle={handleEditSnoozeVehicle}
                                                onCreateBooking={handleCreateBooking}
                                                onEndSnoozeEarly={handleEndSnoozeEarly}
                                        />
                                </div>
                        </PageWrapper>

                        <PopupWrapper
                                isOpen={activePopup === "relist"}
                                title="Request to Relist Vehicle"
                                description="Your request will be reviewed before this vehicle goes live again"
                                onClose={closePopup}
                                form={
                                        <RequestRelistVehicleForm
                                                onCancel={closePopup}
                                                onSubmit={submitRelistRequest}
                                        />
                                }
                        />

                        <PopupWrapper
                                isOpen={activePopup === "unlist"}
                                title="Unlist Vehicle"
                                description="Give a reason for unlisting this vehicle"
                                onClose={closePopup}
                                form={
                                        <UnlistVehicleForm
                                                // NOTE: check this against UnlistVehicleForm's actual prop type —
                                                // it previously received a hardcoded string, this now passes
                                                // the selected vehicle's real snooze end date when available.
                                                snoozeEnd={selectedVehicle?.snoozeEnd ?? ""}
                                                onCancel={closePopup}
                                                onSubmit={submitUnlistVehicle}
                                        />
                                }
                        />

                        <PopupWrapper
                                isOpen={activePopup === "createSnooze"}
                                title="Create Snooze"
                                onClose={closePopup}
                                form={<SnoozeForm onCancel={closePopup} onSubmit={submitCreateSnooze} />}
                        />

                        <PopupWrapper
                                isOpen={activePopup === "editSnooze"}
                                title="Edit Snooze"
                                onClose={closePopup}
                                form={
                                        <SnoozeForm
                                                defaultValues={{
                                                        duration: "custom",
                                                        startDate: selectedVehicle?.snoozeStart ? new Date(selectedVehicle.snoozeStart) : undefined,
                                                        endDate: selectedVehicle?.snoozeEnd ? new Date(selectedVehicle.snoozeEnd) : undefined,
                                                }}
                                                onCancel={closePopup}
                                                onSubmit={submitEditSnooze}
                                        />
                                }
                        />
                </>
        )
}

const PageButton = () => {
        return (
                <Link
                        href={`${HOST_DASHBOARD_PATH}fleet/add-vehicle`}
                        className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300"
                >
                        Add Vehicle
                </Link>
        )
}

type OverviewCardProps = {
        title: string;
        number: string;
        numberColor: string;
}

const OverviewCard = ({ title, number, numberColor }: OverviewCardProps) => {
        return (
                <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
                        <div>
                                <span className="text-gray-500 text-xs font-semibold font-text uppercase">
                                        {title}
                                </span>
                        </div>
                        <div className="self-stretch h-9 relative">
                                <span className={`text-3xl font-medium font-text ${numberColor}`}>
                                        {number}
                                </span>
                        </div>
                </div>
        )
}