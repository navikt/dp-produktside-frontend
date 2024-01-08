import { PortableTextMarkComponentProps } from "@portabletext/react";
import { useGrunnbelopContext } from "contexts/grunnbelop-context/GrunnbelopContext";

export function Barnetilegg({ children }: PortableTextMarkComponentProps<any>) {
  const { Barnetilegg } = useGrunnbelopContext();
  return <>{Barnetilegg(children)}</>;
}
