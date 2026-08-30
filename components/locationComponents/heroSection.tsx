'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MapPin } from 'lucide-react';
import MainForm from '@/components/forms/MainForm';
import type { FormFieldConfig } from '@/components/forms/types';
import {
  getSanityImageUrl,
  buildBrowseCarsUrl,
  type HeroSectionData,
} from '@/lib/sanity/queries/locations';
import { findUSState } from '@/constants/addressState';

type HeroSectionProps = {
  data?: HeroSectionData;
  locationName: string;
  state?: string;
  city?: string;
};

export default function HeroSection({
  data,
  locationName,
  state,
  city,
}: HeroSectionProps) {
  const router = useRouter();

  const eyebrow = data?.eyebrow || `Now Live in ${locationName}`;
  const headline =
    data?.headline || `${locationName.toUpperCase()}'S SMARTER WAY TO RENT & RIDE`;
  const subheadline =
    data?.subheadline ||
    `SwingRides is now live in ${locationName}. Discover vehicles from trusted local hosts across ${locationName}. Connecting local hosts with renters looking for a better way to get around.`;

  const browseBtnText = data?.browseBtnText || `Browse Vehicles in ${locationName}`;

  // On a state page (where city is undefined), only include state param: /browse-cars?state=GA
  // On a city page (where city is defined), include both: /browse-cars?state=GA&city=atlanta
  const defaultBrowseLink = buildBrowseCarsUrl({
    state: state || (locationName && findUSState(locationName) ? locationName : undefined),
    city: city ? city : undefined,
  });
  const browseBtnLink = data?.browseBtnLink || defaultBrowseLink;

  const becomeHostBtnText = data?.becomeHostBtnText || 'Become a Host';
  const becomeHostBtnLink = data?.becomeHostBtnLink || '/for-hosts';

  const trustBadges = data?.trustBadges?.length
    ? data.trustBadges
    : ['Trusted local hosts', 'Secure platform', 'Real support'];

  const heroImageSrc = getSanityImageUrl(
    data?.heroImage,
    '/images/swingrides-default-img.webp'
  );

  const defaultLocationValue =
    city && state
      ? `${city}, ${findUSState(state)?.value || state}`
      : locationName || 'Georgia';

  const formFields: FormFieldConfig[] = [
    {
      name: 'pickupLocation',
      type: 'text',
      label: 'Pick-up location',
      placeholder: 'City, state or airport',
      defaultValue: defaultLocationValue,
      icon: <MapPin className="size-4 text-blue-600" />,
      validation: { required: 'Pick-up location is required' },
    },
    {
      name: 'pickupDate',
      type: 'date',
      label: 'Pick-up date',
      placeholder: 'Select date',
    },
    {
      name: 'returnDate',
      type: 'date',
      label: 'Return date',
      placeholder: 'Select date',
    },
  ];

  const handleSearch = (values: Record<string, unknown>) => {
    let searchState = state;
    let searchCity = city;

    if (values.pickupLocation) {
      const locStr = String(values.pickupLocation).trim();
      if (locStr.includes(',')) {
        const parts = locStr.split(',');
        const parsedCity = parts[0]?.trim();
        const parsedState = parts[1]?.trim();
        if (parsedCity) searchCity = parsedCity;
        if (parsedState) searchState = parsedState;
      } else {
        const matched = findUSState(locStr);
        if (matched) {
          searchState = matched.value;
          searchCity = undefined; // State matched, do not include city
        } else {
          // If on a state page and input matches state name, don't set city
          if (state && (locStr.toLowerCase() === state.toLowerCase() || (searchState && locStr.toLowerCase() === searchState.toLowerCase()))) {
            searchCity = undefined;
          } else {
            searchCity = locStr;
          }
        }
      }
    }

    const url = buildBrowseCarsUrl({
      state: searchState,
      city: searchCity,
      pickupDatetime: values.pickupDate ? String(values.pickupDate) : undefined,
      returnDatetime: values.returnDate ? String(values.returnDate) : undefined,
    });

    router.push(url);
  };

  return (
    <section className="relative w-full bg-[#F3F8FC] py-12 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-5">
              <span className="size-2 rounded-full bg-blue-600 animate-pulse"></span>
              {eyebrow}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] leading-[105%] font-extrabold text-slate-950 uppercase mb-5">
              {headline}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              {subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-8">
              <Link
                href={browseBtnLink}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xs bg-blue-700 text-white text-sm font-semibold hover:bg-blue-900 transition-colors duration-200 shadow-sm text-nowrap"
              >
                {browseBtnText}
              </Link>
              <Link
                href={becomeHostBtnLink}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xs border border-blue-600 text-blue-700 bg-white text-sm font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-2xs text-nowrap"
              >
                {becomeHostBtnText}
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-blue-600 shrink-0" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image & Floating Search Widget Column */}
          <div className="lg:col-span-6 relative w-full flex justify-center">
            <div className="relative w-full max-w-xl lg:max-w-none">
              {/* Hero Image */}
              <div className="relative w-full h-95 sm:h-115 lg:h-125 rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 bg-slate-200">
                <Image
                  src={heroImageSrc}
                  alt={`${locationName} car rental with local hosts`}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Overlay Search Card using MainForm */}
              <div className="relative sm:absolute sm:-bottom-8 sm:left-4 lg:left-6 sm:w-[90%] md:w-95 bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 mt-4 sm:mt-0 z-10">
                <MainForm
                  fields={formFields}
                  rowPairs={[['pickupDate', 'returnDate']]}
                  onSubmit={handleSearch}
                  submitLabel="Search"
                  className="gap-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
