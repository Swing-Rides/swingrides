import React, { memo, useMemo, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shield, Wrench, Truck, Sparkles, Fuel } from "lucide-react";
import {
  DEFAULT_TRUSTED_PARTNERS_SECTION,
  DEFAULT_PARTNER_BENEFITS,
  getPartnerImageUrl,
  type PartnerBenefitItem,
  type TrustedPartnersSectionData,
} from "@/lib/sanity/queries/partners";

type TrustedPartnersSectionProps = {
  data?: TrustedPartnersSectionData | null;
};

const renderPartnerIcon = (
  iconName?: string,
  title?: string,
  image?: PartnerBenefitItem["image"]
): ReactNode => {
  const imageUrl = getPartnerImageUrl(image);
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={title || "Partner benefit"}
        width={24}
        height={24}
        className="size-6 object-contain"
      />
    );
  }

  const normalizedIcon = (iconName || title || "").toLowerCase();

  if (normalizedIcon.includes("shield") || normalizedIcon.includes("insurance") || normalizedIcon.includes("abi")) {
    return <Shield className="size-5 text-blue-600" />;
  }
  if (normalizedIcon.includes("wrench") || normalizedIcon.includes("maintenance")) {
    return <Wrench className="size-5 text-amber-500" />;
  }
  if (normalizedIcon.includes("truck") || normalizedIcon.includes("roadside") || normalizedIcon.includes("tow")) {
    return <Truck className="size-5 text-purple-600" />;
  }
  if (normalizedIcon.includes("sparkles") || normalizedIcon.includes("detail") || normalizedIcon.includes("clean")) {
    return <Sparkles className="size-5 text-emerald-600" />;
  }
  if (normalizedIcon.includes("fuel") || normalizedIcon.includes("gas") || normalizedIcon.includes("petrol")) {
    return <Fuel className="size-5 text-orange-500" />;
  }

  return <Shield className="size-5 text-blue-600" />;
};

const getIconContainerBg = (iconName?: string, title?: string): string => {
  const normalized = (iconName || title || "").toLowerCase();

  if (normalized.includes("insurance") || normalized.includes("abi") || normalized.includes("shield")) {
    return "bg-blue-50";
  }
  if (normalized.includes("maintenance") || normalized.includes("wrench")) {
    return "bg-amber-50";
  }
  if (normalized.includes("roadside") || normalized.includes("truck")) {
    return "bg-purple-50";
  }
  if (normalized.includes("detail") || normalized.includes("sparkles")) {
    return "bg-emerald-50";
  }
  if (normalized.includes("fuel") || normalized.includes("gas")) {
    return "bg-orange-50";
  }

  return "bg-blue-50";
};

const PartnerCard = memo(function PartnerCard({
  partner,
}: {
  partner: PartnerBenefitItem;
}) {
  const hasActiveBadge =
    partner.isActive ||
    Boolean(partner.activeLabel) ||
    partner.status === "ACTIVE";

  const activeLabelText =
    partner.activeLabel || (hasActiveBadge ? "ACTIVE" : "");

  const isComingSoon =
    !hasActiveBadge &&
    (partner.status === "COMING SOON" ||
      partner.statusLabel === "COMING SOON" ||
      !partner.description);

  const containerBg =
    partner.iconBgColor ||
    getIconContainerBg(partner.icon, partner.title);

  const partnerImage =
    partner.brandLogo || partner.featuredImage || partner.image;
  const partnerDesc = partner.shortDescription || partner.description;

  const cardContent = (
    <div className="bg-white rounded-xl border border-gray-100/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5 flex flex-col justify-between min-h-35 hover:shadow-md transition-shadow duration-200 h-full">
      {/* Top Row: Icon & Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${containerBg}`}
        >
          {renderPartnerIcon(partner.icon, partner.title, partnerImage)}
        </div>

        {hasActiveBadge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#dcfce7] text-[#15803d] font-text">
            {activeLabelText}
          </span>
        )}
      </div>

      {/* Bottom Row: Title & Description / Status */}
      <div className="mt-4 flex flex-col gap-1">
        <h3 className="text-neutral-950 text-base font-bold font-text leading-snug">
          {partner.title}
        </h3>

        {partnerDesc ? (
          <p className="text-gray-500 text-xs font-normal font-text leading-relaxed mt-0.5">
            {partnerDesc}
          </p>
        ) : isComingSoon ? (
          <span className="text-gray-400 text-xs font-bold font-text uppercase tracking-wider mt-0.5 block">
            {partner.statusLabel || partner.status || "COMING SOON"}
          </span>
        ) : null}
      </div>
    </div>
  );

  if (partner.link) {
    return (
      <Link href={partner.link} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return <div className="h-full">{cardContent}</div>;
});

const MoreComingSoonCard = memo(function MoreComingSoonCard({
  text,
}: {
  text: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-blue-400/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] p-5 flex flex-col items-center justify-center text-center min-h-35 h-full hover:border-blue-600 transition-colors duration-200">
      <span className="text-blue-600 text-2xl font-bold tracking-widest leading-none select-none">
        ...
      </span>
      <span className="text-blue-600 text-xs sm:text-sm font-semibold font-text mt-3">
        {text}
      </span>
    </div>
  );
});

function TrustedPartnersSectionComponent({
  data,
}: TrustedPartnersSectionProps) {
  const {
    description,
    learnMoreText,
    learnMoreLink,
    showMoreComingSoon,
    moreComingSoonText,
    partners,
  } = useMemo(() => {
    const desc =
      data?.description ||
      data?.subheading ||
      DEFAULT_TRUSTED_PARTNERS_SECTION.description;
    const btnText =
      data?.learnMoreText || DEFAULT_TRUSTED_PARTNERS_SECTION.learnMoreText;
    const btnLink =
      data?.learnMoreLink ||
      DEFAULT_TRUSTED_PARTNERS_SECTION.learnMoreLink ||
      "/for-hosts";
    const showMore =
      data?.showMoreComingSoon !== undefined
        ? data.showMoreComingSoon
        : DEFAULT_TRUSTED_PARTNERS_SECTION.showMoreComingSoon;
    const moreText =
      data?.moreComingSoonText ||
      DEFAULT_TRUSTED_PARTNERS_SECTION.moreComingSoonText ||
      "More coming soon";

    const partnerList =
      data?.partners && data.partners.length > 0
        ? data.partners
        : DEFAULT_PARTNER_BENEFITS;

    return {
      description: desc,
      learnMoreText: btnText,
      learnMoreLink: btnLink,
      showMoreComingSoon: showMore,
      moreComingSoonText: moreText,
      partners: partnerList,
    };
  }, [data]);

  return (
    <section className="section-bg-gradient py-12 px-4 md:px-20 md:py-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl lg:text-[56px] font-black uppercase text-neutral-950 font-sans leading-none">
            POWERED BY <span className="text-blue-700 font-sans">TRUSTED</span> PARTNERS
          </h2>
          <p className="text-gray-600 text-sm md:text-base font-normal font-text leading-relaxed">
            {description}
          </p>
          <div className="mt-1">
            <Link href={learnMoreLink}>
              <button className="py-2.5 px-6 rounded-xs bg-blue-700 hover:bg-blue-950 text-white text-sm font-semibold transition-colors duration-300 cursor-pointer shadow-xs">
                {learnMoreText}
              </button>
            </Link>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-2">
          {partners.map((partner, index) => (
            <PartnerCard
              key={partner.id || partner._id || `${partner.title}-${index}`}
              partner={partner}
            />
          ))}

          {/* "More coming soon" Card */}
          {showMoreComingSoon && (
            <MoreComingSoonCard text={moreComingSoonText} />
          )}
        </div>
      </div>
    </section>
  );
}

const TrustedPartnersSection = memo(TrustedPartnersSectionComponent);
export default TrustedPartnersSection;

