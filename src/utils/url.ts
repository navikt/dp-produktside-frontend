interface ProductionURLOptions {
  anchorId: string;
  locale?: string;
}

export const appUrls = {
  produktsideProductionURL: ({ anchorId, locale = "nb" }: ProductionURLOptions) => {
    const localePart = locale !== "nb" ? `/${locale}` : "";
    return `https://www.nav.no/dagpenger${localePart}#${anchorId}`;
  },
};
