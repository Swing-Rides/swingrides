import { PageIntro } from '@/components/pages/connectToHostPage'
import Link from 'next/link'

type CancelTripMessageProps = {
        imageSrc?: string
        title: string
        description: string
        tripId?: string
}

export default function CancelTripErrorState({
        imageSrc = "/images/circle-x.svg",
        title,
        description,
        tripId,
}: CancelTripMessageProps) {
        return (
                <div className="w-full mx-auto py-12.5 px-4 overflow-clip section-bg-gradient space-y-10">
                        <PageIntro
                                imageSrc={imageSrc}
                                pageTitle={title}
                                description={description}
                        />
                        <div className="flex flex-col gap-4">
                                <Link
                                        href={tripId ? `/trip/${tripId}` : '/profile'}
                                        className="text-center justify-start text-neutral-950 hover:text-blue-700 duration-300 transition-colors text-sm font-semibold font-text leading-5"
                                >
                                        {tripId ? 'Resume Trip' : 'Back to Profile'}
                                </Link>
                        </div>
                </div>
        )
}