import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationTemplate from "@/components/locationComponents/locationTemplate";
import { fetchLocationData } from "@/lib/sanity/queries/locations";
import { findUSState } from "@/constants/addressState";
import { SITE_URL } from "@/constants/constant";

type PageProps = {
  params: Promise<{
    state: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  const matchedState = findUSState(state);

  if (!matchedState) {
    return notFound();
  }

  const stateName = matchedState.label;
  const title = `${stateName} Car Rental & Local Fleet Marketplace | Swing Rides`;
  const description = `Discover and rent cars from trusted local hosts across ${stateName}. Skip the rental counter with flexible pickup and transparent pricing.`;
  const url = `${SITE_URL}/usa/${state.toLowerCase()}`;

  return {
    title,
    description,
    keywords: [
      `${stateName} car rental`,
      `${stateName} rent a car`,
      `peer to peer car rental ${stateName}`,
      `local hosts ${stateName}`,
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
          alt: `${stateName} Car Rental`,
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

export default async function StatePage({ params }: PageProps) {
  const { state } = await params;
  const matchedState = findUSState(state);

  if (!matchedState) {
    return notFound();
  }

  const stateName = matchedState.label;
  const data = await fetchLocationData({ state: stateName });

  return (
    <LocationTemplate
      data={data}
      locationName={stateName}
      state={stateName}
    />
  );
}
