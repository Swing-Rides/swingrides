import React from 'react'
import Image from 'next/image'
import { PriBtn } from '../buttons'

type CarCardProps = {
        content : {
                id: number;
                imageUrl: string;
                name: string;
                price:{
                        daily: number;
                }
                reviewsAndRatings: {
                        averageRating: number;
                        totalRating: number;
                }
                specifications: {
                        seats: number;
                        fuelType: string;
                        transmission: string;
                }
        }
}


export default function CarCard({ content }: CarCardProps ) {

        const carSlug = content.name.toLowerCase().replace(/\s+/g, '-');
        const carUrl = content.id ? `/browse-cars/${carSlug}-${content.id}` : '#';

        return (
                <div key={content.id} className='bg-white'>
                        <div>
                                <Image
                                        src={content.imageUrl}
                                        alt={content.name}
                                        width={420}
                                        height={215}
                                        className='w-full aspect-420/215 object-cover'
                                />
                        </div>
                        <div className='flex flex-col gap-3 p-2.5 md:p-5 border border-[#E5E7EB]'>
                                <div className='flex items-center gap-1'>
                                        <StarIcon/>
                                        <span className='text-sm text-[#1F2937] font-semibold'>{content.reviewsAndRatings.averageRating}</span>
                                        <span className='text-sm text-[#6B7280] font-normal'>{`(${content.reviewsAndRatings.totalRating})`}</span> 
                                </div>
                                <div>
                                        <h4 className='text-lg text-[#1F2937] font-bold font-text'>{content.name}</h4>
                                </div>
                                <div className='flex flex-wrap gap-4 items-center'>
                                        <div className='flex items-center gap-1'>
                                                <PassengersIcon/>
                                                <span className='text-sm text-[#333333] font-normal'>{content.specifications.seats}</span>
                                        </div>

                                        <div className='flex items-center gap-1'>
                                                <FuelIcon/>
                                                <span className='text-sm text-[#333333] font-normal'>{content.specifications.fuelType}</span>
                                        </div>

                                        <div className='flex items-center gap-1'>
                                                <TransmissionIcon/>
                                                <span className='text-sm text-[#333333] font-normal'>{content.specifications.transmission}</span>
                                        </div>
                                </div>
                                <div className='flex justify-between items-center gap-2'>
                                        <div>
                                                <p className='text-2xl text-[#1A56DB] font-medium'>
                                                        {'$'}{content?.price?.daily}
                                                </p>
                                                <span className='text-xs text-[#6B7280] font-normal'>
                                                        per day
                                                </span>
                                        </div>
                                        <div>
                                                <PriBtn 
                                                        btn={{
                                                                label: 'Book Now',
                                                                link: `${carUrl}`
                                                        }}
                                                />
                                        </div>
                                </div>
                        </div>
                </div>
        )
}

const StarIcon = () => {
        return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_116_2052)">
                                <path d="M7.68106 1.52954C7.71027 1.47053 7.75538 1.42086 7.81132 1.38614C7.86725 1.35141 7.93178 1.33301 7.99762 1.33301C8.06346 1.33301 8.12798 1.35141 8.18392 1.38614C8.23985 1.42086 8.28497 1.47053 8.31418 1.52954L9.85365 4.6478C9.95507 4.85304 10.1048 5.03061 10.2899 5.16526C10.4751 5.29991 10.6901 5.38763 10.9166 5.42087L14.3594 5.9247C14.4247 5.93415 14.486 5.96167 14.5364 6.00414C14.5868 6.04661 14.6243 6.10234 14.6447 6.16502C14.6651 6.22771 14.6675 6.29484 14.6517 6.35884C14.6359 6.42284 14.6026 6.48114 14.5554 6.52716L12.0656 8.95167C11.9014 9.11168 11.7785 9.3092 11.7076 9.52722C11.6366 9.74524 11.6198 9.97724 11.6584 10.2032L12.2462 13.6287C12.2577 13.6939 12.2506 13.7611 12.2258 13.8225C12.201 13.8838 12.1595 13.937 12.1059 13.9759C12.0523 14.0149 11.9889 14.0379 11.9229 14.0425C11.8568 14.0471 11.7908 14.0331 11.7323 14.0019L8.65473 12.3838C8.45194 12.2773 8.22633 12.2217 7.99728 12.2217C7.76824 12.2217 7.54263 12.2773 7.33984 12.3838L4.2629 14.0019C4.20447 14.0329 4.13854 14.0468 4.07259 14.0421C4.00665 14.0374 3.94335 14.0143 3.88989 13.9754C3.83642 13.9365 3.79494 13.8834 3.77017 13.8221C3.74539 13.7609 3.73831 13.6938 3.74974 13.6287L4.33687 10.2039C4.37565 9.9778 4.35885 9.74566 4.28791 9.5275C4.21697 9.30934 4.09403 9.11171 3.92968 8.95167L1.43986 6.52783C1.39227 6.48186 1.35855 6.42346 1.34254 6.35927C1.32652 6.29507 1.32886 6.22767 1.34928 6.16474C1.3697 6.10182 1.40738 6.04589 1.45804 6.00333C1.50869 5.96077 1.57029 5.9333 1.63579 5.92403L5.07795 5.42087C5.30471 5.38788 5.52006 5.30029 5.70546 5.16562C5.89086 5.03095 6.04076 4.85325 6.14225 4.6478L7.68106 1.52954Z" fill="#FDC700" stroke="#FDC700" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_116_2052">
                                        <rect width="15.9945" height="15.9945" fill="white" />
                                </clipPath>
                        </defs>
                </svg>

        )
}

const PassengersIcon = () => {
        return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_116_2061)">
                                <path d="M10.6632 13.9952V12.6623C10.6632 11.9553 10.3823 11.2773 9.88237 10.7774C9.38244 10.2774 8.7044 9.99658 7.9974 9.99658H3.99876C3.29176 9.99658 2.61372 10.2774 2.11379 10.7774C1.61386 11.2773 1.33301 11.9553 1.33301 12.6623V13.9952" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5.99779 7.33078C7.47004 7.33078 8.66354 6.13728 8.66354 4.66502C8.66354 3.19277 7.47004 1.99927 5.99779 1.99927C4.52553 1.99927 3.33203 3.19277 3.33203 4.66502C3.33203 6.13728 4.52553 7.33078 5.99779 7.33078Z" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.6614 13.9952V12.6624C14.661 12.0717 14.4644 11.4979 14.1025 11.0311C13.7407 10.5643 13.234 10.2309 12.6621 10.0833" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10.6631 2.08594C11.2365 2.23275 11.7447 2.56624 12.1077 3.03382C12.4706 3.5014 12.6676 4.07648 12.6676 4.66839C12.6676 5.2603 12.4706 5.83538 12.1077 6.30295C11.7447 6.77053 11.2365 7.10402 10.6631 7.25084" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_116_2061">
                                        <rect width="15.9945" height="15.9945" fill="white" />
                                </clipPath>
                        </defs>
                </svg>


        )
}

const FuelIcon = () => {
        return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_116_2069)">
                                <path d="M1.99902 14.6616H9.99629" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.66602 5.99805H9.3304" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.3304 14.6618V2.66589C9.3304 2.31238 9.18998 1.97336 8.94001 1.7234C8.69005 1.47344 8.35103 1.33301 7.99753 1.33301H3.99889C3.64539 1.33301 3.30637 1.47344 3.05641 1.7234C2.80644 1.97336 2.66602 2.31238 2.66602 2.66589V14.6618" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.33008 8.66379H10.663C11.0165 8.66379 11.3555 8.80421 11.6054 9.05418C11.8554 9.30414 11.9958 9.64316 11.9958 9.99666V11.3295C11.9958 11.683 12.1363 12.0221 12.3862 12.272C12.6362 12.522 12.9752 12.6624 13.3287 12.6624C13.6822 12.6624 14.0212 12.522 14.2712 12.272C14.5212 12.0221 14.6616 11.683 14.6616 11.3295V6.55117C14.6617 6.37529 14.6271 6.20112 14.5596 6.0387C14.4921 5.87629 14.3931 5.72883 14.2684 5.60483L11.9958 3.33228" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_116_2069">
                                        <rect width="15.9945" height="15.9945" fill="white" />
                                </clipPath>
                        </defs>
                </svg>

     )
}

const TransmissionIcon = () => {
        return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_116_2077)">
                                <path d="M8.14359 1.33301H7.85035C7.49685 1.33301 7.15783 1.47344 6.90787 1.7234C6.6579 1.97336 6.51748 2.31238 6.51748 2.66589V2.78584C6.51724 3.01958 6.45553 3.24915 6.33856 3.45151C6.22159 3.65387 6.05346 3.82191 5.85104 3.93878L5.56447 4.10539C5.36185 4.22238 5.132 4.28396 4.89803 4.28396C4.66406 4.28396 4.43421 4.22238 4.23159 4.10539L4.13162 4.05208C3.82577 3.87565 3.46241 3.82778 3.1213 3.919C2.7802 4.01021 2.48922 4.23304 2.31225 4.53858L2.16563 4.79183C1.9892 5.09768 1.94134 5.46104 2.03255 5.80215C2.12376 6.14325 2.34659 6.43423 2.65213 6.6112L2.7521 6.67785C2.95354 6.79415 3.12105 6.96114 3.23796 7.16223C3.35488 7.36333 3.41713 7.59152 3.41854 7.82412V8.16401C3.41947 8.39887 3.35832 8.62981 3.24129 8.83345C3.12426 9.03708 2.9555 9.20618 2.7521 9.32361L2.65213 9.38359C2.34659 9.56056 2.12376 9.85154 2.03255 10.1926C1.94134 10.5338 1.9892 10.8971 2.16563 11.203L2.31225 11.4562C2.48922 11.7618 2.7802 11.9846 3.1213 12.0758C3.46241 12.167 3.82577 12.1191 4.13162 11.9427L4.23159 11.8894C4.43421 11.7724 4.66406 11.7108 4.89803 11.7108C5.132 11.7108 5.36185 11.7724 5.56447 11.8894L5.85104 12.056C6.05346 12.1729 6.22159 12.3409 6.33856 12.5433C6.45553 12.7456 6.51724 12.9752 6.51748 13.2089V13.3289C6.51748 13.6824 6.6579 14.0214 6.90787 14.2714C7.15783 14.5214 7.49685 14.6618 7.85035 14.6618H8.14359C8.49709 14.6618 8.83611 14.5214 9.08607 14.2714C9.33604 14.0214 9.47646 13.6824 9.47646 13.3289V13.2089C9.4767 12.9752 9.5384 12.7456 9.65538 12.5433C9.77235 12.3409 9.94048 12.1729 10.1429 12.056L10.4295 11.8894C10.6321 11.7724 10.8619 11.7108 11.0959 11.7108C11.3299 11.7108 11.5597 11.7724 11.7623 11.8894L11.8623 11.9427C12.1682 12.1191 12.5315 12.167 12.8726 12.0758C13.2137 11.9846 13.5047 11.7618 13.6817 11.4562L13.8283 11.1963C14.0047 10.8904 14.0526 10.5271 13.9614 10.186C13.8702 9.84487 13.6473 9.5539 13.3418 9.37692L13.2418 9.32361C13.0384 9.20618 12.8697 9.03708 12.7526 8.83345C12.6356 8.62981 12.5745 8.39887 12.5754 8.16401V7.83079C12.5745 7.59592 12.6356 7.36498 12.7526 7.16134C12.8697 6.95771 13.0384 6.78861 13.2418 6.67118L13.3418 6.6112C13.6473 6.43423 13.8702 6.14325 13.9614 5.80215C14.0526 5.46104 14.0047 5.09768 13.8283 4.79183L13.6817 4.53858C13.5047 4.23304 13.2137 4.01021 12.8726 3.919C12.5315 3.82778 12.1682 3.87565 11.8623 4.05208L11.7623 4.10539C11.5597 4.22238 11.3299 4.28396 11.0959 4.28396C10.8619 4.28396 10.6321 4.22238 10.4295 4.10539L10.1429 3.93878C9.94048 3.82191 9.77235 3.65387 9.65538 3.45151C9.5384 3.24915 9.4767 3.01958 9.47646 2.78584V2.66589C9.47646 2.31238 9.33604 1.97336 9.08607 1.7234C8.83611 1.47344 8.49709 1.33301 8.14359 1.33301Z" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.99736 9.99668C9.10156 9.99668 9.99668 9.10156 9.99668 7.99736C9.99668 6.89317 9.10156 5.99805 7.99736 5.99805C6.89317 5.99805 5.99805 6.89317 5.99805 7.99736C5.99805 9.10156 6.89317 9.99668 7.99736 9.99668Z" stroke="#6B7280" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_116_2077">
                                        <rect width="15.9945" height="15.9945" fill="white" />
                                </clipPath>
                        </defs>
                </svg>
     )
}