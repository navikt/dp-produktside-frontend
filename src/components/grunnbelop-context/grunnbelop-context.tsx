import { createContext, ReactNode, useContext } from "react";

//todo: hvordan håndterer vi hvis vi ikke har grunnbelopdata?
export interface GrunnbelopData {
  dato: string;
  gjennomsnittPerAar: number;
  grunnbeloep: number;
  grunnbeloepPerMaaned: number;
  omregningsfaktor: number;
  virkningstidspunktForMinsteinntekt: string;
}

interface GrunnbelopProviderProps {
  grunnbeloep: number;
  children: ReactNode;
}

interface GrunnbelopContextValues {
  G: number;
  GtoNOK: (g: number) => string;
}

const GrunnbelopContext = createContext<GrunnbelopContextValues | undefined>(undefined);

export function GrunnbelopProvider({ grunnbeloep, children }: GrunnbelopProviderProps) {
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context

  return (
    <GrunnbelopContext.Provider
      value={{
        G: grunnbeloep,
        GtoNOK: (g: number) =>
          isNaN(g)
            ? "Her skulle det vært et kronebeløp oversatt fra grunnbeløp, men vi greide ikke å lese tallet "
            : Math.round(g * grunnbeloep).toLocaleString("no-NO") + " kr",
      }}
    >
      {children}
    </GrunnbelopContext.Provider>
  );
}

export function useGrunnbelopContext() {
  const context = useContext(GrunnbelopContext);
  if (context === undefined) {
    throw new Error("useGrunnbelopContext must be used within a GrunnbelopContext");
  }
  return context;
}
