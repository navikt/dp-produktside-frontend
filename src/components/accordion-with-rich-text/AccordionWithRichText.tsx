import { Accordion, BodyLong } from "@navikt/ds-react";
import { PortableText, PortableTextTypeComponentProps } from "@portabletext/react";
import { useState } from "react";
import { commonComponents } from "components/portable-text-content/components";
import { commonMarks } from "components/portable-text-content/marks/marks";
import { commonBlockStyles } from "components/portable-text-content/styles";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";
import styles from "./AccordionWithRichText.module.scss";

export function AccordionWithRichText({ value }: PortableTextTypeComponentProps<any>) {
  const [isOpen, setIsOpen] = useState(false);

  const { normal, ...restCommonBlockStyles } = commonBlockStyles;

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
        <PortableText
          value={value.content}
          components={{
            block: {
              normal: ({ children }) => <BodyLong className={styles.typography__normal}>{children}</BodyLong>,
              ...restCommonBlockStyles,
            },
            marks: commonMarks,
            types: {
              ...commonComponents,
            },
          }}
        />
      </Accordion.Content>
    </Accordion.Item>
  );
}
