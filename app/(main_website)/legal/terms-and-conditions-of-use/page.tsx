import { portableTextComponents } from "@/components/legals/portableTextComponents";
import { fetchLegal } from "@/lib/sanity/queries/legal";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";

export default async function TermsPage() {
        const policy = await fetchLegal("terms-and-conditions-of-use");

        if (!policy) return notFound();

        return (
                <main>
                        <div className="py-12 px-4 md:px-8 md:py-20 bg-blue-950">
                                <h1 className="font-text text-2xl lg:text-4xl font-bold text-white text-center">
                                        {policy.title}
                                </h1>
                        </div>
                        <div className="py-12 px-4 md:px-8 md:py-20">
                                <article className="max-w-200 mx-auto">
                                        <PortableText 
                                                value={policy.body} 
                                                components={portableTextComponents} 
                                        />
                                </article>
                        </div>
                </main>
        );
}