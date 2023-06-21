import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { setDefaultOptions } from "date-fns";
import nb from "date-fns/locale/nb";
import { useEffect } from "react";
import "@navikt/ds-css";
import "components/prototype-banner/PrototypeBanner.css";
import ErrorBoundary from "components/error-boundary/ErrorBoundary";
import { FilterContextProvider } from "components/filter-menu/FilterContext";
import { GrunnbelopProvider } from "components/grunnbelop-context/grunnbelop-context";
import { SanityProvider } from "components/sanity-context/sanity-context";
import { PreviewBanner } from "components/preview-context/PreviewBanner";
import { PreviewContextProvider } from "components/preview-context/previewContext";
import "styles/global.scss";
import "styles/common.scss";

// TODO: Fix typescript for this
interface PageProps {
  sanityData?: any;
  grunnbelopData?: any;
}

export default function MyApp({ Component, pageProps }: AppProps<PageProps>) {
  const router = useRouter();

  useEffect(() => {
    // Sets locale for all date-fns functions located in utils/dates
    setDefaultOptions({ locale: nb });
  }, []);

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
