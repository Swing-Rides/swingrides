export type PendingCheckoutDraft = {
        vehicleId: string;
        pickupDate: string;
        returnDate: string;
        pickupLocation: string;
        insuranceProvider?: string;
        policyNumber?: string;
        insuranceExpiry?: string;
        hostProvidingCoverage?: boolean;
        subtotal?: number;
        tax?: number;
        taxRate?: number;
        totalAmount?: number;
        totalDays?: number;
        pickupTime: string;
        returnTime: string;
        streetAddress?: string;
        city?: string;
        state?: string;
        postalCode?: string;
};

export type AuthView = "login" | "signup";

// ─── Formatting ─────────────────────────────────────────────────────────────

export const formatCurrency = (amount?: number | null) =>
        `$${Number(amount || 0).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
        })}`;

// ─── Error parsing ──────────────────────────────────────────────────────────

/** Pulls a human-readable message out of an RTK Query error / thrown Error. */
export const getErrorMessage = (error: unknown, fallback: string) => {
        if (
                typeof error === "object" &&
                error !== null &&
                "data" in error &&
                typeof error.data === "object" &&
                error.data !== null &&
                "message" in error.data &&
                typeof error.data.message === "string"
        ) {
                return error.data.message;
        }

        if (
                typeof error === "object" &&
                error !== null &&
                "data" in error &&
                typeof error.data === "object" &&
                error.data !== null &&
                "error" in error.data &&
                typeof error.data.error === "string"
        ) {
                return error.data.error;
        }

        if (error instanceof Error) {
                return error.message;
        }

        return fallback;
};

/** RTK Query's FetchBaseQueryError shape has a numeric/string `status`. */
export const getErrorStatus = (error: unknown): number | string | undefined => {
        if (typeof error === "object" && error !== null && "status" in error) {
                return (error as { status?: number | string }).status;
        }
        return undefined;
};

/**
 * True for a 401/403, or any error whose message reads like an auth
 * requirement (some endpoints return 200-shaped errors with a message like
 * "User authentication required" instead of a proper status code).
 * Used to redirect the person to the login/signup modal instead of
 * surfacing a raw error screen.
 */
export const isUnauthenticatedError = (error: unknown) => {
        const status = getErrorStatus(error);
        if (status === 401 || status === 403) return true;

        const message = getErrorMessage(error, "").toLowerCase();
        return (
                message.includes("authentication") ||
                message.includes("unauthorized") ||
                message.includes("not logged in") ||
                message.includes("log in")
        );
};

// ─── Draft persistence (sessionStorage) ────────────────────────────────────

export const getPendingCheckoutStorageKey = (vehicleId: string) =>
        `swingrides:pending-checkout:${vehicleId}`;

/** Returns the stored draft, or `null` if missing/corrupted. Never throws. */
export const readDraftFromStorage = (
        vehicleId: string,
): PendingCheckoutDraft | null => {
        if (typeof window === "undefined") return null;

        const raw = window.sessionStorage.getItem(
                getPendingCheckoutStorageKey(vehicleId),
        );
        if (!raw) return null;

        try {
                return JSON.parse(raw) as PendingCheckoutDraft;
        } catch (error) {
                console.error("Failed to parse pending checkout draft:", error);
                return null;
        }
};

export const writeDraftToStorage = (
        vehicleId: string,
        draft: PendingCheckoutDraft,
) => {
        if (typeof window === "undefined") return;
        window.sessionStorage.setItem(
                getPendingCheckoutStorageKey(vehicleId),
                JSON.stringify(draft),
        );
};

export const clearDraftFromStorage = (vehicleId: string) => {
        if (typeof window === "undefined") return;
        window.sessionStorage.removeItem(getPendingCheckoutStorageKey(vehicleId));
};