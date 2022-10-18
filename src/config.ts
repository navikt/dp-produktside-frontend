const vars = {
  revalidatePeriod: 3600 * 24,
  pxPerRem: 16,
  mobileBreakpointPx: 768,
  dekoratorenHeight: 104,
};

const appUrls = {
  dagpengerSoknad: "https://www.nav.no/arbeid/dagpenger/soknad-veileder",
  produktsideAnchorUrl: (anchorId: string) => `https://www.nav.no/arbeid/dagpenger#${anchorId}`,
};

const basePath = "/dagpenger";

const Config = {
  appUrls,
  basePath,
  vars,
};

export default Config;
