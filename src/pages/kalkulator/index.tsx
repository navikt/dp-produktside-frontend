import { BodyShort, Heading } from "@navikt/ds-react";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { GrunnbelopData } from "contexts/grunnbelop-context/GrunnbelopContext";
import { useSanityContext } from "contexts/sanity-context/SanityContext";
import { GetStaticPropsContext } from "next";
import Image from "next/image";
import { sanityClient } from "sanity-utils/client";
import { produktsideQuery } from "sanity-utils/groq/produktside/produktsideQuery";
import svgIcon from "../../../public/kalkulator.svg";
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
  // const { content, title, subtitle } = sanityData?.calculatorPage;

  // console.log(`🔥  :`, sanityData.generalTexts);

  console.group(sanityData);

  return (
    <main>
      <div className={styles.layout}>
        <div className={styles.content}>
          <div className={styles.header}>
            {/* <BodyShort className={styles.subtitle} aria-hidden>
              {subtitle}
            </BodyShort>
            <div className={styles.title}>
              <Heading size="large" level="1">
                {title}
              </Heading>
              <Image src={svgIcon} aria-hidden alt="" />
            </div> */}
          </div>
          <PortableTextContent value={content} />
        </div>
      </div>
    </main>
  );
}
