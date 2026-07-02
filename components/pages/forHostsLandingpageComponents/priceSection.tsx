"use client"

import { Fragment, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pill } from "."
import Link from "next/link"
import { Switch } from '@/components/ui/switch'
import { PriceCardProps } from "./types"
import { Check } from "lucide-react"
import { HOST_REGISTRATION_PATH } from "@/constants/constant"

const PERCENT_DISCOUNT = 17

export default function PriceSection(
        {
                pricingContents
        }: {
                pricingContents: PriceCardProps[]
        }) {

        const [isYearly, setIsYearly] = useState(false)

        return (
                <section className='section-bg-gradient'>
                        <div className='px-4 py-12.5 md:px-20 md:py-20 space-y-10.5'>
                                <div className='flex flex-col gap-5 items-center max-w-120 mx-auto'>
                                        <Pill
                                                label='Pricing'
                                        />
                                        <h3 className='text-6xl font-bold leading-16.25 mt-5 mb-4'>
                                                SIMPLE,{" "}<span className='text-[#1A56DB] font-sans'>FLAT</span> PRICING
                                        </h3>
                                        <span className="text-center text-[#333333] text-lg font-medium font-text">
                                                Pay a fixed monthly subscription. No commissions, no hidden fees, no per-booking charges — ever.
                                        </span>

                                        <div className="flex items-center justify-center-safe gap-4">
                                                <span className="text-[#0B0B0B] text-sm font-semibold font-text leading-5">
                                                        Monthly
                                                </span>
                                                <Switch
                                                        checked={isYearly}
                                                        onCheckedChange={setIsYearly}
                                                        aria-label="Toggle yearly billing"
                                                        className="cursor-pointer"
                                                />
                                                <span className="text-[#6B7280] text-sm font-semibold font-text leading-5">
                                                        Yearly{" "}<span className="text-[#10B981]"> {`(Save ${PERCENT_DISCOUNT}%)`}</span>
                                                </span>
                                        </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-8 md:gap-4 max-w-300 mx-auto'>
                                        {pricingContents.map((item) => (
                                                <Fragment key={item.cardTitle}>
                                                        <PriceCard
                                                                {...item}
                                                                isYearly={isYearly}
                                                        />
                                                </Fragment>
                                        ))}
                                </div>
                        </div>
                </section>
        )
}

interface PriceCardDisplayProps extends PriceCardProps {
        isYearly: boolean
}


const PriceCard = ({
        badge,
        cardTitle,
        price,
        vechileQuantity,
        description,
        features,
        isYearly,
}: PriceCardDisplayProps) => {

        const mainButton = cardTitle === 'Flex'

        const buttonStyle = `py-3 px-5.25 w-full rounded-xs text-sm font-semibold font-text border border-[#1A56DB] cursor-pointer transition-color duration-300 
                                ${mainButton ? 'bg-[#1A56DB] text-white hover:bg-blue-900' :
                        'text-[#1A56DB] bg-[#EBF0FB] hover:text-[#EBF0FB] hover:bg-blue-900'}`

        const isCustom = price === 'Custom'

        const displayedPrice = (() => {
                if (isCustom || typeof price !== "number") return null
                if (!isYearly) return { amount: price, label: "/month" }
                const yearly = Math.round(price * 12 * (1 - PERCENT_DISCOUNT / 100))
                return { amount: yearly, label: "/year" }
        })()

        return (
                <div className="relative flex flex-col gap-10 p-8 bg-white rounded-xs">
                        {badge && (
                                <div className="absolute top-0 left-1/2 -translate-1/2 px-3.5 py-1.5 bg-blue-700 rounded-full w-fit">
                                        <span className="text-white text-sm font-semibold font-text">
                                                {badge}
                                        </span>
                                </div>
                        )}

                        <div>
                                <h4 className="text-black text-2xl font-medium font-text">
                                        {cardTitle}
                                </h4>
                        </div>

                        <div className="flex flex-col gap-2">
                                <div className="py-2.5 flex items-end gap-1 overflow-hidden">
                                        {isCustom ? (
                                                <span className="text-[#0B0B0B] text-6xl font-medium font-text leading-12">
                                                        Custom
                                                </span>
                                        ) : (
                                                <>
                                                        <span className="text-[#0B0B0B] text-6xl font-medium font-text leading-12">$</span>
                                                        <AnimatePresence mode="wait">
                                                                <motion.span
                                                                        key={isYearly ? "yearly" : "monthly"}   // ← key swap triggers animation
                                                                        className="text-[#0B0B0B] text-6xl font-medium font-text leading-12"
                                                                        initial={{ opacity: 0, y: 16 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: -16 }}
                                                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                                                >
                                                                        {displayedPrice?.amount}
                                                                </motion.span>
                                                        </AnimatePresence>
                                                        <AnimatePresence mode="wait">
                                                                <motion.span
                                                                        key={isYearly ? "yearly-label" : "monthly-label"}
                                                                        className="text-gray-500 text-lg font-normal font-text leading-7"
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        exit={{ opacity: 0 }}
                                                                        transition={{ duration: 0.15 }}
                                                                >
                                                                        {displayedPrice?.label}
                                                                </motion.span>
                                                        </AnimatePresence>
                                                </>
                                        )}
                                </div>
                                <span className="text-[#0B0B0B] text-lg font-normal font-text">
                                        {vechileQuantity}
                                </span>
                                <p className="text-[#0B0B0B] text-lg font-normal font-text">
                                        {description}
                                </p>
                        </div>

                        <div className="flex flex-col gap-6">
                                {features.map((item, index) => (
                                        <div
                                                key={index}
                                                className="flex items-center gap-3"
                                        >
                                                <div className="size-6 aspect-square flex items-center justify-center rounded-full bg-blue-700">
                                                        <Check className="size-4 text-white" />
                                                </div>                                                
                                                <div>
                                                        <span className="text-gray-700 text-base font-medium font-text">
                                                                {item}
                                                        </span>
                                                </div>
                                        </div>
                                ))}
                        </div>
                        <div>
                                {isCustom ? (<Link href={'/contact-support#contactForm'}>
                                        <button className={buttonStyle}>
                                                Contact Sales
                                        </button>
                                </Link>) : (<Link href={HOST_REGISTRATION_PATH} target="_blank">
                                        <button className={buttonStyle}>
                                                Get Started
                                        </button>
                                </Link>)}
                        </div>
                </div>
        )
}