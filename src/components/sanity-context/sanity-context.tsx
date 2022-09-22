import { createContext, ReactNode, useContext } from "react";
import { produktsideQuery } from "sanity/groq/produktside/produktsideQuery";
import { useSanityPreview } from "sanity/useSanityPreview";

interface SanityProviderProps {
  sanityData: any;
  children: ReactNode;
}

interface SanityContextValues {
  settings: any;
  kortFortalt: any;
  calculatorTexts: any;
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

export function useSanityData() {
  const context = useContext(SanityContext);
  if (context === undefined) {
    throw new Error("useSanity must be used within a SanityContext");
  }
  return context;
}
