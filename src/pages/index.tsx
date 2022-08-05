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
// https://github.com/sanity-io/block-content-to-react/issues/26
// @ts-ignore
import SanityBlockContent from "@sanity/block-content-to-react";

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
  const { title: tittel, kortFortalt, innhold } = sanityData?.produktside[0];

  return (
    <div className={styles.container}>
      <Head>
        <title>{tittel}</title>
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
                  title={tittel}
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
                    <SanityBlockContent blocks={kortFortalt}></SanityBlockContent>
                  </Panel>
                </section>

                <section>
                  <Panel>
                    <Heading spacing level="2" size="large">
                      Søk dagpenger
                    </Heading>
                    <BodyLong>
                      Du kan søke om det du trenger økonomisk støtte til. Det er bare ett søknadsskjema, og du beskriver
                      selv hva du vil søke om. NAV-kontoret vil gjøre en konkret og individuell vurdering av din søknad.
                      Har du sendt en søknad og ønsker å sende dokumentasjon, kan du gjøre dette under dine søknader.
                    </BodyLong>
                  </Panel>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
