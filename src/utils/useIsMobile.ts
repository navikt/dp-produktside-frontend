import { useEffect, useState } from "react";
import { vars } from "utils/variables";
import { windowMatchMedia } from "./match-media";

const mobileWidthBreakpoint = vars.mobileBreakpointPx;
const mqlWidthBreakpoint = windowMatchMedia(`(min-width: ${mobileWidthBreakpoint}px)`);

export function useIsMobile() {
  // This is used for positioning elements specifically for desktop or mobile
  // We use both a CSS and javascript matchmedia solution, to avoid visible layout-shifts
  // on client-side hydration, and to avoid duplicating elements in the DOM on the client
  // (prevents issues such as duplicate ids)
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const updateLayout = () => {
      setIsMobile(window.innerWidth < mobileWidthBreakpoint);
    };

    updateLayout();

    mqlWidthBreakpoint.addEventListener("change", updateLayout);
    return () => {
      mqlWidthBreakpoint.removeEventListener("change", updateLayout);
    };
  }, []);

  return isMobile;
}
