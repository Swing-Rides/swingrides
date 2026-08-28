'use client';

import Link from "next/link";
import { LayoutDashboard, Car, Calendar, AlertCircle, ArrowLeft, LifeBuoy } from "lucide-react";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";

export default function HostNotFound() {
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col items-center text-center max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">
        {/* Host Icon */}
        <div className="relative mb-6">
          <div className="flex items-center justify-center size-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <AlertCircle className="size-8 stroke-[1.75]" />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center size-7 rounded-full bg-slate-900 text-white">
            <Car className="size-3.5" />
          </div>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-100/70 text-amber-800 mb-3">
          Host Portal &bull; 404
        </span>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
          Host resource not found
        </h1>

        {/* Description */}
        <p className="text-slate-600 text-sm sm:text-base mb-8 leading-relaxed">
          The booking, vehicle details, report, or host setting you are trying to access could not be found or has been moved.
        </p>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
          <Link
            href={`${HOST_DASHBOARD_PATH}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-blue-700 text-white text-sm font-medium hover:bg-blue-950 duration-300 transition-colors shadow-xs"
          >
            <LayoutDashboard className="size-4" />
            Host Dashboard
          </Link>

          <Link
            href={`${HOST_DASHBOARD_PATH}fleet`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-200 duration-300 transition-colors"
          >
            <Car className="size-4" />
            Manage Fleet
          </Link>

          <Link
            href={`${HOST_DASHBOARD_PATH}bookings`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-200 duration-300 transition-colors"
          >
            <Calendar className="size-4" />
            View Bookings
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-200 duration-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Previous Page
          </button>
        </div>

        {/* Host Support Link */}
        <div className="pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>Need assistance with your fleet?</span>
          <Link
            href={`${HOST_DASHBOARD_PATH}report-an-issue`}
            className="font-medium text-blue-700 hover:text-blue-950 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LifeBuoy className="size-3.5" />
            Report an Issue
          </Link>
        </div>
      </div>
    </div>
  );
}
