import format from "date-fns/format";
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
  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
}
