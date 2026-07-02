import { client } from "@/sanity/client";

const CATEGORIES_QUERY = `*[_type == "questionCategory" && !defined(parent)]{
  "id": _id,
  title,
  "slug": slug.current
} | order(title asc)`;

const options = { next: { revalidate: 30 } };

export type FaqCategory = {
        id: string;
        title: string;
        slug: string;
};

export const fetchAllFaqCategories = async (): Promise<FaqCategory[]> => {
        const faqCategory = client.fetch<FaqCategory[]>(CATEGORIES_QUERY, {}, options);
        return faqCategory;
};