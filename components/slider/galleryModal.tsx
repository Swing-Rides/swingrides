"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryModalItem = {
  alt: string;
  src: string;
};

export type GalleryModalProps = {
  isOpen: boolean;
  onClose: (lastIndex?: number) => void;
  images: GalleryModalItem[];
  initialIndex?: number;
};

export default function GalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, images.length - 1))
  );

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleClose = () => {
    onClose(currentIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery preview"
      tabIndex={0}
      autoFocus
      onKeyDown={handleKeyDown}
      onClick={handleClose}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md outline-none select-none transition-opacity duration-200"
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-white/10 bg-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-white text-sm font-semibold tracking-wide">
            {currentIndex + 1} / {images.length}
          </span>
          {currentImage.alt && currentImage.alt !== "Default image" && (
            <span className="text-white/60 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-md hidden xs:inline-block">
              {currentImage.alt}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="p-2 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close image gallery"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center p-3 sm:p-6 md:p-8">
        {/* Previous Navigation Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 active:bg-black text-white backdrop-blur-xs transition-all cursor-pointer shadow-lg border border-white/10"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        {/* Contained Image Frame */}
        <div
          className="relative w-full h-full max-w-6xl max-h-[72vh] sm:max-h-[78vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt || `Vehicle image ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1400px"
            className="object-contain select-none"
            priority
          />
        </div>

        {/* Next Navigation Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 active:bg-black text-white backdrop-blur-xs transition-all cursor-pointer shadow-lg border border-white/10"
            aria-label="Next image"
          >
            <ChevronRight className="size-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div
          className="shrink-0 py-3 px-4 bg-black/60 border-t border-white/10 backdrop-blur-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto max-w-4xl mx-auto py-1 px-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-14 h-10 sm:w-20 sm:h-14 rounded-md overflow-hidden transition-all cursor-pointer border-2 ${
                  idx === currentIndex
                    ? "border-blue-500 scale-105 opacity-100 shadow-md"
                    : "border-transparent opacity-40 hover:opacity-80"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || `Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

