import { Accordion, ReadMore } from "@navikt/ds-react";
import { PortableText, PortableTextProps } from "@portabletext/react";
import { DagpengerKalkulator } from "components/dagpenger-kalkulator/DagpengerKalkulator";
import { GtoNOK } from "./marks/GtoNOK";
import styles from "./PortableTextContent.module.scss";

export function PortableTextContent({ value }: PortableTextProps) {
  return (
    <PortableText
      value={value}
      components={{
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
