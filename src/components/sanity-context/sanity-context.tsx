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
  calculatorTexts: any;
  getCalculatorTextWithTextId: (id: string, convertToPlainText?: boolean) => any;
}

const SanityContext = createContext<SanityContextValues | undefined>(undefined);

export function SanityProvider({ sanityData, children }: SanityProviderProps) {
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const previewData = useSanityPreview(sanityData, produktsideQuery);

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

  function getCalculatorTextWithTextId(id: string, convertToPlainText: boolean = true) {
    const calculatorTextId = `kalkulator.${id}`;
    // @ts-ignore
    const element = context?.calculatorTexts.find(({ textId }) => textId === calculatorTextId);

    if (!element) {
      // TODO: Log missing text error with Sentry
      console.error(`Error, calculatorText with ${calculatorTextId} couldn't be found `);
      return calculatorTextId;
    }

    return convertToPlainText ? element.plainText : element.valueBlock;
  }

  return { ...context, getCalculatorTextWithTextId };
}
