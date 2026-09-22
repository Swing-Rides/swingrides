/**
 * Common service types offered as one-click presets in the log-service form.
 *
 * The backend stores `serviceType` as free text and filters on exact
 * (case-insensitive) equality, so inconsistent spellings — "Oil change",
 * "oil chg" — fragment the service-type filter. Offering the usual values as
 * presets keeps the data tidy without blocking anything: the field stays a
 * text input, so anything not listed here can still be typed.
 */
export const SERVICE_TYPE_PRESETS = [
  "Oil Change",
  "Full Service",
  "Brake Service",
  "Tyre Replacement",
  "Battery Check",
  "Wheel Alignment",
  "Inspection",
] as const;

/**
 * Mirrors DUE_SOON_DAYS / DUE_SOON_KM in the backend's maintenance service.
 * Used only for the explanatory hint under the "Next Service Due" fields, so
 * hosts can see what will flip a vehicle into the Due Soon bucket.
 */
export const DUE_SOON_DAYS = 30;
export const DUE_SOON_KM = 3000;

/** Defaults behind the "quick fill" buttons on the next-service fields. */
export const DEFAULT_SERVICE_INTERVAL_MONTHS = 6;
export const DEFAULT_SERVICE_INTERVAL_KM = 10000;
