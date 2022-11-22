import { Button, Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { useSanityContext } from "components/sanity-context/sanity-context";
import { useEffect, useState } from "react";
import styles from "./DagpengerKalkulator.module.scss";
import { ResultTables } from "./ResultTables";

function convertStringToBoolean(value?: string): boolean {
  return value === "true" ? true : false;
}

function convertBooleanToString(value?: boolean) {
  return value ? "true" : "false";
}

export function DagpengerKalkulator() {
  const { getCalculatorTextWithTextId } = useSanityContext();
  const [grunnlag, setGrunnlag] = useState<number | undefined>();
  const [hasChildren, setHasChildren] = useState<boolean | undefined>(undefined);
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>();

  const childrenOptions = Array.from({ length: 10 }, (_, i) => <option value={i + 1}>{i + 1}</option>);

  // TODO: Logg kalkulator bruk?
  // const [harLoggetBruk, setHarLoggetBruk] = useState(false);
  // useEffect(() => {
  //   if (!harLoggetBruk && grunnlag) {
  //     loggKalkulatorbruk("Uinnlogget vanlig");
  //     setHarLoggetBruk(true);
  //   }
  // }, [grunnlag, harLoggetBruk]);

  useEffect(() => {
    if (showResult) {
      setShowResult(false);
    }
  }, [grunnlag, hasChildren, numberOfChildren]);

  return (
    <form
      className={styles.container}
      onSubmit={(event) => {
        event.preventDefault();
        setShowResult(true);
      }}
    >
      <TextField
        className={styles.textField}
        label={getCalculatorTextWithTextId("label")}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={grunnlag || ""}
        onChange={(e) => {
          setGrunnlag(Math.max(0, +e.target.value) || undefined);
        }}
        placeholder="350 000"
        size="medium"
        required
      />

      <RadioGroup
        className={styles.radioGroup}
        legend="Forsørger du barn under 18 år?"
        onChange={(val: any) => {
          if (val === "false") {
            setNumberOfChildren(0);
          }
          setHasChildren(convertStringToBoolean(val));
        }}
        value={convertBooleanToString(hasChildren)}
        required
      >
        <Radio value="true">Ja</Radio>
        <Radio value="false">Nei</Radio>
      </RadioGroup>

      {hasChildren && (
        <Select
          className={styles.select}
          label="Hvor mange barn under 18 år forsørger du?"
          value={numberOfChildren}
          onChange={(event) => setNumberOfChildren(parseInt(event.target.value))}
          required
        >
          <option value="">Velg antall barn under 18 år</option>
          {childrenOptions}
        </Select>
      )}

      <Button type="submit" className={styles.button} variant="secondary">
        Beregn hva jeg kan få
      </Button>

      {grunnlag && showResult && <ResultTables grunnlag={grunnlag} numberOfChildren={numberOfChildren} />}
    </form>
  );
}
