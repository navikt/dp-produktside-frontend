import { Accordion, Button, ReadMore } from "@navikt/ds-react";
import { PortableTextTypeComponent } from "@portabletext/react";
import { DagpengerKalkulator } from "components/dagpenger-kalkulator/DagpengerKalkulator";
import Link from "next/link";
import styles from "./PortableTextContent.module.scss";
import * as NavIcons from "@navikt/ds-icons";

export const commonComponents: Record<string, PortableTextTypeComponent<any> | undefined> | undefined = {
  produktsideAccordion: ({ value }) => (
    <Accordion.Item>
      <Accordion.Header>{value.title}</Accordion.Header>
      <Accordion.Content className={styles.whiteSpacePreline}>{value.content}</Accordion.Content>
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
      <Link href={value?.url} passHref>
        <Button
          className={styles.button}
          as="a"
          target={value?.targetBlank ? "_blank" : "_self"}
          size={value?.size}
          variant={value?.variant}
          {...iconProps}
        >
          {value?.title}
        </Button>
      </Link>
    );
  },
  produktsideReadMore: ({ value }) => (
    <ReadMore className={styles.whiteSpacePreline} header={value.title} size={value.size}>
      {value.content}
    </ReadMore>
  ),
  customComponent: DagpengerKalkulator,
};
