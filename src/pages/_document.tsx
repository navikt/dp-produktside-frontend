import {
  Components as DekoratorComponents,
  Env,
  fetchDecoratorReact,
  Props as DekoratorProps,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

const decoratorEnv = (process.env.DECORATOR_ENV || "prod") as Exclude<Env, "localhost">;

const dekoratorParams: DekoratorProps = {
  env: decoratorEnv,
  breadcrumbs: [{ title: "Dagpenger", url: "https://www.nav.no/arbeid/" }],
  context: "privatperson",
  utilsBackground: "white",
};

export default class MyDocument extends Document<{ Dekorator: DekoratorComponents }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    const Dekorator: DekoratorComponents = await fetchDecoratorReact(dekoratorParams).catch((err) => {
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
    };
  }

  render() {
    const { Dekorator } = this.props;

    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex,nofollow" />
        </Head>
        <Dekorator.Styles />
        <Dekorator.Scripts />
        <body>
          <Dekorator.Header />
          <Main />
          <Dekorator.Footer />
          <NextScript />
        </body>
      </Html>
    );
  }
}
