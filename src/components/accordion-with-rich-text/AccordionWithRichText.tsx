import { Accordion } from "@navikt/ds-react";
import { PortableTextTypeComponentProps } from "@portabletext/react";
import { useState } from "react";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";
import styles from "./AccordionWithRichText.module.scss";

export function AccordionWithRichText({ value }: PortableTextTypeComponentProps<any>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Accordion.Item open={isOpen}>
      <Accordion.Header
        onClick={() => {
          logAmplitudeEvent(isOpen ? AnalyticsEvents.ACC_COLLAPSE : AnalyticsEvents.ACC_EXPAND, {
            _key: value._key,
            tekst: value.title,
            komponent: "Accordion",
          });
          setIsOpen((prevIsOpen) => !prevIsOpen);
        }}
      >
        {value.title}
      </Accordion.Header>
      <Accordion.Content className={styles.accordionContent}>
        <PortableTextContent value={value.content} />
      </Accordion.Content>
    </Accordion.Item>
  );
}
