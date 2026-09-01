import React from 'react';
import HeroSection from './heroSection';
import ValuePropsBar from './valuePropsBar';
import FeaturesSection from './featuresSection';
import HowItWorksSection from './howItWorksSection';
import HostCtaSection from './hostCtaSection';
import LocationPageSchema from './locationSchema';
import type { LocationPageData } from '@/lib/sanity/queries/locations';

type LocationTemplateProps = {
  data: LocationPageData;
  locationName?: string;
  state?: string;
  city?: string;
};

export default function LocationTemplate({
  data,
  locationName,
  state,
  city,
}: LocationTemplateProps) {
  const displayName = locationName || data.name || 'Atlanta';

  return (
    <div className="w-full flex flex-col">
      {/* Schema.org JSON-LD Structured Data */}
      <LocationPageSchema
        data={data}
        locationName={displayName}
        state={state}
        city={city}
      />

      {/* 1. Hero Section with Search Card */}
      <HeroSection
        data={data.hero}
        locationName={displayName}
        state={state}
        city={city}
      />

      {/* 2. Value Props Bar */}
      <ValuePropsBar items={data.valueProps} />

      {/* 3. Features & Benefits Section ("Made for Drivers") */}
      <FeaturesSection data={data.features} locationName={displayName} />

      {/* 4. How It Works Section ("Renting Made Simple.") */}
      <HowItWorksSection data={data.howItWorks} locationName={displayName} />

      {/* 5. Host Opportunity Section ("Your Vehicles. Your Business.") */}
      <HostCtaSection data={data.hostCta} locationName={displayName} />
    </div>
  );
}
