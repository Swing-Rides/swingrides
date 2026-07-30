import { PricingLineItem } from "@/lib/pricing"
import { Rentals } from "../pages/profilePages/types"

export type ModifyTripModalProps = {
        rentals?: Rentals[]
}

export type ModifyFormValues = {
        pickupDate: string
        returnDate: string
        pickupStreet: string
        pickupCity: string
}

export type ModifyBookingFormValues = {
        pickupDate: string;
        returnDate: string;
        pickupStreet: string;
        pickupCity: string;
        pickupState: string;
        pickupZipcode: string;
};

export type ModifyFormProps = {
        rental: NonNullable<ModifyTripModalProps['rentals']>[number]
        onClose: () => void
}

export type ExtraDaysSummary = {
  days: number;
  breakdown: PricingLineItem[];
  total: number;
  insuranceTotalFee: string;
  taxRate: number;
  taxAmount: string;
  totalAmount: string;
};