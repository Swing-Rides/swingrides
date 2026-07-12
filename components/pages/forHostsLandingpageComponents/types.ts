import { ReactNode } from "react";

export type TabContentProps = {
        image: {
                src: string;
                alt: string;
        };
        content: {
                icon: ReactNode;
                label: string;
        }[]
}

export type PriceCardProps = {
                badge?: string;
                cardTitle: string;
                planTier: string;
                price: number | string;
                vechileQuantity: string;
                description: string;
                features: string[];
        }