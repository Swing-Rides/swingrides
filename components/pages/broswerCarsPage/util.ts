import { CarDataType } from '@/constants/carsTestData'

export function getStarPercentage(starRated: number, totalRatings: number): number {
        if (totalRatings === 0) return 0
        return Math.round((starRated / totalRatings) * 1000) / 10
}

export type RentalType = 'any' | 'per day' | 'per hour' | 'per week'
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'rating-asc' | 'name-asc'

export type CarsFilterParams = {
        search: string
        rentalType: RentalType
        availableOnly: boolean
        priceMin: number
        priceMax: number
        vehicleTypes: string[]
        seats: string[]
        transmissions: string[]
        sort: SortOption
}

export const getPriceForRentalType = (
        car: CarDataType,
        rentalType: RentalType
): number => {
        switch (rentalType) {
                case 'per hour': return car.price.hourly
                case 'per week': return car.price.weekly
                case 'per day':
                default: return car.price.daily
        }
}

/** Derives the min/max price boundaries from the dataset for a given rental type */
export const getPriceRange = (
        cars: CarDataType[],
        rentalType: RentalType
): { min: number; max: number } => {
        if (cars.length === 0) return { min: 0, max: 500 }
        const prices = cars.map(car => getPriceForRentalType(car, rentalType))
        return {
                min: Math.floor(Math.min(...prices)),
                max: Math.ceil(Math.max(...prices)),
        }
}

// ─── Filter option derivers (built from the data itself) ──────────────────────
export const getUniqueVehicleTypes = (cars: CarDataType[]) => {
        const seen = new Set<string>()
        return cars
                .map(car => car.specifications.bodyType)
                .filter(type => {
                        if (seen.has(type)) return false
                        seen.add(type)
                        return true
                })
                .map((type, i) => (
                        { 
                                id: `vt-${i}`, 
                                title: type 
                        }
                ))
}

export const getUniqueSeats = (cars: CarDataType[]) => {
        const seen = new Set<number>()
        return cars
                .map(car => car.specifications.seats)
                .filter(s => {
                        if (seen.has(s)) return false
                        seen.add(s)
                        return true
                })
                .sort((a, b) => a - b)
                .map((seat, i) => (
                        { 
                                id: `st-${i}`, 
                                title: `${seat} Seats` 
                        }
                ))
}

export const getUniqueTransmissions = (cars: CarDataType[]) => {
        const seen = new Set<string>()
        return cars
                .map(car => car.specifications.transmission)
                .filter(t => {
                        if (seen.has(t)) return false
                        seen.add(t)
                        return true
                })
                .map((t, i) => (
                        { 
                                id: `tr-${i}`, 
                                title: t 
                        }
                ))
}

// ─── Main filter + sort function ──────────────────────────────────────────────
export const filterAndSortCars = (
        cars: CarDataType[],
        params: CarsFilterParams
): CarDataType[] => {
        const {
                search,
                rentalType,
                availableOnly,
                priceMin,
                priceMax,
                vehicleTypes,
                seats,
                transmissions,
                sort,
        } = params

        const query = search.toLowerCase().trim()

        const filtered = cars.filter(car => {
                // Search — matches car name, make, model, or body type
                if (query) {
                        const haystack = [
                                car.carName,
                                car.specifications.make,
                                car.specifications.model,
                                car.specifications.bodyType,
                        ].join(' ').toLowerCase()
                        if (!haystack.includes(query)) return false
                }

                // Available now only
                if (availableOnly && car.status !== 'Available') return false

                // Price range — compare against the active rental type price
                const price = getPriceForRentalType(car, rentalType)
                if (price < priceMin || price > priceMax) return false

                // Vehicle type
                if (vehicleTypes.length > 0 && !vehicleTypes.includes(car.specifications.bodyType)) return false

                // Seats — stored as numbers in data, filter values are "N Seats" strings
                if (seats.length > 0) {
                        const seatLabel = `${car.specifications.seats} Seats`
                        if (!seats.includes(seatLabel)) return false
                }

                // Transmission — partial match to handle "(8-speed PDK)" variants
                if (transmissions.length > 0) {
                        const matched = transmissions.some(t =>
                                car.specifications.transmission.toLowerCase().includes(t.toLowerCase())
                        )
                        if (!matched) return false
                }

                return true
        })

        // Sort
        return [...filtered].sort((a, b) => {
                switch (sort) {
                        case 'price-asc':
                                return getPriceForRentalType(a, rentalType) - getPriceForRentalType(b, rentalType)
                        case 'price-desc':
                                return getPriceForRentalType(b, rentalType) - getPriceForRentalType(a, rentalType)
                        case 'rating-desc':
                                return b.reviewsAndRatings.averageRating - a.reviewsAndRatings.averageRating
                        case 'rating-asc':
                                return a.reviewsAndRatings.averageRating - b.reviewsAndRatings.averageRating
                        case 'name-asc':
                                return a.carName.localeCompare(b.carName)
                        default:
                                return 0
                }
        })
}