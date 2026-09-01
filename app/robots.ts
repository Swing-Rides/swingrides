import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/constant";

export default function robots(): MetadataRoute.Robots {
  const privateRoutes = [
    "/admin/",
    "/admin",
    "/us/host/",
    "/us/host",
    "/checkout/",
    "/checkout",
    "/payment-unsuccessful/",
    "/payment-unsuccessful",
    "/profile",
    "/profile/",
    "/trip/",
    "/trip",
    "/sign-in",
    "/host/",
    "/host",
    "/verify-email",
    "/api/",
    "/backend/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "Anthropic-ai",
          "PerplexityBot",
          "CCBot",
          "Bytespider",
        ],
        allow: [
          "/",
          "/about-us",
          "/browse-cars",
          "/for-hosts",
          "/faqs",
          "/contact-support",
          "/report-an-issue",
          "/connect-host",
          "/legal/",
          "/usa",
          "/llms.txt",
        ],
        disallow: privateRoutes,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

