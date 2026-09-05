import { Suspense } from "react";
import Image from "next/image";
import { TabContentProps } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

export const TabContent = ({ image, content }: TabContentProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-15.5">
      <div>
        <Suspense
          fallback={<Skeleton className="size-full min-w-50 aspect-630/508" />}
        >
          <Image
            src={image.src}
            alt={image.alt}
            title={image.alt}
            width={630}
            height={508}
            className="size-full aspect-630/508 object-cover"
          />
        </Suspense>
      </div>
      <div>
        <div className="grid gap-10">
          {content.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-start gap-3 bg-white border-l-[6px] border-l-[#1A56DB] py-5.5 px-7.5 rounded-[8px]"
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
