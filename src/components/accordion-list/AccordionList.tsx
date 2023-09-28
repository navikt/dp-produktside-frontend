import { Accordion } from "@navikt/ds-react";
import { PortableTextTypeComponentProps } from "@portabletext/react";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";

export function AccordionList({ value }: PortableTextTypeComponentProps<any>) {
  return (
    <Accordion>
      <PortableTextContent value={value.content} />
    </Accordion>
  );
}
