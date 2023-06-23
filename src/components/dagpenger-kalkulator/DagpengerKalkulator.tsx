import { Button, Heading, Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useGrunnbelopContext } from "components/grunnbelop-context/grunnbelop-context";
import styles from "./DagpengerKalkulator.module.scss";
import { ResultTables } from "./ResultTables";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";
import { useSanityContext } from "components/sanity-context/sanity-context";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { PortableText } from "@portabletext/react";
import { toKR } from "./utils";
import { commonComponents } from "components/portable-text-content/components";
import { commonMarks } from "components/portable-text-content/marks/marks";
import { TypedObject } from "@portabletext/types";
import {
  CalculatorVariables,
  HasChildrenQuestion,
  IncomeQuestion,
  NumberOfChildrenQuestion,
} from "components/sanity-context/types/calculator-schema-types";

function convertStringToBoolean(value?: string): boolean {
  return value === "true";
}

interface PortableTextCalculatorProps {
  value: TypedObject | TypedObject[] | string;
}

interface FormValues {
  grunnlag: number;
  hasChildren: string;
  numberOfChildren: number;
}

export function DagpengerKalkulator() {
  const { calculator, getCalculatorTextBlock } = useSanityContext();
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

  const incomeQuestion = calculator.questions.find(({ _type }) => _type === "incomeQuestion") as IncomeQuestion;
  const hasChildrenQuestion = calculator.questions.find(
    ({ _type }) => _type === "hasChildrenQuestion"
  ) as HasChildrenQuestion;
  const numberOfChildrenQuestion = calculator.questions.find(
    ({ _type }) => _type === "numberOfChildrenQuestion"
  ) as NumberOfChildrenQuestion;

  const numberOfChildren = watchNumberOfChildren ?? 0;
  const mellom0og6g = Math.max(0, Math.min(watchGrunnlag, 6 * gValue));
  const resultatMellom0og6G = mellom0og6g * 0.624;
  const dagpengerPer2Week = resultatMellom0og6G / (52 / 2);
  const barnetilleggPer2Week = 35 * 2 * 5 * numberOfChildren;
  const totalPer2Week = dagpengerPer2Week + barnetilleggPer2Week;

  function resolveCalculatorVariable(variable: CalculatorVariables): string {
    const textToVariableObject = {
      "antall-barn": numberOfChildren,
      "barnetillegg-per-2-uker": barnetilleggPer2Week,
      "dagpenger-per-2-uker": dagpengerPer2Week,
      "dagpenger-mellom-0-og-6G": resultatMellom0og6G,
      "total-per-2-uker": totalPer2Week,
    };

    if (variable === "antall-barn") {
      return `${textToVariableObject[variable]}`;
    }

    return toKR(textToVariableObject[variable]);
  }

  const PortableTextCalculator = ({ value }: PortableTextCalculatorProps) => {
    if (typeof value == "string") {
      return <>{value}</>;
    }

    return (
      <PortableText
        value={value}
        components={{
          block: { normal: ({ children }) => <>{children}</> },
          marks: commonMarks,
          types: {
            ...commonComponents,
            produktsideCalculatorVariable: ({ value }) => {
              const resolvedVariable = resolveCalculatorVariable(value.variable);
              return value?.strongText ? <strong>{resolvedVariable}</strong> : <>{resolvedVariable}</>;
            },
          },
        }}
      />
    );
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles.calculatorFieldset}>
        <legend className={styles.calculatorTitle}>
          <Heading size="medium" level="3">
            {calculator?.title}
          </Heading>
        </legend>

        <Controller
          control={control}
          name="grunnlag"
          rules={{
            required: incomeQuestion?.errorMessage,
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
                onChange(values.floatValue as number);
              }}
              type="text"
              inputMode="numeric"
              size="medium"
              className={styles.textField}
              customInput={TextField}
              error={error?.message}
              label={incomeQuestion?.label}
              description={<PortableTextContent value={incomeQuestion?.description} />}
            />
          )}
        />

        <Controller
          control={control}
          name="hasChildren"
          rules={{ required: hasChildrenQuestion?.errorMessage }}
          render={({ field: { value, onChange, onBlur, name, ref }, fieldState: { error } }) => (
            <RadioGroup
              ref={ref}
              className={styles.radioGroup}
              description={<PortableTextContent value={hasChildrenQuestion?.description} />}
              name={name}
              legend={hasChildrenQuestion?.label}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={error?.message}
            >
              <Radio value="true">{hasChildrenQuestion?.radioButtonLabel1}</Radio>
              <Radio value="false">{hasChildrenQuestion?.radioButtonLabel2}</Radio>
            </RadioGroup>
          )}
        />

        {hasChildren && (
          <Select
            {...register("numberOfChildren", {
              required: numberOfChildrenQuestion?.errorMessage,
              shouldUnregister: true,
            })}
            className={styles.select}
            label={numberOfChildrenQuestion?.label}
            error={errors?.numberOfChildren?.message as string}
          >
            <option value="">{numberOfChildrenQuestion?.firstOption}</option>
            {childrenOptions}
          </Select>
        )}

        <Button type="submit" className={styles.button} variant="secondary">
          <PortableTextCalculator value={getCalculatorTextBlock("submit-button-title")} />
        </Button>
      </fieldset>

      <div ref={resultTablesContainerRef} className={styles.resultTablesContainer}>
        {showResult && (
          <div aria-live="assertive">
            {hasNotEnoughGrunnlag ? (
              <div className={styles.resultInfoText}>
                <PortableTextContent value={calculator?.bottomContentOnInsufficientIncome} />
              </div>
            ) : (
              <>
                <ResultTables
                  title={<PortableTextCalculator value={getCalculatorTextBlock("result-section-title")} />}
                  resultBoxTitle={<PortableTextCalculator value={getCalculatorTextBlock("result-box-title")} />}
                  resultBoxSubtitle={<PortableTextCalculator value={getCalculatorTextBlock("result-box-subtitle")} />}
                  resultExplanationTitle={
                    <PortableTextCalculator value={getCalculatorTextBlock("result-explanation-title")} />
                  }
                  resultExplanationDescription={
                    <PortableTextCalculator value={getCalculatorTextBlock("result-explanation-description")} />
                  }
                  resultDescriptionList={calculator.calculationList.map(({ term, description }) => ({
                    term,
                    description: <PortableTextCalculator value={description} />,
                  }))}
                />

                <div className={styles.resultInfoText}>
                  <PortableTextContent value={calculator?.bottomContentOnSufficientIncome} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
