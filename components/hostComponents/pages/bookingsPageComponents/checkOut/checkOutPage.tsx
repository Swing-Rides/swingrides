"use client";

import { Dispatch, SetStateAction, useState, useCallback, useEffect, memo } from "react";
import PageWrapper from "../../../dashboard/pageWrapper";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { FormProvider, useForm, useWatch, useFormContext } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/lib/utils";
import StepThree from "./stepThree";
import StepTwo from "./stepTwo";
import StepOne from "./stepOne";
import { useParams, useRouter } from "next/navigation";
import {
  BookingResponse,
  useCompleteCheckOutMutation,
  useGetBookingByIdQuery,
  useGetBookingByReferenceQuery,
} from "@/app/store/services/bookingApi";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { toast } from "sonner";

type CategoryRatingKey =
  | "vehicleCondition"
  | "cleanliness"
  | "communication"
  | "pickupReturn"
  | "adherenceToTerms";

export type FuelLevelValue =
  "1/8" | "2/8" | "3/8" | "4/8" | "5/8" | "6/8" | "7/8" | "8/8 (Full)";

type DamageStatus = "none" | "damage";

export type CheckOutFormValues = {
  confirmReturnIds: string[];
  categoryRatings: Record<CategoryRatingKey, number>;
  reviewNotes: string;
  checkoutMileage: number | "";
  checkoutFuelLevel: FuelLevelValue | "";
  checkoutPhoto?: FileList;
  damageStatus: DamageStatus | "";
  damageType: string;
  damageDescription: string;
};

// Data fetched from the server for comparison against checkout values
export type CheckInData = {
  mileage: number;
  fuelLevel: FuelLevelValue;
  photoUrl: string;
};

// The renter's own self-checkout form uses a coarser quarter-based fuel scale
// than the host wizard's eighths scale - map the values that translate cleanly.
// "Empty" has no safe equivalent on the host's 1/8-8/8 scale, so it's left
// unmapped and the host picks it themselves.
const RENTER_TO_HOST_FUEL_LEVEL: Record<string, FuelLevelValue> = {
  "1/4": "2/8",
  "1/2": "4/8",
  "3/4": "6/8",
  "Full": "8/8 (Full)",
};

const confirmReturn = [
  {
    id: "vehicleReturned",
    label: "I confirm the renter has returned the vehicle",
  },
  {
    id: "vehicleKeyReturned",
    label: "Vehicle keys have been returned",
  },
];

// ─── Rating categories config ──────────────────────────────────────────────────

export const RATING_CATEGORIES: { id: CategoryRatingKey; label: string }[] = [
  { id: "vehicleCondition", label: "Vehicle Condition After Return" },
  { id: "cleanliness", label: "Cleanliness" },
  { id: "communication", label: "Communication" },
  { id: "pickupReturn", label: "Pickup & Return" },
  { id: "adherenceToTerms", label: "Adherence to Rental Terms" },
];

export const DEFAULT_CATEGORY_RATINGS: Record<CategoryRatingKey, number> = {
  vehicleCondition: 0,
  cleanliness: 0,
  communication: 0,
  pickupReturn: 0,
  adherenceToTerms: 0,
};

export function useIsStepOneComplete() {
  const confirmReturnIds = useWatch<CheckOutFormValues, "confirmReturnIds">({
    name: "confirmReturnIds",
  });
  return confirmReturn.every((item) => confirmReturnIds?.includes(item.id));
}

export default function CheckOutPage() {
  const params = useParams<{ id: string }>();
  const bookingId = decodeURIComponent(params.id);
  const isReferenceCode = /^SR-/i.test(bookingId);
  const bookingById = useGetBookingByIdQuery(bookingId, { skip: isReferenceCode });
  const bookingByReference = useGetBookingByReferenceQuery(bookingId, {
    skip: !isReferenceCode,
  });
  const booking = isReferenceCode
    ? bookingByReference.data?.data
    : bookingById.data?.data;
  const isLoading = isReferenceCode
    ? bookingByReference.isLoading
    : bookingById.isLoading;
  const isError = isReferenceCode
    ? bookingByReference.isError
    : bookingById.isError;

  const methods = useForm<CheckOutFormValues>({
    defaultValues: {
      confirmReturnIds: [],
      categoryRatings: DEFAULT_CATEGORY_RATINGS,
      reviewNotes: "",
      checkoutMileage: "",
      checkoutFuelLevel: "",
      checkoutPhoto: undefined,
      damageStatus: "",
      damageType: "",
      damageDescription: "",
    },
  });

  return (
    <PageWrapper
      pageDescription={`Process vehicle return for booking ${bookingId}`}
      pageTitle="Complete Check-Out"
    >
      {isLoading ? (
        <div className="mt-6 rounded-lg border bg-white p-6 text-sm text-gray-500">
          Loading booking checkout details...
        </div>
      ) : isError || !booking ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Unable to load this booking. Confirm that the booking belongs to your account.
        </div>
      ) : booking.status === "cancelled" ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          A cancelled booking cannot be checked out.
        </div>
      ) : booking.status === "completed" && booking.checkOut?.completedBy !== "renter" ? (
        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-700">
          This booking has already been checked out and completed.
        </div>
      ) : !["checked_in", "in_progress", "completed"].includes(booking.status) ? (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
          Complete the booking check-in before starting checkout.
        </div>
      ) : (
        <FormProvider {...methods}>
          <CheckOutWizard booking={booking} />
        </FormProvider>
      )}
    </PageWrapper>
  );
}

const CheckOutWizard = memo(function CheckOutWizard({
  booking,
}: {
  booking: BookingResponse;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [completeCheckOut, { isLoading: isCompleting }] =
    useCompleteCheckOutMutation();

  const { getValues, trigger, handleSubmit: formHandleSubmit, reset } =
    useFormContext<CheckOutFormValues>();

  const renterCheckOut =
    booking.checkOut?.completedBy === "renter" ? booking.checkOut : undefined;

  // The renter already submitted their own return - seed the host's form with
  // it once on mount so the host reviews/overrides instead of starting blank.
  // Deliberately runs only once: re-running on every `booking` refetch would
  // stomp on whatever the host has already typed.
  useEffect(() => {
    if (!renterCheckOut) return;
    reset((prev) => ({
      ...prev,
      confirmReturnIds: [
        ...(renterCheckOut.returnConfirmation.renterReturned ? ["vehicleReturned"] : []),
        ...(renterCheckOut.returnConfirmation.keysReturned ? ["vehicleKeyReturned"] : []),
      ],
      checkoutMileage: renterCheckOut.vehicleInspection.mileage,
      checkoutFuelLevel:
        RENTER_TO_HOST_FUEL_LEVEL[renterCheckOut.vehicleInspection.fuelLevel] || "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCheckInData = useCallback(async (): Promise<CheckInData> => {
    const fuelPercent = Number(booking.checkIn?.fuelLevel ?? 100);
    const eighths = Math.max(1, Math.min(8, Math.round(fuelPercent / 12.5)));
    return {
      mileage: Number(booking.checkIn?.odometerReading ?? 0),
      fuelLevel: eighths === 8 ? "8/8 (Full)" : `${eighths}/8` as FuelLevelValue,
      photoUrl:
        booking.checkIn?.vehicleCondition?.exterior?.[0] ||
        booking.vehicleImage ||
        "/images/swingrides-default-img.webp",
    };
  }, [booking]);

  const goBack = useCallback(() => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  }, []);

  const goNext = useCallback(async () => {
    if (step === 1) {
      const confirmReturnIds = getValues("confirmReturnIds");
      const isComplete = confirmReturn.every((item) =>
        confirmReturnIds?.includes(item.id),
      );
      if (!isComplete) return;
    }
    if (step === 2) {
      const valid = await trigger([
        "checkoutMileage",
        "checkoutFuelLevel",
        "checkoutPhoto",
        "damageStatus",
        "damageType",
        "damageDescription",
      ]);
      if (!valid) return;
    }
    setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
  }, [step, getValues, trigger]);

  const handleSubmit = useCallback(() => {
    formHandleSubmit(async (data) => {
      const photo = data.checkoutPhoto?.[0];
      const renterPhotoUrls = renterCheckOut?.vehicleInspection.photoUrls || [];
      if (!photo && renterPhotoUrls.length === 0) {
        toast.error("Please upload an after-checkout photo");
        return;
      }
      if (photo && !["image/jpeg", "image/png"].includes(photo.type)) {
        toast.error("Checkout photos must be JPG or PNG files");
        return;
      }
      if (photo && photo.size > 10 * 1024 * 1024) {
        toast.error("Checkout photos must be under 10MB");
        return;
      }

      setIsUploading(true);
      try {
        let photoUrls = renterPhotoUrls;
        if (photo) {
          const uploadData = new FormData();
          uploadData.append("file", photo);
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadData,
          });
          if (!uploadResponse.ok) throw new Error("Checkout photo upload failed");
          const uploaded = (await uploadResponse.json()) as { secure_url?: string };
          if (!uploaded.secure_url) throw new Error("The upload did not return a photo URL");
          photoUrls = [uploaded.secure_url];
        }

        const hasRating = Object.values(data.categoryRatings).some((rating) => rating > 0);
        await completeCheckOut({
          bookingId: booking.referenceCode,
          body: {
            returnConfirmation: {
              renterReturned: data.confirmReturnIds.includes("vehicleReturned"),
              keysReturned: data.confirmReturnIds.includes("vehicleKeyReturned"),
            },
            vehicleInspection: {
              mileage: Number(data.checkoutMileage),
              fuelLevel: data.checkoutFuelLevel,
              photoUrls,
              damageStatus: data.damageStatus as "none" | "damage",
              damageType: data.damageStatus === "damage" ? data.damageType : undefined,
              damageDescription:
                data.damageStatus === "damage" ? data.damageDescription : undefined,
            },
            renterRating: hasRating || data.reviewNotes.trim()
              ? {
                  categoryRatings: data.categoryRatings,
                  notes: data.reviewNotes.trim() || undefined,
                }
              : undefined,
          },
        }).unwrap();

        toast.success("Vehicle checkout completed successfully");
        router.replace(`${HOST_DASHBOARD_PATH}bookings/${booking.referenceCode}`);
      } catch (error) {
        const message =
          typeof error === "object" && error && "data" in error &&
          typeof (error as { data?: { message?: string } }).data?.message === "string"
            ? (error as { data: { message: string } }).data.message
            : error instanceof Error
              ? error.message
              : "Failed to complete vehicle checkout";
        toast.error(message);
      } finally {
        setIsUploading(false);
      }
    })();
  }, [formHandleSubmit, completeCheckOut, booking, router, renterCheckOut]);

  return (
    <div className="mt-4 md:mt-6 space-y-4">
      <StepTitle setStep={setStep} step={step} />
      <div className="flex gap-4 flex-col md:flex-row md:items-start w-full">
        {step === 1 && (
          <StepOne
            renterName={booking.renterName}
            phoneNumber={booking.renterPhone}
            emailAddress={booking.renterEmail}
            licenseNumber={booking.checkIn?.driverLicenseNumber || "Not provided"}
            renterSelfReturnedAt={renterCheckOut?.completedAt}
          />
        )}

        {step === 2 && (
          <StepTwo
            fetchCheckInData={fetchCheckInData}
            renterCheckOut={renterCheckOut}
          />
        )}

        {step === 3 && <StepThree />}

        <BookingSummary booking={booking} />
      </div>
      <Separator />
      <CheckOutFooter
        step={step}
        goBack={goBack}
        goNext={goNext}
        handleSubmit={handleSubmit}
        isSubmitting={isUploading || isCompleting}
      />
    </div>
  );
});

// ─── Step nav (with completed-state check icons) ──────────────────────────────

const STEP_TITLE = [
  {
    number: 1 as const,
    title: "Vehicle Return Confirmation",
  },
  {
    number: 2 as const,
    title: "Vehicle Inspection",
  },
  {
    number: 3 as const,
    title: "Rate Renter",
  },
];

type StepTitleProps = {
  step: 1 | 2 | 3;
  setStep: Dispatch<SetStateAction<1 | 2 | 3>>;
};

const StepTitle = memo(function StepTitle({ setStep, step }: StepTitleProps) {
  const isStepOneComplete = useIsStepOneComplete();

  return (
    <div className="flex items-center justify-start py-4 gap-5 overflow-x-auto">
      {STEP_TITLE.map((item) => {
        const isCompleted = item.number < step;
        const isActive = item.number === step;

        const isReachable =
          item.number <= step ||
          (item.number === step + 1 && step === 1 && isStepOneComplete);

        return (
          <button
            key={item.number}
            type="button"
            disabled={!isReachable}
            className={cn(
              "flex items-center justify-start gap-3",
              isReachable ? "cursor-pointer" : "cursor-not-allowed opacity-60",
            )}
            onClick={() => isReachable && setStep(item.number)}
          >
            <span
              className={cn(
                "flex justify-center items-center aspect-square size-8 text-sm font-semibold rounded-full border",
                isActive
                  ? "text-white bg-blue-700 border-blue-700"
                  : isCompleted
                    ? "text-white bg-emerald-500 border-emerald-500"
                    : "text-gray-500 bg-gray-100 border-gray-400",
              )}
            >
              {isCompleted ? <Check className="size-4" /> : item.number}
            </span>

            <span
              className={cn(
                "text-xs font-semibold font-text leading-4",
                item.number === step ? "text-neutral-950" : "text-gray-500",
              )}
            >
              {item.title}
            </span>
          </button>
        );
      })}
    </div>
  );
});

type CheckOutFooterProps = {
  step: 1 | 2 | 3;
  goBack: () => void;
  goNext: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
};

const CheckOutFooter = memo(function CheckOutFooter({
  step,
  goBack,
  goNext,
  handleSubmit,
  isSubmitting,
}: CheckOutFooterProps) {
  const isStepOneComplete = useIsStepOneComplete();

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={goBack}
        disabled={step === 1}
        className="text-sm py-2 px-6 flex items-center gap-2 border rounded-xs bg-transparent hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-inherit"
      >
        <ChevronLeft className="size-4 text-gray-500" />
        <span>Back</span>
      </button>
      {step < 3 ? (
        <button
          type="button"
          onClick={goNext}
          disabled={step === 1 && !isStepOneComplete}
          className="text-sm flex items-center gap-1.5 py-2 px-6 border rounded-xs text-white bg-blue-700 hover:bg-blue-900 transition-colors duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-700"
        >
          <span>Next</span>
          <ChevronRight className="size-4 text-white" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="text-sm py-2 px-6 border rounded-xs text-white bg-blue-700 hover:bg-blue-900 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? "Completing..." : "Complete Check Out"}</span>
        </button>
      )}
    </div>
  );
});

const BookingSummary = memo(function BookingSummary({ booking }: { booking: BookingResponse }) {
  const rentalDays = Math.max(
    1,
    Math.ceil(
      (new Date(booking.returnDate).getTime() - new Date(booking.pickupDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const [plateNumber = "N/A"] = booking.vehicleDetails.split(" - ");
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return (
    <div className="basis-85 grow-0 shrink w-full p-4 bg-gray-50 rounded-[10px] border border-gray-200 flex flex-col justify-start items-start gap-4">
      <h3 className="text-neutral-950 text-base font-semibold font-text leading-6">
        Booking Summary
      </h3>
      <Separator />
      <div className="flex items-center gap-3">
        <Image
          src={booking.vehicleImage || "/images/swingrides-default-img.webp"}
          alt={booking.vehicleName}
          width={480}
          height={320}
          className="max-w-12 object-cover aspect-480/320 w-full rounded-sm"
        />
        <div className="flex flex-col">
          <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
            {booking.vehicleName}
          </span>
          <span className="text-gray-500 text-xs font-normal font-text leading-4">
            {plateNumber}
          </span>
        </div>
      </div>
      <Separator />
      <div className="w-full space-y-2">
        <StepOneDataList label="Rental Period" data={`${rentalDays} day${rentalDays === 1 ? "" : "s"}`} />
        <StepOneDataList label="Check-In" data={formatDate(booking.pickupDate)} />
        <StepOneDataList label="Check-Out" data={formatDate(booking.returnDate)} />
      </div>
    </div>
  );
});

type StepOneDataListProps = {
  label: string;
  data: string;
};

const StepOneDataList = memo(function StepOneDataList({
  label,
  data,
}: StepOneDataListProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-gray-500 text-sm font-normal font-text">
        {label}
      </span>
      <span className="text-neutral-950 text-sm font-medium font-text">
        {data}
      </span>
    </div>
  );
});
