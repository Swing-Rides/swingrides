export function calculatePercentages<T extends Record<string, unknown>>(
        data: T[],
        key: keyof T
): (T & { percentage: string })[] {
        const total = data.reduce((sum, item) => sum + Number(item[key]), 0)
        return data.map((item) => ({
                ...item,
                percentage: total === 0 ? "0%" : `${Math.round((Number(item[key]) / total) * 100)}%`,
        }))
}

/**
 * Calculates the percentage difference between current and previous values.
 * Returns the formatted string and the appropriate Tailwind text color class.
 *
 * @example
 * calcPercentageDiff(120, 100) → { percentage: "20.0%", colorClass: "text-emerald-500" }
 * calcPercentageDiff(80, 100)  → { percentage: "-20.0%", colorClass: "text-red-500" }
 */
export function calcPercentageDiff(
        current: number,
        previous: number,
        options?: { invertColors?: boolean }
): { percentage: string; colorClass: string } {
        if (previous === 0) {
                return { percentage: "N/A", colorClass: "text-gray-400" }
        }

        const diff = ((current - previous) / Math.abs(previous)) * 100
        const isPositive = diff >= 0

        // invertColors: a decrease is good (e.g. churn rate, failed payments)
        const isGood = options?.invertColors ? !isPositive : isPositive

        return {
                percentage: `${isPositive ? "+" : ""}${diff.toFixed(1)}%`,
                colorClass: isGood ? "text-emerald-500" : "text-red-500",
        }
}