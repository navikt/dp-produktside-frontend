import { useGrunnbelopContext } from "../../grunnbelop-context/grunnbelop-context";

// @ts-ignore
export function GtoNOK({ children }) {
  const { GtoNOK } = useGrunnbelopContext();
  return <>{GtoNOK(children)}</>;
}
