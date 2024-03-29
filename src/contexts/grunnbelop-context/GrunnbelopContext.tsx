import { getBarneTillegg } from "components/dagpenger-kalkulator/utils";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

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
  gValue: number;
  GtoNOK: (g: any) => string;
  setGValue: Dispatch<SetStateAction<number>>;
  barnetilleggValue: number;
  Barnetilegg: (numberOf: any) => string;
  setBarnetilleggValue: Dispatch<SetStateAction<number>>;
}

const GrunnbelopContext = createContext<GrunnbelopContextValues | undefined>(undefined);

export function GrunnbelopProvider({ grunnbeloep, children }: GrunnbelopProviderProps) {
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const [gValue, setGValue] = useState(grunnbeloep);
  const [barnetilleggValue, setBarnetilleggValue] = useState(getBarneTillegg(new Date()));

  return (
    <GrunnbelopContext.Provider
      value={{
        gValue: gValue,
        setGValue: setGValue,
        GtoNOK: (g: any) =>
          isNaN(g)
            ? "Her skulle det vært et kronebeløp oversatt fra grunnbeløp, men vi greide ikke å lese tallet "
            : Math.round(g * gValue).toLocaleString("no-NO"),
        barnetilleggValue: barnetilleggValue,
        setBarnetilleggValue: setBarnetilleggValue,
        Barnetilegg: (numberOf: any) =>
          isNaN(numberOf)
            ? "Her skulle det vært antall barnetillegg beløp, men vi greide ikke å lese tallet "
            : Math.round(numberOf * barnetilleggValue).toLocaleString("no-NO"),
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
