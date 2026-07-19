import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

export const client = createClient({
        projectId: "36033end",
        dataset: "production",
        apiVersion: "2026-05-15",
        useCdn: false,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: Image) => {
        return builder.image(source);
};