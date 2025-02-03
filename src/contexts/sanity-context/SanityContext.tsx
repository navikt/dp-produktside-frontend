import { TypedObject } from "@portabletext/types";
import { createContext, ReactNode, useContext } from "react";
import { CalculatorSchema } from "./types/calculator-schema-types";
import { HeaderSchema } from "./types/header-schema";
import { TopContentSchema } from "./types/top-content-schema";

// TODO: Fix any-types when Sanity is upgraded to V3.
interface SanityProviderProps {
  sanityData: any;
  children: ReactNode;
}

interface SanityContextValues {
  header: HeaderSchema;
  settings: any;
  kortFortalt: any;
  filterSection: any;
  generalTexts: any;
  calculatorPage: any;
  contactOptions: any;
  seo: any;
  topContent: TopContentSchema;
  calculator: CalculatorSchema;
  getCalculatorTextBlock: (id: string) => TypedObject | TypedObject[] | string;
  getGeneralText: (id: string) => string;
}

const SanityContext = createContext<SanityContextValues | undefined>(undefined);

export function SanityProvider({ sanityData, children }: SanityProviderProps) {
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  return (
    <SanityContext.Provider
      value={{
        ...sanityData,
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

  function getCalculatorTextBlock(id: string): any {
    const calculatorTextId = `calculator.${id}`;
    const element = context?.calculator?.texts?.find(({ textId }) => textId === calculatorTextId);

    if (!element?.textValue) {
      // TODO: Log missing text error with Sentry
      console.error(`Error, calculatorText with ${calculatorTextId} couldn't be found `);
      return calculatorTextId;
    }

    return element.textValue;
  }

  return { ...context, getGeneralText, getCalculatorTextBlock };
}
