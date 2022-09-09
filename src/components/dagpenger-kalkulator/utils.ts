import { useGrunnbelop } from "components/grunnbelop-context/grunnbelop-context";

export function useKalkulatorGrunnbelop() {
  const { grunnbeloep } = useGrunnbelop();

  return {
    GtoNOK: (g: number) => Math.round(g * grunnbeloep).toLocaleString("no-NO"),
    G: grunnbeloep,
  };
}

export function toKR(kr: number) {
  return Math.round(kr).toLocaleString("nb-NO") + " kr";
}
