export function formatDateOrFallback(
        date: string | Date | null | undefined,
        fallback = "N/A",
): string {
        if (!date) return fallback;

        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return fallback;

        return parsed.toLocaleDateString();
}