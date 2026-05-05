export type PageIntroProps = {
        imageSrc: string;
        pageTitle: string;
        description: string;
}

export const pageIntro: PageIntroProps  = {
        imageSrc: '/images/connect-to-host-icon.svg',
        pageTitle: 'Connect to host',
        description: `Link your phone number to your host's fleet. Their vehicles will be highlighted when you browse — making it faster to find and book your regular car.`,
}

export const whatHappens = [
        {
                id: 1,
                label: `Your host's vehicles appear first in your search results`,
        },
        {
                id: 2,
                label: `Get notified when new cars are added to their fleet`,
        },
        {
                id: 3,
                label: `Faster booking — your details are pre-filled for their vehicles`,
        },
]

export const benefitOfConnecting = [
        {
                id: 1,
                label: `This host vehicles appear first in your search results`
        },
        {
                id: 2,
                label: `You'll be notified when new cars are added to their fleet`
        },
        {
                id: 3,
                label: `Your details are pre-filled for faster booking`
        },
]