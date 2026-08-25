'use client';

import Link from "next/link";
import { Compass, ArrowLeft, Car, Home, LifeBuoy } from "lucide-react";

export default function MainWebsiteNotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center bg-slate-50/50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Decorative Badge & Icon */}
        <div className="relative mb-6">
          <div className="flex items-center justify-center size-20 rounded-2xl bg-blue-50 text-blue-700 shadow-xs border border-blue-100">
            <Compass className="size-10 stroke-[1.75]" />
          </div>
          <div className="absolute -bottom-2 -right-2 flex items-center justify-center size-8 rounded-full bg-blue-600 text-white shadow-sm">
            <Car className="size-4" />
          </div>
        </div>

        {/* Status Code */}
        <span className="flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 mb-3">
          404 &bull; Page Not Found
        </span>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          Lost on the road?
        </h1>

        {/* Description */}
        <p className="text-slate-600 text-sm sm:text-base mb-8 leading-relaxed">
          The page or vehicle you are searching for might have moved, been renamed, or is currently unavailable. Let&apos;s get you back in the driver&apos;s seat.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/browse-cars"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xs bg-blue-700 text-white text-sm font-semibold hover:bg-blue-950 transition-colors duration-300"
          >
            <Car className="size-4" />
            Browse Vehicles
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xs bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-300 transition-colors duration-300 shadow-xs"
          >
            <Home className="size-4" />
            Homepage
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xs border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-200 transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>

        {/* Support Link */}
        <div className="mt-10 pt-6 border-t border-slate-200 w-full flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>Need help finding something?</span>
          <Link
            href="/contact-support"
            className="font-medium text-blue-700 hover:text-blue-950 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LifeBuoy className="size-3.5" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
