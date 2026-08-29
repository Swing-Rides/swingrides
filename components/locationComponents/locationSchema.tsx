import React from 'react';
import { buildBrowseCarsUrl, type LocationPageData } from '@/lib/sanity/queries/locations';

type LocationSchemaProps = {
  data: LocationPageData;
  locationName: string;
  state?: string;
  city?: string;
  canonicalUrl?: string;
};

export default function LocationPageSchema({
  data,
  locationName,
  state,
  city,
  canonicalUrl,
}: LocationSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.swingrides.com';
  const pageUrl =
    canonicalUrl ||
    (city && state
      ? `${baseUrl}/usa/${state.toLowerCase()}/${city.toLowerCase()}`
      : state
        ? `${baseUrl}/usa/${state.toLowerCase()}`
        : `${baseUrl}/usa`);

  // 1. AutoRental / LocalBusiness Schema
  const autoRentalSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    '@id': `${pageUrl}#autorental`,
    name: `Swing Rides - ${locationName}`,
    description:
      data.hero?.subheadline ||
      `Rent cars directly from trusted local hosts in ${locationName}. Skip the rental counter with flexible pickup options and transparent pricing.`,
    url: pageUrl,
    logo: `${baseUrl}/images/swingrides-logo.png`,
    image: `${baseUrl}/images/swingrides-default-img.webp`,
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Credit Card, Debit Card, Stripe',
    areaServed: {
      '@type': city ? 'City' : 'AdministrativeArea',
      name: locationName,
      ...(state && {
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: state,
          containedInPlace: {
            '@type': 'Country',
            name: 'United States',
          },
        },
      }),
    },
    provider: {
      '@type': 'Organization',
      name: 'Swing Rides',
      url: baseUrl,
      logo: `${baseUrl}/images/swingrides-logo.png`,
    },
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}${buildBrowseCarsUrl({ state, city: city || locationName })}`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      result: {
        '@type': 'Reservation',
        name: `Car Rental in ${locationName}`,
      },
    },
  };

  // 2. BreadcrumbList Schema
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'USA',
      item: `${baseUrl}/usa`,
    },
  ];

  if (state) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: state.toUpperCase(),
      item: `${baseUrl}/usa/${state.toLowerCase()}`,
    });
  }

  if (city && state) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 4,
      name: locationName,
      item: `${baseUrl}/usa/${state.toLowerCase()}/${city.toLowerCase()}`,
    });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  // 3. HowTo Schema (How It Works)
  const steps = data.howItWorks?.steps || [];
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Rent a Car in ${locationName} with Swing Rides`,
    description: `A quick 3-step guide to renting a vehicle from local hosts in ${locationName}.`,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
      url: `${pageUrl}#how-it-works`,
    })),
  };

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [autoRentalSchema, breadcrumbSchema, howToSchema],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
}

