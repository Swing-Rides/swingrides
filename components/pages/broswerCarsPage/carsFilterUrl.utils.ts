import { ReadonlyURLSearchParams } from 'next/navigation';
import { CarsFilterParams, RentalType, SortOption } from './util';
import { findUSState } from '@/constants/addressState';

export const DEFAULT_PRICE_MIN = 0;
export const DEFAULT_PRICE_MAX = 99999;

export const parseFilterParams = (
  searchParams: ReadonlyURLSearchParams
): CarsFilterParams => {
  const stateQuery = searchParams.get('state');
  const locationsQuery = searchParams.get('locations');
  const pickupQuery = searchParams.get('pickup');

  // Collect and normalize any location/state filters from ?state=, ?locations=, or ?pickup=
  const extractedLocations: string[] = [];

  if (stateQuery) {
    stateQuery.split(',').forEach((s) => {
      const trimmed = s.trim();
      if (!trimmed) return;
      const matched = findUSState(trimmed);
      extractedLocations.push(matched ? matched.value : trimmed.toUpperCase());
    });
  }

  if (locationsQuery) {
    locationsQuery.split(',').forEach((l) => {
      const trimmed = l.trim();
      if (!trimmed) return;
      const matched = findUSState(trimmed);
      extractedLocations.push(matched ? matched.value : trimmed.toUpperCase());
    });
  }

  if (pickupQuery && extractedLocations.length === 0) {
    const matched = findUSState(pickupQuery);
    if (matched) {
      extractedLocations.push(matched.value);
    }
  }

  return {
    search: searchParams.get('search') ?? '',
    rentalType: (searchParams.get('rentalType') as RentalType) ?? 'any',
    availableOnly: searchParams.get('availableOnly') === 'true',
    priceMin: Number(searchParams.get('priceMin') ?? DEFAULT_PRICE_MIN),
    priceMax: Number(searchParams.get('priceMax') ?? DEFAULT_PRICE_MAX),
    vehicleTypes: searchParams.get('vehicleTypes')?.split(',').filter(Boolean) ?? [],
    seats: searchParams.get('seats')?.split(',').filter(Boolean) ?? [],
    transmissions: searchParams.get('transmissions')?.split(',').filter(Boolean) ?? [],
    locations: Array.from(new Set(extractedLocations)),
    sort: (searchParams.get('sort') as SortOption) ?? 'default',
  };
};

export const buildFilterParams = (
  current: URLSearchParams,
  updates: Partial<Record<keyof CarsFilterParams, string | boolean | number | string[]>>
): URLSearchParams => {
  const params = new URLSearchParams(current.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === '' || value === false || value === null || value === undefined) {
      params.delete(key);
      if (key === 'locations') {
        params.delete('state');
      }
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        params.delete(key);
        if (key === 'locations') {
          params.delete('state');
        }
      } else {
        params.set(key, value.join(','));
        // If updating locations array, sync/replace state parameter
        if (key === 'locations') {
          params.delete('state');
        }
      }
    } else {
      params.set(key, String(value));
    }
  });

  // Always reset to page 1 when filters change
  params.set('page', '1');
  return params;
};

export const toggleArrayParam = (
  current: string[],
  value: string
): string[] => {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
};