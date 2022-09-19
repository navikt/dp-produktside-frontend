import { PortableText, PortableTextProps } from "@portabletext/react";
import { DagpengerKalkulator } from "components/dagpenger-kalkulator/DagpengerKalkulator";
import { GtoNOK } from "./marks/GtoNOK";

export default function PortableTextContent({ value }: PortableTextProps) {
  // @ts-ignore
  return (
    <PortableText
      value={value}
      components={{
        marks: { GtoNOK: GtoNOK },
        types: {
          customComponent: DagpengerKalkulator,
        },
      }}
    />
  );
}
