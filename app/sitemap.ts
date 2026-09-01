import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/constant";
import { US_STATES } from "@/constants/addressState";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Core public routes
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/browse-cars`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/for-hosts`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/usa`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faqs`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact-support`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/report-an-issue`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/connect-host`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/legal/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/legal/terms-and-conditions-of-use`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // US State landing pages
  const stateRoutes: MetadataRoute.Sitemap = US_STATES.map((state) => {
    const slug = state.label.toLowerCase().replace(/\s+/g, "-");
    return {
      url: `${SITE_URL}/usa/${slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  return [...coreRoutes, ...stateRoutes];
}

