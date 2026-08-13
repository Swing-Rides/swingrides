/**
 * VIN (Vehicle Identification Number) local validation helper.
 *
 * Validates format + the ISO 3779 check-digit (position 9), which is used
 * by all North American (and many other) VINs. This catches the vast
 * majority of typos and fabricated VINs without any network call.
 */

export interface VinValidationResult {
  valid: boolean;
  vin: string;
  errors: string[];
  checkDigit?: {
    expected: string;
    computed: string;
  };
}

// Letters I, O, Q are never used in VINs (avoid confusion with 1, 0).
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

// Transliteration table for VIN checksum (ISO 3779).
const TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};

// Position weights, left to right, for positions 1-17 (position 9 is the check digit itself).
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

function charValue(char: string): number {
  if (char >= "0" && char <= "9") return Number(char);
  const val = TRANSLITERATION[char];
  if (val === undefined) {
    throw new Error(`Invalid VIN character: ${char}`);
  }
  return val;
}

function computeCheckDigit(vin: string): string {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += charValue(vin[i]) * WEIGHTS[i];
  }
  const remainder = sum % 11;
  return remainder === 10 ? "X" : String(remainder);
}

/**
 * Validate a VIN's structure and (optionally) its ISO 3779 check digit.
 *
 * @param rawVin      The VIN to validate (case-insensitive, whitespace trimmed).
 * @param options.strict  If true (default), also enforce the check-digit rule.
 */
export function validateVin(
  rawVin: string = "",
  options: { strict?: boolean } = {}
): VinValidationResult {
  const { strict = true } = options;
  const vin = (rawVin || "").trim().toUpperCase();
  const errors: string[] = [];

  if (vin.length !== 17) {
    errors.push(`VIN must be exactly 17 characters (got ${vin.length}).`);
  }

  if (!VIN_REGEX.test(vin)) {
    errors.push("VIN contains invalid characters (letters I, O, Q are not allowed).");
  }

  // If basic format already failed, don't attempt checksum (would throw).
  if (errors.length > 0) {
    return { valid: false, vin, errors };
  }

  const expected = vin[8]; // position 9, 0-indexed
  const computed = computeCheckDigit(vin);
  const checkDigitOk = expected === computed;

  if (strict && !checkDigitOk) {
    errors.push("Invalid VIN number. Please double-check and try again.");
  }

  return {
    valid: errors.length === 0,
    vin,
    errors,
    checkDigit: { expected, computed },
  };
}

/**
 * Convenience wrapper returning just a boolean.
 */
export function isValidVin(vin: string, options?: { strict?: boolean }): boolean {
  return validateVin(vin, options).valid;
}

// ---------------------------------------------------------------------------
// Example usage:
//
// const result = validateVin("1FA6P8TD5M5100001");
// console.log(result);
// // { valid: true, vin: '1FA6P8TD5M5100001', errors: [], checkDigit: { expected: '5', computed: '5' } }
//
// isValidVin("1FA6P8TD5M5100002"); // false (bad check digit)
// isValidVin("1FA6P8TD5M510000O"); // false (contains 'O')
// ---------------------------------------------------------------------------