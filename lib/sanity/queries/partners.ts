import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { Image, PortableTextBlock } from "sanity";

const builder = imageUrlBuilder(client);

export const getPartnerImageUrl = (
  source: Image | string | null | undefined,
  fallback: string = ""
): string => {
  if (!source) return fallback;
  if (typeof source === "string") return source;
  try {
    return builder.image(source).auto("format").fit("max").url();
  } catch {
    return fallback;
  }
};

export type PartnerCategory = {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
};

export type PartnerBenefitItem = {
  id?: string;
  _id?: string;
  title: string;
  slug?: string;
  category?: string | PartnerCategory | null;
  brandLogo?: Image | string | null;
  featuredImage?: Image | string | null;
  image?: Image | string | null;
  shortDescription?: string;
  description?: string;
  longDescription?: PortableTextBlock[] | string;
  icon?: string;
  iconBgColor?: string;
  isActive?: boolean;
  activeLabel?: string;
  status?: string;
  statusLabel?: string;
  link?: string;
  order?: number;
};

export type TrustedPartnersSectionData = {
  id?: string;
  heading?: string;
  highlightedText?: string;
  subheading?: string;
  description?: string;
  learnMoreText?: string;
  learnMoreLink?: string;
  showMoreComingSoon?: boolean;
  moreComingSoonText?: string;
  partners?: PartnerBenefitItem[];
};

export const DEFAULT_PARTNER_BENEFITS: PartnerBenefitItem[] = [
  {
    id: "abi-insurance",
    title: "ABI Insurance",
    category: "Insurance",
    shortDescription:
      "Get quoted rental and host insurance coverage directly through our partner.",
    description:
      "Get quoted rental and host insurance coverage directly through our partner.",
    isActive: true,
    activeLabel: "ACTIVE",
    status: "ACTIVE",
    icon: "shield",
    iconBgColor: "bg-blue-50 text-blue-600",
  },
  {
    id: "maintenance-savings",
    title: "Maintenance Savings",
    category: "Maintenance",
    status: "COMING SOON",
    statusLabel: "COMING SOON",
    isActive: false,
    icon: "wrench",
    iconBgColor: "bg-amber-50 text-amber-500",
  },
  {
    id: "roadside-assistance",
    title: "Roadside Assistance",
    category: "Roadside Assistance",
    status: "COMING SOON",
    statusLabel: "COMING SOON",
    isActive: false,
    icon: "truck",
    iconBgColor: "bg-purple-50 text-purple-600",
  },
  {
    id: "detailing-services",
    title: "Detailing Services",
    category: "Detailing",
    status: "COMING SOON",
    statusLabel: "COMING SOON",
    isActive: false,
    icon: "sparkles",
    iconBgColor: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "fuel-savings",
    title: "Fuel Savings",
    category: "Fuel",
    status: "COMING SOON",
    statusLabel: "COMING SOON",
    isActive: false,
    icon: "fuel",
    iconBgColor: "bg-orange-50 text-orange-500",
  },
];

export const DEFAULT_TRUSTED_PARTNERS_SECTION: TrustedPartnersSectionData = {
  heading: "POWERED BY TRUSTED PARTNERS",
  highlightedText: "TRUSTED",
  description:
    "Exclusive partner benefits to help you run your business and keep your fleet moving.",
  learnMoreText: "Learn More",
  learnMoreLink: "/for-hosts",
  showMoreComingSoon: true,
  moreComingSoonText: "More coming soon",
  partners: DEFAULT_PARTNER_BENEFITS,
};

export const TRUSTED_PARTNERS_QUERY = `*[
  _type in ["trustedPartnersSection", "trustedPartners", "homepagePartners", "partnersSection"]
][0]{
  "id": _id,
  title,
  heading,
  highlightedText,
  subheading,
  description,
  learnMoreText,
  learnMoreLink,
  showMoreComingSoon,
  moreComingSoonText,
  "partners": coalesce(
    partners[]->{
      "id": _id,
      title,
      "slug": slug.current,
      "category": category->title,
      brandLogo,
      featuredImage,
      "image": coalesce(brandLogo, featuredImage),
      shortDescription,
      "description": coalesce(shortDescription, description),
      longDescription,
      icon,
      iconBgColor,
      isActive,
      activeLabel,
      status,
      statusLabel,
      link,
      order
    },
    partners[]{
      "id": _id,
      title,
      "slug": slug.current,
      "category": category->title,
      brandLogo,
      featuredImage,
      "image": coalesce(brandLogo, featuredImage),
      shortDescription,
      "description": coalesce(shortDescription, description),
      longDescription,
      icon,
      iconBgColor,
      isActive,
      activeLabel,
      status,
      statusLabel,
      link,
      order
    },
    *[_type in ["trustedPartner", "partnerBenefit", "partner"]] | order(order asc, _createdAt asc){
      "id": _id,
      title,
      "slug": slug.current,
      "category": category->title,
      brandLogo,
      featuredImage,
      "image": coalesce(brandLogo, featuredImage),
      shortDescription,
      "description": coalesce(shortDescription, description),
      longDescription,
      icon,
      iconBgColor,
      isActive,
      activeLabel,
      status,
      statusLabel,
      link,
      order
    }
  )
}`;

const options = { next: { revalidate: 30 } };

export const fetchTrustedPartners = async (): Promise<TrustedPartnersSectionData | null> => {
  try {
    const data = await client.fetch<TrustedPartnersSectionData | null>(
      TRUSTED_PARTNERS_QUERY,
      {},
      options
    );
    return data;
  } catch (error) {
    console.error("Error fetching trusted partners from Sanity:", error);
    return null;
  }
};
