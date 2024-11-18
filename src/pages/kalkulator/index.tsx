import { BodyShort, Heading, Link } from "@navikt/ds-react";
import { PageMeta } from "components/PageMeta";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { GrunnbelopData } from "contexts/grunnbelop-context/GrunnbelopContext";
import { useSanityContext } from "contexts/sanity-context/SanityContext";
import { GetStaticPropsContext } from "next";
import Image from "next/image";
import { sanityClient } from "sanity-utils/client";
import { produktsideQuery } from "sanity-utils/groq/produktside/produktsideQuery";
import kalkulatorIcon from "../../../public/kalkulator.svg";
import dagpengerIcon from "../../../public/static-dagpenger.svg";
import styles from "./styles.module.css";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const sanityData = await sanityClient.fetch(produktsideQuery, { baseLang: "nb", lang: locale });
  const grunnbelopResponse = await fetch("https://g.nav.no/api/v1/grunnbeloep");
  const grunnbelopData: GrunnbelopData = await grunnbelopResponse.json();

  return {
    props: {
      sanityData: sanityData,
      grunnbelopData: grunnbelopData,
    },
    revalidate: 120,
  };
}

export default function KalkulatorIndex() {
  const sanityData = useSanityContext();
  /* @ts-ignore */
  const { content, title, subtitle, dagpengerLink, seo } = sanityData?.calculatorPage;

  return (
    <div>
      <PageMeta title={seo?.title} description={seo?.description} seoImage={seo?.image} />
      <main id="maincontent" tabIndex={-1}>
        <div className={styles.layout}>
          <div className={styles.content}>
            <div className={styles.header}>
              <BodyShort className={styles.subtitle} aria-hidden>
                {subtitle}
              </BodyShort>
              <div className={styles.title}>
                <Heading size="large" level="1">
                  {title}
                </Heading>
                <Image src={kalkulatorIcon} aria-hidden alt="" />
              </div>
            </div>
            <PortableTextContent value={content} />
            <Link className={styles.dagpengerLink} href={dagpengerLink.link}>
              <div className={styles.dagpengerLinkIcon}>
                <Image src={dagpengerIcon} height={50} alt="Ikon for dagpenger" aria-hidden />
              </div>
              <div className={styles.dagpengerLinkText}>
                <div className={styles.dagpengerLinkTitle}>{dagpengerLink.text}</div>
                <BodyShort>{dagpengerLink.description}</BodyShort>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
