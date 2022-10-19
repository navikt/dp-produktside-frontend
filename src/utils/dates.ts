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
