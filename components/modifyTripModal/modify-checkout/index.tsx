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
import ModalWrapper from "@/components/modals/modalWrapper";
import { stripePromise } from "@/lib/stripe";
import { Elements } from "@stripe/react-stripe-js";
import React, { useCallback, useEffect, useState } from "react";

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

    setPaymentIntent(null);
    setNoPaymentRequired(false);

    createPaymentIntent({
      bookingId,
      pickupDate: pendingCheckoutData.pickupDate,
      returnDate: pendingCheckoutData.returnDate,
    })
      .unwrap()
      .then((res) => setPaymentIntent(res.data as any))
      .catch(() => setNoPaymentRequired(true));
  }, [bookingId, pendingCheckoutData]);

  if (!pendingCheckoutData || !bookingId) return null;
  if (!paymentIntent && !noPaymentRequired) return null;

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
      paymentIntentId: values.paymentIntentId,
    }).unwrap();
    handleClose();
  };

  const meta = paymentIntent?.metadata;

  // paymentIntent top-level fields = the actual charge amounts (price difference only).
  // metadata fields = full new booking totals (for reference).
  // The summary and Pay button must both reflect what Stripe is charging: the difference.
  const chargeAmount =
    paymentIntent?.totalAmount ?? pendingCheckoutData.totalAmount;
  const chargeSubtotal =
    paymentIntent?.subtotal ?? Number(meta?.priceDifference ?? chargeAmount);
  const chargeTax = paymentIntent?.taxRate ?? 0;
  const chargeTaxRate =
    paymentIntent?.taxRate ??
    Number(meta?.taxRate ?? pendingCheckoutData.taxRate);
  const chargeInsuranceFee = paymentIntent?.insuranceFee ?? 0;

  // Full new booking total — shown as an informational line only
  const newBookingTotal = Number(
    meta?.totalAmount ?? pendingCheckoutData.totalAmount,
  );
  const originalAmount = Number(meta?.originalAmount ?? 0);

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
          subTotalFee={String(chargeSubtotal)}
          taxFee={String(chargeTax)}
          taxPercentageRate={String(chargeTaxRate)}
          insuranceFee={chargeInsuranceFee}
          totalPrice={String(
            noPaymentRequired ? pendingCheckoutData.totalAmount : chargeAmount,
          )}
          chargeAmount={String(noPaymentRequired ? 0 : chargeAmount)}
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
            city: "",
            email: userprofile?.renter.email as string,
            firstName: firstName as string,
            lastName: rest.join(" ") as string,
            phoneNumber: userprofile?.renter.phoneNumber as string,
            postalCode: "DAMI",
            state: "DAMIAN",
            streetAddress: "DAMOLA",
          }}
        />
      </Elements>
    </ModalWrapper>
  );
}
