import { Alert, BodyShort, Table } from "@navikt/ds-react";
import { LegacyRef } from "react";
import { useGrunnbelopContext } from "components/grunnbelop-context/grunnbelop-context";
import { toKR } from "./utils";
import styles from "./ResultTables.module.scss";
interface ResultTablesProps {
  grunnlag: number;
  numberOfChildren: number;
}

export function ResultTables({ grunnlag, numberOfChildren }: ResultTablesProps) {
  const { gValue } = useGrunnbelopContext();

  if (grunnlag < 1.5 * gValue) {
    return (
      <Alert className={styles.alertInfoText} variant="info">
        Inntekt under 1.5 G (167 216 kr) gir ikke rett til dagpenger. Vi anbefaler likevel at du sender søknad så kan
        NAV vurdere din rett til dagpenger.
      </Alert>
    );
  }

  const mellom0og6g = Math.max(0, Math.min(grunnlag, 6 * gValue));
  const resultatMellom0og6G = mellom0og6g * 0.624;
  const dagpengerPerWeek = resultatMellom0og6G / 52;
  const barnetilleggPerWeek = 17 * 5 * numberOfChildren;
  const totalPerWeek = dagpengerPerWeek + barnetilleggPerWeek;

  return (
    <>
      <Table zebraStripes className={styles.beregningsgrunnlagTable}>
        <Table.Header>
          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="col" align="left">
              Beregningsgrunnlag
            </Table.HeaderCell>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="row" align="left">
              Din inntekt opptil 6G
            </Table.HeaderCell>
            <Table.DataCell align="right">{toKR(mellom0og6g)}</Table.DataCell>
          </Table.Row>

          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="row" align="left">
              Antall barn
            </Table.HeaderCell>
            <Table.DataCell align="right">{numberOfChildren}</Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table zebraStripes className={styles.utregningTable}>
        <Table.Header>
          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="col" align="left">
              Utregning
            </Table.HeaderCell>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="row" align="left">
              62,4 % av inntekt opp til 6G
            </Table.HeaderCell>
            <Table.DataCell align="right">{toKR(resultatMellom0og6G)}</Table.DataCell>
          </Table.Row>

          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="row" align="left">
              {`${toKR(resultatMellom0og6G)}/52 uker`}
            </Table.HeaderCell>
            <Table.DataCell align="right">{toKR(dagpengerPerWeek)}</Table.DataCell>
          </Table.Row>

          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="row" align="left">
              Barnetillegg per uke
            </Table.HeaderCell>
            <Table.DataCell align="right">{toKR(barnetilleggPerWeek)}</Table.DataCell>
          </Table.Row>

          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="row" align="left">
              Beregnet utbetaling per uke
            </Table.HeaderCell>
            <Table.DataCell align="right">{toKR(totalPerWeek)}</Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>

      <BodyShort className={styles.infoText}>Alle tall er før skatt.</BodyShort>

      <Alert className={styles.alertInfoText} variant="info">
        Dette er kun en veiledende utregning. Når du søker vurderer NAV hvor mye du kan ha rett til i dagpenger.
      </Alert>
    </>
  );
}
