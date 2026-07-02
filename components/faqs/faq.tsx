"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState, useMemo } from "react"
import { type Faq as FaqType } from "@/lib/sanity/queries/faq"
import { type FaqCategory } from "@/lib/sanity/queries/faqCategory"

const ALL_QUESTIONS = "allQuestions"

type FaqProps = {
        faqs: FaqType[]
        categories: FaqCategory[]
}

export default function Faq({ faqs, categories }: FaqProps) {

        const [tab, setTab] = useState("allQuestions")

        const tabs = useMemo(
                () => [{ id: ALL_QUESTIONS, title: "All Questions", slug: ALL_QUESTIONS }, ...categories],
                [categories]
        )

        const filteredFaqs = useMemo(() => {
                if (tab === ALL_QUESTIONS) return faqs.slice(0, 10)
                return faqs.filter((faq) => faq.categorySlug === tab)
        }, [faqs, tab])

        return (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 w-full'>
                        <div className='col-span-1 rounded-2xl border border-gray-200 bg-white py-3 md:py-6 px-2.5 md:px-5 flex flex-col gap-2 md:gap-4.5 divide-y'>
                                {tabs.map((item) => (
                                        <button
                                                key={item.id}
                                                className={`text-left px-6 py-4 rounded-xs text-sm md:text-xl font-semibold font-text leading-6 cursor-pointer ${tab === item.slug ? "bg-indigo-50 text-blue-700" : "bg-white text-gray-500"} hover:bg-gray-100 hover:text-blue-700 transition-colors duration-300`}
                                                onClick={() => setTab(item.slug)}
                                        >
                                                {item.title}
                                        </button>
                                ))}
                        </div>
                        <div className='col-span-1 md:col-span-2 px-3 md:px-8 py-2.5 md:py-6 bg-white rounded-2xl border border-gray-200 flex flex-col'>
                                {filteredFaqs.length > 0 ? (
                                        <>
                                                <Accordion
                                                        type="single"
                                                        collapsible
                                                        defaultValue={filteredFaqs[0].id}
                                                >
                                                        {filteredFaqs.map((item) => (
                                                                <AccordionItem
                                                                        key={item.id}
                                                                        value={item.id}
                                                                        className="border-b px-1.5 md:px-4 last:border-b-0"
                                                                >
                                                                        <AccordionTrigger
                                                                                className="text-gray-800 text-base font-medium font-text leading-6 cursor-pointer"
                                                                        >
                                                                                {item.question}
                                                                        </AccordionTrigger>
                                                                        <AccordionContent
                                                                                className="text-gray-500 text-base font-normal font-text leading-6"
                                                                        >
                                                                                {item.answer}
                                                                        </AccordionContent>
                                                                </AccordionItem>
                                                        ))}
                                                </Accordion>
                                                {tab === ALL_QUESTIONS && faqs.length > 10 && (
                                                        <p className="text-xs text-gray-400 px-4 pt-2">
                                                                Showing 10 of {faqs.length} questions — select a category to see more.
                                                        </p>
                                                )}
                                        </>
                                ) : (
                                        <p className="text-gray-500 text-sm px-4 py-6">No questions in this category yet.</p>
                                )}
                        </div>
                </div>
        )
}