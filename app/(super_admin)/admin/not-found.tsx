'use client';

import Link from "next/link";
import { LayoutDashboard, Users, UserCheck, Ticket, ShieldAlert, ArrowLeft } from "lucide-react";

export default function SuperAdminNotFound() {
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 md:p-10">
      <div className="flex flex-col items-center text-center max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">
        {/* Admin Icon */}
        <div className="relative mb-6">
          <div className="flex items-center justify-center size-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <ShieldAlert className="size-8 stroke-[1.75]" />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center size-7 rounded-full bg-slate-900 text-white">
            <span className="text-[10px] font-bold tracking-tight">ADM</span>
          </div>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-100/70 text-indigo-800 mb-3">
          Admin Console &bull; 404
        </span>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
          Admin record not found
        </h1>

        {/* Description */}
        <p className="text-slate-600 text-sm sm:text-base mb-8 leading-relaxed">
          The administrative view, subscriber record, renter profile, or support ticket you are looking for does not exist or has been removed.
        </p>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 duration-300 transition-colors shadow-xs"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>

          <Link
            href="/admin/subscribers"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-200 duration-300 transition-colors"
          >
            <Users className="size-4" />
            Subscribers
          </Link>

          <Link
            href="/admin/renters"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-200 duration-300 transition-colors"
          >
            <UserCheck className="size-4" />
            Renters
          </Link>

          <Link
            href="/admin/tickets"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-200 duration-300 transition-colors"
          >
            <Ticket className="size-4" />
            Tickets
          </Link>
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xs border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors duration-300 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Go Back to Previous Screen
        </button>
      </div>
    </div>
  );
}
