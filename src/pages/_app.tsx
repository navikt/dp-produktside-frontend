import "@navikt/ds-css";
import type { AppProps } from "next/app";
import ErrorBoundary from "../components/error-boundary/ErrorBoundary";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />;
    </ErrorBoundary>
  );
}

export default MyApp;
