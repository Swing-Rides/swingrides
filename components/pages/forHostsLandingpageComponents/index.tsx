import { Fragment, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { pricingContents } from "@/constants/forHostPageContents";
import PriceSection from "./priceSection";
import {
  // Building, CalendarCheck, 
  Car, ChartColumn, Phone, Receipt, Check,
  // ThumbsUp, 
  Wrench
} from "lucide-react";
// import { StarRating } from "@/components/hostComponents/pages/reviewsPageComponents/reviewsPageComponents";
import FAQsSection from "@/components/faqs";
import { trustContent } from "@/constants/homePage";
import { TrustContentProps } from "../homepage";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { SwingNumberSection } from "../aboutPage";
import EverythingYouNeedSection from "./everythingYouNeedSection";

export default function ForHostLandingPage() {
  return (
    <>
      <HeroSection />
      <SwingNumberSection />
      <HowItWork />
      <EverythingYouNeedSection />
      <PriceSection pricingContents={pricingContents} />
      <TrustSection />
      <FAQsSection />
    </>
  );
}

const HeroSection = () => {
  return (
    <section className="py-12 px-4 md:pl-8 md:pr-0 md:py-20 section-bg-gradient overflow-hidden">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        <div className="flex flex-col items-start gap-5 max-w-133.75">
          <Pill label="The Operating System for Rental Businesses" />
          <h2 className="text-4xl md:text-6xl leading-16 font-black ">
            Everything independent rental operators need.
          </h2>
          <h3 className="text-4xl md:text-6xl leading-16 font-black text-blue-700">
            Spend less time managing. More time growing.
          </h3>
          <p className="text-gray-500 text-lg font-normal font-text leading-6 text-left">
            SwingRides helps you manage bookings, fleet, customers, maintenance, invoices and more — all in one platform.
          </p>
          <div className="flex gap-3 items-center justify-center">
            <Link
              href='#price-list'
              className="py-2 px-6 rounded-xs bg-blue-700 border-blue-700 text-white border text-xs font-semibold capitalize hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
            >
              Become a Host
            </Link>
            <Link
              href={HOST_DASHBOARD_PATH}
              className="py-2 px-6 rounded-xs border-blue-700 bg-transparent text-blue-700 border text-xs font-semibold capitalize hover:text-white hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
            >
              Login as host
            </Link>
          </div>
          <div className="flex gap-3 items-center justify-start flex-wrap">
            {["No hidden fees", "No commission per booking"].map((item) => (
              <div key={item} className="flex gap-2 items-center justify-start">
                <Check className="text-blue-700 size-4" />
                <span className="text-gray-500 text-sm font-normal font-text leading-5">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex -mr-10 aspect-816/704 w-full">
          <Image
            src={"/images/host-dashboard-screenshot.png"}
            alt={"SwingRides Host Platform Dashboard - Everything independent rental operators need."}
            title={"Everything independent rental operators need."}
            width={908}
            height={796}
            className="aspect-908/796 object-cover w-full"
          />
        </div>
      </div>
    </section>
  );
};

// const NumberSection = () => {

// 	const numberContent = [
//         {
// 			icon: <Building className="text-blue-700 size-8" />,
// 			number: "2,500+",
// 			label: "Rental Businesses",
//         },
//         {
// 			icon: <Car className="text-blue-700 size-8" />,
// 			number: "2,500+",
// 			label: "Vehicles Managed",
//         },
//         {
// 			icon: <CalendarCheck className="text-blue-700 size-8" />,
// 			number: "150,000+",
// 			label: "Bookings Processed",
//         },
//         {
// 			icon: <ThumbsUp className="text-blue-700 size-8" />,
// 			number: "98%",
// 			label: "Customer Satisfaction",
//         },
// 	];


//     return (
//         <section className="py-12 px-4 md:px-8 md:py-20 bg-indigo-50">
// 			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-between divide-x">
//                 <div className="">
// 					<h3 className="text-neutral-950 text-sm font-bold font-text leading-4">
// 						Trusted by rental operators and fleet owners
// 					</h3>
//                 </div>
//                 {numberContent.map((item) => (
//                     <Fragment key={item.label}>
//                         <NumberCard
//                             icon={item.icon}
//                             number={item.number}
//                             label={item.label}
//                         />
//                     </Fragment>
//                 ))}
//                 <div className="flex flex-col">
//                     <div className="flex gap-2 items-center justify-start">
// 						<StarRating
// 							rating={4.8}
// 						/>
// 						<span className="text-neutral-950 text-2xl font-bold font-text leading-8">
// 							4.8/5
// 						</span>
// 					</div>
// 					<span className="text-gray-500 text-sm font-normal font-text leading-5">
// 						Based on 1,847 reviews
// 					</span>
//                 </div>
//             </div>
//         </section>
//     );
// };

const HowItWork = () => {

  const content: HowItWorksCardProps[] = [
    {
      icon: <Phone className="text-red-600 size-6" />,
      iconBgColor: "bg-red-100",
      title: "Manual Bookings",
      desc: `Juggling calls, texts and spreadsheets leads to double bookings and lost revenue.`,
    },
    {
      icon: <Car className="text-blue-700 size-6" />,
      iconBgColor: "bg-blue-100",
      title: "Fleet Management Chaos",
      desc: "No real-time visibility into availability, maintenance or vehicle performance.",
    },
    {
      icon: <Wrench className="text-amber-500 size-6" />,
      iconBgColor: "bg-amber-100",
      title: "Maintenance Overdue",
      desc: "Missed services lead to breakdowns, unhappy customers and extra costs.",
    },
    {
      icon: <Receipt className="text-purple-500 size-6" />,
      iconBgColor: "bg-purple-100",
      title: "Financial Disorganization",
      desc: "Tracking expenses, invoices and revenue across different tools wastes time and creates errors.",
    },
    {
      icon: <ChartColumn className="text-green-500 size-6" />,
      iconBgColor: "bg-green-100",
      title: "No Business Insights",
      desc: "No clear reports means poor decisions and missed opportunities to grow.",
    },
  ];

  return (
    <section className="section-bg-gradient" id="how-it-works">
      <div className="px-4 py-12.5 md:px-20 md:py-20 space-y-10.5">
        <div className="flex flex-col items-center gap-4 max-w-120 mx-auto">
          <span className="text-center text-blue-700 text-xs font-bold font-text uppercase leading-4">
            Built for Operators
          </span>
          <h3 className="text-center justify-center text-neutral-950 text-4xl font-black font-sans tracking-tight">
            Running a rental business is hard.
          </h3>
          <p className="text-center text-gray-500 text-lg font-normal font-text leading-7">
            Too many tools. Too many tasks. Not enough time.
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-start gap-6 mx-auto">
          {content.map((item) => (
            <Fragment key={item.title}>
              <HowItWorksCard {...item} />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

type HowItWorksCardProps = {
  icon: ReactNode
  iconBgColor: string;
  title: string;
  desc: string;
};

const HowItWorksCard = ({
  icon,
  iconBgColor,
  title,
  desc,
}: HowItWorksCardProps) => {
  return (
    <div className="basis-60.75 shrink grow-0 space-y-4 overflow-clip">
      <div className={`flex justify-center items-center size-12 mx-auto rounded-md aspect-square ${iconBgColor}`}>
        {icon}
      </div>
      <div className="space-y-2 text-center">
        <h4 className="text-neutral-950 text-base font-bold font-text leading-6">
          {title}
        </h4>
        <span className="text-gray-500 text-sm font-normal font-text leading-5">
          {desc}
        </span>
      </div>
    </div>
  );
};

export const Pill = ({ label }: { label: string }) => {
  return (
    <div className="mb-5 py-1 px-3 w-fit flex gap-2.5 items-center bg-blue-100 rounded-full">
      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="3" cy="3" r="3" fill="#1A56DB" />
      </svg>
      <span className="text-[#1A56DB] text-xs font-semibold font-text uppercase leading-4 text-nowrap">
        {label}
      </span>
    </div>
  );
};

// type NumberCardProps = {
//   icon: ReactNode;
//   number: string;
//   label: string;
// };

// const NumberCard = ({ icon, number, label }: NumberCardProps) => {
//   return (
//     <div className="px-4 flex gap-4 overflow-hidden">
//       <div>
//         {icon}
//       </div>
//       <div className="flex flex-col gap-3">
//         <h3 className="text-neutral-950 text-2xl font-bold font-text leading-8">
//           {number}
//         </h3>
//         <span className="text-gray-500 text-sm font-normal font-text leading-5">
//           {label}
//         </span>
//       </div>
//     </div>
//   );
// };

const TrustSection = () => {
  return (
    <section className='px-4 py-10 md:px-20 bg-blue-950'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
        {trustContent.map((items) => (
          <TrustCard
            key={items.title}
            content={items}
          />
        ))}
      </div>
    </section>
  )
}

const TrustCard = ({ content }: TrustContentProps) => {
  return (
    <div className='basis-80 shrink grow-0 block space-y-3 md:flex items-center justify-start gap-3 p-3 md:p-8'>
      <div className='size-9 px-2 bg-white rounded-[10px] border border-slate-200 flex justify-center items-center m-0'>
        {content.icon}
      </div>
      <div className='flex flex-col'>
        <p className='text-white text-sm font-bold font-text leading-5'>
          {content.title}
        </p>
        <span className='text-gray-500 text-xs font-normal font-text leading-4'>
          {content.description}
        </span>
      </div>
    </div>
  )
}