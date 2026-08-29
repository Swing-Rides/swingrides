import React from 'react';
import Image from 'next/image';
import { getSanityImageUrl, type FeaturesSectionData } from '@/lib/sanity/queries/locations';

type FeaturesSectionProps = {
  data?: FeaturesSectionData;
  locationName: string;
};

export default function FeaturesSection({ data, locationName }: FeaturesSectionProps) {
  const eyebrow = data?.eyebrow || `Made for ${locationName} Drivers`;
  const headline = data?.headline || 'EVERY RIDE, EVERY JOURNEY, EVERY DAY';
  const subheadline =
    data?.subheadline ||
    `Skip the rental counter. ${locationName} hosts list their own vehicles, so you get more choice, more flexibility, and a real person behind every booking.`;

  const defaultCards = [
    {
      title: 'Real variety',
      description:
        "From sedans to trucks, choose the exact vehicle that fits your trip, not whatever's left on the lot.",
      image: '/images/swingrides-default-img.webp',
    },
    {
      title: 'Book on your schedule',
      description:
        'No counters, no rigid hours. Pick a time and place that actually works for you.',
      image: '/images/swingrides-default-img.webp',
    },
    {
      title: 'A real person, not a counter',
      description:
        'Every booking connects you directly to the host renting out the vehicle. No middlemen.',
      image: '/images/swingrides-default-img.webp',
    },
    {
      title: 'Your regular host, every time',
      description:
        'Already know a host? Connect your number to their fleet so their vehicles always show up first.',
      image: '/images/swingrides-default-img.webp',
    },
  ];

  const features = data?.features && data.features.length > 0 ? data.features : defaultCards;

  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col items-start max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100">
            <span className="size-2 rounded-full bg-blue-600"></span>
            {eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 uppercase tracking-tight mb-4">
            {headline}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base italic leading-relaxed">
            {subheadline}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const fallbackImg = defaultCards[idx % defaultCards.length].image;
            const imgSrc = getSanityImageUrl(feature.image, fallbackImg);

            return (
              <div
                key={idx}
                className="flex flex-col bg-slate-50/70 rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Card Image */}
                <div className="relative w-full h-48 bg-slate-200 overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={feature.title}
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 font-text">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed flex-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

