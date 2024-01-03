import { BodyLong } from "@navikt/ds-react";
import classnames from "classnames";
import localFont from "next/font/local";
import { ReactNode } from "react";
import styles from "./NegativeResult.module.scss";

const SourceSans3Black = localFont({ src: "./SourceSans3-Black.ttf.woff2" });

interface NegativeResultProps {
  title: ReactNode;
  description: ReactNode;
}

export function NegativeResult({ title, description }: NegativeResultProps) {
  return (
    <div className={styles.container}>
      <div className={styles.resultBox}>
        <h4 className={classnames(styles.title, SourceSans3Black.className)}>{title}</h4>
      </div>

      <div className={styles.resultExplanationBox}>{description}</div>
    </div>
  );
}
