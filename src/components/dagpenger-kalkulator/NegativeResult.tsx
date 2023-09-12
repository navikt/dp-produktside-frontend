import { BodyLong } from "@navikt/ds-react";
import { ReactNode } from "react";
import styles from "./NegativeResult.module.scss";

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
        <h4 className={styles.title}>{title}</h4>
      </div>

      <div className={styles.resultExplanationBox}>
        <BodyLong spacing>{resultExplanationDescription1}</BodyLong>
        <BodyLong>{resultExplanationDescription2}</BodyLong>
      </div>
    </div>
  );
}
