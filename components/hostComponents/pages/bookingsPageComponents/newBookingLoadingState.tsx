import { Skeleton } from "@/components/ui/skeleton";

export default function NewBookingLoadingState() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Panel: Form Input Skeletons */}
        <div className="p-4 rounded-[10px] border border-gray-200 bg-white flex flex-col gap-5">
          {/* Section 1: Vehicle Selection */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-36 bg-gray-200" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-28 bg-gray-200" />
              <Skeleton className="h-10 w-full rounded-xs bg-gray-200" />
            </div>
          </div>

          <div className="h-px bg-gray-200 w-full" />

          {/* Section 2: Renter Details */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-32 bg-gray-200" />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-20 bg-gray-200" />
                <Skeleton className="h-10 w-full rounded-xs bg-gray-200" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-20 bg-gray-200" />
                <Skeleton className="h-10 w-full rounded-xs bg-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-24 bg-gray-200" />
                <Skeleton className="h-10 w-full rounded-xs bg-gray-200" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-24 bg-gray-200" />
                <Skeleton className="h-10 w-full rounded-xs bg-gray-200" />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200 w-full" />

          {/* Section 3: Booking Dates & Location */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-48 bg-gray-200" />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-32 bg-gray-200" />
                <Skeleton className="h-10 w-full rounded-xs bg-gray-200" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-32 bg-gray-200" />
                <Skeleton className="h-10 w-full rounded-xs bg-gray-200" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-28 bg-gray-200" />
              <Skeleton className="h-10 w-full rounded-xs bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Right Panel: Booking Summary Skeleton */}
        <div className="p-4 rounded-[10px] border border-gray-200 bg-white flex flex-col gap-5">
          <Skeleton className="h-5 w-36 bg-gray-200" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-14 rounded-md bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-40 bg-gray-200" />
              <Skeleton className="h-3 w-24 bg-gray-200" />
            </div>
          </div>
          <div className="h-px bg-gray-200 w-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full bg-gray-200" />
            <Skeleton className="h-4 w-3/4 bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
          </div>
          <div className="h-px bg-gray-200 w-full" />
          <Skeleton className="h-12 w-full rounded-[10px] bg-gray-200" />
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24 rounded-xs bg-gray-200" />
        <Skeleton className="h-10 w-44 rounded-xs bg-gray-200" />
      </div>
    </div>
  );
}
