import { Accordion, Alert, BodyShort, TextField } from "@navikt/ds-react";
import { useGrunnbelop } from "components/grunnbelop-context/grunnbelop-context";
import { useState } from "react";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { useSanityData } from "components/sanity-context/sanity-context";
import { useDebouncedValue } from "utils/useDebouncedValue";
import styles from "./DagpengerKalkulator.module.scss";
import { getCalculatorTextFromList, toKR } from "./utils";

interface ResultatProps {
  grunnlag?: number;
}

function Resultat({ grunnlag }: ResultatProps) {
  const { G, GtoNOK } = useGrunnbelop();
  const { calculatorTexts } = useSanityData();
  const getCalculatorTextWithTextId = getCalculatorTextFromList(calculatorTexts);

  if (!grunnlag) {
    return null;
  }

  if (grunnlag < 1.5 * G) {
    return (
      <>
        <BodyShort>
          {/* TODO: Strip the html tags generated from PortaleTextContent 
          to get the plain text of parsed blocks. */}
          <PortableTextContent value={getCalculatorTextWithTextId("forLavtGrunnlag", false)} />
        </BodyShort>
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
  const { calculatorTexts } = useSanityData();
  const getCalculatorTextWithTextId = getCalculatorTextFromList(calculatorTexts);

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
