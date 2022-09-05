export function useGrunnbellop() {
  const hardCodedG = 100000;

  return {
    GtoNOK: (g: number) => Math.round(g * hardCodedG).toLocaleString("no-NO"),
    G: hardCodedG,
  };
}

export function toKR(kr: number) {
  return Math.round(kr).toLocaleString("nb-NO") + " kr";
}
