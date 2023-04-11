import { PortableTextTypeComponent } from "@portabletext/react";
import { AccordionWithRichText } from "components/accordion-with-rich-text/AccordionWithRichText";
import { MicroCards } from "components/card/MicroCard";
import { DagpengerKalkulator } from "components/dagpenger-kalkulator/DagpengerKalkulator";
import { LinkButton } from "components/link-button/LinkButton";
import { ReadMoreWithRichText } from "components/readmore-with-rich-text/ReadMoreWithRichText";

export const commonComponents: Record<string, PortableTextTypeComponent<any> | undefined> | undefined = {
  produktsideAccordionWithRichText: AccordionWithRichText,
  produktsideButton: LinkButton,
  produktsideCalculator: DagpengerKalkulator,
  produktsideMicroCards: ({ value }) => <MicroCards title={value.title} cardList={value.cardList} />,
  produktsideReadMoreWithRichText: ReadMoreWithRichText,
};
