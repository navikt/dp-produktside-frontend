import createImageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import { SanityImage } from "./types";

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
