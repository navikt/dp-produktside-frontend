import { Accordion, Button, ReadMore } from "@navikt/ds-react";
import { PortableText, PortableTextTypeComponent } from "@portabletext/react";
import { DagpengerKalkulator } from "components/dagpenger-kalkulator/DagpengerKalkulator";
import styles from "./PortableTextContent.module.scss";
import * as NavIcons from "@navikt/ds-icons";

export const commonComponents: Record<string, PortableTextTypeComponent<any> | undefined> | undefined = {
  produktsideAccordion: ({ value }) => (
    <Accordion.Item>
      <Accordion.Header>{value.title}</Accordion.Header>
      <Accordion.Content className={styles.whiteSpacePreline}>{value.content}</Accordion.Content>
    </Accordion.Item>
  ),
  produktsideAccordionWithRichText: ({ value }) => (
    <Accordion.Item>
      <Accordion.Header>{value.title}</Accordion.Header>
      <Accordion.Content className={styles.whiteSpacePreline}>
        <PortableText value={value.content} />
      </Accordion.Content>
    </Accordion.Item>
  ),
  produktsideButton: ({ value }) => {
    // @ts-ignore
    const Icon = NavIcons?.[value?.iconName];

    const iconProps = Icon
      ? {
          icon: <Icon aria-hidden />,
          iconPosition: value?.iconPosition,
        }
      : {};

    return (
      <Button
        className={styles.button}
        as="a"
        target={value?.targetBlank ? "_blank" : "_self"}
        size={value?.size}
        variant={value?.variant}
        {...iconProps}
        href={value?.url}
      >
        {value?.title}
      </Button>
    );
  },
  produktsideCalculator: DagpengerKalkulator,
  produktsideReadMore: ({ value }) => (
    <ReadMore className={styles.whiteSpacePreline} header={value.title} size={value.size}>
      {value.content}
    </ReadMore>
  ),
  produktsideReadMoreWithRichText: ({ value }) => (
    <ReadMore className={styles.whiteSpacePreline} header={value.title} size={value.size}>
      <PortableText value={value.content} />
    </ReadMore>
  ),
  // TODO: Fjern denne etterhvert
  customComponent: DagpengerKalkulator,
};
