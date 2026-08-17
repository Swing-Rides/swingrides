"use client";

import { useState } from "react";
import { Loader2, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/MainForm";
import { toast } from "sonner";

type WithdrawFormValues = {
  amount: number | "";
};

type WithdrawFundsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxAmount?: number;
  currency?: string;
  onConfirm?: (amount: number) => void | Promise<void>;
};

export default function WithdrawFundsModal({
  open,
  onOpenChange,
  maxAmount,
  currency = "USD",
  onConfirm,
}: WithdrawFundsModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawFormValues>({
    defaultValues: {
      amount: "",
    },
  });

  const formattedMaxAmount =
    maxAmount !== undefined
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
        }).format(maxAmount)
      : null;

  const handleClose = () => {
    if (!isProcessing) {
      reset();
      onOpenChange(false);
    }
  };

  const onSubmit = async (data: WithdrawFormValues) => {
    const numAmount =
      typeof data.amount === "number" ? data.amount : parseFloat(data.amount as string);

    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsProcessing(true);
    try {
      if (onConfirm) {
        await onConfirm(numAmount);
      }
      toast.success("Withdrawal request submitted successfully");
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to process withdrawal. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickSelect = (percentage: number) => {
    if (maxAmount !== undefined && maxAmount > 0) {
      const calculated = parseFloat((maxAmount * percentage).toFixed(2));
      setValue("amount", calculated, { shouldValidate: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold font-text">
            <DollarSign className="size-5 text-blue-700" />
            Withdraw Funds
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 font-text">
            Enter the amount you would like to withdraw to your connected bank account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {formattedMaxAmount && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-xs font-medium text-gray-600 font-text">
                Available Balance
              </span>
              <span className="text-sm font-bold text-neutral-950 font-text">
                {formattedMaxAmount}
              </span>
            </div>
          )}

          <FormField
            field={{
              name: "amount",
              type: "number-dollar",
              label: `Withdrawal Amount (${currency})`,
              placeholder: "0.00",
              min: 0.01,
              max: maxAmount,
              step: 0.01,
              disabled: isProcessing,
              validation: {
                required: "Please enter an amount to withdraw",
                min: {
                  value: 0.01,
                  message: "Amount must be greater than $0",
                },
                max:
                  maxAmount !== undefined
                    ? {
                        value: maxAmount,
                        message: `Amount cannot exceed available balance (${formattedMaxAmount})`,
                      }
                    : undefined,
                valueAsNumber: true,
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />

          {maxAmount !== undefined && maxAmount > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickSelect(0.25)}
                disabled={isProcessing}
                className="flex-1 py-1 px-2 text-xs font-medium border border-gray-200 rounded-xs bg-white hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(0.5)}
                disabled={isProcessing}
                className="flex-1 py-1 px-2 text-xs font-medium border border-gray-200 rounded-xs bg-white hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(0.75)}
                disabled={isProcessing}
                className="flex-1 py-1 px-2 text-xs font-medium border border-gray-200 rounded-xs bg-white hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(1)}
                disabled={isProcessing}
                className="flex-1 py-1 px-2 text-xs font-medium border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer rounded-xs"
              >
                Max
              </button>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="w-full sm:w-auto rounded-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full sm:w-auto bg-blue-700 hover:bg-blue-900 text-white rounded-xs ml-3 cursor-pointer"
            >
              {isProcessing && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isProcessing ? "Processing…" : "Process Withdrawal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
