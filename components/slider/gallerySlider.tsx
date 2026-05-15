"use client"

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';

type GallerySliderProps = {
        gallery: {
                alt: string;
                src: string;
        }[];
};

export default function GallerySlider({ gallery }: GallerySliderProps) {

        const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

        const [activeIndex, setActiveIndex] = useState(1);

        return (
                <div className='space-y-4.5'>
                        {/* Main slider */}
                        <div className="relative">
                                <Swiper
                                        style={
                                                {
                                                        '--swiper-navigation-color': '#fff',
                                                        '--swiper-pagination-color': '#fff',
                                                } as React.CSSProperties
                                        }
                                        spaceBetween={16}
                                        navigation={true}
                                        thumbs={{ swiper: thumbsSwiper }}
                                        modules={[FreeMode, Navigation, Thumbs]}
                                        className="mySwiper2"
                                        // Track active slide for the counter
                                        onSwiper={(swiper) => setActiveIndex(swiper.realIndex + 1)}
                                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex + 1)}
                                >
                                        {gallery.map((img, index) => (
                                                <SwiperSlide 
                                                        key={index}
                                                        className='overflow-clip bg-gray-50 rounded-lg aspect-108/40 object-cover'
                                                >
                                                        <Image
                                                                src={img.src}
                                                                alt={img.alt}
                                                                width={1080}
                                                                height={400}
                                                                className='w-full object-cover'
                                                        />
                                                </SwiperSlide>
                                        ))}
                                </Swiper>

                                {/* ✅ Pagination counter — top-right, above the swiper */}
                                <div
                                        style={{
                                                position: 'absolute',
                                                top: '16px',
                                                right: '10px',
                                                zIndex: 10,
                                                backgroundColor: 'rgba(0,0,0,0.60)',
                                                color: '#fff',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                pointerEvents: 'none',
                                                userSelect: 'none',
                                        }}
                                >
                                        {activeIndex}&nbsp;/&nbsp;{gallery.length}
                                </div>
                        </div>

                        {/* Thumbnail slider */}
                        <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={18}
                                slidesPerView={5}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper"
                        >
                                {gallery.map((img, index) => (
                                        <SwiperSlide 
                                                key={index}
                                                className='overflow-clip rounded-lg aspect-96/76 object-cover'
                                        >
                                                <Image
                                                        src={img.src}
                                                        alt={img.alt}
                                                        width={964}
                                                        height={764}
                                                        className='w-full object-cover'
                                                />
                                        </SwiperSlide>
                                ))}
                        </Swiper>
                </div>
        );
}