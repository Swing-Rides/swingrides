/**
 * Returns the absolute number of days between `dueDate` and `now`,
 * formatted as "N days".
 *
 * `now` must be passed in (rather than calling Date.now() inline) so the
 * value used during render is stable and computed on the client after
 * mount — calling Date.now() directly inside render can produce a
 * different value on the server render pass than on the client hydration
 * pass, which Next.js flags as a hydration mismatch.
 */
export function formatDaysDelta(dueDate: string | Date, now: Date): string {
        const dueTime = new Date(dueDate).getTime();

        if (Number.isNaN(dueTime)) return "N/A";

        const days = Math.ceil(Math.abs(dueTime - now.getTime()) / (1000 * 60 * 60 * 24));
        return `${days} days`;
}

export function formatDateOrFallback(
        date: string | Date | null | undefined,
        fallback = "N/A",
): string {
        if (!date) return fallback;

        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return fallback;

        return parsed.toLocaleDateString();
}