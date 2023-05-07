import {
  DecoratorComponents,
  DecoratorEnvProps,
  DecoratorLocale,
  DecoratorParams,
  fetchDecoratorReact,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import * as Sentry from "@sentry/browser";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

const decoratorEnv = (process.env.DECORATOR_ENV || "prod") as Exclude<DecoratorEnvProps["env"], "localhost">;

const defaultLocale = "nb";
const supportedLocales = [defaultLocale];
const availableLanguages = supportedLocales.map((locale) => ({
  locale,
  url: `https://www.nav.no/dagpenger/${locale}`,
  handleInApp: true,
})) as DecoratorParams["availableLanguages"];

const decoratorParams: DecoratorParams = {
  availableLanguages,
  breadcrumbs: [{ title: "Dagpenger", url: "https://www.nav.no/dagpenger/" }],
  context: "privatperson",
  utilsBackground: "white",
  urlLookupTable: false,
};

export default class MyDocument extends Document<{ Decorator: DecoratorComponents }> {
  static async getInitialProps(ctx: DocumentContext) {
    const { locale } = ctx;
    const initialProps = await Document.getInitialProps(ctx);
    const language = locale === undefined ? defaultLocale : (locale as DecoratorLocale);

    Sentry.setContext("culture", { locale: language });

    const Decorator: DecoratorComponents = await fetchDecoratorReact({
      env: decoratorEnv,
      params: { ...decoratorParams, language },
    }).catch((err) => {
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
      Decorator,
      locale: language,
    };
  }

  render() {
    const { Decorator, locale } = this.props;

    return (
      <Html lang={locale}>
        <Head>
          <Decorator.Styles />
        </Head>

        <body>
          {/* TODO: Legg til condition for banner når den prodsettes */}
          {/* TODO: Utforsk rendring av banner med createPortal */}
          {/* {process.env.ENABLE_PROTOTYPE_BANNER && <PrototypeBanner />} */}
          <Decorator.Header />
          <Main />
          <Decorator.Footer />
          <Decorator.Scripts />
          <NextScript />
        </body>
      </Html>
    );
  }
}
