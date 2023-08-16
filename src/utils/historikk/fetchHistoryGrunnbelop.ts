import { GrunnbelopData } from "components/grunnbelop-context/grunnbelop-context";

export async function fetchHistoryGrunnbelop(timestamp?: string) {
  const grunnbelopResponse = await fetch(`https://g.nav.no/api/v1/grunnbeloep?dato=${timestamp}`);
  const grunnbelopData: GrunnbelopData = await grunnbelopResponse.json();
  return grunnbelopData;
}
