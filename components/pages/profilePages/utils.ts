import { User, TripStatus, ButtonConfig, Rentals } from "./types"

export const getInitials = (fullName?: string) => {
        if (!fullName) return ''

        const names = fullName
                .trim()
                .split(/\s+/)
                .filter(Boolean)

        if (names.length === 0) return ''

        const firstInitial = names[0][0].toUpperCase()
        const lastInitial = names.length > 1 ? names[names.length - 1][0].toUpperCase() : ''

        return `${firstInitial}${lastInitial}`
}

export const getTotalTrips = (rentals?: User['rentals']) => {
        if (!rentals) return 0

        return rentals.filter(rental => rental.status !== 'Cancelled').length
}

export const getAverageRating = (rentals?: User['rentals']) => {
        if (!rentals) return 0

        const completedRentals = rentals.filter(
                (rental): rental is typeof rental & { hostRatingForGuest: number } =>
                        rental.status === 'Completed' && typeof rental.hostRatingForGuest === 'number'
        )

        if (completedRentals.length === 0) return 0

        const totalRating = completedRentals.reduce((sum, rental) => sum + rental.hostRatingForGuest, 0)
        return totalRating / completedRentals.length
}

export const getTotalSpent = (rentals?: User['rentals']) => {
        if (!rentals) return 0

        const activeAndCompletedRentals = rentals.filter(
                rental => rental.status === 'Active' || rental.status === 'Completed'
        )

        if (activeAndCompletedRentals.length === 0) return 0

        return activeAndCompletedRentals.reduce((total, rental) => {
                const pickUp = new Date(rental.pickUpDate)
                const returnD = new Date(rental.returnDate)
                const days = Math.ceil((returnD.getTime() - pickUp.getTime()) / (1000 * 60 * 60 * 24))
                return total + days * rental.price
        }, 0)
}

export const getTripButtons = (
        status: TripStatus,
        rentId: string,
        currentParams: string,
        contactNumber: string
): ButtonConfig[] => {
        // const params = new URLSearchParams(currentParams)

        const modifyParams = new URLSearchParams(currentParams)
        modifyParams.set('modify', rentId)

        switch (status) {
                case 'Upcoming':
                        return [
                                { label: 'View Details', href: `/trip/${rentId}` },
                                { label: 'Modify', href: `?${modifyParams.toString()}` },
                                { label: 'Cancel', href: `?${(() => { const p = new URLSearchParams(currentParams); p.set('cancel', rentId); return p.toString() })()}` },
                        ]
                case 'Active':
                        return [
                                { label: 'View Details', href: `/trip/${rentId}` },
                                { label: 'Contact Host', href: `tel:${contactNumber}` },
                        ]
                case 'Completed':
                        return [
                                { label: 'View Details', href: `/trip/${rentId}` },
                                { label: 'Rate Trip', href: `/trip/${rentId}/rate` },
                        ]
                case 'Cancelled':
                        return [
                                { label: 'View Details', href: `/trip/${rentId}` },
                        ]
                default:
                        return []
        }
}

export const getTripDuration = (pickUpDate: string, returnDate: string) => {
        const pickUp = new Date(pickUpDate)
        const returnD = new Date(returnDate)
        const days = Math.ceil((returnD.getTime() - pickUp.getTime()) / (1000 * 60 * 60 * 24))
        return days
}

export const statusBadgeClass: Record<TripStatus, string> = {
        Upcoming: 'bg-[#E3EEFF] text-[#3B82F6] border-transparent',
        Active: 'bg-[#DAFFF3] text-[#10B981] border-transparent',
        Completed: 'bg-[#E5E7EB] text-[#6B7280] border-transparent',
        Cancelled: 'bg-[#FFE9E9] text-[#EF4444] border-transparent',
}

export const cancelRental = (
        rentals: Rentals[],
        rentId: string
): Rentals[] => {
        return rentals.map(rental => {
                if (rental.rentId === rentId && rental.status === 'Upcoming') {
                        return { ...rental, status: 'Cancelled' }
                }
                return rental
        })
}