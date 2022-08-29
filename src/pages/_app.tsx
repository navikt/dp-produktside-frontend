import "@navikt/ds-css";
import type { AppProps } from "next/app";
import { PreviewBanner } from "components/preview-context/PreviewBanner";
import { PreviewContextProvider } from "components/preview-context/previewContext";
import ErrorBoundary from "components/error-boundary/ErrorBoundary";
import "styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <PreviewContextProvider>
        <PreviewBanner />
        <Component {...pageProps} />;
      </PreviewContextProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
