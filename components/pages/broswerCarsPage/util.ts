import { toast } from "sonner";

export function getStarPercentage(
  starRated: number,
  totalRatings: number,
): number {
  if (totalRatings === 0) return 0;
  return Math.round((starRated / totalRatings) * 1000) / 10;
}

export type RentalType = "any" | "per day" | "per hour" | "per week";
export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "rating-asc"
  | "name-asc";

export type CarsFilterParams = {
  search: string;
  rentalType: RentalType;
  availableOnly: boolean;
  priceMin: number;
  priceMax: number;
  vehicleTypes: string[];
  seats: string[];
  transmissions: string[];
  sort: SortOption;
};

interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

/**
 * Shares content using the native Web Share API when available,
 * falling back to copying the URL to the clipboard.
 * Shows toast feedback via sonner for each outcome.
 */
export async function shareContent({
  title,
  text,
  url = typeof window !== "undefined" ? window.location.href : "",
}: ShareOptions): Promise<void> {
  const shareData: ShareData = { title, text, url };

  // Use native share sheet on supported browsers (mostly mobile)
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return; 
      }
    } catch (err) {
      // AbortError happens when the user closes the share sheet — silently ignore
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      console.error("Error sharing content:", err);
      // fall through to clipboard fallback
    }
  }

  // Fallback: copy link to clipboard
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  } catch (err) {
    console.error("Error copying to clipboard:", err);
    toast.error("Couldn't share. Please try again.");
  }
}