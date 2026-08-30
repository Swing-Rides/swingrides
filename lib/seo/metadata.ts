import type { Metadata } from "next";
import { SITE_URL } from "@/constants/constant";

export const DEFAULT_OG_IMAGE = "/images/swingrides-desktop-view.png";

export interface ConstructMetadataParams {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  openGraphType?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
}

export function constructMetadata({
  title,
  description = "Drive your fleet. Own your data. Rent cars directly from trusted local hosts across the United States with Swing Rides.",
  path = "",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  openGraphType = "website",
  keywords,
  publishedTime,
  modifiedTime,
}: ConstructMetadataParams = {}): Metadata {
  const fullTitle = title
    ? `${title} | Swing Rides`
    : "Swing Rides | Drive your fleet. Own your data.";

  const normalizedPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : "";
  const canonicalUrl = normalizedPath ? `${SITE_URL}${normalizedPath}` : SITE_URL;

  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords || [
      "car rental",
      "peer to peer car rental",
      "rent a car",
      "car sharing",
      "fleet marketplace",
      "Swing Rides",
      "local car hosts",
    ],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: "Swing Rides",
      images: [
        {
          url: imageUrl,
          width: 1440,
          height: 867,
          alt: title || "Swing Rides",
        },
      ],
      type: openGraphType,
      locale: "en_US",
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
        },
  };
}
