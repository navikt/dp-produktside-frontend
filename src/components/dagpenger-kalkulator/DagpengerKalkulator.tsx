import { Button, Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import styles from "./DagpengerKalkulator.module.scss";
import { ResultTables } from "./ResultTables";

function convertStringToBoolean(value?: string): boolean {
  return value === "true" ? true : false;
}

function convertBooleanToString(value?: boolean) {
  return value ? "true" : "false";
}

export function DagpengerKalkulator() {
  const [grunnlag, setGrunnlag] = useState<number | undefined>();
  const [hasChildren, setHasChildren] = useState<boolean | undefined>(undefined);
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>();
  const childrenOptions = Array.from({ length: 10 }, (_, i) => <option value={i + 1}>{i + 1}</option>);
  const resultRef = useRef<HTMLDivElement | null>(null);

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
        resultRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      <TextField
        className={styles.textField}
        label="Hva har du hatt i inntekt de siste 12 månedene?"
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        value={grunnlag || ""}
        onChange={(e) => {
          setGrunnlag(Math.max(0, +e.target.value) || undefined);
        }}
        placeholder="700 000"
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

      <div ref={resultRef} className={styles.resultTablesContainer}>
        {grunnlag && showResult && <ResultTables grunnlag={grunnlag} numberOfChildren={numberOfChildren} />}
      </div>
    </form>
  );
}
