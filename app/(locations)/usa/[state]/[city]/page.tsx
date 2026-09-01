import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationTemplate from "@/components/locationComponents/locationTemplate";
import {
  fetchLocationData,
  formatLocationName,
} from "@/lib/sanity/queries/locations";
import { findUSState } from "@/constants/addressState";

type PageProps = {
  params: Promise<{
    state: string;
    city: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city } = await params;
  const matchedState = findUSState(state);

  if (!matchedState) {
    return notFound();
  }

  const cityName = formatLocationName(city);
  const stateName = matchedState.label;
  const title = `${cityName}, ${stateName} Car Rental | Swing Rides`;
  const description = `Rent cars directly from local hosts in ${cityName}, ${stateName}. Skip the rental counter with flexible pickup, transparent pricing, and trusted local fleets.`;
  const url = `/usa/${state.toLowerCase()}/${city.toLowerCase()}`;

  return {
    title,
    description,
    keywords: [
      `${cityName} car rental`,
      `${cityName} rent a car`,
      `${stateName} car rental`,
      `peer to peer car rental ${cityName}`,
      `local car rental ${cityName}`,
      "Swing Rides",
      "fleet marketplace",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "Swing Rides",
      images: [
        {
          url: "/images/swingrides-default-img.webp",
          width: 1200,
          height: 630,
          alt: `${cityName}, ${stateName} Car Rental`,
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/swingrides-default-img.webp"],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { state, city } = await params;
  const matchedState = findUSState(state);

  if (!matchedState) {
    return notFound();
  }

  const cityName = formatLocationName(city);
  const stateName = matchedState.label;
  const data = await fetchLocationData({ city: cityName, state: stateName });

  return (
    <LocationTemplate
      data={data}
      locationName={cityName}
      state={stateName}
      city={cityName}
    />
  );
}
