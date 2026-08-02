import { formatCurrency, pluralize } from "@/lib/pricing";
import { AlertCircle } from "lucide-react";
import { Separator } from "../ui/separator";
import { ExtraDaysSummary } from "./types";

type ModifyRentalFormFooterProps = {
  summary: ExtraDaysSummary | null;
  hostProvidingCoverage: boolean;
  insuranceDailyFee: number;
  onClose: () => void;
  /** Already bound to the current form values by the parent — takes no args. */
  handleCheckSummary: () => void;
};

export default function ModifyRentalFormFooter({
  summary,
  onClose,
  handleCheckSummary,
  hostProvidingCoverage,
  insuranceDailyFee,
}: ModifyRentalFormFooterProps) {
  return (
    <>
      {summary && (
        <div className="p-4 bg-indigo-50 rounded-[10px] flex flex-col justify-start items-start gap-2">
          <div className="flex flex-col justify-start items-start gap-1 w-full">
            {summary.breakdown.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 justify-between items-center w-full"
              >
                <span className="text-zinc-500 text-sm font-normal font-text leading-5">
                  {item.label}
                </span>
                <span className="text-gray-700 text-sm font-medium font-text">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}

            <div className="flex gap-3 justify-between items-center w-full">
              <span className="flex text-black text-sm font-normal font-text leading-5">
                {`Added Duration: ${pluralize(summary.days, "day")}`}
              </span>
              <span className="flex text-blue-700 text-base font-medium font-text leading-6 text-nowrap">
                {`Subtotal: ${formatCurrency(summary.total)}`}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col justify-start items-start gap-1 w-full">
            {hostProvidingCoverage && (
              <div className="flex gap-3 justify-between items-center w-full">
                <span className="text-zinc-500 text-sm font-normal font-text leading-5">
                  Insurance · {pluralize(summary.days, "day")} @{" "}
                  {formatCurrency(insuranceDailyFee)}/day
                </span>
                <span className="text-gray-700 text-sm font-medium font-text">
                  {summary.insuranceTotalFee}
                </span>
              </div>
            )}

            <div className="flex gap-3 justify-between items-center w-full">
              <span className="text-zinc-500 text-sm font-normal font-text leading-5">
                {`Taxable Amount ${summary.taxRate}%`}
              </span>
              <span className="text-gray-700 text-sm font-medium font-text">
                {summary.taxAmount}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3 justify-between items-center w-full">
            <span className="flex text-black text-sm font-bold font-text leading-5">
              Estimated New Total
            </span>
            <span className="flex text-blue-700 text-base font-bold font-text leading-6 text-nowrap">
              {summary.totalAmount}
            </span>
          </div>

          <span className="flex-1 justify-start text-gray-500 text-xs font-normal font-text leading-4">
            Final amount will be confirmed after modification.
          </span>
        </div>
      )}

      <div className="p-4 bg-amber-100 rounded-[10px] flex justify-start items-start gap-2">
        <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
        <span className="block text-amber-800 text-xs font-normal font-text leading-5">
          Modifications within 24 hours of pickup may incur a fee.
        </span>
      </div>

      <button
        type="button"
        onClick={handleCheckSummary}
        className="w-full text-sm font-medium font-text leading-5 border border-blue-700 text-blue-700 rounded-xs py-2 px-4 bg-transparent hover:bg-blue-50 transition-colors duration-300 cursor-pointer"
      >
        Check Summary
      </button>

      <button
        type="button"
        onClick={onClose}
        className="w-full text-sm font-medium font-text leading-5 border border-gray-500 text-gray-500 rounded-xs py-2 px-4 bg-transparent hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
      >
        Cancel
      </button>
    </>
  );
}
