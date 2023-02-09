import { BodyLong, Heading } from "@navikt/ds-react";
import { PortableTextBlockComponent } from "@portabletext/react";
import styles from "./PortableTextContent.module.scss";

export const commonBlockStyles:
  | PortableTextBlockComponent
  | Record<string, PortableTextBlockComponent | undefined>
  | undefined = {
  normal: ({ children }) => <BodyLong spacing>{children}</BodyLong>,
  h3: ({ children }) => (
    <Heading level="3" size="medium" spacing>
      {children}
    </Heading>
  ),
  h4: ({ children }) => (
    <Heading level="4" size="small" spacing>
      {children}
    </Heading>
  ),
  h5: ({ children }) => (
    <Heading level="5" size="xsmall" spacing>
      {children}
    </Heading>
  ),
  h6: ({ children }) => (
    <Heading level="6" size="xsmall" spacing>
      {children}
    </Heading>
  ),
  m1: ({ children }) => <BodyLong className={styles.typography__normalM1}>{children}</BodyLong>,
};
