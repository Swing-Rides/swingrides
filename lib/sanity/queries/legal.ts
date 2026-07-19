import { client } from "@/sanity/client";
import type { PortableTextBlock } from "sanity";
import type { Image } from "sanity";

const LEGAL_QUERY = `*[
        _type == "policy" &&
        slug.current == $slug
][0]{
        "id": _id,
        "title": policyTitle,
        "slug": slug.current,
        "publishedDate": publishedAt,
        "image": policyImage,
        "body": body,
}`;

const options = { next: { revalidate: 30 } };

export type Legal = {
        id: string;
        title: string;
        slug: string;
        publishedDate: string;
        image: Image | null;
        body: PortableTextBlock[];
};

export const fetchLegal = async (slug: string): Promise<Legal | null> => {
        const data = await client.fetch<Legal | null>(
                LEGAL_QUERY,
                { slug },
                options
        );
        return data;
};