'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { getSanityImageUrl, type HowItWorksSectionData } from '@/lib/sanity/queries/locations';

type HowItWorksSectionProps = {
  data?: HowItWorksSectionData;
  locationName?: string;
};

export default function HowItWorksSection({ data }: HowItWorksSectionProps) {
  const [activeStep, setActiveStep] = useState(0);

  const eyebrow = data?.eyebrow || 'How It Works';
  const headline = data?.headline || 'RENTING MADE SIMPLE.';

  const defaultSteps = [
    {
      stepNumber: '01',
      title: 'Search & choose your vehicle',
      description:
        'Enter your pickup location and dates, then browse listings from local hosts to find what fits your trip.',
      image: '/images/swingrides-default-img.webp',
    },
    {
      stepNumber: '02',
      title: 'Book instantly',
      description: 'Reserve directly through the platform, no back and forth.',
      image: '/images/swingrides-default-img.webp',
    },
    {
      stepNumber: '03',
      title: 'Pick up and go',
      description: 'Meet your host, grab the keys, and hit the road.',
      image: '/images/swingrides-default-img.webp',
    },
  ];

  const steps = data?.steps && data.steps.length > 0 ? data.steps : defaultSteps;

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <section id="how-it-works" className="w-full bg-[#EDF5FB] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-200/50">
            <ChevronDown className="size-3.5 text-blue-600" />
            {eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 uppercase">
            {headline}
          </h2>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Steps */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleStepClick(idx)}
                  className={`cursor-pointer transition-all duration-300 rounded-xl p-5 border-l-4 ${isSelected
                      ? 'border-blue-600 bg-white shadow-md translate-x-1'
                      : 'border-transparent bg-transparent hover:bg-white/60 opacity-70 hover:opacity-100'
                    }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleStepClick(idx);
                    }
                  }}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`text-xs font-bold block uppercase tracking-wider mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-500'
                      }`}
                  >
                    {step.stepNumber}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 font-text">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column - Step Image with Dynamic Switch */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Photo Container with cross-fade images */}
              <div className="relative w-full h-90 sm:h-105 lg:h-120">
                {steps.map((step, idx) => {
                  const fallbackImg =
                    defaultSteps[idx % defaultSteps.length]?.image ||
                    '/images/swingrides-default-img.webp';
                  const stepImgSrc = getSanityImageUrl(step.image, fallbackImg);
                  const isVisible = activeStep === idx;

                  return (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100 z-1' : 'opacity-0 pointer-events-none z-0'
                        }`}
                    >
                      <Image
                        src={stepImgSrc}
                        alt={`${step.title} - SwingRides`}
                        width={653}
                        height={519}
                        className="aspect-653/519 object-cover object-center"
                        priority={idx === 0}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
