// ─── Types ────────────────────────────────────────────────────────────────────

export type PriceConfig = {
        daily: number;
        weekly: number;
        monthly: number;
};

export type PricingLineItem = { label: string; total: number };

export type ComputedPricing = {
        displayPrice: number; // headline price shown at top (monthly > weekly > daily)
        displayPriceTier: string; // label for headline price
        lineItems: PricingLineItem[];
        total: number;
};

// ─── Formatting helpers ────────────────────────────────────────────────────────

export const formatCurrency = (amount?: number | null) => {
        const value =
                typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
        return value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
        });
};

export const pluralize = (n: number, word: string) =>
        `${n} ${word}${n !== 1 ? "s" : ""}`;

// ─── Rental pricing ────────────────────────────────────────────────────────────

/**
 * Mixed-unit billing — full periods at the dominant tier rate,
 * remaining days at the daily rate.
 *
 * Examples:
 *   8 days  → 1 week ($X/wk) + 1 day ($Y/day)
 *   16 days → 2 weeks + 2 days
 *   45 days → 1 month + 2 weeks + 1 day
 */
export const computePricing = (
        price: PriceConfig,
        days: number,
): ComputedPricing => {
        // Normalize incoming prices
        const normalizedPrice = {
                daily: price.daily ?? 0,
                weekly: price.weekly ?? 0,
                monthly: price.monthly ?? 0,
        };
        const lineItems: PricingLineItem[] = [];
        let remaining = days;
        let total = 0;

        // Months
        const months = Math.floor(remaining / 30);
        if (months > 0) {
                const monthTotal = months * normalizedPrice.monthly;
                total += monthTotal;
                remaining -= months * 30;
                lineItems.push({
                        label: `${pluralize(months, "month")} @ ${formatCurrency(normalizedPrice.monthly)}/mo`,
                        total: monthTotal,
                });
        }

        // Weeks (from the remainder)
        const weeks = Math.floor(remaining / 7);
        if (weeks > 0) {
                const weekTotal = weeks * normalizedPrice.weekly;
                total += weekTotal;
                remaining -= weeks * 7;
                lineItems.push({
                        label: `${pluralize(weeks, "week")} @ ${formatCurrency(normalizedPrice.weekly)}/wk`,
                        total: weekTotal,
                });
        }

        // Days (final remainder)
        if (remaining > 0) {
                const dayTotal = remaining * normalizedPrice.daily;
                total += dayTotal;
                lineItems.push({
                        label: `${pluralize(remaining, "day")} @ ${formatCurrency(normalizedPrice.daily)}/day`,
                        total: dayTotal,
                });
        }

        // Headline: show the dominant tier's unit price
        let displayPrice = normalizedPrice.daily;
        let displayPriceTier = "day";
        if (days >= 30) {
                displayPrice = normalizedPrice.monthly;
                displayPriceTier = "month";
        } else if (days >= 7) {
                displayPrice = normalizedPrice.weekly;
                displayPriceTier = "week";
        }

        return { displayPrice, displayPriceTier, lineItems, total };
};

// ─── Insurance fee ──────────────────────────────────────────────────────────────

/**
 * Insurance is always billed per-day, regardless of which rental tier
 * (daily/weekly/monthly) the booking falls into — e.g. 2 weeks of rental
 * still means 14 days × insuranceFeePerDay.
 *
 * Only charged when the host is providing coverage. If the renter supplies
 * their own insurance (hostProvidingCoverage === false), the fee is 0.
 */
export const computeInsuranceFee = (
        days: number,
        insuranceFeePerDay: number,
        hostProvidingCoverage: boolean,
): number => {
        if (!hostProvidingCoverage || days <= 0) return 0;
        return days * (insuranceFeePerDay ?? 0);
};

// ─── Grand total (rental + insurance + tax) ────────────────────────────────────

export type TotalBreakdown = {
        subtotal: number;
        insuranceFee: number;
        taxableAmount: number;
        tax: number;
        totalAmount: number;
};

export const computeTotal = (
        pricingTotal: number,
        insuranceFee: number,
        taxRate: number,
): TotalBreakdown => {
        const subtotal = pricingTotal;
        const taxableAmount = subtotal + insuranceFee;
        const tax = taxableAmount * taxRate;
        const totalAmount = taxableAmount + tax;
        return { subtotal, insuranceFee, taxableAmount, tax, totalAmount };
};