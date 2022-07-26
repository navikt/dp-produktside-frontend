import { Components as DekoratorComponents, fetchDecoratorReact, Props as DekoratorProps } from "@navikt/nav-dekoratoren-moduler/ssr";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document<{ Dekorator: DekoratorComponents }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    const dekoratorParams: DekoratorProps = {
      // @ts-ignore
      env: process.env.DEKORATOR_MILJO || "prod",
      context: "privatperson",
    };

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
        <Head /> {/* Head må først inn, så kan neste blokk inserte elementer */}
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
