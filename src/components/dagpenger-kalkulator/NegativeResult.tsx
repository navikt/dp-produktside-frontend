import { BodyLong } from "@navikt/ds-react";
import classnames from "classnames";
import localFont from "next/font/local";
import { ReactNode } from "react";
import styles from "./NegativeResult.module.scss";

const SourceSans3Black = localFont({ src: "./SourceSans3-Black.ttf.woff2" });

interface NegativeResultProps {
  title: ReactNode;
  resultExplanationDescription1: ReactNode;
  resultExplanationDescription2: ReactNode;
}

export function NegativeResult({
  title,
  resultExplanationDescription1,
  resultExplanationDescription2,
}: NegativeResultProps) {
  return (
    <div className={styles.container}>
      <div className={styles.resultBox}>
        <h4 className={classnames(styles.title, SourceSans3Black.className)}>{title}</h4>
      </div>

      <div className={styles.resultExplanationBox}>
        <BodyLong spacing>{resultExplanationDescription1}</BodyLong>
        <BodyLong>{resultExplanationDescription2}</BodyLong>
      </div>
    </div>
  );
}
