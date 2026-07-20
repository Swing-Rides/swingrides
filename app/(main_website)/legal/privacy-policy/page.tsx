import { portableTextComponents } from "@/components/legals/portableTextComponents";
import { fetchLegal } from "@/lib/sanity/queries/legal";
import { Spinner } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";

export default async function PrivacyPolicyPage() {

        const policy = await fetchLegal("privacy-policy");
        
        if (!policy) return (
                <main>
                        <div className="py-12 px-4 md:px-8 md:py-20 bg-blue-950">
                                <h1 className="font-text text-2xl lg:text-4xl font-bold text-white text-center">
                                        Privacy Policy
                                </h1>
                        </div>
                        <div className="py-12 px-4 md:px-8 md:py-20 grid place-content-center">
                                <div className="flex items-center justify-center gap-2">
                                        <Spinner />
                                        <span className="block text-center">
                                                Loding...
                                        </span>
                                </div>
                        </div>
                </main>
        );

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
        )
}
