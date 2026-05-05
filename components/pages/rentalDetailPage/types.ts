import { ReactNode } from "react";
import { Rentals } from "../profilePages/types"

export type ManageBookingCardProps = {
        rentals?: Rentals
}

export type ManageBookingButtonConfig = {
        icon: ReactNode;
        label: string;
        href: string;
        className: string;
}