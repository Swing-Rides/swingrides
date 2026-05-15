
type PageIntroProps = {
        pageTitle: string;
        pageDesc: string;
}

export default function PageIntro({ pageTitle, pageDesc }: PageIntroProps ) {
        return (
                <div className='flex flex-col gap-1.25'>
                        <h2 className="text-neutral-950 text-2xl font-semibold font-text">
                                {pageTitle}
                        </h2>  
                        <span className="text-gray-500 text-sm font-normal font-text">
                                {pageDesc}
                        </span>
                </div>
        )
}
