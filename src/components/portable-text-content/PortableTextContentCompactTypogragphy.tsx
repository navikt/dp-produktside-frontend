import { PortableText, PortableTextProps } from "@portabletext/react";
import { commonBlockStyles } from "./styles";
import { commonMarks } from "./marks/marks";
import { commonComponents } from "./components";
import { BodyLong } from "@navikt/ds-react";
import styles from "./PortableTextContent.module.scss";

export function PortableTextContentCompactTypogragphy({ value }: PortableTextProps) {
  const { normal, ...restCommonBlockStyles } = commonBlockStyles;

  return (
    <PortableText
      value={value}
      components={{
        block: {
          normal: ({ children }) => <BodyLong className={styles.typography__normalCompact}>{children}</BodyLong>,
          ...restCommonBlockStyles,
        },
        marks: commonMarks,
        types: {
          ...commonComponents,
        },
      }}
    />
  );
}
