import { PortableTextTypeComponent } from "@portabletext/react";
import { AccordionWithRichText } from "components/accordion-with-rich-text/AccordionWithRichText";
import { Alert } from "components/alert/Alert";
import { MicroCards } from "components/card/MicroCard";
import { DagpengerKalkulator } from "components/dagpenger-kalkulator/DagpengerKalkulator";
import { LinkButton } from "components/link-button/LinkButton";
import { ReadMoreWithRichText } from "components/readmore-with-rich-text/ReadMoreWithRichText";
import { PortableTextContent } from "./PortableTextContent";

export const commonComponents: Record<string, PortableTextTypeComponent<any> | undefined> | undefined = {
  produktsideAccordionWithRichText: AccordionWithRichText,
  produktsideAlert: Alert,
  produktsideButton: LinkButton,
  produktsideCalculator: DagpengerKalkulator,
  produktsideMicroCards: ({ value }) => <MicroCards title={value.title} cardList={value.cardList} />,
  produktsideReadMoreWithRichText: ({ value }) => (
    <ReadMoreWithRichText header={value.title} size={value.size} _key={value._key}>
      <PortableTextContent value={value.content} />
    </ReadMoreWithRichText>
  ),
};
