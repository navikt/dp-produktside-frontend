import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { setDefaultOptions } from "date-fns";
import { nb, enGB } from "date-fns/locale";
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
    // Sets locale for all date-fns functions located in utils/dates
    Cookies.set("NEXT_LOCALE", locale, { path: router.basePath, expires: 30 });
    router.push(router.asPath, router.asPath, { locale });
  });

  useEffect(() => {
    console.log(router.locale);
    setDefaultOptions({ locale: router.locale === "en" ? enGB : nb });
  }, [router.locale]);

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
