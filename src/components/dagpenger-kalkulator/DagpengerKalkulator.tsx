import { Accordion, Alert, BodyShort, TextField } from "@navikt/ds-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebouncedValue } from "utils/useDebouncedValue";
import styles from "./DagpengerKalkulator.module.scss";
import { toKR, useGrunnbellop } from "./utils";

interface ResultatProps {
  grunnlag?: number;
}

function Resultat({ grunnlag }: ResultatProps) {
  const { t } = useTranslation("kalkulator");
  const { G, GtoNOK } = useGrunnbellop();

  if (!grunnlag) {
    return null;
  }

  if (grunnlag < 1.5 * G) {
    return (
      <>
        <BodyShort>{t("forLavtGrunnlag", { G: `1.5 G (${GtoNOK(1.5)} kroner)` })} </BodyShort>
        <Alert variant="info">{t("sendSøknadLikvel")}</Alert>
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
              <i>{t("mellom", { over: 0, under: 6 })}</i>
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
            <td colSpan={2}>{t("tilsammen")}</td>
            <td>{toKR(totalt)}</td>
          </tr>
          <tr>
            <td colSpan={2}>{t("ukesats")}</td>
            <td> {toKR(totalt / 52)}</td>
          </tr>
        </tbody>
      </table>
      <Alert variant="info">{t("kunveiledende")}</Alert>
    </>
  );
}

export function DagpengerKalkulator() {
  const [grunnlag, setGrunnlag] = useState<undefined | number>();
  const debouncedGrunnlag = useDebouncedValue(grunnlag, 300);
  // TODO: International Language?
  const { t } = useTranslation("kalkulator");

  // TODO: Logg kalkulator bruk?
  // const [harLoggetBruk, setHarLoggetBruk] = useState(false);
  // useEffect(() => {
  //   if (!harLoggetBruk && grunnlag) {
  //     loggKalkulatorbruk("Uinnlogget vanlig");
  //     setHarLoggetBruk(true);
  //   }
  // }, [grunnlag, harLoggetBruk]);

  return (
    <aside className={styles.kalkulator}>
      <Accordion>
        <Accordion.Item open={true}>
          <Accordion.Header>Kalkulator</Accordion.Header>
          <Accordion.Content className={styles.inputWrapper}>
            <TextField
              label={t("label")}
              type="number"
              // @ts-ignore
              value={grunnlag || ""}
              onChange={(e) => setGrunnlag(Math.max(0, +e.target.value) || undefined)}
              placeholder="350 000"
            />
          </Accordion.Content>
          <Resultat grunnlag={debouncedGrunnlag} />
        </Accordion.Item>
      </Accordion>
    </aside>
  );
}
