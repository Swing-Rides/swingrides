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