import { useGrunnbelop } from "../../grunnbelop-context/grunnbelop-context";

// @ts-ignore
export function GtoNOK({ children }) {
  const { GtoNOK } = useGrunnbelop();
  return <>{GtoNOK(children)}</>;
}
