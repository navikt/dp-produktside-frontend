import { InformationSquareIcon } from "@navikt/aksel-icons";
import { BodyShort } from "@navikt/ds-react";
import classnames from "classnames";
import { ReactNode } from "react";
import styles from "./InformationBox.module.scss";

interface InformationBoxProps {
  children: ReactNode;
  className?: string;
  iconTitle?: string;
  variant?: "green" | "orange";
}

export function InformationBox({
  children,
  className,
  iconTitle = "information",
  variant = "green",
}: InformationBoxProps) {
  return (
    <div
      className={classnames(
        styles.container,
        {
          [styles.container__green]: variant === "green",
          [styles.container__orange]: variant === "orange",
        },
        className,
      )}
    >
      <InformationSquareIcon className={styles.icon} title={iconTitle} />
      <BodyShort size="small" className={styles.textContent}>
        {children}
      </BodyShort>
    </div>
  );
}
