export function convertTimestampToDate(timestamp: string) {
  return new Date(timestamp);
}

export function formatLocaleDate(date: Date) {
  return date.toLocaleString("nb-NO", { dateStyle: "full", timeStyle: "long" });
}

export function formatTimestamp(timestamp: string) {
  return formatLocaleDate(convertTimestampToDate(timestamp));
}
