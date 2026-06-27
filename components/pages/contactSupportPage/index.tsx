import ContactForm from '@/components/forms/contactForm'
import { trustContent, contactLink } from '@/constants/contact'
import Image from 'next/image'
import Link from 'next/link'


export default function ConatactSupportPageComponent() {
        return (
                <div className='flex flex-col overflow-x-hidden'>
                        <HeroSection/>
                        <TrustSectioin />
                        <NeedHelpSectioin />
                        <FormSection />
                </div>
        )
}

const HeroSection = () => {
        return (
                <section className='flex flex-col md:flex-row md:justify-between md:items-center gap-5 py-12 px-4 md:px-8 lg:px-20 md:py-24 section-bg-gradient'>
                        <div className='flex flex-col gap-4'>
                                <div className='flex items-center justify-start gap-2'>
                                        <div className='bg-blue-700 aspect-square size-2 rounded-full' />
                                        <span className='text-blue-700 text-xs font-bold font-text uppercase leading-4'>
                                                SAFETY & SUPPORT
                                        </span>
                                </div>
                                <div className='space-y-4'>
                                        <h1 className='flex flex-col text-4xl md:text-6xl font-sans leading-16 tracking-wide font-black'>
                                                <span className='font-sans'>
                                                        Your{' '}<span className='text-blue-700 font-sans'>safety.</span> 
                                                </span>
                                                <span className='font-sans'>
                                                        Our{' '}<span className='text-blue-700 font-sans'>priority.</span>
                                                </span>
                                        </h1>
                                        <p className='text-gray-500 text-lg font-normal font-text leading-6'>
                                                We&apos;ve got you covered before, during, and after your trip.
                                        </p>
                                </div>
                                <div className='mt-2'>
                                        <Link 
                                                href={'#contactForm'}
                                                className='flex w-fit bg-blue-700 rounded-xs text-white py-2 px-6 hover:bg-blue-900 transition-colors duration-300'
                                        >
                                                Contact Support
                                        </Link>
                                </div>
                        </div>
                        <div>
                                <Image 
                                        src={'/images/your-safety.png'}
                                        alt={`We've got you covered before, during, and after your trip.`}
                                        width={998}
                                        height={640}
                                        className='aspect-499/320 w-full object-cover'
                                />
                        </div>
                </section>
        )
}

const TrustSectioin = () => {
        return (
                <section className='py-12 px-4 md:px-8 lg:px-20 md:py-20 section-bg-gradient'>
                        <div className='flex flex-wrap justify-center gap-6'>
                                {trustContent.map((item) => (
                                        <div key={item.title} className='flex flex-col gap-2 basis-77.5 grow-0 shrink p-6 bg-white rounded-[10px] border border-gray-200'>
                                                <div className="size-14 bg-blue-50 rounded-full flex justify-center items-center mx-auto">
                                                        {item.icon}
                                                </div>
                                                <h4 className="text-center justify-center text-neutral-950 text-lg font-bold font-text leading-7">
                                                        {item.title}
                                                </h4>
                                                <div className="flex flex-col justify-start items-center">
                                                        <div className="text-center justify-center text-gray-500 text-sm font-normal font-text leading-6">
                                                                {item.description}
                                                        </div>
                                                </div>
                                        </div>
                                ))}
                        </div>
                </section>
        )
}

const NeedHelpSectioin = () => {
        return (
                <section className='py-12 px-4 md:px-8 lg:px-20 md:py-20 section-bg-gradient'>
                        <div className='flex flex-col-reverse lg:flex-row md:justify-center gap-0 rounded-[10px] overflow-clip'>
                                <div className='p-3 md:p-12 bg-white space-y-4 lg:basis-160.25 lg:grow-0 lg:shrink'>
                                        <h3 className="text-neutral-950 text-3xl font-bold font-text leading-9">
                                                Need help?
                                        </h3>
                                        <p className="text-gray-500 text-base font-normal font-text leading-6">
                                                Reach out to our support team directly. We`&apos;re here to help with
                                                booking issues, vehicle concerns, and anything else you need.
                                        </p>
                                        <div className='space-y-3 mt-2 mb-3 mb:mt-6 mb:mb-8'>
                                                {contactLink.map((item) => (
                                                        <div 
                                                                className='flex gap-3 items-center justify-start'
                                                                key={item.label}
                                                        >
                                                                {item.icon}
                                                                <Link href={item.href} className='text-blue-700 hover:decoration-2 hover:text-blue-900 transition-colors duration'>
                                                                        {item.label}
                                                                </Link>
                                                        </div>
                                                ))}
                                        </div>
                                        <div className='mt-8'>
                                                <Link
                                                        href={'#contactForm'}
                                                        className='flex w-fit bg-blue-700 rounded-xs text-white py-2 px-6 hover:bg-blue-900 transition-colors duration-300'
                                                >
                                                        Contact Support
                                                </Link>
                                        </div>
                                </div>
                                <div className='lg:basis-160.25 lg:grow-0 lg:shrink'>
                                        <Image 
                                                src={'/images/friendly-support-agent-ready-to-help.png'}
                                                alt='Need help?'
                                                width={1282}
                                                height={720}
                                                className='aspect-1282/720 w-full object-cover'
                                        />
                                </div>
                        </div>
                </section>
        )
}

const FormSection = () => {
        return (
                <section className='py-12 px-4 md:px-8 lg:px-20 md:py-20 section-bg-gradient' id='contactForm'>
                        <div className='grid gap-4.5 md:gap-10'>
                                <div className='space-y-3'>
                                        <h2 className='text-center justify-center text-neutral-950 text-3xl font-bold font-text leading-9'>
                                                Send us a message
                                        </h2>
                                        <p className="text-center justify-center text-gray-500 text-base font-normal font-text leading-6">
                                                Fill out the form below and we&apos;ll get back to you as soon as possible.
                                        </p>
                                </div>
                                <div className='p-8 bg-white rounded-[10px] mx-auto max-w-160 w-full border border-gray-200'>
                                        <ContactForm />
                                </div>
                        </div>
                </section>
        )
}