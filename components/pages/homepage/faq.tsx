"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

const faqCategory = [
        {
                label: "All Questions",
                value: "allQuestions",
        },
        {
                label: "Booking & Payment",
                value: "bookingPayment",
        },
        {
                label: "Pickup & Return",
                value: "pickupReturn",
        },
        {
                label: "Hosts & Vehicles",
                value: "hostsVehicles",
        },
        {
                label: "Safety & Security",
                value: "safetySecurity",
        },
        {
                label: "Policies",
                value: "policies",
        },
]

const content = [
        {
                value: "how-do-i-book-a-car-on-swingrides?",
                trigger: "How do I book a car on SwingRides?",
                content:
                        "Booking a car is simple: Browse available cars in your area, select your pickup and return dates, review the details and pricing, and confirm your booking. You'll receive instant confirmation via email with all the details you need for pickup.",
        },
        {
                value: "Do I need an account to browse cars?",
                trigger: "Do I need an account to browse cars?",
                content:
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London.",
        },
        {
                value: "what-documents-do-i-need-to-rent-a-car?",
                trigger: "What documents do I need to rent a car?",
                content:
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London.",
        },
        {
                value: "How does payment work?",
                trigger: "How does payment work?",
                content:
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London.",
        },
        {
                value: "What documents do I need to rent a car?",
                trigger: "What documents do I need to rent a car?",
                content:
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London.",
        },
        {
                value: "What happens if the car is damaged during my trip?",
                trigger: "What happens if the car is damaged during my trip?",
                content:
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London.",
        },
        {
                value: "How do I connect to a specific host?",
                trigger: "How do I connect to a specific host?",
                content:
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London.",
        },
        {
                value: "What is the difference between a host and SwingRides?",
                trigger: "What is the difference between a host and SwingRides?",
                content:
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London.",
        },
]

export default function Faq() {

        const [ tab, setTab ] = useState("allQuestions")

        return (
                <div className='grid grid-cols-3 gap-5 w-full'>
                        <div className='col-span-1 rounded-2xl border border-gray-200 bg-white py-6 px-5 flex flex-col gap-4.5 divide-y'>
                                {faqCategory.map((item) => (
                                        <button
                                                key={item.value}
                                                className={`text-left px-6 py-4 rounded-xs text-xl font-semibold font-text leading-6 cursor-pointer ${tab === item.value ? "bg-indigo-50 text-blue-700" : "bg-white text-gray-500"} hover:bg-gray-100 hover:text-blue-700 transition-colors duration-300`}
                                                onClick={() => setTab(item.value)}
                                        >
                                                {item.label}
                                        </button>
                                ))}
                        </div>
                        <div className='col-span-2 px-8 py-6 bg-white rounded-2xl border border-gray-200 flex flex-col'>
                                {tab && <Accordion
                                        type="single"
                                        collapsible
                                        className=""
                                        defaultValue={content[0].value}
                                >
                                        {content.map((item) => (
                                                <AccordionItem
                                                        key={item.value}
                                                        value={item.value}
                                                        className="border-b px-4 last:border-b-0"
                                                >
                                                        <AccordionTrigger
                                                                className="text-gray-800 text-base font-medium font-text leading-6 cursor-pointer"
                                                        >
                                                                {item.trigger}
                                                        </AccordionTrigger>
                                                        <AccordionContent
                                                                className="text-gray-500 text-base font-normal font-text leading-6"
                                                        >
                                                                {item.content}
                                                        </AccordionContent>
                                                </AccordionItem>
                                        ))}
                                </Accordion>}
                        </div>
                </div>
        )
}
