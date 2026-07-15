/**
 * Returns a fun, hour-specific greeting string (no punctuation, no name).
 * Pass an hour (0-23) to override — otherwise uses the caller's local time.
 *
 * Usage:
 *   `${getTimeGreeting()}, ${businessName}! 👋`
 */
const HOURLY_GREETINGS: Record<number, string> = {
        0: "Burning the midnight oil",
        1: "Still up? Night owl mode",
        2: "Quiet hours over here",
        3: "The fleet never sleeps",
        4: "Early bird status: activated",
        5: "Rise and shine",
        6: "Good morning",
        7: "Good morning",
        8: "Good morning",
        9: "Good morning",
        10: "Mid-morning momentum",
        11: "Almost noon, looking sharp",
        12: "Happy noon",
        13: "Good afternoon",
        14: "Good afternoon",
        15: "Good afternoon",
        16: "Coasting into the evening",
        17: "Good evening",
        18: "Good evening",
        19: "Good evening",
        20: "Winding down out there",
        21: "Good evening, night owl",
        22: "Late night check-in",
        23: "Burning the midnight oil",
};

export function getTimeGreeting(hour?: number): string {
        const h = hour ?? new Date().getHours();
        const safeHour = ((h % 24) + 24) % 24; // guard against out-of-range input
        return HOURLY_GREETINGS[safeHour] ?? "Hello";
}