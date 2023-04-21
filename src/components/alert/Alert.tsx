import { Alert as DsAlert } from "@navikt/ds-react";
import { PortableTextTypeComponentProps } from "@portabletext/react";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";

export function Alert({ value }: PortableTextTypeComponentProps<any>) {
  return (
    <DsAlert fullWidth={value.fullWidth} inline={value.inline} size={value.size} variant={value.variant}>
      <PortableTextContent value={value.content} />
    </DsAlert>
  );
}
