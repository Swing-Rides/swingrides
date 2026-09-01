import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Car,
  CalendarCheck,
  CreditCard,
  Sparkles,
  Users,
  ClipboardList,
} from 'lucide-react';
import { getSanityImageUrl, type HostCtaSectionData } from '@/lib/sanity/queries/locations';

type HostCtaSectionProps = {
  data?: HostCtaSectionData;
  locationName: string;
};

export default function HostCtaSection({ data, locationName }: HostCtaSectionProps) {
  const eyebrow = data?.eyebrow || `${locationName} Launch Offer`;
  const headline = data?.headline || 'YOUR VEHICLES. YOUR BUSINESS. MORE OPPORTUNITY.';
  const subheadline =
    data?.subheadline ||
    `Join SwingRides as an ${locationName} host, list your vehicles and connect with renters looking for local options.`;

  const launchOfferTitle = data?.launchOfferTitle || 'LAUNCH OFFER';
  const launchOfferText = data?.launchOfferText || 'Get your first 3 months free';

  const defaultFeatures = [
    { text: 'Sign up and choose a plan in minutes' },
    { text: 'List and manage your vehicles' },
    { text: 'Help existing customers find your fleet' },
    { text: 'Collect payments directly from renters through Stripe' },
  ];

  const features = data?.features && data.features.length > 0 ? data.features : defaultFeatures;

  const ctaBtnText = data?.ctaBtnText || `Become an ${locationName} Host`;
  const ctaBtnLink = data?.ctaBtnLink || '/for-hosts';

  const hostImageSrc = getSanityImageUrl(
    data?.hostImage,
    '/images/swingrides-default-img.webp'
  );

  const activeBookingsCount = data?.activeBookingsCount ?? 42;
  const totalVehiclesCount = data?.totalVehiclesCount ?? 69;

  const getFeatureIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <User className="size-4 text-white" />;
      case 1:
        return <ClipboardList className="size-4 text-white" />;
      case 2:
        return <Users className="size-4 text-white" />;
      case 3:
        return <CreditCard className="size-4 text-white" />;
      default:
        return <Sparkles className="size-4 text-white" />;
    }
  };

  return (
    <section className="w-full bg-[#0B1528] text-white py-16 lg:py-24 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column - Image & Floating Fleet Overview Card */}
          <div className="lg:col-span-6 relative flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Host Photo */}
              <div className="relative w-full h-100 sm:h-120 lg:h-130 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-800">
                <Image
                  src={hostImageSrc}
                  alt={`SwingRides host in ${locationName}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Floating Fleet Overview Card */}
              <div className="absolute -bottom-6 left-4 sm:left-6 bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 min-w-65 sm:min-w-72.5 z-10">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-3 font-text">
                  Your Fleet Overview
                </span>
                <div className="grid grid-cols-2 gap-3 divide-x divide-slate-100">
                  <div className="flex flex-col gap-1 pr-2">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <CalendarCheck className="size-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        Active Bookings
                      </span>
                    </div>
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-text">
                      {activeBookingsCount}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 pl-3">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Car className="size-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        Total Vehicles
                      </span>
                    </div>
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-text">
                      {totalVehiclesCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Host Opportunity Content */}
          <div className="lg:col-span-6 flex flex-col items-start order-1 lg:order-2">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-600/40 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-5">
              <span className="size-2 rounded-full bg-blue-400 animate-pulse"></span>
              {eyebrow}
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase leading-[110%] mb-5">
              {headline}
            </h2>

            {/* Subheading */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              {subheadline}
            </p>

            {/* Launch Offer Card */}
            <div className="w-full bg-[#132238] border border-blue-700/50 rounded-xl p-4 sm:p-5 flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center size-10 rounded-full bg-blue-600 text-white shrink-0">
                <Sparkles className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  {launchOfferTitle}
                </span>
                <span className="text-sm sm:text-base font-bold text-white font-text">
                  {launchOfferText}
                </span>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="flex flex-col gap-3.5 w-full mb-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-7 rounded-full bg-blue-600 shrink-0">
                    {getFeatureIcon(idx)}
                  </div>
                  <span className="text-xs sm:text-sm text-slate-200 font-medium font-text">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href={ctaBtnLink}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xs bg-white text-slate-950 text-sm font-bold hover:bg-slate-100 transition-colors duration-200 shadow-md text-nowrap"
            >
              {ctaBtnText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

