import { ReadMore } from "@navikt/ds-react";
import { PortableText, PortableTextTypeComponentProps } from "@portabletext/react";
import { useState } from "react";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";
import styles from "./ReadMoreWithRichText.module.scss";

export function ReadMoreWithRichText({ value }: PortableTextTypeComponentProps<any>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ReadMore
      onClick={() => {
        logAmplitudeEvent(isOpen ? AnalyticsEvents.ACC_COLLAPSE : AnalyticsEvents.ACC_EXPAND, {
          _key: value._key,
          tekst: value.title,
          komponent: "ReadMore",
        });
        setIsOpen((prevIsOpen) => !prevIsOpen);
      }}
      open={isOpen}
      className={styles.readMore}
      header={value.title}
      size={value.size}
    >
      <PortableText value={value.content} />
    </ReadMore>
  );
}
