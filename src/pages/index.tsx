import { GetStaticPropsContext } from "next";
import { max } from "date-fns";
import { Heading } from "@navikt/ds-react";
import { openChatbot } from "@navikt/nav-dekoratoren-moduler";
import { ContactOption } from "components/contact-option/ContactOption";
import { FilterSection } from "components/filter-section/FilterSection";
import { GrunnbelopData } from "components/grunnbelop-context/grunnbelop-context";
import { Header } from "components/header/Header";
import { KortFortaltSection } from "components/kort-fortalt-section/KortFortaltSection";
import { LeftMenuSection } from "components/layout/left-menu-section/LeftMenuSection";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { useSanityContext } from "components/sanity-context/sanity-context";
import { SectionWithHeader } from "components/section-with-header/SectionWithHeader";
import { PageMeta } from "components/PageMeta";
import { sanityClient } from "sanity-utils/client";
import { produktsideQuery } from "sanity-utils/groq/produktside/produktsideQuery";
import styles from "styles/Home.module.scss";
import { convertTimestampToDate, isValidDate } from "utils/dates";
import { useIsMobile } from "utils/useIsMobile";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  // TODO: errorhåndtering hvis man ikke greier å hente produktside
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

export default function Home() {
  const isMobile = useIsMobile();
  const sanityData = useSanityContext();

  const {
    settings: { title, content, supportLinks, _updatedAt },
    kortFortalt,
    contactOptions,
    seo,
  } = sanityData;

  const kortFortaltLink = {
    anchorId: kortFortalt?.slug?.current,
    linkText: kortFortalt?.title,
  };

  // @ts-ignore
  const links = content?.map(({ title, slug }) => ({
    anchorId: slug?.current,
    linkText: title,
  }));

  const lastUpdatedDates = [
    _updatedAt,
    kortFortalt?._updatedAt,
    //@ts-ignore
    ...(content?.map((section) => {
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

      <main className={styles.main}>
        <div className={styles.productPage}>
          <Header title={title} lastUpdated={lastUpdated} />

          <div className={styles.content}>
            <div className={styles.layoutContainer}>
              <div className={styles.topRow}>
                <div className={styles.leftCol}>
                  {isMobile && <KortFortaltSection />}
                  {isMobile && <FilterSection />}
                  <LeftMenuSection
                    internalLinks={[kortFortaltLink, ...links]}
                    supportLinks={supportLinks}
                    sticky={!isMobile}
                  />
                </div>

                <div className={styles.mainCol}>
                  {!isMobile && <KortFortaltSection />}
                  {!isMobile && <FilterSection />}

                  {/* @ts-ignore */}
                  {content?.map(({ title, content, slug, iconName }, index) => (
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
