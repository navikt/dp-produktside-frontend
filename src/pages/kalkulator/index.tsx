import { Header } from "components/header/Header";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { SectionWithHeader } from "components/section-with-header/SectionWithHeader";
import { GrunnbelopData } from "contexts/grunnbelop-context/GrunnbelopContext";
import { useSanityContext } from "contexts/sanity-context/SanityContext";
import { max } from "date-fns";
import { GetStaticPropsContext } from "next";
import { sanityClient } from "sanity-utils/client";
import { produktsideQuery } from "sanity-utils/groq/produktside/produktsideQuery";
import { convertTimestampToDate, isValidDate } from "utils/dates";
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
  const { header, settings, kortFortalt } = sanityData;

  /* @ts-ignore */
  const kalkulator = settings?.content?.find((c) => c.iconName === "CalculatorIcon");
  const { title, content, slug, iconName } = kalkulator;

  const lastUpdatedDates = [
    settings?._updatedAt,
    kortFortalt?._updatedAt,
    //@ts-ignore
    ...(settings?.content?.map((section) => {
      if (section?._updatedAt) {
        return section?._updatedAt;
      }
    }) ?? []),
  ]
    .map(convertTimestampToDate)
    .filter(isValidDate);

  const lastUpdated = max(lastUpdatedDates);

  return (
    <main>
      <Header
        title={header?.title}
        leftSubtitle={header?.leftSubtitle}
        rightSubtitle={header?.rightSubtitle}
        lastUpdated={lastUpdated}
      />

      <div className={styles.layout}>
        <div className={styles.content}>
          <SectionWithHeader title={title} anchorId={slug?.current} iconName={iconName}>
            <PortableTextContent value={content} />
          </SectionWithHeader>
        </div>
      </div>
    </main>
  );
}
