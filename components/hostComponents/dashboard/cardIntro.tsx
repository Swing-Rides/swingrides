
type CardIntroProps = {
        title: string;
        desc: string;
}

export const CardIntro = ({ title, desc }: CardIntroProps) => {
        return (
                <div className='flex flex-col gap-1'>
                        <h3 className="text-neutral-950 text-lg font-semibold font-text leading-6">
                                {title}
                        </h3>
                        <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                {desc}
                        </span>
                </div>
        )
}