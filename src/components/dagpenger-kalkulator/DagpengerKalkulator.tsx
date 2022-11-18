import { Alert, BodyShort, Button, Radio, RadioGroup, Table, TextField } from "@navikt/ds-react";
import { useGrunnbelopContext } from "components/grunnbelop-context/grunnbelop-context";
import { useState } from "react";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { useSanityContext } from "components/sanity-context/sanity-context";
import { useDebouncedValue } from "utils/useDebouncedValue";
import styles from "./DagpengerKalkulator.module.scss";
import { toKR } from "./utils";

interface ResultatProps {
  grunnlag?: number;
}

function Resultat({ grunnlag }: ResultatProps) {
  const { G } = useGrunnbelopContext();

  const { getCalculatorTextWithTextId } = useSanityContext();

  if (!grunnlag) {
    return null;
  }

  if (grunnlag < 1.5 * G) {
    return (
      <>
        {/* TODO: Find a way to get the plain text after the blocks are parsed so we can use BodyShort here instead. */}
        <PortableTextContent value={getCalculatorTextWithTextId("forLavtGrunnlag", false)} />
        <Alert variant="info">{getCalculatorTextWithTextId("sendSoknadLikevel")}</Alert>
      </>
    );
  }

  const mellom0og6g = Math.max(0, Math.min(grunnlag, 6 * G));
  const resultatMellom0og6G = mellom0og6g * 0.624;
  const totalt = resultatMellom0og6G;

  return (
    <>
      <Table zebraStripes>
        <Table.Header>
          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="col">Beregningsgrunnlag</Table.HeaderCell>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row shadeOnHover={false}>
            <Table.DataCell>Din inntekt opptil 6G</Table.DataCell>
            <Table.DataCell>{toKR(mellom0og6g)}</Table.DataCell>
          </Table.Row>

          <Table.Row shadeOnHover={false}>
            <Table.DataCell>Antall barn</Table.DataCell>
            <Table.DataCell>0</Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table zebraStripes>
        <Table.Header>
          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="col">Utregning</Table.HeaderCell>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row shadeOnHover={false}>
            <Table.DataCell>62,4 % av inntekt opp til 6G</Table.DataCell>
            <Table.DataCell>{toKR(resultatMellom0og6G)}</Table.DataCell>
          </Table.Row>

          <Table.Row shadeOnHover={false}>
            <Table.DataCell>{getCalculatorTextWithTextId("ukesats")}</Table.DataCell>
            <Table.DataCell>{toKR(totalt / 52)}</Table.DataCell>
          </Table.Row>

          <Table.Row shadeOnHover={false}>
            <Table.DataCell>{getCalculatorTextWithTextId("tilsammen")}</Table.DataCell>
            <Table.DataCell>{toKR(totalt)}</Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>

      <BodyShort>Alle tall er før skatt.</BodyShort>
      <Alert variant="info">{getCalculatorTextWithTextId("kunveiledende")}</Alert>
    </>
  );
}

export function DagpengerKalkulator() {
  const [grunnlag, setGrunnlag] = useState<undefined | number>();
  const debouncedGrunnlag = useDebouncedValue(grunnlag, 300);
  const { getCalculatorTextWithTextId } = useSanityContext();

  // TODO: Logg kalkulator bruk?
  // const [harLoggetBruk, setHarLoggetBruk] = useState(false);
  // useEffect(() => {
  //   if (!harLoggetBruk && grunnlag) {
  //     loggKalkulatorbruk("Uinnlogget vanlig");
  //     setHarLoggetBruk(true);
  //   }
  // }, [grunnlag, harLoggetBruk]);

  return (
    <div className={styles.container}>
      <TextField
        label={getCalculatorTextWithTextId("label")}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        // @ts-ignore
        value={grunnlag || ""}
        onChange={(e) => setGrunnlag(Math.max(0, +e.target.value) || undefined)}
        placeholder="350 000"
        size="medium"
      />

      <RadioGroup legend="Velg din aldersgruppe." onChange={(val: any) => setVal(val)} value={val}>
        <Radio value="true">Ja</Radio>
        <Radio value="false">Nei</Radio>
      </RadioGroup>

      <Button className={styles.button} variant="secondary">
        Beregn hva jeg kan få
      </Button>

      <Resultat grunnlag={debouncedGrunnlag} />
    </div>
  );
}
