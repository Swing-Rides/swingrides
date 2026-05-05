import { ReadonlyURLSearchParams } from 'next/navigation'
import { CarsFilterParams, RentalType, SortOption } from './util'

export const DEFAULT_PRICE_MIN = 0
export const DEFAULT_PRICE_MAX = 99999

export const parseFilterParams = (
        searchParams: ReadonlyURLSearchParams
): CarsFilterParams => {
        return {
                search: searchParams.get('search') ?? '',
                rentalType: (searchParams.get('rentalType') as RentalType) ?? 'any',
                availableOnly: searchParams.get('availableOnly') === 'true',
                priceMin: Number(searchParams.get('priceMin') ?? DEFAULT_PRICE_MIN),
                priceMax: Number(searchParams.get('priceMax') ?? DEFAULT_PRICE_MAX),
                vehicleTypes: searchParams.get('vehicleTypes')?.split(',').filter(Boolean) ?? [],
                seats: searchParams.get('seats')?.split(',').filter(Boolean) ?? [],
                transmissions: searchParams.get('transmissions')?.split(',').filter(Boolean) ?? [],
                sort: (searchParams.get('sort') as SortOption) ?? 'default',
        }
}

export const buildFilterParams = (
        current: URLSearchParams,
        updates: Partial<Record<keyof CarsFilterParams, string | boolean | number | string[]>>
): URLSearchParams => {
        const params = new URLSearchParams(current.toString())

        Object.entries(updates).forEach(([key, value]) => {
                if (value === '' || value === false || value === null || value === undefined) {
                        params.delete(key)
                } else if (Array.isArray(value)) {
                        if (value.length === 0) {
                                params.delete(key)
                        } else {
                                params.set(key, value.join(','))
                        }
                } else {
                        params.set(key, String(value))
                }
        })

        // Always reset to page 1 when filters change
        params.set('page', '1')
        return params
}

export const toggleArrayParam = (
        current: string[],
        value: string
): string[] => {
        return current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value]
}