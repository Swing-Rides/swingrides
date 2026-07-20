"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { toast } from "sonner";

import CheckoutForm from "@/components/forms/checkoutForm";
import CheckoutAuthModal from "@/components/modals/checkoutAuthModal";
import CheckoutSkeleton from "@/components/checkout/checkoutSkeleton";
import CheckoutErrorState from "@/components/checkout/checkoutErrorState";
import {
  useCreateCheckoutPaymentIntentMutation,
  useCreatePublicBookingMutation,
  useGetPublicVehicleByIdQuery,
} from "@/app/store/services/publicApi";
import { useGetProfileQuery } from "@/app/store/services/renterApi";
import { SITE_URL, DEFAULT_IMAGE_SRC } from "@/constants/constant";
import { stripePromise } from "@/lib/stripe";
import {
  clearDraftFromStorage,
  formatCurrency,
  getErrorMessage,
  isUnauthenticatedError,
  readDraftFromStorage,
  writeDraftToStorage,
  type PendingCheckoutDraft,
} from "@/lib/checkout-helpers";
import type {
  CheckoutContact,
  CheckoutFormValues,
} from "@/components/forms/checkoutForm";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = params.id as string;
  const redirectStatus = searchParams.get("redirect_status");
  const redirectedPaymentIntentId = searchParams.get("payment_intent");

  const [draft, setDraft] = useState<PendingCheckoutDraft | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [draftError, setDraftError] = useState(false);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pricingSummary, setPricingSummary] = useState<{
    subtotal: number;
    tax: number;
    taxRate: number;
    totalAmount: number;
  } | null>(null);
  const [paymentIntentError, setPaymentIntentError] = useState<string | null>(
    null,
  );
  const [paymentIntentRetryCount, setPaymentIntentRetryCount] = useState(0);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [finalizingPaymentIntentId, setFinalizingPaymentIntentId] = useState<
    string | null
  >(null);

  // Un-dismissable by default: pass `onDismiss` if guest checkout without an
  // account should be allowed.
  const [authModalDismissed, setAuthModalDismissed] = useState(false);
  // True when the modal was forced open by a real "authentication required"
  // error from the API (as opposed to simply being a not-yet-logged-in
  // guest browsing checkout) — in that case the modal can't be dismissed,
  // since there's no valid path forward without signing in.
  const [authRequiredByFailure, setAuthRequiredByFailure] = useState(false);

  const {
    data: vehicleData,
    isLoading: isVehicleLoading,
    isError: isVehicleError,
    refetch: refetchVehicle,
  } = useGetPublicVehicleByIdQuery({ id: vehicleId }, { skip: !vehicleId });

  const {
    data: renterProfile,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  const [createPaymentIntent] = useCreateCheckoutPaymentIntentMutation();
  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreatePublicBookingMutation();

  // ── Load the draft from sessionStorage ──────────────────────────────────
  useEffect(() => {
    if (!vehicleId) return;

    const storedDraft = readDraftFromStorage(vehicleId);
    if (!storedDraft) {
      setDraftError(true);
    } else {
      setDraft(storedDraft);
    }

    setIsDraftLoaded(true);
  }, [vehicleId]);

  // ── Finalize booking once Stripe confirms payment ───────────────────────
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
        const result = await createBooking({
          vehicleId: draft.vehicleId,
          paymentIntentId,
          pickupDate: draft.pickupDate,
          returnDate: draft.returnDate,
          pickupLocation: draft.pickupLocation,
          streetAddress:
            checkoutValues?.streetAddress || draft.streetAddress || "",
          city: checkoutValues?.city || draft.city || "",
          state: checkoutValues?.state || draft.state || "",
          postalCode: checkoutValues?.postalCode || draft.postalCode || "",
          pickupTime: draft.pickupTime,
          returnTime: draft.returnTime,
          insuranceProvider: draft.insuranceProvider,
          policyNumber: draft.policyNumber,
          insuranceExpiry: draft.insuranceExpiry,
          hostProvidingCoverage: draft.hostProvidingCoverage,
        }).unwrap();

        if (!result.success || !result.data?.id) {
          throw new Error("Booking was not created after payment.");
        }

        clearDraftFromStorage(vehicleId);
        toast.success("Booking confirmed!");
        router.push(`/trip/${result.data.id}`);
      } catch (error) {
        setFinalizingPaymentIntentId(null);

        if (isUnauthenticatedError(error)) {
          // Don't show a raw "authentication required" error — just get
          // them signed in and let them resubmit. Also a hard requirement,
          // so the modal can't be dismissed here either.
          toast.error("Please sign in to complete your booking.");
          setAuthRequiredByFailure(true);
          setAuthModalDismissed(false);
          return;
        }

        const message = getErrorMessage(
          error,
          "Payment succeeded, but booking creation failed.",
        );
        setSubmitError(message);
        toast.error(message);
      }
    },
    [createBooking, draft, finalizingPaymentIntentId, router, vehicleId],
  );

  // ── Auto-finalize on redirect back from Stripe ──────────────────────────
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
      streetAddress: draft.streetAddress,
      city: draft.city,
      state: draft.state,
      postalCode: draft.postalCode,
    });
  }, [draft, finalizeBooking, redirectStatus, redirectedPaymentIntentId]);

  // ── Create the payment intent ───────────────────────────────────────────
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
        setPaymentIntentError(null);
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
          totalAmount:
            response.data.totalAmount +
            Number(vehicleData?.data.insuranceDaily),
        });
      } catch (error) {
        if (!isActive) return;

        if (isUnauthenticatedError(error)) {
          // Skip the error screen entirely — surface the auth modal so
          // they can sign in and payment-intent creation will retry.
          // This is a hard requirement, so the modal can't be dismissed.
          setAuthRequiredByFailure(true);
          setAuthModalDismissed(false);
          return;
        }

        const message = getErrorMessage(
          error,
          "Unable to initialize payment. Please try again.",
        );
        setPaymentIntentError(message);
        toast.error(message);
      }
    };

    void initializePaymentIntent();

    return () => {
      isActive = false;
    };
  }, [
    clientSecret,
    createPaymentIntent,
    draft,
    redirectStatus,
    vehicleId,
    paymentIntentRetryCount,
  ]);

  const vehicle = vehicleData?.data;
  const renter = renterProfile?.renter;
  const isLoggedIn = !!renter;

  // Only prompt once the profile lookup has actually settled — avoids a
  // flash of the auth modal while the "am I logged in" request is in flight.
  // A 401 here just means "guest", so it's handled the same as any other
  // logged-out state rather than as a failure.
  const shouldPromptAuth =
    isDraftLoaded &&
    !isProfileLoading &&
    !isProfileFetching &&
    !isLoggedIn &&
    !authModalDismissed;

  const user = useMemo(() => {
    if (!renter) return null;

    const [firstName = "", ...rest] = (renter.fullName || "").split(" ");
    return {
      firstName,
      lastName: rest.join(" "),
      email: renter.email,
      phoneNumber: renter.phoneNumber,
      streetAddress: "2266 Nostrand Ave",
      city: "Brooklyn",
      state: "New York",
      postalCode: "11210",
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
      insuranceFee: vehicle.insuranceFee || "$0.00",
      duration: `${draft.totalDays || 1} day${draft.totalDays === 1 ? "" : "s"}`,
      totalPrice: formatCurrency(totalAmount),
      subTotalFee: formatCurrency(subtotal),
      taxPercentageRate: `${taxRate * 100}%`,
      taxFee: formatCurrency(tax),
    };
  }, [draft, pricingSummary, vehicle]);

  // Refetching the profile flips `isLoggedIn` to true, which closes the
  // modal on its own. Bumping the retry count re-runs the payment-intent
  // effect in case it bailed out earlier on an auth error — it's a no-op if
  // a clientSecret already exists.
  const handleAuthSuccess = useCallback(async () => {
    await refetchProfile();
    setAuthRequiredByFailure(false);
    setPaymentIntentRetryCount((count) => count + 1);
  }, [refetchProfile]);

  const authModal = shouldPromptAuth ? (
    <CheckoutAuthModal
      onAuthSuccess={handleAuthSuccess}
      onDismiss={
        authRequiredByFailure ? undefined : () => setAuthModalDismissed(true)
      }
    />
  ) : null;

  // ── Failure states ───────────────────────────────────────────────────────

  if (!vehicleId) {
    return (
      <CheckoutErrorState
        title="Invalid checkout session"
        message="We couldn't find a vehicle for this checkout link."
        primaryAction={{
          label: "Browse vehicles",
          onClick: () => router.push("/"),
        }}
      />
    );
  }

  if (isVehicleError) {
    return (
      <CheckoutErrorState
        title="We couldn't load this vehicle"
        message="It may have been removed or is temporarily unavailable."
        primaryAction={{ label: "Try again", onClick: () => refetchVehicle() }}
        secondaryAction={{ label: "Go back", onClick: () => router.back() }}
      />
    );
  }

  if (draftError) {
    return (
      <CheckoutErrorState
        title="Your checkout session has expired"
        message="Please head back to the vehicle page and start the booking again."
        primaryAction={{
          label: "Start over",
          onClick: () => router.push(`/browse-cars/${vehicleId}`),
        }}
      />
    );
  }

  if (!isDraftLoaded || isVehicleLoading) {
    return <CheckoutSkeleton />;
  }

  if (!draft || !summary) {
    return (
      <CheckoutErrorState
        title="Checkout details not found"
        message="Please start your booking again."
        primaryAction={{
          label: "Start over",
          onClick: () => router.push(`/browse-cars/${vehicleId}`),
        }}
      />
    );
  }

  if (redirectStatus === "succeeded" && finalizingPaymentIntentId) {
    return <CheckoutSkeleton />;
  }

  if (paymentIntentError && !clientSecret) {
    return (
      <CheckoutErrorState
        title="Unable to prepare secure payment"
        message={paymentIntentError}
        primaryAction={{
          label: "Try again",
          onClick: () => setPaymentIntentRetryCount((count) => count + 1),
        }}
        secondaryAction={{ label: "Go back", onClick: () => router.back() }}
      />
    );
  }

  if (!clientSecret) {
    return (
      <>
        <CheckoutSkeleton />
        {authModal}
      </>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        id={vehicleId}
        {...summary}
        user={user}
        insuranceFee={vehicleData?.data.insuranceDaily}
        clientSecret={clientSecret}
        returnUrl={`${SITE_URL}/checkout/${vehicleId}`}
        submitError={submitError}
        onLogin={() => router.push(`/sign-in?next=/checkout/${vehicleId}`)}
        onBeforeConfirm={async (values: CheckoutContact) => {
          const nextDraft = { ...draft, ...values };
          setDraft(nextDraft);
          writeDraftToStorage(vehicleId, nextDraft);
        }}
        onSubmit={async (values) => {
          await finalizeBooking(values);
        }}
        onCancel={() => {
          clearDraftFromStorage(vehicleId);
          router.back();
        }}
      />
      {isCreatingBooking && (
        <div className="text-center text-sm text-gray-500 py-2">
          Finalizing booking...
        </div>
      )}
      {authModal}
    </Elements>
  );
}
