import { ReadMore } from "@navikt/ds-react";
import { ReactNode, useState } from "react";
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
