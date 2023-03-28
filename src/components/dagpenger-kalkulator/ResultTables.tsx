import { Alert, BodyLong, BodyShort, Heading, Table } from "@navikt/ds-react";
import { useGrunnbelopContext } from "components/grunnbelop-context/grunnbelop-context";
import { toKR } from "./utils";
import styles from "./ResultTables.module.scss";

interface ResultTablesProps {
  grunnlag: number;
  numberOfChildren: number;
}

export function ResultTables({ grunnlag, numberOfChildren }: ResultTablesProps) {
  const { gValue } = useGrunnbelopContext();
  const mellom0og6g = Math.max(0, Math.min(grunnlag, 6 * gValue));
  const resultatMellom0og6G = mellom0og6g * 0.624;
  const dagpengerPer2Week = resultatMellom0og6G / (52 / 2);
  const barnetilleggPer2Week = 35 * 2 * 5 * numberOfChildren;
  const totalPer2Week = dagpengerPer2Week + barnetilleggPer2Week;

  return (
    <div className={styles.container}>
      <Heading size="large" level="4" className={styles.title}>
        Du kan få utbetalt
      </Heading>

      <div className={styles.resultBox}>
        <Heading size="large" level="4" className={styles.resultBox_title}>
          {toKR(totalPer2Week)}
        </Heading>

        <Heading size="small" level="4" className={styles.resultBox_subtitle}>
          hver 14. dag (før skatt)
        </Heading>
      </div>

      <Heading size="medium" level="4" className={styles.resultText_title}>
        Beregningen din
      </Heading>

      <BodyLong>
        Vi regner ut 62,4 prosent av din inntekt opp til 6 G. For deg blir det <b>{toKR(resultatMellom0og6G)}</b> i
        året.
      </BodyLong>

      <dl className={styles.resultDetailList}>
        <BodyShort as="dt">Dagpenger</BodyShort>
        <BodyShort as="dd">{toKR(dagpengerPer2Week)}</BodyShort>

        <BodyShort as="dt">Barnetilegg</BodyShort>
        <BodyShort as="dd">
          {toKR(barnetilleggPer2Week)} <span className={styles.weak}>for {numberOfChildren} barn</span>
        </BodyShort>

        <hr />

        <BodyShort as="dt">Totalt hver 14. dag før skatt</BodyShort>
        <BodyShort as="dd">{toKR(totalPer2Week)}</BodyShort>
      </dl>
    </div>
  );
}
