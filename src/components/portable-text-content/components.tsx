import { Accordion, ReadMore } from "@navikt/ds-react";
import { PortableTextTypeComponent } from "@portabletext/react";
import { DagpengerKalkulator } from "components/dagpenger-kalkulator/DagpengerKalkulator";
import styles from "./PortableTextContent.module.scss";

export const commonComponents: Record<string, PortableTextTypeComponent<any> | undefined> | undefined = {
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
  customComponent: DagpengerKalkulator,
};
