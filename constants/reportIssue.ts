import { PageIntroProps } from "./connectToHost"

export type WhatHappenNextListProps = {
        number: number;
        label: string;
        desc: string;
}

export const pageIntro: PageIntroProps = {
        imageSrc: '/images/connect-to-host-icon.svg',
        pageTitle: 'Report an Issue',
        description: `Experiencing a problem with your booking or vehicle? Let us know and our support team will get back to you within 24 hours.`,
}

export const happenNextList: WhatHappenNextListProps[] = [
        {
                number: 1,
                label: 'Report Received',
                desc: 'Your report is logged and assigned to a support agent immediately.',
        },
        {
                number: 2,
                label: 'Investigation',
                desc: 'Our team reviews your report and contacts both parties if needed.',
        },
        {
                number: 3,
                label: 'Resolution',
                desc: `We'll update you within 24 hours with our findings and next steps.`,
        },
]