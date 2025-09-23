import * as AkselIcons from "@navikt/aksel-icons";
import * as NavIcons from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import { PortableTextTypeComponentProps } from "@portabletext/react";
import styles from "./LinkButton.module.scss";

export function LinkButton({ value }: PortableTextTypeComponentProps<any>) {
  // @ts-ignore
  const Icon = AkselIcons?.[value?.iconName] ?? NavIcons?.[value?.iconName];

  const iconProps = Icon
    ? {
        icon: <Icon aria-hidden />,
        iconPosition: value?.iconPosition,
      }
    : {};

  return (
    <Button
      className={styles.linkButton}
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
}
