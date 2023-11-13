import { Button, ErrorMessage, Heading, Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { TypedObject } from "@portabletext/types";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { commonComponents } from "components/portable-text-content/components";
import { commonMarks } from "components/portable-text-content/marks/marks";
import { useGrunnbelopContext } from "contexts/grunnbelop-context/GrunnbelopContext";
import { useSanityContext } from "contexts/sanity-context/SanityContext";
import {
  CalculatorVariables,
  HasChildrenQuestion,
  Income36MonthsQuestion,
  IncomeQuestion,
  NumberOfChildrenQuestion,
} from "contexts/sanity-context/types/calculator-schema-types";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";
import svgIcon from "../../../public/kalkulator.svg";
import styles from "./DagpengerKalkulator.module.scss";
import { InformationBox } from "./InformationBox";
import { NegativeResult } from "./NegativeResult";
import { PositiveResult } from "./PositiveResult";
import { toKR } from "./utils";

function convertStringToBoolean(value?: string): boolean {
  return value === "true";
}

interface PortableTextCalculatorProps {
  value: TypedObject | TypedObject[] | string;
}

interface FormValues {
  income: number;
  income36Months: number;
  hasChildren: string;
  numberOfChildren: number;
}

export function DagpengerKalkulator() {
  const { locale } = useRouter();
  const { calculator, getCalculatorTextBlock } = useSanityContext();
  const { gValue } = useGrunnbelopContext();
  const [showResult, setShowResult] = useState<boolean>(false);
  const resultTablesContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    register,
    control,
    formState: { errors, isSubmitted },
    handleSubmit,
    trigger,
    watch,
  } = useForm<FormValues>();
  const watchIncome = watch("income") ?? 0;
  const watchIncome36Months = watch("income36Months") ?? 0;
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
  }, [watchIncome, watchIncome36Months, watchHasChildren, watchNumberOfChildren]);

  useEffect(() => {
    if (isSubmitted) {
      trigger("income");
      trigger("income36Months");
    }
  }, [watchIncome, watchIncome36Months, isSubmitted]);

  function onSubmit(data: FormValues) {
    console.log(data);
    setShowResult(true);
    resultTablesContainerRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    logAmplitudeEvent(AnalyticsEvents.FORM_SUBMITTED, {
      skjemanavn,
      skjemaId,
    });
  }

  const incomeQuestion = calculator.questions.find(({ _type }) => _type === "incomeQuestion") as IncomeQuestion;
  const income36MonthsQuestion = calculator.questions.find(
    ({ _type }) => _type === "income36MonthsQuestion"
  ) as Income36MonthsQuestion;
  const hasChildrenQuestion = calculator.questions.find(
    ({ _type }) => _type === "hasChildrenQuestion"
  ) as HasChildrenQuestion;
  const numberOfChildrenQuestion = calculator.questions.find(
    ({ _type }) => _type === "numberOfChildrenQuestion"
  ) as NumberOfChildrenQuestion;

  const hasEnoughIncome = watchIncome >= 1.5 * gValue || watchIncome36Months >= 3 * gValue;

  const bestIncome = Math.max(watchIncome, watchIncome36Months / 3);
  const numberOfChildren = watchNumberOfChildren ?? 0;
  const mellom0og6g = Math.max(0, Math.min(bestIncome, 6 * gValue));
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
    } else if (variable === "dagpenger-mellom-0-og-6G" && locale === "nb") {
      return `${Math.round(textToVariableObject[variable]).toLocaleString("nb-NO")} kroner`;
    }

    return toKR(textToVariableObject[variable], locale);
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
          <Image className={styles.calculatorIcon} src={svgIcon} aria-hidden alt="" />
          <Heading size="medium" level="3">
            {calculator?.title}
          </Heading>
        </legend>

        <div role="img" className={styles.calculatorDecorativeLine} aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 282 4" fill="none">
            <path d="M2 2H280" stroke="#CCE1FF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        <Controller
          control={control}
          name="income"
          rules={{
            validate: {
              atLeastOneInputIsFilled: (value, formValues) => {
                return formValues.income || formValues.income36Months ? true : false;
              },
            },
          }}
          render={({ field: { onChange, name, value }, fieldState: { error } }) => (
            <NumericFormat
              name={name}
              value={value}
              maxLength={14}
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
              suffix={locale === "en" ? " NOK" : " kr"}
            />
          )}
        />

        <Controller
          control={control}
          name="income36Months"
          rules={{
            validate: {
              atLeastOneInputIsFilled: (value, formValues) => {
                return formValues.income || formValues.income36Months ? true : false;
              },
            },
          }}
          render={({ field: { onChange, name, value }, fieldState: { error } }) => (
            <NumericFormat
              name={name}
              value={value}
              maxLength={14}
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
              label={income36MonthsQuestion?.label}
              suffix={locale === "en" ? " NOK" : " kr"}
            />
          )}
        />

        {errors?.income && <ErrorMessage>Du må skrive i minst et av feltene over</ErrorMessage>}

        <PortableTextContent value={incomeQuestion?.description} />

        <Controller
          control={control}
          name="hasChildren"
          rules={{ required: hasChildrenQuestion?.errorMessage }}
          render={({ field: { onChange, onBlur, name, ref }, fieldState: { error } }) => (
            <RadioGroup
              ref={ref}
              className={styles.radioGroup}
              name={name}
              legend={hasChildrenQuestion?.label}
              onChange={onChange}
              onBlur={onBlur}
              error={error?.message}
            >
              <Radio value="true">{hasChildrenQuestion?.radioButtonLabel1}</Radio>
              <Radio value="false">{hasChildrenQuestion?.radioButtonLabel2}</Radio>
            </RadioGroup>
          )}
        />

        <PortableTextContent value={hasChildrenQuestion?.description} />

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
        <Button type="submit" className={styles.button} variant="primary">
          <PortableTextCalculator value={getCalculatorTextBlock("submit-button-title")} />
        </Button>
      </fieldset>

      <div ref={resultTablesContainerRef} className={styles.resultTablesContainer}>
        {showResult && (
          <div aria-live="assertive">
            {!hasEnoughIncome ? (
              <>
                <NegativeResult
                  title={<PortableTextCalculator value={getCalculatorTextBlock("negative-result-section-title")} />}
                  resultExplanationDescription1={
                    <PortableTextCalculator
                      value={getCalculatorTextBlock("negative-result-explanation-description-1")}
                    />
                  }
                  resultExplanationDescription2={
                    <PortableTextCalculator
                      value={getCalculatorTextBlock("negative-result-explanation-description-2")}
                    />
                  }
                />

                <InformationBox variant="orange">
                  <PortableTextCalculator value={getCalculatorTextBlock("negative-result-info")} />
                </InformationBox>
              </>
            ) : (
              <>
                <PositiveResult
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

                <InformationBox>
                  <PortableTextCalculator value={getCalculatorTextBlock("positive-result-info")} />
                </InformationBox>
              </>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
