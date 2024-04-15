import { BodyShort, Button, Heading, Label, Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { TypedObject } from "@portabletext/types";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toPlainText } from "@portabletext/react";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { commonComponents } from "components/portable-text-content/components";
import { commonMarks } from "components/portable-text-content/marks/marks";
import { useGrunnbelopContext } from "contexts/grunnbelop-context/GrunnbelopContext";
import { useSanityContext } from "contexts/sanity-context/SanityContext";
import {
  CalculatorVariables,
  HasChildrenQuestion,
  IncomePeriodQuestion,
  IncomeQuestion,
  NumberOfChildrenQuestion,
} from "contexts/sanity-context/types/calculator-schema-types";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";
import svgIcon from "../../../public/kalkulator.svg";
import styles from "./DagpengerKalkulator.module.scss";
import { InformationBox } from "./InformationBox";
import { NegativeResult } from "./NegativeResult";
import { PositiveResult } from "./PositiveResult";
import { getBarneTillegg, getMonthsToSubtract, toKR } from "./utils";
import classNames from "classnames";
import { subMonths } from "date-fns";

function convertStringToBoolean(value?: string): boolean {
  return value === "true";
}

interface PortableTextCalculatorProps {
  value: TypedObject | TypedObject[] | string;
}

interface FormValues {
  incomeLast12Months: number;
  incomeLast36MonthsThisYear: number;
  incomeLast36MonthsLastYear: number;
  incomeLast36MonthsTwoYearsAgo: number;
  hasChildren: string;
  numberOfChildren: number;
  incomePeriod: string;
}

interface Period {
  name: "incomeLast36MonthsThisYear" | "incomeLast36MonthsLastYear" | "incomeLast36MonthsTwoYearsAgo";
  from: Date;
  to: Date;
}

export function DagpengerKalkulator() {
  const { locale, pathname } = useRouter();
  const { calculator, getCalculatorTextBlock } = useSanityContext();
  const { gValue, barnetilleggValue } = useGrunnbelopContext();
  const [showResult, setShowResult] = useState<boolean>(false);
  const resultTablesContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>();
  const watchIncomeLast12Months = watch("incomeLast12Months");
  const watchIncomeLast36MonthsThisYear = watch("incomeLast36MonthsThisYear");
  const watchIncomeLast36MonthsLastYear = watch("incomeLast36MonthsLastYear");
  const watchIncomeLast36MonthsTwoYearsAgo = watch("incomeLast36MonthsTwoYearsAgo");
  const watchHasChildren = watch("hasChildren");
  const watchNumberOfChildren = watch("numberOfChildren");
  const watchIncomePeriod = watch("incomePeriod");
  const hasChildren = convertStringToBoolean(watchHasChildren);
  const skjemanavn = "Kalkulator";
  const skjemaId = "produktside-dagpenger-kalkulator";

  const today = new Date();
  const monthsToSubtract = getMonthsToSubtract(new Date());
  const lastMonthWithPay = subMonths(today, monthsToSubtract);

  const incomeLast36MonthsPeriodList: Period[] = [
    { name: "incomeLast36MonthsThisYear", from: subMonths(lastMonthWithPay, 11), to: lastMonthWithPay },
    {
      name: "incomeLast36MonthsLastYear",
      from: subMonths(lastMonthWithPay, 11 + 12),
      to: subMonths(lastMonthWithPay, 12),
    },
    {
      name: "incomeLast36MonthsTwoYearsAgo",
      from: subMonths(lastMonthWithPay, 12 * 2 + 11),
      to: subMonths(lastMonthWithPay, 2 * 12),
    },
  ];

  const incomeLast12MonthsPeriod = { from: subMonths(lastMonthWithPay, 11), to: lastMonthWithPay };

  const childrenOptions = Array.from({ length: 10 }, (_, i) => (
    <option value={i + 1} key={i + 1}>
      {i + 1}
    </option>
  ));

  useEffect(() => {
    if (showResult) {
      setShowResult(false);
    }
  }, [
    watchIncomeLast12Months,
    watchIncomeLast36MonthsThisYear,
    watchIncomeLast36MonthsLastYear,
    watchIncomeLast36MonthsTwoYearsAgo,
    watchHasChildren,
    watchNumberOfChildren,
    watchIncomePeriod,
  ]);

  function onSubmit() {
    setShowResult(true);
    resultTablesContainerRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    logAmplitudeEvent(AnalyticsEvents.FORM_SUBMITTED, {
      skjemanavn,
      skjemaId,
    });
  }

  function wageCap6G(amount: number): number {
    return Math.min(amount, 6 * gValue);
  }

  function getTotaltIncomeLast36Months() {
    return watchIncomeLast36MonthsThisYear + watchIncomeLast36MonthsLastYear + watchIncomeLast36MonthsTwoYearsAgo;
  }

  function getAvrageIncomeLast36MonthsWithWageCap6G() {
    return (
      (wageCap6G(watchIncomeLast36MonthsThisYear) +
        wageCap6G(watchIncomeLast36MonthsLastYear) +
        wageCap6G(watchIncomeLast36MonthsTwoYearsAgo)) /
      3
    );
  }

  const income = watchIncomePeriod === "12" ? watchIncomeLast12Months : getTotaltIncomeLast36Months();
  const incomeForCalculation =
    watchIncomePeriod === "12" ? watchIncomeLast12Months : getAvrageIncomeLast36MonthsWithWageCap6G();
  const minumumIncomeBasedOnPeriodeLength = watchIncomePeriod === "12" ? 1.5 : 3;
  const hasNotEnoughIncome = income < minumumIncomeBasedOnPeriodeLength * gValue;

  const incomeQuestion = calculator.questions.find(({ _type }) => _type === "incomeQuestion") as IncomeQuestion;
  const hasChildrenQuestion = calculator.questions.find(
    ({ _type }) => _type === "hasChildrenQuestion",
  ) as HasChildrenQuestion;
  const numberOfChildrenQuestion = calculator.questions.find(
    ({ _type }) => _type === "numberOfChildrenQuestion",
  ) as NumberOfChildrenQuestion;
  const selectIncomePeriodQuestion = calculator.questions.find(
    ({ _type }) => _type === "incomePeriodQuestion",
  ) as IncomePeriodQuestion;

  const numberOfChildren = watchNumberOfChildren ?? 0;
  const mellom0og6g = Math.max(0, Math.min(incomeForCalculation, 6 * gValue));
  const resultatMellom0og6G = mellom0og6g * 0.624;
  const dagpengerPer2Week = (resultatMellom0og6G / 52) * 2;
  const barnetilleggPer2Week = barnetilleggValue * 2 * 5 * numberOfChildren;
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

  function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };

    return new Date(date).toLocaleDateString(locale, options);
  }

  function getFromAndToDateHtmlLabel(fromDate: Date, toDate: Date) {
    return (
      <>
        <div>{`${toPlainText(getCalculatorTextBlock("from"))} ${formatDate(fromDate)}`}</div>
        <div>{`${toPlainText(getCalculatorTextBlock("to"))} ${formatDate(toDate)}`}</div>
      </>
    );
  }

  function getFromAndToDateScreenReaderLabel(fromDate: Date, toDate: Date) {
    const fromDateText = `${toPlainText(getCalculatorTextBlock("from"))} ${formatDate(fromDate)}`;
    const toDateText = `${toPlainText(getCalculatorTextBlock("to"))} ${formatDate(toDate)}`;
    return `${fromDateText} ${toDateText}`;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles.calculatorFieldset}>
        {pathname !== "/kalkulator" && (
          <legend className={styles.calculatorTitle}>
            <Heading size="medium" level="3">
              {calculator?.title}
            </Heading>
            <Image className={styles.calculatorIcon} src={svgIcon} aria-hidden alt="" />
          </legend>
        )}

        <BodyShort spacing>
          <PortableTextCalculator value={getCalculatorTextBlock("intro")} />
        </BodyShort>

        <div role="img" className={styles.calculatorDecorativeLine} aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 282 2" fill="none">
            <path d="M2 2H280" stroke="#CBCFD5" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>

        <Controller
          defaultValue={"12"}
          control={control}
          name="incomePeriod"
          render={({ field: { onChange, onBlur, name, value, ref }, fieldState: { error } }) => (
            <RadioGroup
              ref={ref}
              name={name}
              className={styles.radioGroup}
              legend={selectIncomePeriodQuestion?.label}
              onChange={onChange}
              onBlur={onBlur}
              error={error?.message}
              value={value}
            >
              <Radio defaultChecked={true} value="12">
                {selectIncomePeriodQuestion?.radioButtonLabel1}
              </Radio>
              <Radio value="36">{selectIncomePeriodQuestion?.radioButtonLabel2}</Radio>
            </RadioGroup>
          )}
        />

        <PortableTextContent value={selectIncomePeriodQuestion?.description1} />

        {watchIncomePeriod === "12" && (
          <div className={styles.lastThirySixMonthPeriodContainer}>
            <BodyShort weight="semibold" spacing>
              {selectIncomePeriodQuestion?.option1title}
            </BodyShort>
            <div className={classNames(styles.inputContainer, styles.singleInputContainer)}>
              <Label size="small" aria-hidden>
                {getFromAndToDateHtmlLabel(incomeLast12MonthsPeriod.from, incomeLast12MonthsPeriod.to)}
              </Label>
              <Controller
                control={control}
                name="incomeLast12Months"
                rules={{
                  required: incomeQuestion?.errorMessage,
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
                    className={classNames(styles.textField, "navds-form-field--custom")}
                    customInput={TextField}
                    error={error?.message}
                    hideLabel
                    label={getFromAndToDateScreenReaderLabel(
                      incomeLast12MonthsPeriod.from,
                      incomeLast12MonthsPeriod.to,
                    )}
                    suffix={locale === "en" ? " NOK" : " kr"}
                    autoComplete="off"
                  />
                )}
              />
            </div>
          </div>
        )}
        {watchIncomePeriod === "36" && (
          <div className={styles.lastThirySixMonthPeriodContainer}>
            <BodyShort weight="semibold" spacing>
              {selectIncomePeriodQuestion?.option2title}
            </BodyShort>
            {incomeLast36MonthsPeriodList.map((period, index) => (
              <div className={classNames(styles.inputContainer, styles.multipleInputContainer)} key={period.name}>
                <Label size="small" aria-hidden>
                  {getFromAndToDateHtmlLabel(period.from, period.to)}
                </Label>
                <Controller
                  key={index}
                  control={control}
                  name={period.name}
                  rules={{
                    required: incomeQuestion?.errorMessage,
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
                      className={classNames(styles.textField, styles.textFeild36, "navds-form-field--custom")}
                      customInput={TextField}
                      error={error?.message}
                      label={getFromAndToDateScreenReaderLabel(period.from, period.to)}
                      hideLabel
                      suffix={locale === "en" ? " NOK" : " kr"}
                      autoComplete="off"
                    />
                  )}
                />
              </div>
            ))}
          </div>
        )}

        <PortableTextContent value={selectIncomePeriodQuestion?.description2} />

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
            {hasNotEnoughIncome ? (
              <>
                <NegativeResult
                  title={<PortableTextCalculator value={getCalculatorTextBlock("negative-result-section-title")} />}
                  description={
                    <PortableTextContent value={getCalculatorTextBlock("negative-result-explanation-description-1")} />
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
