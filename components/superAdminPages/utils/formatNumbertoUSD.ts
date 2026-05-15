
/** $320 → "$320"  |  $1234 → "$1.2K"  |  $1234567 → "$1.2M" */
export function formatNumberToUSD(value: number): string {
        if (value === 0) return "$0"
        if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
        if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
        if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
        return `$${value}`
}