import { memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { 
        HostInfoType, 
        PricingTierType, 
} from "@/constants/carsTestData"
import { 
        Tabs, 
        TabsList, 
        TabsTrigger, 
        TabsContent 
} from "@/components/ui/tabs"
import ReviewTab from "./reviewTab"
import { getInitials } from "../profilePages/utils"
import { 
        CarPageComponentProp, 
        ImagesSectionProps, 
        CarDetailCardProps, 
        OverviewTabProps, 
        SpecificationsTabProps, 
        SpecificationsContentProps 
} from "./types"

export default function CarPageComponent({ content }: CarPageComponentProp) {
        return (
                <>
                        <NotificationBar 
                                carName={content.carName}
                        />
                        <section className="py-5 px-2.5 md:py-10 md:px-20">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                        <LeftContent
                                                carName={content.carName}
                                                featuredImage={content.featuredImage}
                                                gallery={content.gallery}
                                                reviewsAndRatings={content.reviewsAndRatings}
                                                status={content.status}
                                                specifications={content.specifications}
                                                overview={content.overview}
                                                hostName={content.host.hostName}
                                                memberSince={content.host.memberSince}
                                                tripsCompleted={content.host.tripsCompleted}
                                                contactNumber={content.host.contactNumber}
                                                rating={content.host.rating}
                                        />
                                        <RightContent
                                                price={content.price}
                                        />
                                </div>
                        </section>
                </>
        )
}

const NotificationBar = memo(({ carName }: { carName: string }) => {
        return (
                <div className='bg-[#EBF0FB] py-2.5 px-2.5 md:px-8'>
                        <div className='flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
                                <div className='flex flex-wrap items-center gap-2 md:text-nowrap'>
                                        <Link
                                                href='/browse-cars'
                                                className='text-sm font-normal font-text leading-5 text-[#6B7280]'
                                        >
                                                Browse Cars
                                        </Link>
                                        <GreaterThanIcon />
                                        <span className='text-[#1A56DB] text-sm font-semibold font-text leading-5'>
                                                {carName}
                                        </span>
                                </div>
                                <div className='flex justify-start items-center'>
                                        <button className='w-full md:w-fit font-text px-4 py-1.5 cursor-pointer border border-[#1A56DB] text-[#1A56DB] bg-transparent hover:bg-[#1A56DB] hover:text-white transition-colors duration-300 rounded-xs text-nowrap'>
                                                Share this vehicle
                                        </button>
                                </div>
                        </div>
                </div>
        )
})
NotificationBar.displayName = "NotificationBar"

const LeftContent = memo((
        { 
                carName, 
                gallery, 
                featuredImage, 
                reviewsAndRatings, 
                status, 
                specifications, 
                overview, 
                hostName, 
                memberSince, 
                tripsCompleted, 
                contactNumber, 
                rating 
        }
                : ImagesSectionProps & CarDetailCardProps & HostInfoType
) => {
        return (
                <div className="col-span-1 md:col-span-7 w-full">
                        <div className="flex flex-col gap-5">
                                <ImageCard 
                                        gallery={gallery} 
                                        featuredImage={featuredImage} 
                                />
                                <CarDetailCard
                                        carName={carName}
                                        status={status}
                                        reviewsAndRatings={reviewsAndRatings}
                                        specifications={specifications}
                                        overview={overview}
                                />
                                <HostCard
                                        hostName={hostName}
                                        memberSince={memberSince}
                                        tripsCompleted={tripsCompleted}
                                        contactNumber={contactNumber}
                                        rating={rating}
                                />
                        </div>
                </div>
        )
})
LeftContent.displayName = "LeftContent"

const RightContent = memo(({ price }: PaymentSectionProps) => {
        return (
                <div className="col-span-1 md:col-span-5 w-full">
                        <PaymentSection
                                price={price}
                        />
                </div>
        )
})
RightContent.displayName = "RightContent"

const ImageCard = memo(({ gallery, featuredImage }: ImagesSectionProps) => {
        return (
                <div className="flex flex-col gap-4">
                        <div className="rounded-[10px] overflow-hidden">
                                <Image
                                        src={featuredImage.src}
                                        alt={featuredImage.alt}
                                        title={featuredImage.alt}
                                        width={1720}
                                        height={920}
                                        className="size-full aspect-13/9 object-cover max-w-250"
                                />
                        </div>
                        <div className="flex flex-wrap justify-between gap-4 items-center">
                                {gallery.map((img) => (
                                        <div key={img.id} className="aspect-video object-cover object-center rounded-[10px] overflow-clip">
                                                <Image
                                                        src={img.src}
                                                        alt={img.alt}
                                                        title={img.alt}
                                                        width={172}
                                                        height={92}
                                                        className="size-full aspect-video object-cover max-w-50 cursor-pointer"
                                                />
                                        </div>
                                ))}
                        </div>
                </div>
        )
})
ImageCard.displayName = "ImageCard"

const CarDetailCard = memo(({ carName, status, reviewsAndRatings, specifications, overview }: CarDetailCardProps) => {
        return (
                <div className="flex flex-col gap-5 p-4 md:p-6 rounded-[10px] border border-gray-200">
                        <div className="flex flex-col gap-2">
                                <div className="flex gap-2 justify-between items-center">
                                        <h3 className="text-[#0B0B0B] text-2xl font-bold font-text leading-8">
                                                {carName}
                                        </h3>
                                        <div className="px-3 py-1 bg-[#DCFCE7] text-green-700 text-sm font-medium font-text leading-5 rounded-full">
                                                <span>{status}</span>
                                        </div>
                                </div>

                                <div className="flex gap-2 items-center">
                                        <div className="flex gap-2 items-center">
                                                <StarIcon />
                                                <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                                                        {reviewsAndRatings.averageRating}
                                                </span>
                                        </div>
                                        <span>{'·'}</span>
                                        <div>
                                                <span className="justify-start text-gray-500 text-sm font-normal font-['DM_Sans'] leading-5">
                                                         {reviewsAndRatings.reviews.length} reviews
                                                </span>
                                        </div>
                                </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                                <Badge className="py-4 px-2 bg-[#F3F4F6] rounded-[10px]">
                                        <CarIcon />
                                        <span className="text-[#1F2937]">
                                                {specifications.bodyType}
                                        </span>
                                </Badge>
                                <Badge className="py-4 px-2 bg-[#F3F4F6] rounded-[10px]">
                                        <GearIcon />
                                        <span className="text-[#1F2937]">
                                                {specifications.transmission}
                                        </span>
                                </Badge>
                                <Badge className="py-4 px-2 bg-[#F3F4F6] rounded-[10px]">
                                        <PassengerIcon />
                                        <span className="text-[#1F2937]">
                                                {specifications.seats} seats
                                        </span>
                                </Badge>
                                <Badge className="py-4 px-2 bg-[#F3F4F6] rounded-[10px]">
                                        <CalendarIcon />
                                        <span className="text-[#1F2937]">
                                                {specifications.year}
                                        </span>
                                </Badge>
                        </div>

                        <Tabs 
                                defaultValue="overview"
                                className="space-y-5"
                        >
                                <TabsList
                                        className="justify-start border-b pb-0 border-black rounded-none gap-8 w-full bg-white"
                                >
                                        <TabsTrigger 
                                                value="overview"
                                                className="max-w-fit p-0  pb-3.5 -mb-0.5 text-gray-500 text-sm font-medium font-text leading-5 border-b-2 border-b-transparent shadow-none shadow-transparent data-active:rounded-none data-active:text-[#1A56DB] data-active:border-b-[#1A56DB] data-active:shadow-none cursor-pointer"
                                        >
                                                Overview
                                        </TabsTrigger>
                                        <TabsTrigger 
                                                value="specifications"
                                                className="max-w-fit p-0  pb-3.5 -mb-0.5 text-gray-500 text-sm font-medium font-text leading-5 border-b border-b-transparent shadow-none shadow-transparent data-active:rounded-none data-active:text-[#1A56DB] data-active:border-b-[#1A56DB] data-active:shadow-none cursor-pointer"
                                        >
                                                Specifications
                                        </TabsTrigger>
                                        <TabsTrigger 
                                                value="reviews"
                                                className="max-w-fit p-0  pb-3.5 -mb-0.5 text-gray-500 text-sm font-medium font-text leading-5 border-b border-b-transparent shadow-none shadow-transparent data-active:rounded-none data-active:text-[#1A56DB] data-active:border-b-[#1A56DB] data-active:shadow-none cursor-pointer"
                                        >
                                                Reviews
                                        </TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview">
                                        <OverviewTab overview={overview} features={specifications?.features} />
                                </TabsContent>
                                <TabsContent value="specifications">
                                        <SpecificationsTab specifications={specifications} />
                                </TabsContent>
                                <TabsContent value="reviews">
                                        <ReviewTab reviewsAndRatings={reviewsAndRatings} />
                                </TabsContent>
                        </Tabs>
                </div>
        )
})
CarDetailCard.displayName = "CarDetailCard"

const OverviewTab = memo(({ overview, features }: OverviewTabProps) => {
        return (
                <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200 space-y-6">
                        <p className="text-[#333333] text-base font-normal font-text leading-7">
                                {overview}
                        </p>
                        {features && features.length > 0 && (
                                <div className="flex flex-col gap-4">
                                        <h4 className="text-[#0B0B0B] text-base font-semibold font-text leading-6">
                                                Features
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                                {features.map((item) => (
                                                        <div key={item} className="flex items-center gap-2">
                                                                <FeaturesCheckIcon />
                                                                <span className="text-[#0B0B0B] text-sm font-normal font-text leading-5">
                                                                        {item}
                                                                </span>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        )}
                </div>
        )
})
OverviewTab.displayName = "OverviewTab"

const SpecificationsTab = memo(({ specifications }: SpecificationsTabProps) => {

        const rows: { title: string; content: string | number }[] = [
                { title: "Make", content: specifications.make },
                { title: "Model", content: specifications.model },
                { title: "Year", content: specifications.year },
                { title: "Body Type", content: specifications.bodyType },
                { title: "Engine", content: specifications.engine },
                { title: "Horsepower", content: specifications.horsepower },
                { title: "Transmission", content: specifications.transmission },
                { title: "Drive Type", content: specifications.driveType },
                { title: "Fuel Type", content: specifications.fuelType },
                { title: "Fuel Efficiency", content: specifications.fuelEfficiency },
                { title: "Seats", content: specifications.seats },
                { title: "Doors", content: specifications.doors },
                { title: "Color", content: specifications.color },
                { title: "Mileage", content: specifications.mileage },
        ]

        return (
                <div className="divide-[#6B7280] divide-y">
                        {rows.map(({ title, content }) => (
                                <SpecificationsContent key={title} title={title} content={content} />
                        ))}
                </div>
        )
})
SpecificationsTab.displayName = "SpecificationsTab"

const SpecificationsContent = memo(({ title, content }: SpecificationsContentProps) => {
        return (
                <div className="flex items-center justify-between gap-3 py-3">
                        <h4 className="text-[#6B7280] text-sm font-normal font-text leading-5">{title}</h4>
                        <p className="text-[#0B0B0B] text-sm font-semibold font-text leading-5">{content}</p>
                </div>
        )
})
SpecificationsContent.displayName = "SpecificationsContent"

const HostCard = memo(({ hostName, memberSince, tripsCompleted, contactNumber, rating }: HostInfoType) => {
        
        const initials = getInitials(hostName)

        return (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
                        <div className="flex gap-4 items-center justify-start">
                                <div className="size-12 aspect-square rounded-full grid place-content-center bg-[#1A56DB]">
                                        <span className="text-white">{initials}</span>
                                </div>
                                <div className="flex flex-col gap-px">
                                        <h4 className="text-[#0B0B0B] text-sm font-semibold font-text leading-5">
                                                {hostName}
                                        </h4>
                                        <span className="text-[#6B7280] text-xs font-normal font-text leading-4">
                                                Member since {memberSince} · {tripsCompleted} trips completed
                                        </span>
                                        <div className="flex items-center gap-1">
                                                <StarIcon />
                                                <span className="text-[#0B0B0B] text-xs font-medium font-text leading-4">
                                                        {rating} Host Rating
                                                </span>
                                        </div>
                                </div>
                        </div>
                        <Link 
                                href={`tel:${contactNumber}`} 
                                title={`Contact ${hostName}`}
                        >
                                <button className="p-2 px-4 rounded-lg border border-[#1A56DB] text-[#1A56DB] text-sm text-nowrap font-medium font-text leading-5 cursor-pointer">
                                        Contact Host
                                </button>
                        </Link>
                </div>
        )
})
HostCard.displayName = "HostCard"

type PaymentSectionProps = {
        price: PricingTierType;
}

const PaymentSection = memo(({ price }: PaymentSectionProps) => {
        
        const displayPrice = price.daily
        const displayPriceTier = "day"

        const totalDays = 3

        const enteredPickUpDate = "Mar 14"
        const enteredReturnDate = "Mar 17"
        const totalPrice = 585

        return (           
                <div className="p-4 md:p-6 rounded-[10px] border border-gray-200">
                        <div>
                                <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                                <div>
                                                        <span className="text-blue-700 text-3xl font-medium font-text leading-12">
                                                                {"$"}{displayPrice}
                                                        </span>
                                                        <span className="text-gray-500 text-base font-normal font-text leading-6">
                                                                /{displayPriceTier}
                                                        </span>
                                                </div>
                                                <div>
                                                        <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                                                                Total: ${totalPrice} for {totalDays} {totalDays > 1 ? "days" : "day"}
                                                        </span>
                                                </div>
                                        </div>
                                        <div>
                                                FORM GOES HERE
                                        </div>
                                        <div className="bg-[#EBF0FB] rounded-[10px] p-2.5 md:p-3">
                                                <span className="text-blue-700 text-sm font-medium font-text leading-5">
                                                        {totalDays} {totalDays > 1 ? "days" : "day"}
                                                </span>
                                                {" "}
                                                <span className="text-blue-700 text-sm font-medium font-text leading-5">
                                                        · {enteredPickUpDate} - {enteredReturnDate}
                                                </span>
                                        </div>
                                        <div className="flex flex-col gap-3 pb-6.25 border-b border-b-[#E5E7EB]">
                                                <div className="flex justify-between gap-4">
                                                        <div>
                                                                <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
                                                                        {"$"}{displayPrice} x {totalDays} days
                                                                </span>
                                                        </div>
                                                        <div>
                                                                <span>
                                                                        {"$"}{totalPrice}
                                                                </span>
                                                        </div>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                        <div>
                                                                <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
                                                                        Insurance
                                                                </span>
                                                        </div>
                                                        <div>
                                                                <span className="text-[#F59E0B] text-sm font-normal font-text text-right leading-5">
                                                                        Charged separately
                                                                </span>
                                                        </div>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                        <div>
                                                                <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
                                                                        Fuel & Extras
                                                                </span>
                                                        </div>
                                                        <div>
                                                                <span className="text-[#F59E0B] text-sm font-normal font-text text-right leading-5">
                                                                        Charged separately
                                                                </span>
                                                        </div>
                                                </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                                <div>
                                                        <span className="text-[#0B0B0B] text-base font-bold font-text leading-6">
                                                                Total Estimate
                                                        </span>
                                                </div>
                                                <div>
                                                        <span className="text-[#1A56DB] text-xl font-medium font-text leading-7">
                                                                {"$"}{totalPrice}
                                                        </span>
                                                </div>
                                        </div>
                                        <div>
                                                <span className="text-gray-800 text-xs font-medium font-text leading-5">
                                                        I agree to the <Link href={'/'} className="text-[#1A56DB] hover:text-blue-900 duration-300 transition-colors underline" target="_blank" title="terms and conditions link">terms and conditions</Link>
                                                </span>
                                        </div>
                                        <div>
                                                <button className="w-full font-text text-white px-10 py-3 bg-[#1A56DB] rounded-xs cursor-pointer hover:bg-blue-900 duration-300 transition-colors">
                                                        Proceed to Payment
                                                </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                                <ShieldIcon/>
                                                <div>
                                                        <span className="text-[#6B7280] text-xs font-normal font-test leading-4">
                                                                Your booking is secure. Documents verified before confirmation.
                                                        </span>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div >
        )
})
PaymentSection.displayName = "PaymentSection"

const GreaterThanIcon = memo(() => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.99805 11.9959L9.99668 7.99729L5.99805 3.99866" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
))
GreaterThanIcon.displayName = "GreaterThanIcon"

const CarIcon = memo(() => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_123_793)">
                        <path d="M12.6625 11.3294H13.9953C14.3952 11.3294 14.6618 11.0629 14.6618 10.663V8.66367C14.6618 8.06388 14.1953 7.53073 13.6621 7.39744C12.4625 7.06422 10.6632 6.66436 10.6632 6.66436C10.6632 6.66436 9.79678 5.73134 9.19699 5.13155C8.86377 4.86497 8.4639 4.66504 7.9974 4.66504H3.33232C2.93246 4.66504 2.59924 4.93161 2.39931 5.26483L1.4663 7.19751C1.37805 7.4549 1.33301 7.72513 1.33301 7.99723V10.663C1.33301 11.0629 1.59958 11.3294 1.99945 11.3294H3.33232" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.66491 12.6623C5.40104 12.6623 5.99779 12.0656 5.99779 11.3295C5.99779 10.5933 5.40104 9.99658 4.66491 9.99658C3.92878 9.99658 3.33203 10.5933 3.33203 11.3295C3.33203 12.0656 3.92878 12.6623 4.66491 12.6623Z" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.99805 11.3293H9.99668" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.329 12.6623C12.0651 12.6623 12.6618 12.0656 12.6618 11.3295C12.6618 10.5933 12.0651 9.99658 11.329 9.99658C10.5928 9.99658 9.99609 10.5933 9.99609 11.3295C9.99609 12.0656 10.5928 12.6623 11.329 12.6623Z" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs><clipPath id="clip0_123_793"><rect width="15.9945" height="15.9945" fill="white" /></clipPath></defs>
        </svg>
))
CarIcon.displayName = "CarIcon"

const GearIcon = memo(() => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_123_801)">
                        <path d="M8.14359 1.33276H7.85035C7.49685 1.33276 7.15783 1.47319 6.90787 1.72315C6.6579 1.97312 6.51748 2.31214 6.51748 2.66564V2.7856C6.51724 3.01934 6.45553 3.2489 6.33856 3.45126C6.22159 3.65363 6.05346 3.82167 5.85104 3.93854L5.56447 4.10515C5.36185 4.22213 5.132 4.28372 4.89803 4.28372C4.66406 4.28372 4.43421 4.22213 4.23159 4.10515L4.13162 4.05183C3.82577 3.8754 3.46241 3.82754 3.1213 3.91875C2.7802 4.00996 2.48922 4.2328 2.31225 4.53833L2.16563 4.79158C1.9892 5.09743 1.94134 5.46079 2.03255 5.8019C2.12376 6.14301 2.34659 6.43398 2.65213 6.61096L2.7521 6.6776C2.95354 6.7939 3.12105 6.9609 3.23796 7.16199C3.35488 7.36308 3.41713 7.59127 3.41854 7.82388V8.16376C3.41947 8.39863 3.35832 8.62957 3.24129 8.8332C3.12426 9.03684 2.9555 9.20593 2.7521 9.32336L2.65213 9.38334C2.34659 9.56032 2.12376 9.85129 2.03255 10.1924C1.94134 10.5335 1.9892 10.8969 2.16563 11.2027L2.31225 11.456C2.48922 11.7615 2.7802 11.9843 3.1213 12.0756C3.46241 12.1668 3.82577 12.1189 4.13162 11.9425L4.23159 11.8892C4.43421 11.7722 4.66406 11.7106 4.89803 11.7106C5.132 11.7106 5.36185 11.7722 5.56447 11.8892L5.85104 12.0558C6.05346 12.1726 6.22159 12.3407 6.33856 12.543C6.45553 12.7454 6.51724 12.975 6.51748 13.2087V13.3287C6.51748 13.6822 6.6579 14.0212 6.90787 14.2711C7.15783 14.5211 7.49685 14.6615 7.85035 14.6615H8.14359C8.49709 14.6615 8.83611 14.5211 9.08607 14.2711C9.33604 14.0212 9.47646 13.6822 9.47646 13.3287V13.2087C9.4767 12.975 9.5384 12.7454 9.65538 12.543C9.77235 12.3407 9.94048 12.1726 10.1429 12.0558L10.4295 11.8892C10.6321 11.7722 10.8619 11.7106 11.0959 11.7106C11.3299 11.7106 11.5597 11.7722 11.7623 11.8892L11.8623 11.9425C12.1682 12.1189 12.5315 12.1668 12.8726 12.0756C13.2137 11.9843 13.5047 11.7615 13.6817 11.456L13.8283 11.1961C14.0047 10.8902 14.0526 10.5268 13.9614 10.1857C13.8702 9.84463 13.6473 9.55365 13.3418 9.37668L13.2418 9.32336C13.0384 9.20593 12.8697 9.03684 12.7526 8.8332C12.6356 8.62957 12.5745 8.39863 12.5754 8.16376V7.83054C12.5745 7.59568 12.6356 7.36473 12.7526 7.1611C12.8697 6.95746 13.0384 6.78837 13.2418 6.67094L13.3418 6.61096C13.6473 6.43398 13.8702 6.14301 13.9614 5.8019C14.0526 5.46079 14.0047 5.09743 13.8283 4.79158L13.6817 4.53833C13.5047 4.2328 13.2137 4.00996 12.8726 3.91875C12.5315 3.82754 12.1682 3.8754 11.8623 4.05183L11.7623 4.10515C11.5597 4.22213 11.3299 4.28372 11.0959 4.28372C10.8619 4.28372 10.6321 4.22213 10.4295 4.10515L10.1429 3.93854C9.94048 3.82167 9.77235 3.65363 9.65538 3.45126C9.5384 3.2489 9.4767 3.01934 9.47646 2.7856V2.66564C9.47646 2.31214 9.33604 1.97312 9.08607 1.72315C8.83611 1.47319 8.49709 1.33276 8.14359 1.33276Z" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.99736 9.99668C9.10156 9.99668 9.99668 9.10156 9.99668 7.99736C9.99668 6.89317 9.10156 5.99805 7.99736 5.99805C6.89317 5.99805 5.99805 6.89317 5.99805 7.99736C5.99805 9.10156 6.89317 9.99668 7.99736 9.99668Z" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs><clipPath id="clip0_123_801"><rect width="15.9945" height="15.9945" fill="white" /></clipPath></defs>
        </svg>
))
GearIcon.displayName = "GearIcon"

const PassengerIcon = memo(() => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_123_807)">
                        <path d="M10.6632 13.9952V12.6623C10.6632 11.9553 10.3823 11.2773 9.88237 10.7774C9.38244 10.2774 8.7044 9.99658 7.9974 9.99658H3.99876C3.29176 9.99658 2.61372 10.2774 2.11379 10.7774C1.61386 11.2773 1.33301 11.9553 1.33301 12.6623V13.9952" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.99779 7.33078C7.47004 7.33078 8.66354 6.13728 8.66354 4.66502C8.66354 3.19277 7.47004 1.99927 5.99779 1.99927C4.52553 1.99927 3.33203 3.19277 3.33203 4.66502C3.33203 6.13728 4.52553 7.33078 5.99779 7.33078Z" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.6614 13.9952V12.6624C14.661 12.0717 14.4644 11.4979 14.1025 11.0311C13.7407 10.5643 13.234 10.2309 12.6621 10.0833" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.6631 2.08594C11.2365 2.23275 11.7447 2.56624 12.1077 3.03382C12.4706 3.5014 12.6676 4.07648 12.6676 4.66839C12.6676 5.2603 12.4706 5.83538 12.1077 6.30295C11.7447 6.77053 11.2365 7.10402 10.6631 7.25084" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs><clipPath id="clip0_123_807"><rect width="15.9945" height="15.9945" fill="white" /></clipPath></defs>
        </svg>
))
PassengerIcon.displayName = "PassengerIcon"

const CalendarIcon = memo(() => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_123_815)">
                        <path d="M5.33105 1.33276V3.99852" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.6631 1.33276V3.99852" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.662 2.66577H3.3319C2.59577 2.66577 1.99902 3.26252 1.99902 3.99865V13.3288C1.99902 14.0649 2.59577 14.6617 3.3319 14.6617H12.662C13.3982 14.6617 13.9949 14.0649 13.9949 13.3288V3.99865C13.9949 3.26252 13.3982 2.66577 12.662 2.66577Z" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1.99902 6.66431H13.9949" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs><clipPath id="clip0_123_815"><rect width="15.9945" height="15.9945" fill="white" /></clipPath></defs>
        </svg>
))
CalendarIcon.displayName = "CalendarIcon"

const FeaturesCheckIcon = memo(() => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Fixed: fill-opacity → fillOpacity (JSX requires camelCase) */}
                <path d="M0 9.9931C0 4.47407 4.47407 0 9.9931 0C15.5121 0 19.9862 4.47407 19.9862 9.9931C19.9862 15.5121 15.5121 19.9862 9.9931 19.9862C4.47407 19.9862 0 15.5121 0 9.9931Z" fill="#1A56DB" fillOpacity="0.1" />
                <path d="M13.9819 6.99585L8.48695 12.4908L5.98926 9.99309" stroke="#1A56DB" strokeWidth="0.999079" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
))
FeaturesCheckIcon.displayName = "FeaturesCheckIcon"

const StarIcon = memo(() => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_123_884)">
                        <path d="M5.75706 1.14633C5.77895 1.10211 5.81277 1.06488 5.85469 1.03885C5.89662 1.01282 5.94499 0.999023 5.99434 0.999023C6.04369 0.999023 6.09206 1.01282 6.13398 1.03885C6.17591 1.06488 6.20973 1.10211 6.23162 1.14633L7.38556 3.48368C7.46157 3.63752 7.57379 3.77062 7.71257 3.87155C7.85134 3.97248 8.01254 4.03822 8.18232 4.06314L10.7629 4.4408C10.8118 4.44788 10.8578 4.46851 10.8956 4.50034C10.9333 4.53217 10.9615 4.57395 10.9768 4.62093C10.992 4.66792 10.9939 4.71824 10.982 4.76621C10.9702 4.81418 10.9452 4.85789 10.9098 4.89238L9.04353 6.7097C8.92045 6.82964 8.82836 6.9777 8.77519 7.14112C8.72202 7.30454 8.70936 7.47844 8.73831 7.64784L9.1789 10.2155C9.18753 10.2643 9.18225 10.3147 9.16366 10.3607C9.14508 10.4067 9.11393 10.4466 9.07377 10.4757C9.03362 10.5049 8.98607 10.5222 8.93656 10.5256C8.88705 10.5291 8.83756 10.5185 8.79376 10.4952L6.48688 9.28233C6.33488 9.20252 6.16577 9.16082 5.99409 9.16082C5.82241 9.16082 5.65329 9.20252 5.50129 9.28233L3.19492 10.4952C3.15113 10.5184 3.10171 10.5288 3.05228 10.5253C3.00285 10.5218 2.9554 10.5045 2.91533 10.4753C2.87525 10.4462 2.84416 10.4064 2.82559 10.3604C2.80702 10.3145 2.80171 10.2643 2.81028 10.2155L3.25037 7.64834C3.27944 7.47886 3.26685 7.30485 3.21367 7.14133C3.1605 6.9778 3.06834 6.82967 2.94515 6.7097L1.07887 4.89288C1.0432 4.85843 1.01792 4.81465 1.00592 4.76653C0.993916 4.71842 0.995667 4.6679 1.01097 4.62073C1.02628 4.57356 1.05453 4.53163 1.0925 4.49973C1.13047 4.46783 1.17663 4.44724 1.22574 4.4403L3.80586 4.06314C3.97583 4.03842 4.13725 3.97276 4.27622 3.87181C4.41518 3.77087 4.52754 3.63767 4.60362 3.48368L5.75706 1.14633Z" fill="#FDC700" stroke="#FDC700" strokeWidth="0.999079" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs><clipPath id="clip0_123_884"><rect width="11.9889" height="11.9889" fill="white" /></clipPath></defs>
        </svg>
))
StarIcon.displayName = "StarIcon"

const ShieldIcon = memo(() => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_123_1079)">
                        <path d="M13.329 8.66365C13.329 11.9958 10.9965 13.6619 8.22411 14.6283C8.07894 14.6775 7.92124 14.6751 7.7776 14.6216C4.99855 13.6619 2.66602 11.9958 2.66602 8.66365V3.99857C2.66602 3.82182 2.73623 3.65231 2.86121 3.52733C2.98619 3.40235 3.1557 3.33214 3.33245 3.33214C4.66533 3.33214 6.33143 2.53241 7.49103 1.51942C7.63222 1.3988 7.81182 1.33252 7.99753 1.33252C8.18323 1.33252 8.36283 1.3988 8.50402 1.51942C9.67029 2.53907 11.3297 3.33214 12.6626 3.33214C12.8393 3.33214 13.0089 3.40235 13.1338 3.52733C13.2588 3.65231 13.329 3.82182 13.329 3.99857V8.66365Z" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                        <clipPath id="clip0_123_1079">
                                <rect width="15.9945" height="15.9945" fill="white" />
                        </clipPath>
                </defs>
        </svg>
))
ShieldIcon.displayName = "StarIcon"
