'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { buildBrowseCarsUrl, formatLocationName } from '@/lib/sanity/queries/locations';
import { findUSState } from '@/constants/addressState';

type LocationHeaderProps = {
  locationName?: string;
  state?: string;
  city?: string;
  browseBtnText?: string;
  browseBtnLink?: string;
  becomeHostBtnText?: string;
  becomeHostBtnLink?: string;
};

export default function LocationHeader({
  locationName,
  state,
  city,
  browseBtnText,
  browseBtnLink,
  becomeHostBtnText = 'Become a Host',
  becomeHostBtnLink = '/for-hosts',
}: LocationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Derive state and city dynamically from pathname when not explicitly passed as props
  // URL formats: /usa/[state]/[city], /usa/[state], /usa
  const pathSegments = (pathname || '').split('/').filter(Boolean);

  let autoState = state;
  let autoCity = city;
  let autoLocationName = locationName;

  if (pathSegments[0] === 'usa') {
    if (pathSegments[1] && !autoState) {
      autoState = pathSegments[1];
    }
    if (pathSegments[2] && !autoCity) {
      autoCity = pathSegments[2];
    }
  }

  if (!autoLocationName) {
    if (autoCity) {
      autoLocationName = formatLocationName(autoCity);
    } else if (autoState) {
      const matched = findUSState(autoState);
      autoLocationName = matched?.label || formatLocationName(autoState);
    } else {
      autoLocationName = 'USA';
    }
  }

  const displayBrowseText =
    browseBtnText ||
    (autoLocationName ? `Browse Vehicles in ${autoLocationName}` : 'Browse Vehicles');

  const displayBrowseLink =
    browseBtnLink ||
    buildBrowseCarsUrl({
      state: autoState,
      city: autoCity,
    });

  const handleToggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" title="Swing Rides Home" className="flex items-center">
              <Image
                src="/swing-rides-logo.png"
                alt="Swing Rides"
                width={110}
                height={55}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors duration-200"
            >
              How It Works
            </Link>
            <Link
              href={becomeHostBtnLink}
              className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors duration-200"
            >
              {becomeHostBtnText}
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={becomeHostBtnLink}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xs border border-blue-600 text-blue-700 text-xs sm:text-sm font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-2xs"
            >
              {becomeHostBtnText}
            </Link>
            <Link
              href={displayBrowseLink}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xs bg-blue-700 text-white text-xs sm:text-sm font-semibold hover:bg-blue-900 transition-colors duration-200 shadow-2xs text-nowrap"
            >
              {displayBrowseText}
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={handleToggleMenu}
              className="p-2 rounded-md text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/#how-it-works"
              onClick={handleCloseMenu}
              className="text-base font-medium text-slate-800 hover:text-blue-700 py-1"
            >
              How It Works
            </Link>
            <Link
              href={becomeHostBtnLink}
              onClick={handleCloseMenu}
              className="text-base font-medium text-slate-800 hover:text-blue-700 py-1"
            >
              {becomeHostBtnText}
            </Link>
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={becomeHostBtnLink}
              onClick={handleCloseMenu}
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-xs border border-blue-600 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              {becomeHostBtnText}
            </Link>
            <Link
              href={displayBrowseLink}
              onClick={handleCloseMenu}
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-xs bg-blue-700 text-white text-sm font-semibold hover:bg-blue-900 transition-colors text-center"
            >
              {displayBrowseText}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
