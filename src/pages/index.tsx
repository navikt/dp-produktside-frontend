import { Heading, Panel } from "@navikt/ds-react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "components/header/Header";
import { LeftMenuSection } from "components/layout/left-menu-section/LeftMenuSection";
import PortableTextContent from "components/portable-text-content/PortableTextContent";
import { sanityClient } from "sanity/client";
import { produktsideQuery } from "sanity/groq/produktside/produktsideQuery";
import styles from "styles/Home.module.scss";
import createHashLinkIdFromString from "utils/createHashLinkIdFromString";

export async function getStaticProps() {
  // TODO: errorhåndtering hvis man ikke greier å hente produktside
  const response = await sanityClient.fetch(produktsideQuery);

  return {
    props: {
      sanityData: response,
    },
  };
}

const Home: NextPage = ({ sanityData }: any) => {
  const {
    innholdsseksjoner,
    oppsett: { title, kortFortalt },
  } = sanityData;

  const kortFortaltLink = {
    anchorId: "kort-fortalt",
    linkText: "Kort fortalt",
  };

  const links = innholdsseksjoner.map((item) => ({
    anchorId: createHashLinkIdFromString(item.title),
    linkText: item.title,
  }));

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.productPage}>
          <Header />

          <div className={styles.content}>
            <div className={styles.layoutContainer}>
              <LeftMenuSection menuHeader={title} internalLinks={[kortFortaltLink, ...links]} sticky />

              <div className={styles.mainContent}>
                <section id={createHashLinkIdFromString(kortFortaltLink.linkText)}>
                  <Panel>
                    <Heading spacing level="2" size="large">
                      Kort fortalt
                    </Heading>
                    {/* bør styles til bodylong*/}
                    <PortableTextContent value={kortFortalt} />
                  </Panel>
                </section>

                {/* @ts-ignore */}
                {innholdsseksjoner?.map(({ title, innhold }, index) => (
                  <section key={index} id={createHashLinkIdFromString(title)}>
                    <Panel>
                      <Heading spacing level="2" size="large">
                        {title}
                      </Heading>
                      {/* bør styles til bodylong*/}
                      <PortableTextContent value={innhold} />
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
