export const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr)
        const day = date.getDate()
        const suffix =
                day % 10 === 1 && day !== 11 ? 'st' :
                        day % 10 === 2 && day !== 12 ? 'nd' :
                                day % 10 === 3 && day !== 13 ? 'rd' : 'th'

        const month = date.toLocaleString('en-US', { month: 'short' })
        const year = date.getFullYear()
        return `${day}${suffix} ${month}, ${year}`
}

export const getRelativeTime = (date: string | Date): string => {
        const now = new Date();
        const past = new Date(date);

        if (Number.isNaN(past.getTime())) {
                return "Invalid date";
        }

        if (past > now) {
                return "just now";
        }

        // Work with a copy so we can calculate calendar units
        let cursor = new Date(past);

        let months = 0;
        let weeks = 0;
        let days = 0;
        let hours = 0;
        let minutes = 0;

        // Months
        while (true) {
                const next = new Date(cursor);
                next.setMonth(next.getMonth() + 1);

                if (next <= now) {
                        months++;
                        cursor = next;
                } else {
                        break;
                }
        }

        // Weeks
        while (true) {
                const next = new Date(cursor);
                next.setDate(next.getDate() + 7);

                if (next <= now) {
                        weeks++;
                        cursor = next;
                } else {
                        break;
                }
        }

        // Days
        while (true) {
                const next = new Date(cursor);
                next.setDate(next.getDate() + 1);

                if (next <= now) {
                        days++;
                        cursor = next;
                } else {
                        break;
                }
        }

        // Remaining hours
        const remainingMs = now.getTime() - cursor.getTime();

        hours = Math.floor(remainingMs / (1000 * 60 * 60));

        const afterHours = remainingMs % (1000 * 60 * 60);
        minutes = Math.floor(afterHours / (1000 * 60));

        const parts: string[] = [];

        if (months) parts.push(`${months}month${months > 1 ? "s" : ""}`);
        if (weeks) parts.push(`${weeks}week${weeks > 1 ? "s" : ""}`);
        if (days) parts.push(`${days}day${days > 1 ? "s" : ""}`);
        if (hours) parts.push(`${hours}hr${hours > 1 ? "s" : ""}`);
        if (minutes && parts.length < 2) {
                parts.push(`${minutes}min${minutes > 1 ? "s" : ""}`);
        }

        if (!parts.length) {
                return "just now";
        }

        return `${parts.slice(0, 4).join(" ")} ago`;
};