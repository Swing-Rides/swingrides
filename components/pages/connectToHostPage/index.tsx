import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FieldSeparator } from '@/components/ui/field'
import { whatHappens } from '@/constants/connectToHost'

export type ListProps = {
        content: {
                id: number | string
                label: string
        }
}

export default function ConnectToHostPageComponent() {
        return (
                <div className='w-full mx-auto py-12.5 px-4 overflow-clip bg-[#F4F6F9]'>
                        <div className='max-w-146 mx-auto'>
                                <div>
                                        <Image
                                                src={'/images/connect-to-host-icon.svg'}
                                                alt='Connect to host'
                                                title='Connect to host'
                                                width={196}
                                                height={156}
                                                loading="eager"
                                                className='max-w-48 size-full mx-auto'
                                        />
                                </div>
                                <div>
                                        <h2 className="text-center text-neutral-950 text-4xl font-normal leading-10">
                                                Connect to Your Host
                                        </h2>
                                        <p className="text-center text-zinc-800 text-base font-medium font-text leading-6 mt-2">
                                                {`Link your phone number to your host's fleet. Their vehicles will be highlighted when you browse — making it faster to find and book your regular car.`}
                                        </p>
                                </div>
                        </div>
                        <div className='max-w-146 mx-auto w-full p-4 md:p-8 overflow-clip bg-white rounded-[10px] outline outline-offset-[-0.89px] outline-gray-200 mt-8 mb-6'>
                                <div className='grid gap-5'>
                                        <div className='text-center md:text-left'>
                                                <h3 className='text-neutral-950 text-base font-semibold font-text leading-6'>
                                                        Enter Your Phone Number
                                                </h3>
                                                <p className='text-gray-500 text-sm font-normal leading-5'>
                                                        Use the same phone number you use for bookings.
                                                </p>
                                        </div>
                                        <FieldSeparator/>
                                        <div>
                                                FORM COMES HERE
                                                <Link
                                                        href={'/connect-host/confirmed'}
                                                >
                                                        Connect to Host →
                                                </Link>
                                        </div>
                                        <FieldSeparator />
                                        <div className='grid gap-4'>
                                                <h3 className='text-gray-500 text-sm font-semibold font-text uppercase leading-5'>
                                                        What happens when you connect?
                                                </h3>
                                                <div className='grid gap-3'>
                                                        {whatHappens.map((item) => (
                                                                <Fragment key={item.id}>
                                                                        <List content={item}/>
                                                                </Fragment>
                                                        ))}
                                                </div>
                                                <span className='max-w-117.5 w-full mx-auto text-center text-gray-500 text-xs font-normal leading-4'>
                                                        🔒 Your phone number is only shared with your connected host. You can disconnect anytime.
                                                </span>
                                        </div>
                                </div>
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                                <p className='text-center text-zinc-800 text-base font-normal leading-5'>
                                        {`Don't have a specific host?`}
                                </p>
                                <Link 
                                        href={'/browse-cars'} 
                                        className='text-blue-700 text-base font-medium leading-5'
                                >
                                        Browse all available cars →
                                </Link>
                        </div>
                </div>
        )
}

const List = ({ content }: ListProps) => {
        return (
                <div className='flex gap-3 items-center'>
                        <div className='grid place-content-center size-6 aspect-square p-1 overflow-hidden rounded-full bg-blue-700'>
                                <span className='text-white text-xs font-semibold leading-4'>
                                        {content.id}
                                </span>
                        </div>
                        <div>
                                <p className='text-neutral-900 text-sm text-wrap font-normal leading-5'>
                                        {content.label}
                                </p>
                        </div>
                </div>
        )
}