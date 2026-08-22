import { User, TripStatus, ButtonConfig } from "./types";

export const getInitials = (fullName?: string) => {
  if (!fullName) return "";

  const names = fullName.trim().split(/\s+/).filter(Boolean);

  if (names.length === 0) return "";

  const firstInitial = names[0][0].toUpperCase();
  const lastInitial =
    names.length > 1 ? names[names.length - 1][0].toUpperCase() : "";

  return `${firstInitial}${lastInitial}`;
};

export const getTotalTrips = (rentals?: User["rentals"]) => {
  if (!rentals) return 0;

  return rentals.filter((rental) => rental.status !== "Cancelled").length;
};

export const getAverageRating = (rentals?: User["rentals"]) => {
  if (!rentals) return 0;

  const completedRentals = rentals.filter(
    (rental): rental is typeof rental & { hostRatingForGuest: number } =>
      rental.status === "Completed" &&
      typeof rental.hostRatingForGuest === "number",
  );

  if (completedRentals.length === 0) return 0;

  const totalRating = completedRentals.reduce(
    (sum, rental) => sum + rental.hostRatingForGuest,
    0,
  );
  return totalRating / completedRentals.length;
};

export const getTripButtons = (
  status: TripStatus,
  rentId: string,
  currentParams: string,
  contactNumber: string,
  hasCheckedIn?: boolean,
): ButtonConfig[] => {
  const modifyParams = new URLSearchParams(currentParams);
  modifyParams.set("modify", rentId);

  // Once the renter has already checked in, "Running Late"/"Overdue" mean the
  // return is late, not that pickup is late - Cancel/Modify no longer apply
  // since the vehicle is already with the renter. Treat it like "Active";
  // the trip detail page (View Details) surfaces "Complete Vehicle Return".
  const activeButtons: ButtonConfig[] = [
    { label: "View Details", href: `/trip/${rentId}` },
    { label: "Contact Host", href: `tel:${contactNumber}` },
  ];

  switch (status) {
    case "Upcoming":
      return [
        { label: "View Details", href: `/trip/${rentId}` },
        { label: "Modify", href: `?${modifyParams.toString()}` },
        {
          label: "Cancel",
          href: `?${(() => {
            const p = new URLSearchParams(currentParams);
            p.set("cancel", rentId);
            return p.toString();
          })()}`,
        },
      ];
    case "Running Late":
      if (hasCheckedIn) {
        return activeButtons;
      }
      return [
        { label: "View Details", href: `/trip/${rentId}` },
        { label: "Contact Host", href: `tel:${contactNumber}` },
        { label: "Modify", href: `?${modifyParams.toString()}` },
        {
          label: "Cancel",
          href: `?${(() => {
            const p = new URLSearchParams(currentParams);
            p.set("cancel", rentId);
            return p.toString();
          })()}`,
        },
      ];
    case "Overdue":
      if (hasCheckedIn) {
        return activeButtons;
      }
      return [
        { label: "View Details", href: `/trip/${rentId}` },
        {
          label: "Cancel",
          href: `?${(() => {
            const p = new URLSearchParams(currentParams);
            p.set("cancel", rentId);
            return p.toString();
          })()}`,
        },
        { label: "Contact Host", href: `tel:${contactNumber}` },
      ];
    case "Active":
      return activeButtons;
    case "Completed":
      return [
        { label: "View Details", href: `/trip/${rentId}` },
        { label: "Rate Trip", href: `/trip/${rentId}/rate` },
      ];
    case "Cancelled":
      return [{ label: "View Details", href: `/trip/${rentId}` }];
    default:
      return [];
  }
};

export const getTripDuration = (pickUpDate: string, returnDate: string) => {
  const pickUp = new Date(pickUpDate);
  const returnD = new Date(returnDate);
  const days = Math.ceil(
    (returnD.getTime() - pickUp.getTime()) / (1000 * 60 * 60 * 24),
  );
  return days;
};

export const statusBadgeClass: Record<TripStatus, string> = {
  Upcoming: "bg-[#E3EEFF] text-[#3B82F6] border-transparent",
  Active: "bg-[#DAFFF3] text-[#10B981] border-transparent",
  Completed: "bg-[#E5E7EB] text-[#6B7280] border-transparent",
  Cancelled: "bg-red-500 text-red-50 border-transparent",
  Overdue: "bg-red-100 text-red-500 border-transparent",
  "Running Late": "bg-red-100 text-red-500 border-transparent",
};
