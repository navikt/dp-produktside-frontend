export function toKR(kr: number, locale?: string) {
  if (locale === "en") {
    return Math.round(kr).toLocaleString("nb-NO") + " NOK";
  }

  return Math.round(kr).toLocaleString("nb-NO") + " kr";
}
