import { BodyLong } from "@navikt/ds-react";
import { PortableText, PortableTextProps } from "@portabletext/react";
import styles from "./PortableTextContent.module.scss";
import { UnknownComponentType } from "./UnknownComponentType";
import { commonComponents } from "./components";
import { commonMarks } from "./marks/marks";
import { commonBlockStyles } from "./styles";

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
        unknownType: UnknownComponentType,
      }}
    />
  );
}
