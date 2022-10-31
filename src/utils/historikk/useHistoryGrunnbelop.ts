import { GrunnbelopData, useGrunnbelopContext } from "components/grunnbelop-context/grunnbelop-context";
import { useEffect } from "react";

export function useHistoryGrunnbelop(timestamp?: string) {
  const { setGValue } = useGrunnbelopContext();

  useEffect(() => {
    if (!timestamp) {
      return;
    }

    (async function () {
      const grunnbelopResponse = await fetch(`https://g.nav.no/api/v1/grunnbeloep?dato=${timestamp}`);
      const grunnbelopData: GrunnbelopData = await grunnbelopResponse.json();
      setGValue(grunnbelopData?.grunnbeloep);
    })();
  }, [timestamp, setGValue]);
}
