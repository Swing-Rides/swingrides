import { setPendingCheckoutData } from "@/app/store/reducers/public.reducer";
import {
  useCreateBookingUpdatePaymentIntentMutation,
  useConfirmBookingDateChangeMutation,
  useGetBookingByIdQuery,
  useGetProfileQuery,
} from "@/app/store/services/renterApi";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import CheckoutForm, {
  CheckoutFormValues,
} from "@/components/forms/checkoutForm";
import ModalWrapper from "./wrapper";
import { stripePromise } from "@/lib/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { useCallback, useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";

import {
  computePricing,
  computeInsuranceFee,
  computeTotal,
  type PriceConfig,
} from "@/lib/pricing";

type PaymentIntentData = {
  id: string;
  amount: number;
  currency: string;
  clientSecret: string;
  status: string;
  subtotal: number;
  insuranceFee: number;
  taxableAmount: number;
  tax: number;
  taxRate: number;
  totalAmount: number;
  metadata?: Record<string, string>;
};

export default function ModifyCheckout() {
  const dispatch = useAppDispatch();
  const { pendingCheckoutData, bookingId } = useAppSelector(
    (state) => state.publicReducer,
  );
  const { data: userprofile } = useGetProfileQuery();
  const { data } = useGetBookingByIdQuery(
    { id: bookingId as string },
    { skip: !bookingId },
  );

  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentData | null>(
    null,
  );
  const [noPaymentRequired, setNoPaymentRequired] = useState(false);
  const [createPaymentIntent] = useCreateBookingUpdatePaymentIntentMutation();
  const [confirmDateChange] = useConfirmBookingDateChangeMutation();

  const handleClose = useCallback(() => {
    dispatch(
      setPendingCheckoutData({ bookingId: null, pendingCheckoutData: null }),
    );
    setPaymentIntent(null);
    setNoPaymentRequired(false);
  }, [dispatch]);

  useEffect(() => {
    if (!bookingId || !pendingCheckoutData) return;

    let isMounted = true;

    const fetchPaymentIntent = async () => {
      setPaymentIntent(null);
      setNoPaymentRequired(false);

      try {
        const res = await createPaymentIntent({
          bookingId,
          pickupDate: pendingCheckoutData.pickupDate,
          returnDate: pendingCheckoutData.returnDate,
        }).unwrap();

        if (!isMounted) return;
        setPaymentIntent(res.data as PaymentIntentData);
      } catch {
        if (!isMounted) return;
        setNoPaymentRequired(true);
      }
    };

    fetchPaymentIntent();

    return () => {
      isMounted = false;
    };
  }, [bookingId, pendingCheckoutData, createPaymentIntent]);

  if (!pendingCheckoutData || !bookingId) return null;

  if (!paymentIntent && !noPaymentRequired) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all animate-in fade-in duration-200">
        <div className="bg-white rounded-[16px] shadow-2xl p-6 sm:p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-200">
          <div className="size-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
            <Spinner className="size-7 text-blue-700 animate-spin" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-neutral-950 text-lg font-bold font-text">
              Preparing Checkout
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm font-normal font-text leading-relaxed">
              Please hold on while we calculate your updated pricing and initialize your secure payment session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const vehicleImage = data?.data.car.imageUrl as string;
  const vehicleName = data?.data.car.carName as string;
  const vehicleType = data?.data.car.carType as string;
  const gearType = data?.data.transmission as string;

  const [firstName = "", ...rest] = (userprofile?.renter.fullName || "").split(
    " ",
  );

  const handleSubmit = async (values: CheckoutFormValues) => {
    await confirmDateChange({
      id: bookingId,
      pickupDate: pendingCheckoutData.pickupDate,
      returnDate: pendingCheckoutData.returnDate,
      pickupTime: pendingCheckoutData.pickupTime,
      returnTime: pendingCheckoutData.returnTime,
      pickupLocation: pendingCheckoutData.pickupLocation,
      streetAddress: pendingCheckoutData.streetAddress,
      city: pendingCheckoutData.city,
      state: pendingCheckoutData.state,
      postalCode: pendingCheckoutData.postalCode,
      paymentIntentId: values.paymentIntentId,
    }).unwrap();
    handleClose();
  };

  // ── Pricing calculation strictly using lib/pricing.ts and renter booking data ──
  const extraDays = Number(pendingCheckoutData.totalDays ?? 1);
  const rentalRate: PriceConfig = data?.data?.rentalRate ?? {
    daily: 0,
    weekly: 0,
    monthly: 0,
  };

  const pricing = computePricing(rentalRate, extraDays);
  const isHostCoverage = Boolean(
    pendingCheckoutData.hostProvidingCoverage ?? data?.data?.hostProvidingCoverage,
  );
  const insuranceFeePerDay = Number(
    pendingCheckoutData.insuranceFeePerDay ?? data?.data?.dailyInsuranceFee ?? 0,
  );
  const calculatedInsuranceFee = computeInsuranceFee(
    extraDays,
    insuranceFeePerDay,
    isHostCoverage,
  );
  const taxRate = Number(
    pendingCheckoutData.taxRate ?? data?.data?.taxRate ?? 0,
  );

  const totalBreakdown = computeTotal(
    pendingCheckoutData.subtotal ?? pricing.total,
    calculatedInsuranceFee,
    taxRate,
  );

  const chargeSubtotal = totalBreakdown.subtotal;
  const chargeInsuranceFee = totalBreakdown.insuranceFee;
  const chargeTax = totalBreakdown.tax;
  const chargeTaxRate = taxRate;
  const chargeAmount =
    paymentIntent?.totalAmount && Number(paymentIntent.totalAmount) > 0
      ? Number(paymentIntent.totalAmount)
      : totalBreakdown.totalAmount;

  // Original booking amount (from booking details or totalPaid)
  const originalParsed = data?.data?.totalAmount
    ? Number(data.data.totalAmount)
    : data?.data?.totalPaid
    ? parseFloat(data.data.totalPaid.replace(/[^0-9.]/g, ""))
    : 0;
  const originalAmount = Number.isFinite(originalParsed) ? originalParsed : 0;
  const newBookingTotal = originalAmount > 0 ? originalAmount + chargeAmount : undefined;

  const clientSecret = paymentIntent?.clientSecret ?? "";
  const stripeOptions = clientSecret ? { clientSecret } : {};

  return (
    <ModalWrapper
      title="Modify Booking"
      handleClose={handleClose}
      description=""
    >
      <Elements stripe={stripePromise} options={stripeOptions}>
        <CheckoutForm
          clientSecret={clientSecret}
          duration={String(pendingCheckoutData?.totalDays)}
          id={pendingCheckoutData.vehicleId}
          imageUrl={vehicleImage}
          returnUrl=""
          subTotalFee={Number(chargeSubtotal).toFixed(2)}
          taxFee={Number(chargeTax).toFixed(2)}
          taxPercentageRate={chargeTaxRate}
          insuranceFee={Number(chargeInsuranceFee)}
          totalPrice={String(
            Number(
              noPaymentRequired ? pendingCheckoutData.totalAmount : chargeAmount,
            ).toFixed(2),
          )}
          chargeAmount={String(
            Number(noPaymentRequired ? 0 : chargeAmount).toFixed(2),
          )}
          newBookingTotal={noPaymentRequired ? undefined : newBookingTotal}
          originalAmount={originalAmount > 0 ? originalAmount : undefined}
          vehicleGearType={gearType}
          vehicleName={vehicleName}
          vehicleType={vehicleType}
          durationSeconds={240}
          endDate={new Date(pendingCheckoutData?.returnDate)}
          onCancel={handleClose}
          onSubmit={handleSubmit}
          user={{
            city: userprofile?.renter.city as string,
            email: userprofile?.renter.email as string,
            firstName: firstName as string,
            lastName: rest.join(" ") as string,
            phoneNumber: userprofile?.renter.phoneNumber as string,
            postalCode: userprofile?.renter.postalCode as string,
            state: userprofile?.renter.state as string,
            streetAddress: userprofile?.renter.streetAddress as string,
          }}
        />
      </Elements>
    </ModalWrapper>
  );
}
