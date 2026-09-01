import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { findUSState } from "@/constants/addressState";

const builder = imageUrlBuilder(client);

export const buildBrowseCarsUrl = ({
  state,
  city,
  pickupDatetime,
  returnDatetime,
}: {
  state?: string;
  city?: string;
  pickupDatetime?: string;
  returnDatetime?: string;
} = {}): string => {
  const params = new URLSearchParams();

  if (state) {
    const matchedState = findUSState(state);
    params.set("state", matchedState?.value || state.toUpperCase());
  }

  if (city) {
    params.set("city", city.toLowerCase());
  }

  if (pickupDatetime) {
    params.set("pickupDatetime", pickupDatetime);
  }

  if (returnDatetime) {
    params.set("returnDatetime", returnDatetime);
  }

  const queryString = params.toString();
  return queryString ? `/browse-cars?${queryString}` : "/browse-cars";
};

export const getSanityImageUrl = (
  source: Image | string | null | undefined,
  fallback: string
): string => {
  if (!source) return fallback;
  if (typeof source === "string") return source;
  try {
    return builder.image(source).auto("format").fit("max").url();
  } catch {
    return fallback;
  }
};

export type HeroSectionData = {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  browseBtnText?: string;
  browseBtnLink?: string;
  becomeHostBtnText?: string;
  becomeHostBtnLink?: string;
  trustBadges?: string[];
  heroImage?: Image | string;
};

export type ValuePropItem = {
  title: string;
  description: string;
};

export type FeatureCardItem = {
  title: string;
  description: string;
  image?: Image | string;
};

export type FeaturesSectionData = {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  features?: FeatureCardItem[];
};

export type HowItWorksStep = {
  stepNumber: string;
  title: string;
  description: string;
  image?: Image | string;
};

export type HowItWorksSectionData = {
  eyebrow?: string;
  headline?: string;
  steps?: HowItWorksStep[];
  sideImage?: Image | string;
};

export type HostFeatureItem = {
  text: string;
  icon?: string;
};

export type HostCtaSectionData = {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  launchOfferTitle?: string;
  launchOfferText?: string;
  features?: HostFeatureItem[];
  ctaBtnText?: string;
  ctaBtnLink?: string;
  hostImage?: Image | string;
  activeBookingsCount?: number;
  totalVehiclesCount?: number;
};

export type LocationPageData = {
  id?: string;
  name: string;
  stateName?: string;
  countryName?: string;
  slug?: string;
  hero?: HeroSectionData;
  valueProps?: ValuePropItem[];
  features?: FeaturesSectionData;
  howItWorks?: HowItWorksSectionData;
  hostCta?: HostCtaSectionData;
};

const LOCATION_PAGE_QUERY = `*[
  _type in ["locationPage", "cityPage", "statePage"] &&
  (
    slug.current == $slug ||
    cityName == $city ||
    stateName == $state ||
    title == $locationName
  )
][0]{
  "id": _id,
  "name": coalesce(cityName, stateName, title, $locationName),
  "stateName": stateName,
  "countryName": countryName,
  "slug": slug.current,
  hero {
    eyebrow,
    headline,
    subheadline,
    browseBtnText,
    browseBtnLink,
    becomeHostBtnText,
    becomeHostBtnLink,
    trustBadges,
    heroImage
  },
  valueProps[] {
    title,
    description
  },
  features {
    eyebrow,
    headline,
    subheadline,
    features[] {
      title,
      description,
      image
    }
  },
  howItWorks {
    eyebrow,
    headline,
    steps[] {
      stepNumber,
      title,
      description,
      image
    },
    sideImage
  },
  hostCta {
    eyebrow,
    headline,
    subheadline,
    launchOfferTitle,
    launchOfferText,
    features[] {
      text,
      icon
    },
    ctaBtnText,
    ctaBtnLink,
    hostImage,
    activeBookingsCount,
    totalVehiclesCount
  }
}`;

const options = { next: { revalidate: 60 } };

export const formatLocationName = (slugOrName: string): string => {
  if (!slugOrName) return "";
  return slugOrName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getDefaultLocationData = (
  locationName: string,
  stateName?: string
): LocationPageData => {
  const formattedLocation = formatLocationName(locationName) || "Atlanta";
  const formattedState = stateName ? formatLocationName(stateName) : "";

  let defaultBrowseLink = "/browse-cars";
  if (stateName) {
    defaultBrowseLink = buildBrowseCarsUrl({ state: stateName, city: locationName });
  } else if (locationName && locationName !== "USA" && locationName !== "United States") {
    const isState = findUSState(locationName);
    if (isState) {
      defaultBrowseLink = buildBrowseCarsUrl({ state: locationName });
    } else {
      defaultBrowseLink = buildBrowseCarsUrl({ city: locationName });
    }
  }

  return {
    name: formattedLocation,
    stateName: formattedState,
    countryName: "USA",
    hero: {
      eyebrow: `Now Live in ${formattedLocation}`,
      headline: `${formattedLocation.toUpperCase()}'S SMARTER WAY TO RENT & RIDE`,
      subheadline: `SwingRides is now live in ${formattedLocation}. Discover vehicles from trusted local hosts across ${formattedLocation}. Connecting local hosts with renters looking for a better way to get around.`,
      browseBtnText: `Browse Vehicles in ${formattedLocation}`,
      browseBtnLink: defaultBrowseLink,
      becomeHostBtnText: "Become a Host",
      becomeHostBtnLink: "/for-hosts",
      trustBadges: [
        "Trusted local hosts",
        "Secure platform",
        "Real support",
      ],
      heroImage: "/images/swingrides-default-img.webp",
    },
    valueProps: [
      {
        title: "Local vehicles",
        description: "Listed by hosts near you",
      },
      {
        title: "More ways to ride",
        description: "From everyday cars to SUVs",
      },
      {
        title: "Host-first marketplace",
        description: "No hidden inspections required",
      },
      {
        title: "One simple platform",
        description: "Search, book and drive",
      },
    ],
    features: {
      eyebrow: `Made for ${formattedLocation} Drivers`,
      headline: "EVERY RIDE, EVERY JOURNEY, EVERY DAY",
      subheadline: `Skip the rental counter. ${formattedLocation} hosts list their own vehicles, so you get more choice, more flexibility, and a real person behind every booking.`,
      features: [
        {
          title: "Real variety",
          description:
            "From sedans to trucks, choose the exact vehicle that fits your trip, not whatever's left on the lot.",
          image: "/images/swingrides-default-img.webp",
        },
        {
          title: "Book on your schedule",
          description:
            "No counters, no rigid hours. Pick a time and place that actually works for you.",
          image: "/images/swingrides-default-img.webp",
        },
        {
          title: "A real person, not a counter",
          description:
            "Every booking connects you directly to the host renting out the vehicle. No middlemen.",
          image: "/images/swingrides-default-img.webp",
        },
        {
          title: "Your regular host, every time",
          description:
            "Already know a host? Connect your number to their fleet so their vehicles always show up first.",
          image: "/images/swingrides-default-img.webp",
        },
      ],
    },
    howItWorks: {
      eyebrow: "How It Works",
      headline: "RENTING MADE SIMPLE.",
      steps: [
        {
          stepNumber: "01",
          title: "Search & choose your vehicle",
          description:
            "Enter your pickup location and dates, then browse listings from local hosts to find what fits your trip.",
          image: "/images/swingrides-default-img.webp",
        },
        {
          stepNumber: "02",
          title: "Book instantly",
          description: "Reserve directly through the platform, no back and forth.",
          image: "/images/swingrides-default-img.webp",
        },
        {
          stepNumber: "03",
          title: "Pick up and go",
          description: "Meet your host, grab the keys, and hit the road.",
          image: "/images/swingrides-default-img.webp",
        },
      ],
      sideImage: "/images/swingrides-default-img.webp",
    },
    hostCta: {
      eyebrow: `${formattedLocation} Launch Offer`,
      headline: "YOUR VEHICLES. YOUR BUSINESS. MORE OPPORTUNITY.",
      subheadline: `Join SwingRides as an ${formattedLocation} host, list your vehicles and connect with renters looking for local options.`,
      launchOfferTitle: "LAUNCH OFFER",
      launchOfferText: "Get your first 3 months free",
      features: [
        { text: "Sign up and choose a plan in minutes" },
        { text: "List and manage your vehicles" },
        { text: "Help existing customers find your fleet" },
        { text: "Collect payments directly from renters through Stripe" },
      ],
      ctaBtnText: `Become an ${formattedLocation} Host`,
      ctaBtnLink: "/for-hosts",
      hostImage: "/images/swingrides-default-img.webp",
      activeBookingsCount: 42,
      totalVehiclesCount: 69,
    },
  };
};

export const fetchLocationData = async ({
  city,
  state,
  country = "USA",
}: {
  city?: string;
  state?: string;
  country?: string;
}): Promise<LocationPageData> => {
  const targetName = city || state || country || "Atlanta";
  const slug = (city || state || country || "atlanta").toLowerCase();

  try {
    const sanityData = await client.fetch<LocationPageData | null>(
      LOCATION_PAGE_QUERY,
      {
        slug,
        city: city ? formatLocationName(city) : null,
        state: state ? formatLocationName(state) : null,
        locationName: formatLocationName(targetName),
      },
      options
    );

    const defaultData = getDefaultLocationData(targetName, state);

    if (!sanityData) {
      return defaultData;
    }

    return {
      id: sanityData.id,
      name: sanityData.name || defaultData.name,
      stateName: sanityData.stateName || defaultData.stateName,
      countryName: sanityData.countryName || defaultData.countryName,
      slug: sanityData.slug || slug,
      hero: {
        eyebrow: sanityData.hero?.eyebrow || defaultData.hero?.eyebrow,
        headline: sanityData.hero?.headline || defaultData.hero?.headline,
        subheadline: sanityData.hero?.subheadline || defaultData.hero?.subheadline,
        browseBtnText: sanityData.hero?.browseBtnText || defaultData.hero?.browseBtnText,
        browseBtnLink: sanityData.hero?.browseBtnLink || defaultData.hero?.browseBtnLink,
        becomeHostBtnText: sanityData.hero?.becomeHostBtnText || defaultData.hero?.becomeHostBtnText,
        becomeHostBtnLink: sanityData.hero?.becomeHostBtnLink || defaultData.hero?.becomeHostBtnLink,
        trustBadges: sanityData.hero?.trustBadges || defaultData.hero?.trustBadges,
        heroImage: sanityData.hero?.heroImage || defaultData.hero?.heroImage,
      },
      valueProps: sanityData.valueProps?.length ? sanityData.valueProps : defaultData.valueProps,
      features: {
        eyebrow: sanityData.features?.eyebrow || defaultData.features?.eyebrow,
        headline: sanityData.features?.headline || defaultData.features?.headline,
        subheadline: sanityData.features?.subheadline || defaultData.features?.subheadline,
        features: sanityData.features?.features?.length ? sanityData.features.features : defaultData.features?.features,
      },
      howItWorks: {
        eyebrow: sanityData.howItWorks?.eyebrow || defaultData.howItWorks?.eyebrow,
        headline: sanityData.howItWorks?.headline || defaultData.howItWorks?.headline,
        steps: sanityData.howItWorks?.steps?.length ? sanityData.howItWorks.steps : defaultData.howItWorks?.steps,
        sideImage: sanityData.howItWorks?.sideImage || defaultData.howItWorks?.sideImage,
      },
      hostCta: {
        eyebrow: sanityData.hostCta?.eyebrow || defaultData.hostCta?.eyebrow,
        headline: sanityData.hostCta?.headline || defaultData.hostCta?.headline,
        subheadline: sanityData.hostCta?.subheadline || defaultData.hostCta?.subheadline,
        launchOfferTitle: sanityData.hostCta?.launchOfferTitle || defaultData.hostCta?.launchOfferTitle,
        launchOfferText: sanityData.hostCta?.launchOfferText || defaultData.hostCta?.launchOfferText,
        features: sanityData.hostCta?.features?.length ? sanityData.hostCta.features : defaultData.hostCta?.features,
        ctaBtnText: sanityData.hostCta?.ctaBtnText || defaultData.hostCta?.ctaBtnText,
        ctaBtnLink: sanityData.hostCta?.ctaBtnLink || defaultData.hostCta?.ctaBtnLink,
        hostImage: sanityData.hostCta?.hostImage || defaultData.hostCta?.hostImage,
        activeBookingsCount: sanityData.hostCta?.activeBookingsCount ?? defaultData.hostCta?.activeBookingsCount,
        totalVehiclesCount: sanityData.hostCta?.totalVehiclesCount ?? defaultData.hostCta?.totalVehiclesCount,
      },
    };
  } catch (error) {
    console.error("Error fetching location data from Sanity:", error);
    return getDefaultLocationData(targetName, state);
  }
};

