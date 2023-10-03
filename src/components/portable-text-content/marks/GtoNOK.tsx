import { PortableTextMarkComponentProps } from "@portabletext/react";
import { useGrunnbelopContext } from "contexts/grunnbelop-context/GrunnbelopContext";

export function GtoNOK({ children }: PortableTextMarkComponentProps<any>) {
  const { GtoNOK } = useGrunnbelopContext();
  return <>{GtoNOK(children)}</>;
}
