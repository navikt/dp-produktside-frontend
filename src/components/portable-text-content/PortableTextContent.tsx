import { PortableText, PortableTextProps } from "@portabletext/react";
import { DagpengerKalkulator } from "components/dagpenger-kalkulator/DagpengerKalkulator";

export default function PortableTextContent({ value }: PortableTextProps) {
  return (
    <PortableText
      value={value}
      components={{
        types: {
          customComponent: DagpengerKalkulator,
        },
      }}
    />
  );
}
