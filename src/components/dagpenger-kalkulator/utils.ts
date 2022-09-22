export function toKR(kr: number) {
  return Math.round(kr).toLocaleString("nb-NO") + " kr";
}

export function getCalculatorTextFromList(list: any[]) {
  return function (id: string, convertToPlainText: boolean = true) {
    const element = list.find(({ textId }) => textId == `kalkulator.${id}`);

    if (!element) {
      return "Feil! Kunne ikke finne kalkulatortekst";
    }

    return convertToPlainText ? element?.plainText : element?.valueBlock;
  };
}
