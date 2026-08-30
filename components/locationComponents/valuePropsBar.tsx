import React from 'react';
import type { ValuePropItem } from '@/lib/sanity/queries/locations';

type ValuePropsBarProps = {
  items?: ValuePropItem[];
};

export default function ValuePropsBar({ items }: ValuePropsBarProps) {
  const defaultItems: ValuePropItem[] = [
    {
      title: 'Local vehicles',
      description: 'Listed by hosts near you',
    },
    {
      title: 'More ways to ride',
      description: 'From everyday cars to SUVs',
    },
    {
      title: 'Host-first marketplace',
      description: 'No hidden inspections required',
    },
    {
      title: 'One simple platform',
      description: 'Search, book and drive',
    },
  ];

  const list = items && items.length > 0 ? items : defaultItems;

  return (
    <section className="w-full bg-[#0B1728] text-white py-8 lg:py-10 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-800/80 gap-6 sm:gap-4 lg:gap-0">
          {list.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center ${index !== 0 ? 'lg:pl-6' : ''
                } ${index !== list.length - 1 ? 'lg:pr-6' : ''} pt-4 sm:pt-0`}
            >
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 uppercase font-text">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

