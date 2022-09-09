import "@navikt/ds-css";
import type { AppProps } from "next/app";
import { PreviewBanner } from "components/preview-context/PreviewBanner";
import { PreviewContextProvider } from "components/preview-context/previewContext";
import { GrunnbelopProvider } from "components/grunnbelop-context/grunnbelop-context";
import ErrorBoundary from "components/error-boundary/ErrorBoundary";
import "styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <PreviewContextProvider>
        <GrunnbelopProvider grunnbeloep={pageProps.grunnbelopData?.grunnbeloep}>
          <PreviewBanner />
          <Component {...pageProps} />;
        </GrunnbelopProvider>
      </PreviewContextProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
