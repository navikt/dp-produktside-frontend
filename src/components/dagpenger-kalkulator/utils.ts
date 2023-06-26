export function toKR(kr: number, locale?: string) {
  if (locale === "en") {
    return "NOK " + Math.round(kr).toLocaleString("nb-NO");
  }

  return Math.round(kr).toLocaleString("nb-NO") + " kr";
}
