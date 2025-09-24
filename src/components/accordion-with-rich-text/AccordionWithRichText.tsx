import { Accordion } from "@navikt/ds-react";
import { PortableTextTypeComponentProps } from "@portabletext/react";
import { useState } from "react";
import { PortableTextContentCompactTypogragphy } from "components/portable-text-content/PortableTextContentCompactTypogragphy";
import { commonBlockStyles } from "components/portable-text-content/styles";
import styles from "./AccordionWithRichText.module.scss";

export function AccordionWithRichText({ value }: PortableTextTypeComponentProps<any>) {
  const [isOpen, setIsOpen] = useState(false);

  const { normal, ...restCommonBlockStyles } = commonBlockStyles;

  return (
    <Accordion.Item open={isOpen}>
      <Accordion.Header
        onClick={() => {
          setIsOpen((prevIsOpen) => !prevIsOpen);
        }}
      >
        {value.title}
      </Accordion.Header>
      <Accordion.Content className={styles.accordionContent}>
        <PortableTextContentCompactTypogragphy value={value.content} />
      </Accordion.Content>
    </Accordion.Item>
  );
}
