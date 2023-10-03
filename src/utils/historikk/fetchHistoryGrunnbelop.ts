import { GrunnbelopData } from "contexts/grunnbelop-context/GrunnbelopContext";

export async function fetchHistoryGrunnbelop(timestamp?: string) {
  const grunnbelopResponse = await fetch(`https://g.nav.no/api/v1/grunnbeloep?dato=${timestamp}`);
  const grunnbelopData: GrunnbelopData = await grunnbelopResponse.json();
  return grunnbelopData;
}
