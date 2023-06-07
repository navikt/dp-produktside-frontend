import { Alert, BodyLong, Button, Heading, Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useGrunnbelopContext } from "components/grunnbelop-context/grunnbelop-context";
import { ReadMoreWithRichText } from "components/readmore-with-rich-text/ReadMoreWithRichText";
import styles from "./DagpengerKalkulator.module.scss";
import { ResultTables } from "./ResultTables";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";

function convertStringToBoolean(value?: string): boolean {
  return value === "true";
}

interface FormValues {
  grunnlag: number;
  hasChildren: string;
  numberOfChildren: number;
}

export function DagpengerKalkulator() {
  const { gValue } = useGrunnbelopContext();
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
  const skjemanavn = "Kalkulator";
  const skjemaId = "produktside-dagpenger-kalkulator";

  const childrenOptions = Array.from({ length: 10 }, (_, i) => (
    <option value={i + 1} key={i + 1}>
      {i + 1}
    </option>
  ));

  useEffect(() => {
    if (showResult) {
      setShowResult(false);
    }
  }, [watchGrunnlag, watchHasChildren, watchNumberOfChildren]);

  function onSubmit() {
    setShowResult(true);
    resultTablesContainerRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    logAmplitudeEvent(AnalyticsEvents.FORM_SUBMITTED, {
      skjemanavn,
      skjemaId,
    });
  }

  const hasNotEnoughGrunnlag = watchGrunnlag < 1.5 * gValue;

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles.calculatorFieldset}>
        <legend className={styles.calculatorTitle}>
          <Heading size="medium" level="3">
            Kalkulator
          </Heading>
        </legend>

        <Controller
          control={control}
          name="grunnlag"
          rules={{
            required: "Du må skrive inn inntekt",
          }}
          render={({ field: { onChange, name, value }, fieldState: { error } }) => (
            <NumericFormat
              name={name}
              value={value}
              maxLength={12}
              allowNegative={false}
              decimalScale={0}
              thousandSeparator=" "
              onValueChange={(values) => {
                onChange(values.floatValue);
              }}
              type="text"
              inputMode="numeric"
              size="medium"
              className={styles.textField}
              customInput={TextField}
              error={error?.message}
              label="Hva har du hatt i inntekt de siste 12 månedene, eller i gjennomsnitt de siste 36 månedene?"
              description={
                <ReadMoreWithRichText
                  header="Hvilke inntekter avgjør hvor mye du kan få?"
                  _key={`${skjemaId}-grunnlag`}
                >
                  <BodyLong spacing>Vi bruker disse inntektene for å beregne hvor mye du kan få i dagpenger:</BodyLong>
                  <ul>
                    <li>Arbeidsinntekt</li>
                    <li>Sykepenger</li>
                    <li>Omsorgspenger</li>
                    <li>Pleiepenger</li>
                    <li>Opplæringspenger</li>
                    <li>Svangerskapspenger</li>
                    <li>Foreldrepenger ved fødsel og adopsjon</li>
                    <li>Dagpenger</li>
                  </ul>
                  <br />
                  <BodyLong>Inntekt som selvstendig næringsdrivende regnes ikke som arbeidsinntekt.</BodyLong>
                </ReadMoreWithRichText>
              }
            />
          )}
        />

        <Controller
          control={control}
          name="hasChildren"
          rules={{ required: "Du må svare på om du forsørger barn under 18 år" }}
          render={({ field: { value, onChange, onBlur, name, ref }, fieldState: { error } }) => (
            <RadioGroup
              ref={ref}
              className={styles.radioGroup}
              description={
                <ReadMoreWithRichText header="Hvorfor spør vi om du forsørger barn?" _key={`${skjemaId}-har-barn`}>
                  <BodyLong className={styles.radioGroup_description}>
                    Forsørger du barn under 18 år, får du et barnetillegg på 35 kroner per barn, 5 dager i uken. Dette
                    utgjør 175 kroner i uken per barn. Hvis du forsørger barnet har du rett til barnetillegg selv om
                    barnet ikke bor hos deg.
                  </BodyLong>
                  <BodyLong>
                    Barnet må bo i Norge eller et annet EØS-land. Hvis barnet i løpet av 12 måneder oppholder seg
                    utenfor disse områdene i mer enn 90 dager, vil du ikke lenger få barnetillegg.
                  </BodyLong>
                </ReadMoreWithRichText>
              }
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
            <option value="">Velg antall barn</option>
            {childrenOptions}
          </Select>
        )}

        <Button type="submit" className={styles.button} variant="secondary">
          Beregn hva jeg kan få
        </Button>
      </fieldset>

      <div ref={resultTablesContainerRef} className={styles.resultTablesContainer}>
        {showResult && (
          <div aria-live="assertive">
            {hasNotEnoughGrunnlag ? (
              <Alert variant="info" className={styles.resultInfoText}>
                <Heading spacing size="small" level="4">
                  Du har hatt for lite i inntekt til å ha rett til dagpenger
                </Heading>
                Du må ha hatt en inntekt på minst 177 930 kroner (1,5G) de siste 12 månedene, eller minst 355 860 kroner
                (3G) de siste 36 månedene. Vi anbefaler at du uansett sender en søknad. Da vurderer NAV om du likevel
                har rett.
              </Alert>
            ) : (
              <>
                <ResultTables grunnlag={watchGrunnlag} numberOfChildren={watchNumberOfChildren ?? 0} />

                <Alert variant="info" className={styles.resultInfoText}>
                  Dette er kun en veiledende beregning basert på at du er 100 prosent arbeidsledig. Når du søker
                  vurderer NAV hvor mye du kan ha rett til i dagpenger.
                </Alert>
              </>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
