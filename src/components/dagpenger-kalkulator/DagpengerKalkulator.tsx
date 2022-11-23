import { Button, Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./DagpengerKalkulator.module.scss";
import { ResultTables } from "./ResultTables";

function convertStringToBoolean(value?: string): boolean {
  return value === "true";
}

interface FormValues {
  grunnlag: number;
  hasChildren: string;
  numberOfChildren: number;
}

export function DagpengerKalkulator() {
  const [showResult, setShowResult] = useState<boolean>(false);
  const resultTablesContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>();
  const watchGrunnlag = watch("grunnlag");
  const watchHasChildren = watch("hasChildren");
  const watchNumberOfChildren = watch("numberOfChildren");
  const hasChildren = convertStringToBoolean(watchHasChildren);

  const childrenOptions = Array.from({ length: 10 }, (_, i) => (
    <option value={i + 1} key={i + 1}>
      {i + 1}
    </option>
  ));
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
  }, [watchGrunnlag, watchHasChildren, watchNumberOfChildren]);

  function onSubmit() {
    setShowResult(true);
    resultTablesContainerRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register("grunnlag", { required: "Du må skrive inn inntekt" })}
        className={styles.textField}
        label="Hva har du hatt i inntekt de siste 12 månedene?"
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        size="medium"
        error={errors?.grunnlag?.message as string}
      />

      <Controller
        control={control}
        name="hasChildren"
        rules={{ required: "Du må svare på om du forsørger barn under 18 år" }}
        render={({ field: { value, onChange, onBlur, name, ref }, fieldState: { error } }) => (
          <RadioGroup
            ref={ref}
            className={styles.radioGroup}
            name={name}
            legend="Forsørger du barn under 18 år?"
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            error={error?.message}
          >
            <Radio value="true">Ja</Radio>
            <Radio value="false">Nei</Radio>
          </RadioGroup>
        )}
      />

      {hasChildren && (
        <Select
          {...register("numberOfChildren", { required: "Du må velge antall barn", shouldUnregister: true })}
          className={styles.select}
          label="Hvor mange barn under 18 år forsørger du?"
          error={errors?.numberOfChildren?.message as string}
        >
          <option value="">Velg antall barn under 18 år</option>
          {childrenOptions}
        </Select>
      )}

      <Button type="submit" className={styles.button} variant="secondary">
        Beregn hva jeg kan få
      </Button>

      <div ref={resultTablesContainerRef} className={styles.resultTablesContainer}>
        {showResult && <ResultTables grunnlag={watchGrunnlag} numberOfChildren={watchNumberOfChildren ?? 0} />}
      </div>
    </form>
  );
}
