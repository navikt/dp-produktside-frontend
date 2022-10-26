import { addDays, Interval, isValid as isValidDate, subDays } from "date-fns";
import format from "date-fns/format";
import isWithinInterval from "date-fns/isWithinInterval";
import nb from "date-fns/locale/nb";

const AppLocale = nb;

export function convertTimestampToDate(timestamp: string) {
  return new Date(timestamp);
}

export function formatLocaleDate(date: Date) {
  return format(date, "P", { locale: AppLocale });
}

export function formatLocaleTime(date: Date) {
  return format(date, "p", { locale: AppLocale });
}

export function formatLocaleDateAndTime(date: Date) {
  return format(date, "Pp", { locale: AppLocale });
}

export function formatTimestamp(timestamp: string) {
  return formatLocaleTime(convertTimestampToDate(timestamp));
}

export function toISOString(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'", { locale: AppLocale });
}

export function dateIsValidAndWithinRange(date?: Date | null, interval?: Interval): date is Date {
  if (!interval?.start || !interval?.end) {
    return false;
  }

  return (
    isValidDate(date) &&
    isWithinInterval(date as Date, { start: subDays(interval?.start, 1), end: addDays(interval?.end, 1) })
  );
}
