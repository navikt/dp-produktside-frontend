import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { urlFor } from "../sanity/client";
import { SanityImage } from "../sanity/types";

interface Props {
  title: string;
  description: string;
  path?: string;
  seoImage?: SanityImage;
}

const navUrl = "https://www.nav.no";

export function SEO({ title, description, path, seoImage }: Props) {
  const { basePath } = useRouter();
  const imageUrl = seoImage && urlFor(seoImage).url();
  const cannonical = `${navUrl}${basePath}${path ?? ""}`;

  return (
    <Head>
      <title>{title} | www.nav.no</title>
      <link rel="canonical" href={cannonical} />
      <meta name="description" content={description} />
      <meta name="robots" content="noodp, noydir" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={title} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {imageUrl && (
        <>
          <meta property="twitter:image" content={imageUrl} />
          <meta property="og:image" content={imageUrl} />
          <meta property="image" content={imageUrl} />
        </>
      )}
    </Head>
  );
}
