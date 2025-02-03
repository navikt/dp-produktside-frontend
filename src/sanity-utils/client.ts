import createImageUrlBuilder from "@sanity/image-url";
import { SanityImage } from "./types";
import { createClient } from "@sanity/client";

const projectId = "rt6o382n";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASETT || "development";

export const sanityConfig = {
  dataset: dataset,
  projectId: projectId,
  useCdn: process.env.NODE_ENV === "production",
  apiVersion: "2021-06-06",
};

export const urlFor = (source: SanityImage) => createImageUrlBuilder(sanityConfig).image(source);

export const sanityClient = createClient(sanityConfig);
