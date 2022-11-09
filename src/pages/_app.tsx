import "@navikt/ds-css";
import type { AppProps } from "next/app";
import { PreviewBanner } from "components/preview-context/PreviewBanner";
import { PreviewContextProvider } from "components/preview-context/previewContext";
import { GrunnbelopProvider } from "components/grunnbelop-context/grunnbelop-context";
import ErrorBoundary from "components/error-boundary/ErrorBoundary";
import "styles/globals.scss";
import { SanityProvider } from "components/sanity-context/sanity-context";
import { FilterContextProvider } from "components/filter/FilterContext";

// TODO: Fix typescript for this
interface PageProps {
  sanityData?: any;
  grunnbelopData?: any;
}

function MyApp({ Component, pageProps }: AppProps<PageProps>) {
  return (
    <ErrorBoundary>
      <PreviewContextProvider>
        <FilterContextProvider>
          <SanityProvider sanityData={pageProps.sanityData}>
            <GrunnbelopProvider grunnbeloep={pageProps.grunnbelopData?.grunnbeloep}>
              <PreviewBanner />
              <Component {...pageProps} />;
            </GrunnbelopProvider>
          </SanityProvider>
        </FilterContextProvider>
      </PreviewContextProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
