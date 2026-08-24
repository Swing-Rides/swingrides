'use client'

import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-dvh grid place-content-center bg-zinc-50 px-6">
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Icon mark */}
        <div className="flex items-center justify-center size-16 rounded-full bg-blue-50 mb-6">
          <Compass className="size-7 text-blue-700" />
        </div>

        {/* Eyebrow */}
        <span className="text-sm font-medium tracking-wide text-blue-700 uppercase mb-3">
          Error 404
        </span>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-3">
          We can&apos;t find that page
        </h1>

        {/* Supporting copy */}
        <p className="text-zinc-500 text-sm sm:text-base mb-8 leading-relaxed">
          The page you&apos;re looking for may have been moved, renamed, or
          no longer exists. Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xs bg-blue-700 text-white text-sm font-medium hover:bg-blue-950 duration-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 rounded-xs border border-zinc-300 text-zinc-700 text-sm font-medium hover:bg-zinc-200 duration-300 transition-colors cursor-pointer"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}