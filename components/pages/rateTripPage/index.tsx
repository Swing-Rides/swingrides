"use client";

import { useSubmitTripReviewMutation } from "@/app/store/services/renterApi";
import { PageIntroProps } from "@/constants/connectToHost";
import Link from "next/link";
import { PageIntro } from "../connectToHostPage";
import Image from "next/image";
import { DEFAULT_IMAGE_SRC } from "@/constants/constant";
import RateTripForm, {
  RateTripFormValues,
} from "@/components/forms/rateTripForm";
import { useRouter } from "next/navigation";

const pageIntro: PageIntroProps = {
  imageSrc: "/images/star-rating_svg.svg",
  pageTitle: "How was your trip?",
  description: `Your feedback helps other renters make better decisions and helps hosts improve their service.`,
};

type RateTripPageComponentProps = {
  bookingId: string;
  rentalId: string;
  imageUrl: string;
  carName: string;
  pickUpDate: string;
  returnDate: string;
  tripDurationDays: string;
};

export default function RateTripPageComponent({
  bookingId,
  rentalId,
  imageUrl,
  carName,
  pickUpDate,
  returnDate,
  tripDurationDays,
}: RateTripPageComponentProps) {
  const router = useRouter();
  const [submitTripReview] = useSubmitTripReviewMutation();

  return (
    <div className="w-full mx-auto py-12.5 px-4 overflow-clip section-bg-gradient space-y-10">
      <PageIntro {...pageIntro} />
      <div className="flex flex-col gap-10 max-w-146 mx-auto w-full">
        <div className="p-4 bg-white rounded-[10px] border border-gray-200 flex flex-col justify-start items-start">
          <div className="flex justify-start items-center gap-4">
            <div className="aspect-3/2 object-cover rounded-[10px] overflow-hidden">
              <Image
                src={imageUrl || DEFAULT_IMAGE_SRC}
                alt={carName}
                title={carName}
                width={192}
                height={128}
                className="aspect-3/2 w-full max-w-30 object-cover"
              />
            </div>
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="flex justify-start items-center gap-2.5">
                <p className="justify-start text-neutral-950 text-base font-bold font-text leading-6">
                  {carName}
                </p>
              </div>
              <div>
                <p className="text-zinc-800 text-sm font-normal font-text leading-5">
                  {pickUpDate} - {returnDate} · {tripDurationDays}
                </p>
              </div>
              <div>
                <p className="text-cyan-600 text-xs font-normal font-['DM_Mono'] leading-4">
                  Ref: {rentalId}
                </p>
              </div>
            </div>
          </div>
        </div>

        <RateTripForm
          onSubmit={async (values: RateTripFormValues) => {
            await submitTripReview({
              id: bookingId,
              categoryRatings: values.categoryRatings,
              review: values.review,
              recommend: values.recommend as "yes" | "no",
            }).unwrap();
            router.push(`/trip/${bookingId}`);
          }}
        />

        <div className="flex flex-col gap-4">
          <Link
            href="/profile"
            className="text-center justify-start text-neutral-950 hover:text-blue-700 duration-300 transition-colors text-sm font-semibold font-text leading-5"
          >
            Skip for Now
          </Link>
          <span className="block text-center text-gray-500 text-xs font-normal font-text leading-4">
            Reviews are published publicly and cannot be edited after
            submission.
          </span>
        </div>
      </div>
    </div>
  );
}
