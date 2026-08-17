"use client";

import { useState } from "react";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import StepOne, { StepOneData } from "./stepOne";
import StepTwo, { StepTwoData } from "./stepTwo";
import StepThree, { StepThreeData } from "./stepThree";
import StepFour, { StepFourData } from "./stepFour";
import StepFive, { StepFiveData } from "./stepFive";
import BookingSummary from "./bookingSummary";
import { Button } from "@/components/ui/button";
import {
  BookingResponse,
  useGetBookingByIdQuery,
  useGetBookingByReferenceQuery,
  useStartCheckInMutation,
  useCompleteCheckInMutation,
} from "@/app/store/services/bookingApi";
import { formatDisplayDate } from "@/lib/formatDisplayDate";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";

const FUEL_LEVEL_PERCENT: Record<string, number> = {
  empty: 0,
  quarter: 25,
  half: 50,
  three_quarter: 75,
  full: 100,
};

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("File upload failed");
  const uploaded = (await response.json()) as { secure_url?: string };
  if (!uploaded.secure_url) throw new Error("The upload did not return a file URL");
  return uploaded.secure_url;
}

type CheckInPageProps = {
  bookingId: string;
  onComplete?: (data: CheckInOverallData) => void;
};

export type CheckInOverallData = {
  step1: StepOneData;
  step2: StepTwoData;
  step3: StepThreeData;
  step4: StepFourData;
  step5: StepFiveData;
};

const STEPS = [
  { id: 1, label: "Identity Verification" },
  { id: 2, label: "Insurance Confirmation" },
  { id: 3, label: "Vehicle Inspection" },
  { id: 4, label: "Agreement Closure" },
  { id: 5, label: "Keys Handover" },
];

export default function CheckInPage({ bookingId }: CheckInPageProps) {
  const router = useRouter();
  const isReferenceCode = /^SR-\d{4}-\d{4}$/i.test(bookingId);

  const { data: bookingById, isLoading: isBookingByIdLoading } =
    useGetBookingByIdQuery(bookingId, { skip: isReferenceCode });

  const { data: bookingByReference, isLoading: isBookingByReferenceLoading } =
    useGetBookingByReferenceQuery(bookingId, { skip: !isReferenceCode });

  const booking: BookingResponse | undefined = isReferenceCode
    ? bookingByReference?.data
    : bookingById?.data;

  const isLoading = isReferenceCode
    ? isBookingByReferenceLoading
    : isBookingByIdLoading;

  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);

  const [isUploading, setIsUploading] = useState(false);
  const [startCheckIn] = useStartCheckInMutation();
  const [completeCheckIn, { isLoading: isCompleting }] =
    useCompleteCheckInMutation();
  const isSubmitting = isUploading || isCompleting;

  // Form states
  const [step1Data, setStep1Data] = useState<StepOneData>({
    confirmed: false,
    idType: "",
    idDocument: [],
    driverName: "",
  });
  const [step2Data, setStep2Data] = useState<StepTwoData>({ confirmed: false });
  const [step3Data, setStep3Data] = useState<StepThreeData>({
    vehiclePhotos: [],
    mileage: "",
    fuelLevel: "",
    notes: "",
  });
  const [step4Data, setStep4Data] = useState<StepFourData>({
    confirmed: false,
  });
  const [step5Data, setStep5Data] = useState<StepFiveData>({
    confirmed: false,
  });

  // Map completion status per step
  const completedSteps: Record<number, boolean> = {
    1:
      step1Data.confirmed &&
      step1Data.idType !== "" &&
      step1Data.idDocument.length > 0,
    2: step2Data.confirmed,
    3:
      step3Data.vehiclePhotos.length > 0 &&
      step3Data.mileage.trim() !== "" &&
      step3Data.fuelLevel !== "",
    4: step4Data.confirmed,
    5: step5Data.confirmed,
  };

  const vehicleName = booking?.vehicleName;
  const vehiclePlateNumber =
    booking?.vehicle?.licensePlate || booking?.vehicleId;
  const fetchedVehicleImage =
    booking?.vehicle?.photos?.[0]?.url || booking?.vehicle?.image;
  const renterName = booking?.renterName;
  const renterPhone = booking?.renterPhone;
  const renterEmail = booking?.renterEmail;

  const pickupDateTime = formatDisplayDate(
    booking?.pickupDate || booking?.trip?.PickUpDateTime,
  );
  const returnDateTime = formatDisplayDate(
    booking?.returnDate || booking?.trip?.ReturnDateTime,
  );

  const totalAmount = booking?.totalAmount || booking?.payment?.amountPaid;

  const policyNumber =
    booking?.insurance?.policyNumber || booking?.insurancePolicyNumber;
  const dailyRate = booking?.insurance?.dailyRate;
  const planName = booking?.insurance?.provider;

  // Validation checks for advancing to next step
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          step1Data.confirmed &&
          step1Data.idType !== "" &&
          step1Data.idDocument.length > 0
        );
      case 2:
        return step2Data.confirmed;
      case 3:
        return (
          step3Data.vehiclePhotos.length > 0 &&
          step3Data.mileage.trim() !== "" &&
          step3Data.fuelLevel !== ""
        );
      case 4:
        return step4Data.confirmed;
      case 5:
        return step5Data.confirmed;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(currentStep) && currentStep < 5) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setMaxStepReached((prev) => Math.max(prev, next));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (!isStepValid(5) || !booking) {
      toast.error("Please complete all steps");
      return;
    }

    setIsUploading(true);
    try {
      const [idDocumentUrl, photoUrls] = await Promise.all([
        uploadFile(step1Data.idDocument[0]),
        Promise.all(step3Data.vehiclePhotos.map(uploadFile)),
      ]);

      const mileage = Number(step3Data.mileage);
      const fuelPercent = FUEL_LEVEL_PERCENT[step3Data.fuelLevel] ?? 100;

      if (booking.status === "confirmed") {
        await startCheckIn({
          bookingId: booking.id,
          driverName: step1Data.driverName,
          fuelLevel: fuelPercent,
          odometerReading: mileage,
          vehicleCondition: {
            exterior: photoUrls,
            interior: [],
            damages: [],
          },
          notes: step3Data.notes || undefined,
        }).unwrap();
      } else if (booking.status !== "checked_in") {
        throw new Error(
          `Booking cannot be checked in from its current status (${booking.status})`,
        );
      }

      await completeCheckIn({
        bookingId: booking.id,
        body: {
          identityVerification: {
            idType: step1Data.idType,
            idDocumentUrl,
            identityMatched: step1Data.confirmed,
          },
          insuranceConfirmation: {
            insuranceSelected: planName || undefined,
            policyNumber: policyNumber || undefined,
            dailyRate: dailyRate || undefined,
            confirmed: step2Data.confirmed,
          },
          vehicleInspection: {
            photoUrls,
            currentMileageKm: mileage,
            fuelLevel: step3Data.fuelLevel as
              | "empty"
              | "quarter"
              | "half"
              | "three_quarter"
              | "full",
            inspectionNotes: step3Data.notes || undefined,
            confirmed: true,
          },
          agreementClosure: {
            agreedToTerms: step4Data.confirmed,
          },
          keysHandover: {
            keysHandedOver: step5Data.confirmed,
          },
        },
      }).unwrap();

      toast.success("Check-In Completed Successfully");
      router.replace(`${HOST_DASHBOARD_PATH}bookings/${bookingId}`);
    } catch (error) {
      const message =
        typeof error === "object" &&
        error &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data: { message: string } }).data.message
          : error instanceof Error
            ? error.message
            : "Failed to complete check-in";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const formattedBookingId = bookingId;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden m-4">
      {/* Page Section Header */}
      <div className="p-6 border-b border-[#E5E7EB]">
        <h2 className="text-xl font-bold text-[#1F2937] font-text">
          Complete Check-In
        </h2>
        <p className="text-xs text-[#6B7280] font-text mt-0.5">
          Process vehicle pickup for booking {formattedBookingId}
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="p-6 bg-[#F9FAFB] border-b border-[#E5E7EB] overflow-x-auto">
        <div className="flex items-center justify-between min-w-160 gap-2">
          {STEPS.map((step) => {
            const isCompleted =
              completedSteps[step.id] || step.id < maxStepReached;
            const isActive = step.id === currentStep;
            const isClickable = isCompleted || step.id <= maxStepReached;

            return (
              <div key={step.id} className="flex items-center gap-3 flex-1">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && setCurrentStep(step.id)}
                  className={`flex items-center gap-2 text-left ${
                    isClickable
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-80"
                  }`}
                >
                  <div
                    className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      isCompleted
                        ? "bg-blue-500 text-white"
                        : isActive
                          ? "bg-blue-500 text-white ring-4 ring-blue-100"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <Check className="size-4" /> : step.id}
                  </div>
                  <span
                    className={`text-xs font-text whitespace-nowrap ${
                      isActive
                        ? "font-bold text-[#1F2937]"
                        : isCompleted
                          ? "font-medium text-[#1F2937]"
                          : "font-normal text-[#9CA3AF]"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
                {step.id < STEPS.length && (
                  <div className="h-px bg-gray-200 flex-1 mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Body */}
      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3">
          <div className="animate-spin size-8 border-4 border-blue-700 border-t-transparent rounded-full" />
          <span className="text-sm font-medium text-gray-500 font-text">
            Loading booking details...
          </span>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Content Column (Left 2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between min-h-95">
            {currentStep === 1 && (
              <StepOne
                data={step1Data}
                onSubmitStep={(data) => {
                  setStep1Data(data);
                  setCurrentStep(2);
                  setMaxStepReached((prev) => Math.max(prev, 2));
                }}
                bookingData={{
                  renterName,
                  renterPhone,
                  renterEmail,
                }}
              />
            )}
            {currentStep === 2 && (
              <StepTwo
                data={step2Data}
                onChange={(patch) =>
                  setStep2Data((prev) => ({ ...prev, ...patch }))
                }
                insuranceData={{
                  policyNumber,
                  dailyRate,
                  planName,
                }}
              />
            )}
            {currentStep === 3 && (
              <StepThree
                data={step3Data}
                onSubmitStep={(data) => {
                  setStep3Data(data);
                  setCurrentStep(4);
                  setMaxStepReached((prev) => Math.max(prev, 4));
                }}
              />
            )}
            {currentStep === 4 && (
              <StepFour
                data={step4Data}
                onChange={(patch) =>
                  setStep4Data((prev) => ({ ...prev, ...patch }))
                }
              />
            )}
            {currentStep === 5 && (
              <StepFive
                data={step5Data}
                onChange={(patch) =>
                  setStep5Data((prev) => ({ ...prev, ...patch }))
                }
              />
            )}

            {/* Bottom Controls Footer */}
            <div className="p-6 border-t border-[#E5E7EB] bg-white flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-5 py-2 border-[#E5E7EB] text-[#1F2937] font-medium text-sm font-text rounded-xs hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < 5 ? (
                currentStep !== 3 && currentStep !== 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep)}
                    className="px-6 py-2 bg-blue-700 hover:bg-blue-900 text-white font-medium text-sm font-text rounded-xs transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : null
              ) : (
                <Button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={!isStepValid(5) || isSubmitting}
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-900 text-white font-medium text-sm font-text rounded-xs transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isSubmitting ? "Completing..." : "Complete Check-In"}
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Extracted Booking Summary Component */}
          <div className="lg:col-span-1">
            <BookingSummary
              vehicleName={vehicleName}
              vehiclePlateNumber={vehiclePlateNumber}
              vehicleImageSrc={fetchedVehicleImage}
              renterName={renterName}
              renterPhone={renterPhone}
              pickupDateTime={pickupDateTime}
              returnDateTime={returnDateTime}
              totalAmount={totalAmount}
              currentStep={currentStep}
              maxStepReached={maxStepReached}
              completedSteps={completedSteps}
              step5Confirmed={step5Data.confirmed}
              onSelectStep={(step) => {
                if (step <= maxStepReached || completedSteps[step]) {
                  setCurrentStep(step);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
