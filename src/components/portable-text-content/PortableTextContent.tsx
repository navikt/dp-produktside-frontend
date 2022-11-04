import { Accordion, BodyLong, Heading, ReadMore } from "@navikt/ds-react";
import { PortableText, PortableTextProps } from "@portabletext/react";
import { DagpengerKalkulator } from "components/dagpenger-kalkulator/DagpengerKalkulator";
import { GtoNOK } from "./marks/GtoNOK";
import styles from "./PortableTextContent.module.scss";

export function PortableTextContent({ value }: PortableTextProps) {
  return (
    <PortableText
      value={value || []}
      components={{
        block: {
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
        },
        marks: { GtoNOK: GtoNOK },
        types: {
          customComponent: DagpengerKalkulator,
          produktsideAccordion: ({ value }) => (
            <Accordion.Item>
              <Accordion.Header>{value.title}</Accordion.Header>
              <Accordion.Content className={styles.whiteSpacePreline}>{value.content}</Accordion.Content>
            </Accordion.Item>
          ),
          produktsideReadMore: ({ value }) => (
            <ReadMore className={styles.whiteSpacePreline} header={value.title} size={value.size}>
              {value.content}
            </ReadMore>
          ),
        },
      }}
    />
  );
}
