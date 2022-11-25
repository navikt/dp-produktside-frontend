import { isValid } from "date-fns";
import format from "date-fns/format";
import nb from "date-fns/locale/nb";

const AppLocale = nb;

type Formats =
  | "P" // 01.01.2022
  | "p" // kl 10:50
  | "Pp" // 01.01.2022 kl 10:50
  | "PPP"; // 01. Januar 2022

export function convertTimestampToDate(timestamp: string) {
  return new Date(timestamp);
}

export function formatLocaleDate(date: Date, formatString: Formats = "P") {
  return format(date, formatString, { locale: AppLocale });
}

export function formatLocaleTime(date: Date) {
  return formatLocaleDate(date, "p");
}

export function formatLocaleDateAndTime(date: Date) {
  return formatLocaleDate(date, "Pp");
}

export function formatLocaleDateWithMonthText(date: Date) {
  return formatLocaleDate(date, "PPP");
}

export function formatTimestampAsLocaleTime(timestamp: string) {
  return formatLocaleTime(convertTimestampToDate(timestamp));
}

export function isValidDate(date?: Date | null): date is Date {
  return isValid(date);
}

export function toISOString(date: Date) {
  return date.toISOString();
}
