export const appUrls = {
  nav404: "https://www.nav.no/404",
  dagpengerSoknad: "https://www.nav.no/arbeid/dagpenger/soknad-veileder",
  produktsideProductionUrl: (anchorId: string) => `https://www.nav.no/dagpenger#${anchorId}`,
  produktsidePublicUrl: (href: string) => `${process.env.APP_ORIGIN_URL}${href}`,
};
