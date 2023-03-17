import {
  Components as DekoratorComponents,
  Env,
  Locale,
  fetchDecoratorReact,
  Props as DekoratorProps,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import { PrototypeBanner } from "components/prototype-banner/PrototypeBanner";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

const decoratorEnv = (process.env.DECORATOR_ENV || "prod") as Exclude<Env, "localhost">;
const supportedLocales = ["nb", "en"];
const availableLanguages = supportedLocales.map((locale) => ({
  locale,
  url: `https://www.nav.no/dagpenger/${locale}`,
  handleInApp: true,
})) as DekoratorProps["availableLanguages"];

const dekoratorParams: DekoratorProps = {
  availableLanguages,
  breadcrumbs: [{ title: "Dagpenger", url: "https://www.nav.no/arbeid/" }],
  context: "privatperson",
  env: decoratorEnv,
  utilsBackground: "white",
};

export default class MyDocument extends Document<{ Dekorator: DekoratorComponents }> {
  static async getInitialProps(ctx: DocumentContext) {
    const { locale } = ctx;
    const initialProps = await Document.getInitialProps(ctx);
    const language = locale === undefined ? "nb" : (locale as Locale);

    const Dekorator: DekoratorComponents = await fetchDecoratorReact({ ...dekoratorParams, language }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      const empty = () => <></>;
      return {
        Footer: empty,
        Header: empty,
        Scripts: empty,
        Styles: empty,
      };
    });

    return {
      ...initialProps,
      Dekorator,
      locale: language,
    };
  }

  render() {
    const { Dekorator, locale } = this.props;

    return (
      <Html lang={locale}>
        <Head />

        <Dekorator.Styles />
        <Dekorator.Scripts />
        <body>
          {/* TODO: Legg til condition for banner når den prodsettes */}
          {/* TODO: Utforsk rendring av banner med createPortal */}
          <PrototypeBanner />
          <Dekorator.Header />
          <Main />
          <Dekorator.Footer />
          <NextScript />
        </body>
      </Html>
    );
  }
}
