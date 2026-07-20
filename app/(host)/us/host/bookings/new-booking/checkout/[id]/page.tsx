"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm, {
  CheckoutContact,
  CheckoutFormValues,
} from "@/components/forms/checkoutForm";
import {
  useCreateBookingMutation,
  useCreateBookingPaymentIntentMutation,
} from "@/app/store/services/bookingApi";
import {
  DEFAULT_IMAGE_SRC,
  HOST_DASHBOARD_PATH,
  SITE_URL,
} from "@/constants/constant";
import { stripePromise } from "@/lib/stripe";
import { useGetHostProfileQuery } from "@/app/store/services/hostApi";

type PendingHostCheckoutDraft = {
  vehicleId: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  pickupTime: string;
  returnTime: string;
  subtotal: number;
  tax: number;
  taxRate: number;
  insuranceFee: number;
  totalAmount: number;
  totalDays: number;
  vehicleName: string;
  vehicleImageUrl?: string;
  hostProvidesInsurance: boolean;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
};

const getPendingHostCheckoutStorageKey = (vehicleId: string) =>
  `swingrides:host-booking-checkout:${vehicleId}`;

const formatCurrency = (amount?: number | null) =>
  `$${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export default function HostBookingCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = params.id as string;
  const redirectStatus = searchParams.get("redirect_status");
  const redirectedPaymentIntentId = searchParams.get("payment_intent");

  const [draft, setDraft] = useState<PendingHostCheckoutDraft | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pricingSummary, setPricingSummary] = useState<{
    subtotal: number;
    tax: number;
    taxRate: number;
    insuranceFee: number;
    totalAmount: number;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [finalizingPaymentIntentId, setFinalizingPaymentIntentId] = useState<
    string | null
  >(null);

  const [createPaymentIntent, { isLoading: isCreatingPaymentIntent }] =
    useCreateBookingPaymentIntentMutation();
  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreateBookingMutation();
  const { data } = useGetHostProfileQuery();

  useEffect(() => {
    if (!vehicleId) return;

    const storedDraft = window.sessionStorage.getItem(
      getPendingHostCheckoutStorageKey(vehicleId),
    );

    if (storedDraft) {
      try {
        setDraft(JSON.parse(storedDraft) as PendingHostCheckoutDraft);
      } catch (error) {
        console.error("Failed to parse pending host checkout draft:", error);
        setSubmitError("Unable to load checkout details. Please start again.");
      }
    }

    setIsDraftLoaded(true);
  }, [vehicleId]);

  const finalizeBooking = useCallback(
    async (checkoutValues?: Partial<CheckoutFormValues>) => {
      if (!draft) {
        setSubmitError("Checkout details are missing. Please start again.");
        return;
      }

      const paymentIntentId = checkoutValues?.paymentIntentId;
      if (!paymentIntentId) {
        setSubmitError("Payment confirmation is missing. Please try again.");
        return;
      }

      if (finalizingPaymentIntentId === paymentIntentId) {
        return;
      }

      try {
        setSubmitError(null);
        setFinalizingPaymentIntentId(paymentIntentId);

        const renterName =
          `${checkoutValues?.firstName || ""} ${checkoutValues?.lastName || ""}`.trim() ||
          draft.renterName;

        const result = await createBooking({
          vehicleId: draft.vehicleId,
          paymentIntentId,
          renterName,
          renterEmail: checkoutValues?.email || draft.renterEmail,
          renterPhone: checkoutValues?.phoneNumber || draft.renterPhone,
          pickupDate: draft.pickupDate,
          returnDate: draft.returnDate,
          location: draft.location,
          streetAddress: checkoutValues?.streetAddress || draft.streetAddress,
          city: checkoutValues?.city || draft.city,
          state: checkoutValues?.state || draft.state,
          postalCode: checkoutValues?.postalCode || draft.postalCode,
          pickupTime: draft.pickupTime,
          returnTime: draft.returnTime,
          // hostProvidesInsurance: draft.hostProvidesInsurance,
          // insuranceFee: draft.hostProvidesInsurance
          //   ? (pricingSummary?.insuranceFee ?? draft.insuranceFee ?? 0)
          //   : 0,
          insuranceProvider: draft.hostProvidesInsurance
            ? String(data?.data.insurance?.provvider)
            : draft.insuranceProvider,
          policyNumber: draft.hostProvidesInsurance
            ? String(data?.data.insurance?.policyNumber)
            : draft.insurancePolicyNumber,
          insuranceExpiry: draft.hostProvidesInsurance
            ? String(data?.data.insurance?.expiryDate)
            : draft.insuranceExpiryDate,
        }).unwrap();

        if (!result.success || !result.data?.id) {
          throw new Error("Booking was not created after payment.");
        }

        window.sessionStorage.removeItem(
          getPendingHostCheckoutStorageKey(vehicleId),
        );
        router.push(`${HOST_DASHBOARD_PATH}bookings/${result.data.id}`);
      } catch (error) {
        setFinalizingPaymentIntentId(null);
        setSubmitError(
          getErrorMessage(
            error,
            "Payment succeeded, but booking creation failed.",
          ),
        );
      }
    },
    [
      createBooking,
      draft,
      finalizingPaymentIntentId,
      pricingSummary,
      router,
      vehicleId,
    ],
  );

  useEffect(() => {
    if (
      !draft ||
      redirectStatus !== "succeeded" ||
      !redirectedPaymentIntentId
    ) {
      return;
    }

    void finalizeBooking({
      paymentIntentId: redirectedPaymentIntentId,
      firstName: draft.renterName.split(" ")[0] || "",
      lastName: draft.renterName.split(" ").slice(1).join(" "),
      email: draft.renterEmail,
      phoneNumber: draft.renterPhone,
      streetAddress: draft.streetAddress,
      city: draft.city,
      state: draft.state,
      postalCode: draft.postalCode,
    });
  }, [draft, finalizeBooking, redirectStatus, redirectedPaymentIntentId]);

  useEffect(() => {
    if (
      !draft ||
      !vehicleId ||
      clientSecret ||
      redirectStatus === "succeeded"
    ) {
      return;
    }

    let isActive = true;

    const initializePaymentIntent = async () => {
      try {
        setSubmitError(null);
        const response = await createPaymentIntent({
          vehicleId,
          pickupDate: draft.pickupDate,
          returnDate: draft.returnDate,
          metadata: {
            bookingType: "host",
            pickupLocation: draft.location,
          },
        }).unwrap();

        if (!isActive) return;

        setClientSecret(response.data.clientSecret);
        setPricingSummary({
          subtotal: response.data.subtotal,
          tax: response.data.tax,
          taxRate: response.data.taxRate,
          // Server is the source of truth for the charged insurance fee;
          // fall back to the draft value only if the API doesn't echo it back.
          insuranceFee: draft.insuranceFee ?? 0,
          totalAmount: response.data.totalAmount,
        });
      } catch (error) {
        if (!isActive) return;
        setSubmitError(
          getErrorMessage(
            error,
            "Unable to prepare secure payment for this booking.",
          ),
        );
      }
    };

    void initializePaymentIntent();

    return () => {
      isActive = false;
    };
  }, [clientSecret, createPaymentIntent, draft, redirectStatus, vehicleId]);

  const user = useMemo(() => {
    if (!draft) return null;

    const [firstName = "", ...rest] = draft.renterName.split(" ");
    return {
      firstName,
      lastName: rest.join(" "),
      email: draft.renterEmail,
      phoneNumber: draft.renterPhone,
      streetAddress: draft.streetAddress,
      city: draft.city,
      state: draft.state,
      postalCode: draft.postalCode,
    };
  }, [draft]);

  const summary = useMemo(() => {
    if (!draft) return null;

    const subtotal = pricingSummary?.subtotal ?? draft.subtotal ?? 0;
    const tax = pricingSummary?.tax ?? draft.tax ?? 0;
    const taxRate = pricingSummary?.taxRate ?? draft.taxRate ?? 0.08;
    const insuranceFee =
      pricingSummary?.insuranceFee ?? draft.insuranceFee ?? 0;
    const totalAmount = pricingSummary?.totalAmount ?? draft.totalAmount ?? 0;

    return {
      imageUrl: draft.vehicleImageUrl || DEFAULT_IMAGE_SRC,
      vehicleName: draft.vehicleName || "Vehicle",
      vehicleType: draft.hostProvidesInsurance
        ? "Host-provided insurance"
        : "Renter-provided insurance",
      vehicleGearType: `${draft.pickupTime} - ${draft.returnTime}`,
      duration: `${draft.totalDays || 1} day${draft.totalDays === 1 ? "" : "s"}`,
      totalPrice: formatCurrency(totalAmount),
      subTotalFee: formatCurrency(subtotal),
      taxPercentageRate: `${taxRate * 100}%`,
      taxFee: formatCurrency(tax),
      insuranceFee,
    };
  }, [draft, pricingSummary]);

  if (!vehicleId) {
    return (
      <div className="min-h-[70dvh] bg-gray-200 text-center grid place-content-center">
        Invalid checkout session
      </div>
    );
  }

  if (!isDraftLoaded) {
    return (
      <div className="min-h-[70dvh] bg-gray-200 text-center grid place-content-center">
        Loading checkout details...
      </div>
    );
  }

  if (!draft || !summary) {
    return (
      <div className="min-h-[70dvh] bg-gray-200 text-center grid place-content-center">
        Checkout details not found. Please start again.
      </div>
    );
  }

  if (redirectStatus === "succeeded" && finalizingPaymentIntentId) {
    return (
      <div className="min-h-[70dvh] bg-gray-200 text-center grid place-content-center">
        Finalizing booking...
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-[70dvh] bg-gray-200 text-center grid place-content-center">
        {submitError ||
          (isCreatingPaymentIntent
            ? "Preparing secure payment..."
            : "Unable to load payment details.")}
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        id={vehicleId}
        {...summary}
        user={user}
        clientSecret={clientSecret}
        returnUrl={`${SITE_URL}${HOST_DASHBOARD_PATH}bookings/new-booking/checkout/${vehicleId}`}
        submitError={submitError}
        onBeforeConfirm={async (values: CheckoutContact) => {
          const nextDraft = {
            ...draft,
            renterName: `${values.firstName} ${values.lastName}`.trim(),
            renterEmail: values.email,
            renterPhone: values.phoneNumber,
            streetAddress: values.streetAddress,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
          };
          setDraft(nextDraft);
          window.sessionStorage.setItem(
            getPendingHostCheckoutStorageKey(vehicleId),
            JSON.stringify(nextDraft),
          );
        }}
        onSubmit={async (values) => {
          await finalizeBooking(values);
        }}
        onCancel={() => {
          window.sessionStorage.removeItem(
            getPendingHostCheckoutStorageKey(vehicleId),
          );
          router.push(`${HOST_DASHBOARD_PATH}bookings/new-booking`);
        }}
      />
      {isCreatingBooking ? <div>Finalizing booking...</div> : null}
    </Elements>
  );
}
