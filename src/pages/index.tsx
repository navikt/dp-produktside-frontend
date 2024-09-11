import { GetStaticPropsContext } from "next";
import { max } from "date-fns";
import { Heading } from "@navikt/ds-react";
import { openChatbot } from "@navikt/nav-dekoratoren-moduler";
import { ContactOption } from "components/contact-option/ContactOption";
import { FilterSection } from "components/filter-section/FilterSection";
import { GrunnbelopData } from "contexts/grunnbelop-context/GrunnbelopContext";
import { Header } from "components/header/Header";
import { KortFortaltSection } from "components/kort-fortalt-section/KortFortaltSection";
import { LeftMenuSection } from "components/layout/left-menu-section/LeftMenuSection";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { useSanityContext } from "contexts/sanity-context/SanityContext";
import { SectionWithHeader } from "components/section-with-header/SectionWithHeader";
import { PageMeta } from "components/PageMeta";
import { sanityClient } from "sanity-utils/client";
import { produktsideQuery } from "sanity-utils/groq/produktside/produktsideQuery";
import styles from "styles/Home.module.scss";
import { convertTimestampToDate, isValidDate } from "utils/dates";
import { useIsMobile } from "utils/useIsMobile";
import { TopContent } from "components/top-content/TopContent";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  // TODO: errorhåndtering hvis man ikke greier å hente produktside
  const sanityData = await sanityClient.fetch(produktsideQuery, { lang: locale || "nb" });
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

export default function Home() {
  const isMobile = useIsMobile();
  const sanityData = useSanityContext();

  const { header, settings, kortFortalt, contactOptions, seo, topContent } = sanityData;

  const kortFortaltLink = {
    anchorId: kortFortalt?.slug?.current,
    linkText: kortFortalt?.title,
  };

  // @ts-ignore
  const links = settings?.content?.map(({ title, slug }) => ({
    anchorId: slug?.current,
    linkText: title,
  }));

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
    <div className={styles.rootContainer}>
      <PageMeta title={seo?.title} description={seo?.description} seoImage={seo?.image} />

      <main className={styles.main} id="maincontent">
        <div className={styles.productPage}>
          <Header
            title={header?.title}
            leftSubtitle={header?.leftSubtitle}
            rightSubtitle={header?.rightSubtitle}
            lastUpdated={lastUpdated}
          />

          <div className={styles.content}>
            <div className={styles.layoutContainer}>
              <div className={styles.topRow}>
                <div className={styles.leftCol}>
                  {isMobile && (
                    <>
                      <TopContent value={topContent?.content} />
                      <KortFortaltSection />
                      <FilterSection />
                    </>
                  )}

                  <LeftMenuSection
                    title={settings?.title}
                    supportLinksTitle={settings?.supportLinksTitle}
                    internalLinks={[kortFortaltLink, ...links]}
                    supportLinks={settings?.supportLinks}
                    sticky={!isMobile}
                  />
                </div>

                <div className={styles.mainCol}>
                  {!isMobile && (
                    <>
                      <TopContent value={topContent?.content} />
                      <KortFortaltSection />
                      <FilterSection />
                    </>
                  )}

                  {/* @ts-ignore */}
                  {settings?.content?.map(({ title, content, slug, iconName }, index) => (
                    <SectionWithHeader key={index} title={title} anchorId={slug?.current} iconName={iconName}>
                      {/* bør styles til bodylong*/}
                      <PortableTextContent value={content} />
                    </SectionWithHeader>
                  ))}
                </div>
              </div>
              {contactOptions && (
                <div className={styles.bottomRow}>
                  <div className={styles.bottomRowLayoutContainer}>
                    <Heading className={styles.contactOptionsTitle} level="2" size="large" spacing>
                      {contactOptions.title}
                    </Heading>
                    <div className={styles.contactOptionsContainer}>
                      <ContactOption
                        contactOption="chat"
                        title={contactOptions.chatTitle}
                        content={contactOptions.chatContent}
                        onClick={(event) => {
                          event.preventDefault();
                          openChatbot();
                        }}
                      />
                      <ContactOption
                        contactOption="write"
                        title={contactOptions.writeTitle}
                        content={contactOptions.writeContent}
                        href={contactOptions.writeURL}
                      />

                      <ContactOption
                        contactOption="call"
                        title={contactOptions.callTitle}
                        content={contactOptions.callContent}
                        href={contactOptions.callURL}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
