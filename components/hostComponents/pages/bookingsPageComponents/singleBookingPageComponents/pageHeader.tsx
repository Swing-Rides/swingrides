import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BookingsStatus =
  | "active"
  | "reserved"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "noShow";

type PageHeaderProps = {
  id: string;
  status: BookingsStatus;
  handleEditBooking: () => void;
};

export default function PageHeader({
  id,
  status,
  handleEditBooking,
}: PageHeaderProps) {
  const statusStyles: Record<BookingsStatus, string> = {
    active: "text-emerald-500 bg-green-100",
    completed: "text-white bg-black",
    reserved: "text-gray-500 bg-neutral-200",
    confirmed: "text-blue-500 bg-sky-100",
    cancelled: "text-red-500 bg-rose-100",
    noShow: "text-red-500 bg-rose-100",
  };

  const statusStyle = statusStyles[status] || "text-amber-500 bg-amber-100";

  return (
    <div className="flex flex-col gap-4">
      <Link
        href={`${HOST_DASHBOARD_PATH}bookings`}
        className="flex justify-start items-center gap-2 text-gray-500 hover:text-gray-900 duration-300 transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span className="text-center text-sm font-medium font-text">
          Back to Bookings
        </span>
      </Link>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
        <div className="flex flex-col justify-start items-start gap-2">
          <div className="flex justify-start items-start">
            <h2 className="text-neutral-950 text-2xl font-bold font-text">
              Booking Details
            </h2>
          </div>
          <div className="flex justify-start items-center gap-3">
            <span className="justify-start text-cyan-600 text-base font-medium font-text">
              {id}
            </span>
            <span
              className={`py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4 capitalize ${statusStyle}`}
            >
              {status}
            </span>
          </div>
        </div>
        <div className="flex justify-start items-center gap-3">
          {["active", "reserved", "confirmed"].includes(status) && (
            <button
              className="text-blue-700 text-sm font-semibold font-text leading-5 px-6 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 hover:text-white transition-colors duration-300 cursor-pointer"
              onClick={handleEditBooking}
            >
              Edit
            </button>
          )}
          {["active", "completed"].includes(status) && (
            <button className="text-gray-500 text-sm font-semibold font-text leading-5 px-6 py-2 rounded-xs border border-gray-500 hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer">
              Charge Incidentals
            </button>
          )}
          {["active", "reserved", "confirmed"].includes(status) && (
            <button className="text-center text-red-500 text-sm font-semibold font-text capitalize px-6 py-2 rounded-xs border border-red-500 hover:bg-red-900 hover:text-white transition-colors duration-300 cursor-pointer">
              Cancel Booking
            </button>
          )}
          {["active", "confirmed"].includes(status) && (
            <button className="bg-blue-700 text-white text-sm font-semibold font-text leading-5 px-6 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 transition-colors duration-300 cursor-pointer">
              Complete Check-In
            </button>
          )}
          {["completed"].includes(status) && (
            <button className="bg-blue-700 text-white text-sm font-semibold font-text leading-5 px-6 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 transition-colors duration-300 cursor-pointer">
              Complete Check-Out
            </button>
          )}
          {["noShow"].includes(status) && (
            <button className="bg-blue-700 text-white text-sm font-semibold font-text leading-5 px-6 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 transition-colors duration-300 cursor-pointer">
              Contact renter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
