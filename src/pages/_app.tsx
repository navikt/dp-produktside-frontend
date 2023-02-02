import Cookies from "js-cookie";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { setDefaultOptions } from "date-fns";
import nb from "date-fns/locale/nb";
import en from "date-fns/locale/en-GB";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import { onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
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

  onLanguageSelect(({ locale }) => {
    Cookies.set("NEXT_LOCALE", locale, { path: router.basePath, expires: 30 });
    // Sets locale for all date-fns functions located in utils/dates
    setDefaultOptions({ locale: locale === "en" ? en : nb });
    router.push(router.asPath, router.asPath, { locale });
  });

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
