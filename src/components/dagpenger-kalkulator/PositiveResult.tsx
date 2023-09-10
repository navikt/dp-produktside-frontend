import { BodyLong, BodyShort, Heading } from "@navikt/ds-react";
import { ReactNode } from "react";
import styles from "./PositiveResult.module.scss";

interface ResultDescriptionListItem {
  term: ReactNode;
  description: ReactNode;
}

interface ResultTablesProps {
  title: ReactNode;
  resultBoxTitle: ReactNode;
  resultBoxSubtitle: ReactNode;
  resultExplanationTitle: ReactNode;
  resultExplanationDescription: ReactNode;
  resultDescriptionList: ResultDescriptionListItem[];
}

export function PositiveResult({
  title,
  resultBoxTitle,
  resultBoxSubtitle,
  resultExplanationTitle,
  resultExplanationDescription,
  resultDescriptionList,
}: ResultTablesProps) {
  const resultDescriptionListHead = resultDescriptionList.slice(0, -1);
  const resultDescriptionListTail = [...resultDescriptionList].pop();

  return (
    <div className={styles.container}>
      <div className={styles.resultBox}>
        <Heading size="small" level="4" className={styles.title}>
          {title}
        </Heading>

        <strong className={styles.resultBox_title}>{resultBoxTitle}</strong>

        <Heading size="small" as="p" className={styles.resultBox_subtitle}>
          {resultBoxSubtitle}
        </Heading>
      </div>

      <div className={styles.resultExplanationBox}>
        <Heading level="5" size="small" className={styles.resultText_title}>
          {resultExplanationTitle}
        </Heading>

        <BodyLong>{resultExplanationDescription}</BodyLong>

        <dl className={styles.resultDescriptionList}>
          {resultDescriptionListHead?.map(({ term, description }) => (
            // <div className={styles.row}>
            <>
              <BodyShort as="dt">{term}</BodyShort>
              <BodyShort as="dd">{description}</BodyShort>
            </>
            // </div>
          ))}

          <div role="img" className={styles.decorativeHorizontalLine} aria-hidden>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 265 2" fill="none">
              <path d="M0 0.996094H265" stroke="#484848" />
            </svg>
          </div>

          <BodyShort as="dt">{resultDescriptionListTail?.term}</BodyShort>
          <BodyShort as="dd">{resultDescriptionListTail?.description}</BodyShort>
        </dl>
      </div>
    </div>
  );
}
