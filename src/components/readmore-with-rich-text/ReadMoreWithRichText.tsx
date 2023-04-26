import { ReadMore } from "@navikt/ds-react";
import { ReactNode, useState } from "react";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";
import styles from "./ReadMoreWithRichText.module.scss";

interface ReadMoreWithRichTextProps {
  _key: string;
  header: string;
  children: ReactNode;
  size?: "small" | "medium";
}

export function ReadMoreWithRichText({ _key, header, children, size = "medium" }: ReadMoreWithRichTextProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ReadMore
      onClick={() => {
        logAmplitudeEvent(isOpen ? AnalyticsEvents.ACC_COLLAPSE : AnalyticsEvents.ACC_EXPAND, {
          _key: _key,
          tekst: header,
          komponent: "ReadMore",
        });
        setIsOpen((prevIsOpen) => !prevIsOpen);
      }}
      open={isOpen}
      className={styles.readMore}
      header={header}
      size={size}
    >
      {children}
    </ReadMore>
  );
}
