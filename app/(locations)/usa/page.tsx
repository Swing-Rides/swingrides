import type { Metadata } from "next";
import LocationTemplate from "@/components/locationComponents/locationTemplate";
import { fetchLocationData } from "@/lib/sanity/queries/locations";

export const metadata: Metadata = {
  title: "USA Car Rental & Local Fleet Marketplace | Swing Rides",
  description:
    "Browse and rent cars directly from trusted local hosts across the United States. Fast online booking, flexible pickups, and transparent rates.",
  keywords: [
    "USA car rental",
    "United States car rental",
    "peer to peer car rental USA",
    "local hosts car rental",
    "Swing Rides",
  ],
  openGraph: {
    title: "USA Car Rental & Local Fleet Marketplace | Swing Rides",
    description:
      "Browse and rent cars directly from trusted local hosts across the United States. Fast online booking, flexible pickups, and transparent rates.",
    url: "/usa",
    siteName: "Swing Rides",
    images: [
      {
        url: "/images/swingrides-desktop-view.png",
        width: 1440,
        height: 867,
        alt: "USA Car Rental - Swing Rides",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "USA Car Rental & Local Fleet Marketplace | Swing Rides",
    description:
      "Browse and rent cars directly from trusted local hosts across the United States.",
    images: ["/images/swingrides-desktop-view.png"],
  },
  alternates: {
    canonical: "/usa",
  },
};

export default async function USAPage() {
  const data = await fetchLocationData({ country: "United States" });

  return <LocationTemplate data={data} locationName="United States" />;
}
