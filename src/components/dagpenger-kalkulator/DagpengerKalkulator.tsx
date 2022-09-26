import { Accordion, Alert, TextField } from "@navikt/ds-react";
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

  //const under3G = Math.min(grunnlag, 3 * G);
  const mellom0og6g = Math.max(0, Math.min(grunnlag, 6 * G));
  const over6G = Math.max(0, grunnlag - 6 * G);

  //const resultatUnder3G = under3G * 0.624;
  const resultatMellom0og6G = mellom0og6g * 0.624;
  const totalt = resultatMellom0og6G;

  return (
    <>
      <table className={styles.resultTable}>
        <tbody>
          <tr>
            <td>
              <i>{getCalculatorTextWithTextId("mellom")}</i>
            </td>
            <td>{toKR(mellom0og6g)} x 62.4 %</td>
            <td> {toKR(resultatMellom0og6G)}</td>
          </tr>
          {over6G > 0 && (
            <tr>
              <td>
                <i>Inntekt over 6 G</i>
              </td>
              <td>{toKR(over6G)} x 0 %</td>
              <td>{toKR(0)}</td>
            </tr>
          )}
          <tr>
            <td colSpan={2}>{getCalculatorTextWithTextId("tilsammen")}</td>
            <td>{toKR(totalt)}</td>
          </tr>
          <tr>
            <td colSpan={2}>{getCalculatorTextWithTextId("ukesats")}</td>
            <td> {toKR(totalt / 52)}</td>
          </tr>
        </tbody>
      </table>
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
    <Accordion className={styles.kalkulator}>
      <Accordion.Item open={true}>
        <Accordion.Header>Kalkulator</Accordion.Header>
        <Accordion.Content className={styles.inputWrapper}>
          <TextField
            label={getCalculatorTextWithTextId("label")}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            // @ts-ignore
            value={grunnlag || ""}
            onChange={(e) => setGrunnlag(Math.max(0, +e.target.value) || undefined)}
            placeholder="350 000"
          />
        </Accordion.Content>
        <Resultat grunnlag={debouncedGrunnlag} />
      </Accordion.Item>
    </Accordion>
  );
}
