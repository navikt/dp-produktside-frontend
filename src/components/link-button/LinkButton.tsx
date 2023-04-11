import { Button } from "@navikt/ds-react";
import * as NavIcons from "@navikt/ds-icons";
import { PortableTextTypeComponentProps } from "@portabletext/react";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";
import styles from "./LinkButton.module.scss";

export function LinkButton({ value }: PortableTextTypeComponentProps<any>) {
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
      className={styles.linkButton}
      as="a"
      target={value?.targetBlank ? "_blank" : "_self"}
      size={value?.size}
      variant={value?.variant}
      {...iconProps}
      href={value?.url}
      onClick={() => {
        logAmplitudeEvent(AnalyticsEvents.NAVIGATION, {
          destinasjon: value?.url,
          lenketekst: value?.title,
        });
      }}
    >
      {value?.title}
    </Button>
  );
}
