import React from "react";
import { SITE_URL, DEFAULT_IMAGE_SRC, DISCORD_COMMUNITY_LINK } from "@/constants/constant";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/metadata";

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function JsonLd({
  schema,
}: {
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: "Swing Rides",
    url: SITE_URL,
    logo: `${SITE_URL}/images/swingrides-default-img.webp`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    description:
      "Swing Rides is a peer-to-peer car rental and local fleet marketplace connecting renters with verified vehicle hosts.",
    sameAs: [
      DISCORD_COMMUNITY_LINK,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact-support`,
    },
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: "Swing Rides",
    description: "Drive your fleet. Own your data. Rent cars directly from trusted local hosts.",
    publisher: {
      "@id": `${SITE_URL}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/browse-cars?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path
        ? item.path.startsWith("http")
          ? item.path
          : `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`
        : undefined,
    })),
  };
}

export function getAutoRentalSchema({
  name = "Swing Rides Car Rental",
  description = "Rent cars directly from trusted local hosts with flexible pickups and transparent rates.",
  path = "",
  image = DEFAULT_OG_IMAGE,
  priceRange = "$$",
}: {
  name?: string;
  description?: string;
  path?: string;
  image?: string;
  priceRange?: string;
} = {}) {
  const pageUrl = path ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : SITE_URL;
  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": `${pageUrl}#autorental`,
    name,
    description,
    url: pageUrl,
    logo: `${SITE_URL}/images/swingrides-default-img.webp`,
    image: imageUrl,
    priceRange,
    currenciesAccepted: "USD",
    paymentAccepted: "Credit Card, Debit Card, Stripe",
    provider: {
      "@type": "Organization",
      name: "Swing Rides",
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/browse-cars`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Car Rental Reservation",
      },
    },
  };
}

export function getWebPageSchema({
  name,
  description,
  path,
  breadcrumbs,
}: {
  name: string;
  description: string;
  path: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const pageUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name,
    description,
    isPartOf: {
      "@id": `${SITE_URL}#website`,
    },
    ...(breadcrumbs && {
      breadcrumb: getBreadcrumbSchema(breadcrumbs),
    }),
  };
}

export function getAboutPageSchema({
  name = "About Swing Rides",
  description = "Learn more about Swing Rides, our fleet marketplace mission, and how we empower local hosts and renters.",
  path = "/about-us",
}: {
  name?: string;
  description?: string;
  path?: string;
} = {}) {
  const pageUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl}#aboutpage`,
    url: pageUrl,
    name,
    description,
    isPartOf: {
      "@id": `${SITE_URL}#website`,
    },
    mainEntity: {
      "@id": `${SITE_URL}#organization`,
    },
  };
}

export function getContactPageSchema({
  name = "Contact Swing Rides Support",
  description = "Get in touch with Swing Rides support team for assistance with bookings, fleets, or technical issues.",
  path = "/contact-support",
}: {
  name?: string;
  description?: string;
  path?: string;
} = {}) {
  const pageUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}#contactpage`,
    url: pageUrl,
    name,
    description,
    isPartOf: {
      "@id": `${SITE_URL}#website`,
    },
    mainEntity: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: pageUrl,
    },
  };
}

export function getFAQPageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getVehicleProductSchema({
  id,
  carName,
  description,
  images = [],
  price,
  city,
  state,
  make,
  vehicleModel,
  year,
  rating,
  totalReviews,
}: {
  id: string;
  carName: string;
  description?: string;
  images?: string[];
  price?: { daily?: number; weekly?: number; monthly?: number };
  city?: string;
  state?: string;
  make?: string;
  vehicleModel?: string;
  year?: number;
  rating?: number;
  totalReviews?: number;
}) {
  const pageUrl = `${SITE_URL}/browse-cars/${id}`;
  const imageList = images.length > 0
    ? images.map((img) => (img.startsWith("http") ? img : `${SITE_URL}${img.startsWith("/") ? img : `/${img}`}`))
    : [`${SITE_URL}${DEFAULT_OG_IMAGE}`];

  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Car", "Vehicle"],
    "@id": `${pageUrl}#vehicle`,
    name: carName,
    description: description || `${carName} available for rent on Swing Rides in ${city || ""}, ${state || ""}.`,
    image: imageList,
    url: pageUrl,
    ...(make && { brand: { "@type": "Brand", name: make } }),
    ...(vehicleModel && { model: vehicleModel }),
    ...(year && { modelDate: String(year) }),
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: "USD",
      price: price?.daily || 0,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "Organization",
        name: "Swing Rides",
        url: SITE_URL,
      },
    },
    ...(rating && totalReviews && totalReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: totalReviews,
          },
        }
      : {}),
  };
}
