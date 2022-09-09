import { createContext, ReactNode, useContext } from "react";

interface GrunnbelopData {
  dato: string;
  gjennomsnittPerAar: number;
  grunnbeloep: number;
  grunnbeloepPerMaaned: number;
  omregningsfaktor: number;
  virkningstidspunktForMinsteinntekt: string;
}

interface GrunnbelopProviderProps {
  value: GrunnbelopData;
  children: ReactNode;
}

const GrunnbelopContext = createContext<GrunnbelopData | undefined>(undefined);

function GrunnbelopProvider({ value, children }: GrunnbelopProviderProps) {
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  return <GrunnbelopContext.Provider value={value}>{children}</GrunnbelopContext.Provider>;
}

function useGrunnbelop() {
  const context = useContext(GrunnbelopContext);
  if (context === undefined) {
    throw new Error("useGrunnbelop must be used within a GrunnbelopContext");
  }
  return context;
}

export { GrunnbelopProvider, useGrunnbelop };
