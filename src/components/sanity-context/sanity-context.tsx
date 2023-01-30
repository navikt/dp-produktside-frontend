import { useRouter } from "next/router";
import { createContext, ReactNode, useContext } from "react";
import { produktsideQuery } from "sanity-utils/groq/produktside/produktsideQuery";
import { useSanityPreview } from "sanity-utils/useSanityPreview";

// TODO: Fix any-types when Sanity is upgraded to V3.
interface SanityProviderProps {
  sanityData: any;
  children: ReactNode;
}

interface SanityContextValues {
  settings: any;
  kortFortalt: any;
  generalTexts: any;
  getGeneralText: (id: string) => string;
}

const SanityContext = createContext<SanityContextValues | undefined>(undefined);

export function SanityProvider({ sanityData, children }: SanityProviderProps) {
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const { locale } = useRouter();
  const previewData = useSanityPreview(sanityData, produktsideQuery, { baseLang: "nb", lang: locale });

  return (
    <SanityContext.Provider
      value={{
        ...previewData,
      }}
    >
      {children}
    </SanityContext.Provider>
  );
}

export function useSanityContext() {
  const context = useContext(SanityContext);
  if (context === undefined) {
    throw new Error("useSanityContext must be used within a SanityContext");
  }

  function getGeneralText(id: string) {
    // @ts-ignore
    const element = context?.generalTexts.find(({ textId }) => textId === id);

    if (!element?.textValue) {
      // TODO: Log missing text error with Sentry
      console.error(`Error, generalText with ${id} couldn't be found `);
      return id;
    }

    return element.textValue;
  }

  return { ...context, getGeneralText };
}
