import { TypedObject } from "@portabletext/types";

type PortabelTextBlockType = TypedObject | TypedObject[];

export type CalculatorVariables =
  | "antall-barn"
  | "barnetillegg-per-2-uker"
  | "dagpenger-per-2-uker"
  | "dagpenger-mellom-0-og-6G"
  | "total-per-2-uker";

export interface IncomeQuestion {
  _key: string;
  _type: string;
  description: PortabelTextBlockType;
  errorMessage: string;
  label: string;
}

export interface HasChildrenQuestion {
  _key: string;
  _type: string;
  description: PortabelTextBlockType;
  errorMessage: string;
  label: string;
  radioButtonLabel1: string;
  radioButtonLabel2: string;
}

export interface NumberOfChildrenQuestion {
  _key: string;
  _type: string;
  errorMessage: string;
  firstOption: string;
  label: string;
}

interface CalculationListItem {
  term: string;
  description: PortabelTextBlockType;
}

interface CalculatorTextElement {
  textId: string;
  textValue: PortabelTextBlockType;
}

export interface CalculatorSchema {
  bottomContentOnInsufficientIncome: PortabelTextBlockType;
  bottomContentOnSufficientIncome: PortabelTextBlockType;
  calculationList: CalculationListItem[];
  title: string;
  questions: [IncomeQuestion, HasChildrenQuestion, NumberOfChildrenQuestion];
  texts: CalculatorTextElement[];
}
