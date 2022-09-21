const noMatchMediaSupportFallback = {
  addEventListener: (_: string, __: (e: any) => void) => null,
  removeEventListener: (_: string, __: (e: any) => void) => null,
};

export function windowMatchMedia(mediaQuery: string) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return noMatchMediaSupportFallback;
  }

  const mql = window.matchMedia(mediaQuery);

  return mql;
}
