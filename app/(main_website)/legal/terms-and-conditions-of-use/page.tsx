import type { Metadata } from "next";
import { portableTextComponents } from "@/components/legals/portableTextComponents";
import { fetchLegal } from "@/lib/sanity/queries/legal";
import { PortableText } from "@portabletext/react";
import { Spinner } from "@chakra-ui/react";
import { constructMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/components/seo/jsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Terms and Conditions of Use",
  description:
    "Review the Swing Rides Terms and Conditions of Use for renting cars, listing vehicles, and marketplace usage.",
  path: "/legal/terms-and-conditions-of-use",
});

export default async function TermsPage() {
  const policy = await fetchLegal("terms-and-conditions-of-use");

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Legal", path: "/legal/terms-and-conditions-of-use" },
    { name: "Terms & Conditions", path: "/legal/terms-and-conditions-of-use" },
  ];

  const pageSchema = getWebPageSchema({
    name: policy?.title || "Terms and Conditions of Use | Swing Rides",
    description:
      "Review the Swing Rides Terms and Conditions of Use for renting cars, listing vehicles, and marketplace usage.",
    path: "/legal/terms-and-conditions-of-use",
  });

  if (!policy)
    return (
      <main>
        <JsonLd schema={[pageSchema, getBreadcrumbSchema(breadcrumbs)]} />
        <div className="py-12 px-4 md:px-8 md:py-20 bg-blue-950">
          <h1 className="font-text text-2xl lg:text-4xl font-bold text-white text-center">
            Terms and Conditions
          </h1>
        </div>
        <div className="py-12 px-4 md:px-8 md:py-20 grid place-content-center">
          <div className="flex items-center justify-center gap-2">
            <Spinner />
            <span className="block text-center">Loading...</span>
          </div>
        </div>
      </main>
    );

  return (
    <main>
      <JsonLd schema={[pageSchema, getBreadcrumbSchema(breadcrumbs)]} />
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