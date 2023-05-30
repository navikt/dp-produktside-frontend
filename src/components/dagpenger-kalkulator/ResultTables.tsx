import { BodyLong, BodyShort, Heading } from "@navikt/ds-react";
import { ReactNode } from "react";
import styles from "./ResultTables.module.scss";

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

export function ResultTables({
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
      <Heading size="large" level="4" className={styles.title}>
        {title}
      </Heading>

      <div className={styles.resultBox}>
        <Heading size="large" as="p" className={styles.resultBox_title}>
          {resultBoxTitle}
        </Heading>

        <Heading size="small" as="p" className={styles.resultBox_subtitle}>
          {resultBoxSubtitle}
        </Heading>
      </div>

      <Heading size="medium" as="p" className={styles.resultText_title}>
        {resultExplanationTitle}
      </Heading>

      <BodyLong>{resultExplanationDescription}</BodyLong>

      <dl className={styles.resultDescriptionList}>
        {resultDescriptionListHead?.map(({ term, description }) => (
          <>
            <BodyShort as="dt">{term}</BodyShort>
            <BodyShort as="dd">{description}</BodyShort>
          </>
        ))}

        <div className={styles.decorativeHorziontalLine} />

        <BodyShort as="dt">{resultDescriptionListTail?.term}</BodyShort>
        <BodyShort as="dd">{resultDescriptionListTail?.description}</BodyShort>
      </dl>
    </div>
  );
}
