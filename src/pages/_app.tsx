import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { setDefaultOptions } from "date-fns";
import { nb, enGB } from "date-fns/locale";
import "@navikt/ds-css";
import "components/prototype-banner/PrototypeBanner.css";
import ErrorBoundary from "components/error-boundary/ErrorBoundary";
import { FilterContextProvider } from "contexts/filter-context/FilterContext";
import { GrunnbelopProvider } from "contexts/grunnbelop-context/GrunnbelopContext";
import { SanityProvider } from "contexts/sanity-context/SanityContext";
import { PreviewBanner } from "contexts/preview-context/PreviewBanner";
import { PreviewContextProvider } from "contexts/preview-context/PreviewContext";
import "styles/global.scss";
import "styles/common.scss";
import { onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import Cookies from "js-cookie";
import { useEffect } from "react";

// TODO: Fix typescript for this
interface PageProps {
  sanityData?: any;
  grunnbelopData?: any;
}

export default function MyApp({ Component, pageProps }: AppProps<PageProps>) {
  const router = useRouter();

  onLanguageSelect(({ locale }) => {
    Cookies.set("NEXT_LOCALE", locale, { path: router.basePath, expires: 30 });
    router.push(router.asPath, router.asPath, { locale });
  });

  useEffect(() => {
    // Sets locale for all date-fns functions located in utils/dates
    setDefaultOptions({ locale: router.locale === "en" ? enGB : nb });
  }, [router.locale]);

  return (
    <ErrorBoundary>
      <PreviewContextProvider>
        <FilterContextProvider>
          <SanityProvider sanityData={pageProps.sanityData}>
            <GrunnbelopProvider grunnbeloep={pageProps.grunnbelopData?.grunnbeloep}>
              <PreviewBanner />
              <Component {...pageProps} />
            </GrunnbelopProvider>
          </SanityProvider>
        </FilterContextProvider>
      </PreviewContextProvider>
    </ErrorBoundary>
  );
}
