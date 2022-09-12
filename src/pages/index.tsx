import { Heading, Panel } from "@navikt/ds-react";
import type { NextPage } from "next";
import Head from "next/head";
import { sanityClient } from "sanity/client";
import { produktsideQuery } from "sanity/groq/produktside/produktsideQuery";
import { Header } from "components/header/Header";
import { LeftMenuSection } from "components/layout/left-menu-section/LeftMenuSection";
import PortableTextContent from "components/portable-text-content/PortableTextContent";
import { GrunnbelopData } from "components/grunnbelop-context/grunnbelop-context";
import styles from "styles/Home.module.scss";
import { useIsMobile } from "utils/useIsMobile";
import { useSanityPreveiw } from "sanity/useSanityPreview";

export async function getStaticProps() {
  // TODO: errorhåndtering hvis man ikke greier å hente produktside
  const response = await sanityClient.fetch(produktsideQuery);
  const grunnbelopResponse = await fetch("https://g.nav.no/api/v1/grunnbeloep");
  const grunnbelopData: GrunnbelopData = await grunnbelopResponse.json();

  return {
    props: {
      sanityData: response,
      grunnbelopData: grunnbelopData,
    },
    revalidate: 120,
  };
}

const Home: NextPage = ({ sanityData }: any) => {
  const isMobile = useIsMobile();
  const productData = useSanityPreveiw(sanityData, produktsideQuery);

  const {
    settings: { title, content },
    kortFortalt,
  } = productData;

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
    <section id={kortFortaltLink.anchorId}>
      <Panel>
        <Heading spacing level="2" size="large">
          {kortFortalt?.title}
        </Heading>
        {/* bør styles til bodylong*/}
        <PortableTextContent value={kortFortalt?.content} />
      </Panel>
    </section>
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
              <div className={styles.leftCol}>
                {isMobile && <KortFortaltComponent />}
                <LeftMenuSection menuHeader={title} internalLinks={[kortFortaltLink, ...links]} sticky={!isMobile} />
              </div>

              <div className={styles.mainCol}>
                {!isMobile && <KortFortaltComponent />}

                {/* @ts-ignore */}
                {content?.map(({ title, content, slug }, index) => (
                  <section key={index} id={slug?.current}>
                    <Panel>
                      <Heading spacing level="2" size="large">
                        {title}
                      </Heading>
                      {/* bør styles til bodylong*/}
                      <PortableTextContent value={content} />
                    </Panel>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
