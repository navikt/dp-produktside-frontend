import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { urlFor } from "sanity-utils/client";
import { SanityImage } from "sanity-utils/types";

interface Props {
  title: string;
  description: string;
  seoImage?: SanityImage;
}

const navUrl = "https://www.nav.no";
const navUrlShort = "nav.no";

export function PageMeta({ title, description, seoImage }: Props) {
  const { basePath, locale } = useRouter();

  const localePath = locale !== "nb" ? `/${locale}` : "";
  const canonicalURL = `${navUrl}${basePath}${localePath}`;

  const imageUrl = seoImage && urlFor(seoImage).url();
  const imageAltText = seoImage?.imageAltText ?? "";

  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={canonicalURL} />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalURL} />
      <meta property="og:site_name" content={navUrlShort} />
      <meta property="og:type" content="website" />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:domain" content={navUrlShort} />
      {imageUrl && (
        <>
          <meta property="image" content={imageUrl} />
          <meta property="image:alt" content={imageAltText} />
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:alt" content={imageAltText} />
          <meta property="twitter:image" content={imageUrl} />
          <meta property="twitter:image:alt" content={imageAltText} />
        </>
      )}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
