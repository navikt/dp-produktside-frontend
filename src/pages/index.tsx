import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Header from "../components/header/Header";
import LeftMenu from "../components/left-menu/LeftMenu";
import React from "react";
import { BodyLong, Heading, Menu, Panel } from "@navikt/ds-react";
import { sanityClient } from "../sanity/client";
import { produktsideQuery } from "../sanity/groq/produktside/produktsideQuery";
import { PortableText } from "@portabletext/react";

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

  console.log(sanityData);
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.productPage}>
          <Header />

          <div></div>

          <div className={styles.content}>
            <div className={styles.layoutContainer}>
              <div>
                <LeftMenu
                  title={title}
                  links={[
                    {
                      anchorId: "kort-fortalt",
                      linkText: "Kort fortalt",
                    },
                    {
                      anchorId: "tekst",
                      linkText: "Tekst",
                    },
                  ]}
                />
              </div>

              <div className={styles.mainContent}>
                <section>
                  <Panel>
                    <Heading spacing level="2" size="large">
                      Kort fortalt
                    </Heading>
                    {/* bør styles til bodylong*/}
                    <PortableText value={kortFortalt} />
                  </Panel>
                </section>

                {/* @ts-ignore */}
                {innholdsseksjoner?.map(({ title, innhold }, index) => (
                  <section key={index}>
                    <Panel>
                      <Heading spacing level="2" size="large">
                        {title}
                      </Heading>
                      {/* bør styles til bodylong*/}
                      <PortableText value={innhold} />
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
