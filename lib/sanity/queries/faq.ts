import { client } from "@/sanity/client";

const FAQS_QUERY = `*[_type == "faq"]{
  "id": _id,
  question,
  answer,
  "category": questionCategory->title,
  "categorySlug": questionCategory->slug.current
}`;

const options = { next: { revalidate: 30 } };

export type Faq = {
        id: string;
        question: string;
        answer: string;
        category: string;
        categorySlug: string;
};

export const fetchAllFAQs = async (): Promise<Faq[]> => {
        const faqs = await client.fetch<Faq[]>(FAQS_QUERY, {}, options);
        return faqs;
};