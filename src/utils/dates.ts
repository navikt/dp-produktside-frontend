import format from "date-fns/format";

export function convertTimestampToDate(timestamp: string) {
  return new Date(timestamp);
}

//todo: bruk datefns format
export function formatLocaleDate(date: Date) {
  return date.toLocaleString("nb-NO", { dateStyle: "full" });
}
export function formatLocaleDateAndTime(date: Date) {
  return date.toLocaleString("nb-NO", { dateStyle: "full", timeStyle: "short" });
}

export function formatTimestamp(timestamp: string) {
  return formatLocaleDateAndTime(convertTimestampToDate(timestamp));
}

export function toISOString(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
}
