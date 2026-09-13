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
import { Maximize2 } from 'lucide-react';
import { DEFAULT_IMAGE_SRC } from '@/constants/constant';
import { isValidImageSrc } from '@/lib/imageHelpers';
import GalleryModal from './galleryModal';

type GallerySliderProps = {
        gallery: {
                alt: string;
                src: string;
        }[] | null | undefined;
};

export default function GallerySlider({ gallery }: GallerySliderProps) {

        const validGallery = (gallery ?? []).filter((img) => img && isValidImageSrc(img.src));

        const resolvedGallery = validGallery.length > 0
                ? validGallery
                : [{ alt: 'Default image', src: DEFAULT_IMAGE_SRC }];

        const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
        const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
        const [activeIndex, setActiveIndex] = useState(1);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [modalInitialIndex, setModalInitialIndex] = useState(0);

        const handleOpenModal = (index: number) => {
                setModalInitialIndex(index);
                setIsModalOpen(true);
        };

        const handleCloseModal = (lastIndex?: number) => {
                setIsModalOpen(false);
                if (typeof lastIndex === 'number' && mainSwiper) {
                        mainSwiper.slideTo(lastIndex);
                }
        };

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
                                        className="mySwiper2 !h-auto"
                                        // Track active slide for the counter
                                        onSwiper={(swiper) => {
                                                setMainSwiper(swiper);
                                                setActiveIndex(swiper.realIndex + 1);
                                        }}
                                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex + 1)}
                                >
                                        {resolvedGallery.map((img, index) => (
                                                <SwiperSlide
                                                        key={index}
                                                        className='overflow-hidden rounded-lg cursor-pointer !h-auto select-none'
                                                        onClick={() => handleOpenModal(index)}
                                                >
                                                        <div className='group relative w-full aspect-[3/2] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center'>
                                                                <Image
                                                                        src={img.src}
                                                                        alt={img.alt}
                                                                        fill
                                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                                                                        className='!object-contain select-none transition-transform duration-300 group-hover:scale-[1.01]'
                                                                        priority={index === 0}
                                                                />
                                                                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-xs">
                                                                        <Maximize2 className="size-3.5" />
                                                                        <span>View Photos</span>
                                                                </div>
                                                        </div>
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
                                        {activeIndex}&nbsp;/&nbsp;{resolvedGallery.length}
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
                                {resolvedGallery.map((img, index) => (
                                        <SwiperSlide
                                                key={index}
                                                className='overflow-clip rounded-lg aspect-96/76 object-cover cursor-pointer'
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

                        {/* Full-view Modal */}
                        {isModalOpen && (
                                <GalleryModal
                                        isOpen={isModalOpen}
                                        onClose={handleCloseModal}
                                        images={resolvedGallery}
                                        initialIndex={modalInitialIndex}
                                />
                        )}
                </div>
        );
}