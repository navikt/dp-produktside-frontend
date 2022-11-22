import { Alert, Table, BodyShort } from "@navikt/ds-react";
import { useGrunnbelopContext } from "components/grunnbelop-context/grunnbelop-context";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { useSanityContext } from "components/sanity-context/sanity-context";
import { toKR } from "./utils";
import styles from "./ResultTables.module.scss";

interface ResultTablesProps {
  grunnlag: number;
  numberOfChildren: number;
}

export function ResultTables({ grunnlag, numberOfChildren }: ResultTablesProps) {
  const { gValue } = useGrunnbelopContext();
  const { getCalculatorTextWithTextId } = useSanityContext();

  if (grunnlag < 1.5 * gValue) {
    return (
      <>
        {/* TODO: Find a way to get the plain text after the blocks are parsed so we can use BodyShort here instead. */}
        <PortableTextContent value={getCalculatorTextWithTextId("forLavtGrunnlag", false)} />
        <Alert variant="info">{getCalculatorTextWithTextId("sendSoknadLikevel")}</Alert>
      </>
    );
  }

  const mellom0og6g = Math.max(0, Math.min(grunnlag, 6 * gValue));
  const resultatMellom0og6G = mellom0og6g * 0.624;
  const barnetilleggPerWeek = 17 * 5 * numberOfChildren;
  const totalt = resultatMellom0og6G + barnetilleggPerWeek;

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
              {getCalculatorTextWithTextId("ukesats")}
            </Table.HeaderCell>
            <Table.DataCell align="right">{toKR(totalt / 52)}</Table.DataCell>
          </Table.Row>

          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="row" align="left">
              Barnetillegg per uke
            </Table.HeaderCell>
            <Table.DataCell align="right">{toKR(barnetilleggPerWeek)}</Table.DataCell>
          </Table.Row>

          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="row" align="left">
              {getCalculatorTextWithTextId("tilsammen")}
            </Table.HeaderCell>
            <Table.DataCell align="right">{toKR(totalt)}</Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>

      <BodyShort className={styles.infoText}>Alle tall er før skatt.</BodyShort>

      <Alert className={styles.alertInfoText} variant="info">
        {getCalculatorTextWithTextId("kunveiledende")}
      </Alert>
    </>
  );
}
