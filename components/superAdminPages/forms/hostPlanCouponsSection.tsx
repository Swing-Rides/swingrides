"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, LoadingSpinner } from "@/components/forms/MainForm";
import {
  useListHostPlanCouponsQuery,
  useCreateHostPlanCouponMutation,
  useDeleteHostPlanCouponMutation,
} from "@/app/store/services/adminApi";
import { CouponDuration } from "@/types/settings.type";

type CouponFormValues = {
  code: string;
  name: string;
  percentOff: number | "";
  duration: CouponDuration;
  durationInMonths: number | "";
  redeemBy: string;
  maxRedemptions: number | "";
  autoApplyAtSignup: boolean;
};

const DEFAULT_VALUES: CouponFormValues = {
  code: "",
  name: "",
  percentOff: "",
  duration: "once",
  durationInMonths: "",
  redeemBy: "",
  maxRedemptions: "",
  autoApplyAtSignup: false,
};

export default function HostPlanCouponsSection() {
  const { data: couponsData, isLoading: isLoadingCoupons } =
    useListHostPlanCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] =
    useCreateHostPlanCouponMutation();
  const [deleteCoupon] = useDeleteHostPlanCouponMutation();
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    mode: "onTouched",
    defaultValues: DEFAULT_VALUES,
  });

  const duration = watch("duration");

  // Fields registered with `valueAsNumber: true` report an empty input as
  // NaN, not "" — and JSON.stringify(NaN) silently serializes to `null`,
  // which Stripe's API rejects for these optional params. Filtering NaN
  // (not just "") here is what actually keeps them out of the request.
  const toOptionalNumber = (value: number | "") =>
    typeof value === "number" && !Number.isNaN(value) ? value : undefined;

  const onSubmit = async (values: CouponFormValues) => {
    try {
      await createCoupon({
        code: values.code,
        name: values.name || undefined,
        percentOff: Number(values.percentOff),
        duration: values.duration,
        durationInMonths:
          values.duration === "repeating"
            ? toOptionalNumber(values.durationInMonths)
            : undefined,
        redeemBy: values.redeemBy || undefined,
        maxRedemptions: toOptionalNumber(values.maxRedemptions),
        autoApplyAtSignup: values.autoApplyAtSignup,
      }).unwrap();
      reset(DEFAULT_VALUES);
    } catch {
      // Failure toast is already shown by adminApi's base query.
    }
  };

  const handleDelete = async (code: string) => {
    setDeletingCode(code);
    try {
      await deleteCoupon(code).unwrap();
    } catch {
      // Failure toast is already shown by adminApi's base query.
    } finally {
      setDeletingCode(null);
    }
  };

  const coupons = couponsData?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-[#1F2937] text-base font-semibold font-text leading-6">
          Discount Coupons
        </h3>
        <span className="text-gray-500 text-xs font-normal font-text">
          Create Stripe coupon codes hosts can apply at checkout or upgrade.
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 md:p-6 bg-white rounded-[10px] border border-[#E5E7EB] flex flex-col gap-4"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField<CouponFormValues>
            field={{
              name: "code",
              type: "text",
              label: "Coupon Code",
              placeholder: "e.g. SAVE10",
              className: "uppercase",
              validation: { required: "Code is required" },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
          <FormField<CouponFormValues>
            field={{
              name: "name",
              type: "text",
              label: "Display Name",
              placeholder: "e.g. Launch promo",
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
          <FormField<CouponFormValues>
            field={{
              name: "percentOff",
              type: "number",
              label: "Percent Off",
              placeholder: "e.g. 10",
              min: 1,
              max: 100,
              validation: {
                required: "Percent off is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1" },
                max: { value: 100, message: "Cannot exceed 100" },
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField<CouponFormValues>
            field={{
              name: "duration",
              type: "select",
              label: "Duration",
              options: [
                { label: "Once", value: "once" },
                { label: "Repeating", value: "repeating" },
                { label: "Forever", value: "forever" },
              ],
              validation: { required: "Duration is required" },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
          {duration === "repeating" && (
            <FormField<CouponFormValues>
              field={{
                name: "durationInMonths",
                type: "number",
                label: "Duration (Months)",
                placeholder: "e.g. 3",
                min: 1,
                validation: {
                  required: "Required when duration is repeating",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1" },
                },
              }}
              register={register}
              control={control}
              getValues={getValues}
              errors={errors}
            />
          )}
          <FormField<CouponFormValues>
            field={{
              name: "redeemBy",
              type: "date",
              label: "Expires On (optional)",
              placeholder: "Pick a date",
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
          <FormField<CouponFormValues>
            field={{
              name: "maxRedemptions",
              type: "number",
              label: "Max Redemptions (optional)",
              placeholder: "Unlimited",
              min: 1,
              validation: {
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1" },
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
        </div>

        <FormField<CouponFormValues>
          field={{
            name: "autoApplyAtSignup",
            type: "checkbox",
            label:
              "Auto-apply to every new host registration (no code needed). Only one coupon can be active this way — turning this on for a new coupon turns it off for any other.",
          }}
          register={register}
          control={control}
          getValues={getValues}
          errors={errors}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isCreating}
            className="px-8 py-2.5 rounded-xs bg-blue-700 hover:bg-blue-900 text-white font-semibold font-text cursor-pointer transition-colors duration-200 disabled:opacity-50"
          >
            {isCreating ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Creating...
              </span>
            ) : (
              "Create Coupon"
            )}
          </Button>
        </div>
      </form>

      <div className="bg-white rounded-[10px] border border-[#E5E7EB] overflow-hidden overflow-x-auto">
        {isLoadingCoupons ? (
          <div className="p-6 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No coupons created yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-left text-xs font-semibold text-gray-500 uppercase">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Redemptions</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-[#E5E7EB] last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <span className="flex items-center gap-2">
                      {coupon.id}
                      {coupon.autoApplyAtSignup && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Auto-applied at signup
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {coupon.percentOff}% off
                  </td>
                  <td className="px-4 py-3 text-gray-700 capitalize">
                    {coupon.duration}
                    {coupon.duration === "repeating" && coupon.durationInMonths
                      ? ` (${coupon.durationInMonths}mo)`
                      : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {coupon.timesRedeemed}
                    {coupon.maxRedemptions ? ` / ${coupon.maxRedemptions}` : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {coupon.redeemBy
                      ? new Date(coupon.redeemBy).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        coupon.valid
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500",
                      ].join(" ")}
                    >
                      {coupon.valid ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(coupon.id)}
                      disabled={deletingCode === coupon.id}
                      className="text-red-600 hover:text-red-800 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
