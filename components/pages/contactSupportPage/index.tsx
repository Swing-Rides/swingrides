import ContactForm from '@/components/forms/contactForm'
import { contactSupportPageContent } from '@/constants/contact'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

type ContactListProps = {
        content: {
                id: number
                imageUrl: string
                title: string
                label: string
                link: string
        }
}

export default function ConatactSupportPageComponent() {
        return (
                <div className='flex flex-col md:flex-row overflow-x-hidden'>
                        <div className='md:basis-[50vw]'>
                                <Content />
                        </div>
                        <div className='md:basis-[50vw]'>
                                <Image 
                                        src={'/images/porsche-911.png'}
                                        alt='Contact support page'
                                        title='Contact support page'
                                        width={729}
                                        height={1151}
                                        className='w-full'
                                />
                        </div>
                </div>
        )
}

const Content = () => {
        return (
                <section className='p-4 md:p-20 h-full'>
                        <div className='flex flex-col justify-between h-full'>
                                <div className='grid gap-4.5'>
                                        <h2 className='text-[#1F2937] text-4xl md:text-7xl font-black'>
                                                Get in touch
                                        </h2>
                                        <p className='text-[#6B7280] text-base font-normal leading-6'>
                                                We&apos;re here to help. Our support team is available 24/7 to answer your questions and assist with any issues.
                                        </p>
                                        <div className='grid gap-3'>
                                                {contactSupportPageContent.map((item) => (
                                                        <Fragment key={item.id}>
                                                                <ContactList content={item}/>
                                                        </Fragment>
                                                ))}
                                        </div>
                                        <div className='w-full'>
                                                <ContactForm />
                                        </div>
                                </div>
                                <div className='grid place-content-center'>
                                        <span className='text-center text-[#6B7280] text-xs font-normal leading-4'>
                                                © 2026 SwingRides. All rights reserved.
                                        </span>
                                </div>
                        </div>
                </section>
        )
}

const ContactList = ({ content }: ContactListProps) => {
        return (
                <Link
                        href={content.link}
                        className='flex justify-start items-center gap-3 cursor-pointer'
                        target='_blank'
                >
                        <div className='size-10 p-2.5 aspect-square bg-[#EBF0FB] rounded-[10px]'>
                                <Image 
                                        src={content.imageUrl}
                                        alt={content.title}
                                        title={content.title}
                                        width={20}
                                        height={20}
                                />
                        </div>
                        <div>
                                <h3 className='text-sm font-semibold font-text leading-5'>
                                        {content.title}
                                </h3>
                                <span className='text-sm font-normal leading-5 text-[#1A56DB]'>
                                        {content.label}
                                </span>

                        </div>
                </Link>
        )
}