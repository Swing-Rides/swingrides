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

export type ModifyFormProps = {
        rental: NonNullable<ModifyTripModalProps['rentals']>[number]
        onClose: () => void
}