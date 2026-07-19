import { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";

export const portableTextComponents: PortableTextComponents = {
        block: {
                normal: ({ children }) => (
                        <p className="text-zinc-800 text-base font-normal font-text leading-6 mb-4">
                                {children}
                        </p>
                ),
                h1: ({ children }) => (
                        <h1 className="text-neutral-950 text-2xl font-bold font-text leading-8 mb-4 mt-8">
                                {children}
                        </h1>
                ),
                h2: ({ children }) => (
                        <h2 className="text-neutral-950 text-base font-semibold font-text leading-6 mb-3 mt-6">
                                {children}
                        </h2>
                ),
                h3: ({ children }) => (
                        <h3 className="text-neutral-950 text-sm font-semibold font-text leading-5 mb-2 mt-5">
                                {children}
                        </h3>
                ),
                h4: ({ children }) => (
                        <h4 className="text-neutral-950 text-sm font-medium font-text leading-5 mb-2 mt-4">
                                {children}
                        </h4>
                ),
                h5: ({ children }) => (
                        <h5 className="text-neutral-950 text-xs font-medium font-text leading-4 mb-2 mt-3">
                                {children}
                        </h5>
                ),
                blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-zinc-300 pl-4 italic text-zinc-600 text-base font-normal font-text leading-6 my-4">
                                {children}
                        </blockquote>
                ),
        },

        list: {
                bullet: ({ children }) => (
                        <ul className="list-disc pl-6 text-zinc-800 text-base font-normal font-text leading-6 mb-4 space-y-1">
                                {children}
                        </ul>
                ),
                number: ({ children }) => (
                        <ol className="list-decimal pl-6 text-zinc-800 text-base font-normal font-text leading-6 mb-4 space-y-1">
                                {children}
                        </ol>
                ),
        },

        listItem: {
                bullet: ({ children }) => <li>{children}</li>,
                number: ({ children }) => <li>{children}</li>,
        },

        marks: {
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                underline: ({ children }) => <span className="underline">{children}</span>,
                link: ({ value, children }) => {
                        const href = value?.href || "#";
                        const isExternal = href.startsWith("http");
                        return (
                                <Link
                                        href={ href }
                                        target={ isExternal? "_blank": undefined }
                                        rel={ isExternal? "noopener noreferrer": undefined }
                                        className="text-blue-600 underline hover:text-blue-800 transition-colors"
                                >
                                        { children }
                                </Link >
                        );
                },
        },

        types: {
                image: ({ value }) => {
                        if (!value?.asset) return null;
                        return (
                                <figure className="my-6">
                                        <Image
                                                src={urlFor(value).width(1200).url()}
                                                alt={value.alt || ""}
                                                width={1200}
                                                height={675}
                                                className="rounded-lg w-full h-auto"
                                        />
                                        {value.caption && (
                                                <figcaption className="text-zinc-500 text-sm font-normal font-text leading-5 mt-2 text-center">
                                                        {value.caption}
                                                </figcaption>
                                        )}
                                </figure>
                        );
                },
        },
}