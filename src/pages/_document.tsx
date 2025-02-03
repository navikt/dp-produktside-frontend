import {
  DecoratorComponentsReact,
  DecoratorEnvProps,
  DecoratorLocale,
  DecoratorParams,
  fetchDecoratorReact,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import * as Sentry from "@sentry/browser";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

const decoratorEnv = (process.env.DECORATOR_ENV || "prod") as Exclude<DecoratorEnvProps["env"], "localhost">;

const defaultLocale = "nb";
const supportedLocales = [defaultLocale, "en"];
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
};

export default class MyDocument extends Document<{ decorator: DecoratorComponentsReact; locale: DecoratorLocale }> {
  static async getInitialProps(ctx: DocumentContext) {
    const { locale } = ctx;
    const initialProps = await Document.getInitialProps(ctx);
    const language = locale === undefined ? defaultLocale : (locale as DecoratorLocale);

    Sentry.setContext("culture", { locale: language });

    const decorator = await fetchDecoratorReact({
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
      decorator,
      locale: language,
    };
  }

  render() {
    const { HeadAssets, Scripts, Header, Footer } = this.props.decorator;

    return (
      <Html lang={this.props.locale}>
        <Head />
        <Scripts />
        <HeadAssets />
        <body>
          <Header />
          <Main />
          <Footer />
          <NextScript />
        </body>
      </Html>
    );
  }
}
