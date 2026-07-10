"use client";

import { Dispatch, SetStateAction, useState, useCallback } from "react";
import PageWrapper from "../../../dashboard/pageWrapper";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/lib/utils";
import StepThree from "./stepThree";
import StepTwo from "./stepTwo";
import StepOne from "./stepOne";

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

export default function CheckOutPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // TODO: replace with real data fetched/looked-up using `bookingId`
  // (e.g. via an API route or server action). These are placeholders.
  const bookingId = "SR-2026-0043";

  // Stable reference — required so StepTwo's use()-backed promise doesn't
  // get recreated (and re-suspended) on every render
  const fetchCheckInData = useCallback(async (): Promise<CheckInData> => {
    // TODO: replace with real API call
    // const res = await fetch(`/api/bookings/${bookingId}/check-in`)
    // return res.json()
    return {
      mileage: 24200,
      fuelLevel: "6/8",
      photoUrl: "/images/toyota-camry-2024.webp",
    };
  }, []);

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

  const confirmReturnIds = useWatch({
    control: methods.control,
    name: "confirmReturnIds",
  });
  const isStepOneComplete = confirmReturn.every((item) =>
    confirmReturnIds?.includes(item.id),
  );

  const goBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  };

  const goNext = async () => {
    if (step === 1 && !isStepOneComplete) return;
    if (step === 2) {
      const valid = await methods.trigger([
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
  };

  const handleSubmit = methods.handleSubmit((data) => {
    // TODO: wire up to the actual check-out submission endpoint
    console.log("Check-out submitted", { bookingId, ...data });
  });

  return (
    <PageWrapper
      pageDescription={`Process vehicle return for booking ${bookingId}`}
      pageTitle="Complete Check-Out"
    >
      <FormProvider {...methods}>
        <div className="mt-4 md:mt-6 space-y-4">
          <StepTitle
            setStep={setStep}
            step={step}
            isStepOneComplete={isStepOneComplete}
          />
          <div className="flex gap-4 flex-col md:flex-row md:items-start w-full">
            {step === 1 && (
              <StepOne
                renterName="John Smith"
                phoneNumber="+1 555-0001"
                emailAddress="john.smith@email.com"
                licenseNumber="DL-123456789"
              />
            )}

            {step === 2 && <StepTwo fetchCheckInData={fetchCheckInData} />}

            {step === 3 && <StepThree />}

            <div className="basis-85 grow-0 shrink w-full p-4 bg-gray-50 rounded-[10px] border border-gray-200 flex flex-col justify-start items-start gap-4">
              <h3 className="text-neutral-950 text-base font-semibold font-text leading-6">
                Booking Summary
              </h3>
              <Separator />
              <div className="flex items-center gap-3">
                <Image
                  src={"/images/toyota-camry-2024.webp"}
                  alt={"Toyota Camry"}
                  width={480}
                  height={320}
                  className="max-w-12 object-cover aspect-480/320 w-full rounded-sm"
                />
                <div className="flex flex-col">
                  <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                    {"Toyota Camry"}
                  </span>
                  <span className="text-gray-500 text-xs font-normal font-text leading-4">
                    {"ABC-1234"}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="w-full space-y-2">
                <StepOneDataList label="Rental Period" data={"3 days"} />
                <StepOneDataList label="Check-In" data={"Mar 14, 2026"} />
                <StepOneDataList label="Check-Out" data={"Mar 17, 2026"} />
              </div>
            </div>
          </div>
          <Separator />
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
                className="text-sm py-2 px-6 border rounded-xs text-white bg-blue-700 hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
              >
                <span>Complete Check Out</span>
              </button>
            )}
          </div>
        </div>
      </FormProvider>
    </PageWrapper>
  );
}

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
  isStepOneComplete: boolean;
};

const StepTitle = ({ setStep, step, isStepOneComplete }: StepTitleProps) => {
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
};

type StepOneDataListProps = {
  label: string;
  data: string;
};

const StepOneDataList = ({ label, data }: StepOneDataListProps) => {
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
};
