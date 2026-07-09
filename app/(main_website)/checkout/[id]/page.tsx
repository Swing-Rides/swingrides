"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "@/components/forms/checkoutForm";
import {
  useCreateCheckoutPaymentIntentMutation,
  useCreatePublicBookingMutation,
  useGetPublicVehicleByIdQuery,
} from "@/app/store/services/publicApi";
import { useGetProfileQuery } from "@/app/store/services/renterApi";
import { SITE_URL, DEFAULT_IMAGE_SRC } from "@/constants/constant";
import { stripePromise } from "@/lib/stripe";

type PendingCheckoutDraft = {
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  insuranceProvider?: string;
  policyNumber?: string;
  insuranceExpiry?: string;
  hostProvidingCoverage?: boolean;
  subtotal?: number;
  tax?: number;
  taxRate?: number;
  totalAmount?: number;
  totalDays?: number;
};

const getPendingCheckoutStorageKey = (vehicleId: string) =>
  `swingrides:pending-checkout:${vehicleId}`;

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

  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "error" in error.data &&
    typeof error.data.error === "string"
  ) {
    return error.data.error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = params.id as string;
  const redirectStatus = searchParams.get("redirect_status");
  const redirectedPaymentIntentId = searchParams.get("payment_intent");

  const [draft, setDraft] = useState<PendingCheckoutDraft | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pricingSummary, setPricingSummary] = useState<{
    subtotal: number;
    tax: number;
    taxRate: number;
    totalAmount: number;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [finalizingPaymentIntentId, setFinalizingPaymentIntentId] = useState<
    string | null
  >(null);

  const { data: vehicleData, isLoading: isVehicleLoading } =
    useGetPublicVehicleByIdQuery({ id: vehicleId });
  const { data: renterProfile } = useGetProfileQuery();
  const [createPaymentIntent, { isLoading: isCreatingPaymentIntent }] =
    useCreateCheckoutPaymentIntentMutation();
  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreatePublicBookingMutation();

  useEffect(() => {
    if (!vehicleId) return;

    const storedDraft = window.sessionStorage.getItem(
      getPendingCheckoutStorageKey(vehicleId),
    );

    if (storedDraft) {
      try {
        setDraft(JSON.parse(storedDraft) as PendingCheckoutDraft);
      } catch (error) {
        console.error("Failed to parse pending checkout draft:", error);
        setSubmitError("Unable to load your checkout details. Please start again.");
      }
    }

    setIsDraftLoaded(true);
  }, [vehicleId]);

  const finalizeBooking = useCallback(async (paymentIntentId?: string | null) => {
    if (!draft) {
      setSubmitError("Checkout details are missing. Please start again.");
      return;
    }

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
      const result = await createBooking({
        vehicleId: draft.vehicleId,
        paymentIntentId,
        pickupDate: draft.pickupDate,
        returnDate: draft.returnDate,
        pickupLocation: draft.pickupLocation,
        insuranceProvider: draft.insuranceProvider,
        policyNumber: draft.policyNumber,
        insuranceExpiry: draft.insuranceExpiry,
        hostProvidingCoverage: draft.hostProvidingCoverage,
      }).unwrap();

      if (!result.success || !result.data?.id) {
        throw new Error("Booking was not created after payment.");
      }

      window.sessionStorage.removeItem(getPendingCheckoutStorageKey(vehicleId));
      router.push(`/trip/${result.data.id}`);
    } catch (error) {
      setFinalizingPaymentIntentId(null);
      setSubmitError(
        getErrorMessage(error, "Payment succeeded, but booking creation failed."),
      );
    }
  }, [createBooking, draft, finalizingPaymentIntentId, router, vehicleId]);

  useEffect(() => {
    if (!draft || redirectStatus !== "succeeded" || !redirectedPaymentIntentId) {
      return;
    }

    void finalizeBooking(redirectedPaymentIntentId);
  }, [draft, finalizeBooking, redirectStatus, redirectedPaymentIntentId]);

  useEffect(() => {
    if (!draft || !vehicleId || clientSecret || redirectStatus === "succeeded") {
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
            pickupLocation: draft.pickupLocation,
          },
        }).unwrap();

        if (!isActive) return;

        setClientSecret(response.data.clientSecret);
        setPricingSummary({
          subtotal: response.data.subtotal,
          tax: response.data.tax,
          taxRate: response.data.taxRate,
          totalAmount: response.data.totalAmount,
        });
      } catch (error) {
        if (!isActive) return;
        setSubmitError(
          getErrorMessage(
            error,
            "Unable to initialize payment. Please sign in and try again.",
          ),
        );
      }
    };

    void initializePaymentIntent();

    return () => {
      isActive = false;
    };
  }, [clientSecret, createPaymentIntent, draft, redirectStatus, vehicleId]);

  const vehicle = vehicleData?.data;
  const renter = renterProfile?.renter;

  const user = useMemo(() => {
    if (!renter) return null;

    const [firstName = "", ...rest] = (renter.fullName || "").split(" ");
    return {
      firstName,
      lastName: rest.join(" "),
      email: renter.email,
      phoneNumber: renter.phoneNumber,
      streetAddress: '2266 Nostrand Ave',
      city: 'Brooklyn',
      state: 'New York',
      postalCode: '11210',
    };
  }, [renter]);

  const summary = useMemo(() => {
    if (!draft || !vehicle) return null;

    const subtotal = pricingSummary?.subtotal ?? draft.subtotal ?? 0;
    const tax = pricingSummary?.tax ?? draft.tax ?? 0;
    const taxRate = pricingSummary?.taxRate ?? draft.taxRate ?? 0.08;
    const totalAmount = pricingSummary?.totalAmount ?? draft.totalAmount ?? 0;

    return {
      imageUrl: vehicle.featuredImage?.src || DEFAULT_IMAGE_SRC,
      vehicleName: vehicle.carName || "Vehicle",
      vehicleType: vehicle.vehicleType || "Vehicle",
      vehicleGearType: vehicle.specifications?.transmission || "Automatic",
      duration: `${draft.totalDays || 1} day${draft.totalDays === 1 ? "" : "s"}`,
      totalPrice: formatCurrency(totalAmount),
      subTotalFee: formatCurrency(subtotal),
      taxPercentageRate: `${taxRate * 100}%`,
      taxFee: formatCurrency(tax),
    };
  }, [draft, pricingSummary, vehicle]);

  if (!vehicleId) {
    return <div className="min-h-[70dvh] bg-gray-200 text-center grid place-content-center">Invalid checkout session</div>;
  }

  if (!isDraftLoaded || isVehicleLoading) {
    return <div className="min-h-[70dvh] bg-gray-200 text-center grid place-content-center">Loading checkout details...</div>;
  }

  if (!draft || !summary) {
    return <div className="min-h-[70dvh] bg-gray-200 text-center grid place-content-center">Checkout details not found. Please start again.</div>;
  }

  if (redirectStatus === "succeeded" && finalizingPaymentIntentId) {
    return <div className="min-h-[70dvh] bg-gray-200 text-center grid place-content-center">Finalizing booking...</div>;
  }

  if (!clientSecret) {
    return (
      <div className="min-h-[70dvh] bg-gray-200 text-center grid place-content-center">
        {submitError || (isCreatingPaymentIntent ? "Preparing secure payment..." : "Unable to load payment details.")}
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        id={vehicleId}
        {...summary}
        user={user}
        insuranceFee={'$120'}
        clientSecret={clientSecret}
        returnUrl={`${SITE_URL}/checkout/${vehicleId}`}
        submitError={submitError}
        onLogin={() => router.push(`/sign-in?next=/checkout/${vehicleId}`)}
        onSubmit={async (values) => {
          await finalizeBooking(values.paymentIntentId);
        }}
        onCancel={() => {
          window.sessionStorage.removeItem(getPendingCheckoutStorageKey(vehicleId));
          router.back();
        }}
      />
      {isCreatingBooking ? <div>Finalizing booking...</div> : null}
    </Elements>
  );
}
