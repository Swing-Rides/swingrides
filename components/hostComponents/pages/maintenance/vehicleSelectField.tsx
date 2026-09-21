"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Car, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorIcon, inputClass } from "@/components/forms/MainForm";
import { IListVehiclesDatum } from "@/types/vehicle.type";

export type VehicleSelectFieldProps = {
  value: string;
  onChange: (value: string, vehicle?: IListVehiclesDatum) => void;
  error?: string;
  vehicles?: IListVehiclesDatum[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  disabled?: boolean;
};

export default function VehicleSelectField({
  value,
  onChange,
  error,
  vehicles,
  isLoading = false,
  isError = false,
  onRetry,
  disabled = false,
}: VehicleSelectFieldProps) {
  const [open, setOpen] = useState(false);

  // Deduplicate and ensure each vehicle has a unique identifier
  const uniqueVehicles = useMemo(() => {
    if (!vehicles || vehicles.length === 0) return [];
    const seen = new Set<string>();
    const result: IListVehiclesDatum[] = [];

    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      if (!v) continue;
      const uniqueId = v._id || `${v.name || "vehicle"}-${i}`;
      if (!seen.has(uniqueId)) {
        seen.add(uniqueId);
        result.push(v._id ? v : { ...v, _id: uniqueId });
      }
    }
    return result;
  }, [vehicles]);

  const selectedVehicle = uniqueVehicles.find(
    (vehicle: IListVehiclesDatum) =>
      vehicle._id === value || vehicle.name === value,
  );

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="vehicleName"
          className="text-zinc-800 text-xs font-semibold font-text uppercase"
        >
          Vehicle <span className="text-[#EF4444] ml-1">*</span>
        </Label>
        {isError && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-[11px] text-blue-700 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer font-text"
          >
            <RefreshCw className="w-3 h-3" />
            Retry loading
          </button>
        )}
      </div>

      <Select
        value={selectedVehicle?._id ?? ""}
        onValueChange={(selectedId) => {
          const matched = uniqueVehicles.find((v) => v._id === selectedId);
          onChange(selectedId, matched);
        }}
        open={open}
        onOpenChange={setOpen}
        disabled={disabled || isLoading}
      >
        <SelectTrigger
          className={cn(
            inputClass(error),
            "h-auto min-h-11 py-2 px-3 transition-all duration-200",
          )}
        >
          <SelectValue
            placeholder={
              isLoading ? "Loading vehicles..." : "Select a vehicle"
            }
          >
            {selectedVehicle ? (
              <div className="flex items-center gap-2.5 min-w-0 text-left">
                {selectedVehicle.images?.[0] ? (
                  <Image
                    src={selectedVehicle.images[0]}
                    alt={selectedVehicle.name}
                    width={28}
                    height={28}
                    className="size-7 rounded object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="size-7 rounded bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-gray-400">
                    <Car className="size-4" />
                  </div>
                )}
                <span className="font-semibold text-sm text-neutral-900 truncate">
                  {selectedVehicle.name}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono text-xs font-semibold text-gray-700 tracking-wider shrink-0">
                  {selectedVehicle.licensePlate}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold uppercase tracking-wider shrink-0 border border-blue-100">
                  {selectedVehicle.vehicleType}
                </span>
              </div>
            ) : null}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="z-[9999] max-h-72 w-[var(--radix-select-trigger-width)] min-w-[340px] p-0 overflow-hidden border border-gray-200/80 shadow-lg">
          {/* Framer-motion smooth entrance container */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col p-1"
          >
            {isError ? (
              <div className="p-4 text-center flex flex-col items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-xs text-gray-600 font-text">
                  Could not load vehicles
                </p>
                {onRetry && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="h-7 text-xs font-text cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                )}
              </div>
            ) : !isLoading && uniqueVehicles.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500 font-text">
                No vehicles found in your fleet
              </div>
            ) : (
              uniqueVehicles.map((vehicle: IListVehiclesDatum) => (
                <SelectItem
                  key={vehicle._id}
                  value={vehicle._id}
                  className="py-2.5 px-3 cursor-pointer hover:bg-blue-50/60 focus:bg-blue-50/80 transition-colors border-b border-gray-100 last:border-b-0 rounded-sm"
                >
                  <div className="flex items-center gap-3 w-full">
                    {vehicle.images?.[0] ? (
                      <Image
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        width={44}
                        height={44}
                        className="size-11 rounded-md object-cover border border-gray-200 shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="size-11 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-gray-400">
                        <Car className="size-5" />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-neutral-900 truncate">
                          {vehicle.name}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold uppercase tracking-wider shrink-0 border border-blue-100">
                          {vehicle.vehicleType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono text-[11px] font-semibold text-gray-700 tracking-wider">
                          {vehicle.licensePlate}
                        </span>
                        <span>•</span>
                        <span>
                          {vehicle.mileage !== undefined &&
                            vehicle.mileage !== null
                            ? `${vehicle.mileage.toLocaleString()} km`
                            : "0 km"}
                        </span>
                        {vehicle.colour && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{vehicle.colour}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))
            )}
          </motion.div>
        </SelectContent>
      </Select>

      {error && (
        <span className="text-[#EF4444] text-xs font-normal font-text flex items-center gap-1">
          <ErrorIcon />
          {error}
        </span>
      )}
    </div>
  );
}

