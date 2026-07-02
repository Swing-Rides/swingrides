import { fetchAllFAQs } from "@/lib/sanity/queries/faq";
import { fetchAllFaqCategories } from "@/lib/sanity/queries/faqCategory";
import Faq from './faq'

export default async function FAQsSection() {

        const [faqs, categories] = await Promise.all([
                fetchAllFAQs(),
                fetchAllFaqCategories(),
        ]);

        return (
                <section className='py-12 px-4 md:px-20 md:py-24 section-bg-gradient' >
                        <div className='flex flex-col gap-6 md:gap-8'>
                                <div className='flex flex-col gap-4 max-w-137 w-full'>
                                        <div className='w-fit flex justify-start items-center gap-2.5 py-1 px-3 border border-blue-700 rounded-full'>
                                                <div className='size-1.5 aspect-square bg-blue-700 rounded-full' />
                                                <span className="text-blue-700 text-xs font-semibold font-text uppercase leading-4 bg-blue-100">
                                                        FAQ
                                                </span>
                                        </div>
                                        <div className='space-y-2.5'>
                                                <h3 className='text-4xl md:text-6xl font-black'>
                                                        <span className='text-neutral-950 font-sans'>
                                                                FREQUENTLY ASKED 
                                                        </span>
                                                        {' '}
                                                        <span className='text-blue-700 font-sans'>
                                                                QUESTIONS
                                                        </span>
                                                </h3>
                                                <p>
                                                        Find answers to common questions about renting on SwingRides 
                                                </p>
                                        </div>
                                </div>
                                <div className='flex flex-wrap justify-center gap-6'>
                                        <Faq faqs={faqs} categories={categories} />
                                </div>
                        </div>
                </section>
        )
}
