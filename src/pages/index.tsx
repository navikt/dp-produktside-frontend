import Head from "next/head";
import { sanityClient } from "sanity/client";
import { produktsideQuery } from "sanity/groq/produktside/produktsideQuery";
import { Header } from "components/header/Header";
import { LeftMenuSection } from "components/layout/left-menu-section/LeftMenuSection";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { GrunnbelopData } from "components/grunnbelop-context/grunnbelop-context";
import styles from "styles/Home.module.scss";
import { useIsMobile } from "utils/useIsMobile";
import { useSanityContext } from "components/sanity-context/sanity-context";
import { SectionWithHeader } from "components/section-with-header/SectionWithHeader";

export async function getStaticProps() {
  // TODO: errorhåndtering hvis man ikke greier å hente produktside
  const sanityData = await sanityClient.fetch(produktsideQuery);
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
    settings: { title, content, supportLinks },
    kortFortalt,
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

  const KortFortaltComponent = () => (
    <SectionWithHeader title={kortFortaltLink.linkText} anchorId={kortFortaltLink.anchorId}>
      {/* bør styles til bodylong*/}
      <PortableTextContent value={kortFortalt?.content} />
    </SectionWithHeader>
  );

  return (
    <div className={styles.rootContainer}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.productPage}>
          <Header />

          <div className={styles.content}>
            <div className={styles.layoutContainer}>
              <div className={styles.topRow}>
                <div className={styles.leftCol}>
                  {isMobile && <KortFortaltComponent />}
                  <LeftMenuSection
                    menuHeader="Innhold"
                    internalLinks={[kortFortaltLink, ...links]}
                    supportLinks={supportLinks}
                    sticky={!isMobile}
                  />
                </div>

                <div className={styles.mainCol}>
                  {!isMobile && <KortFortaltComponent />}

                  {/* @ts-ignore */}
                  {content?.map(({ title, content, slug, iconName }, index) => (
                    <SectionWithHeader key={index} title={title} anchorId={slug?.current} iconName={iconName}>
                      {/* bør styles til bodylong*/}
                      <PortableTextContent value={content} />
                    </SectionWithHeader>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
