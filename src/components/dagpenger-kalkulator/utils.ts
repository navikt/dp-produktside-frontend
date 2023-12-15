import { subMonths } from "date-fns";

export function toKR(kr: number, locale?: string) {
  if (locale === "en") {
    return Math.round(kr).toLocaleString("nb-NO") + " NOK";
  }

  return Math.round(kr).toLocaleString("nb-NO") + " kr";
}

export function getMonthsToSubtract(date: Date): number {
  const [sunday, monday, saturday] = [0, 1, 6];

  const rules = [
    date.getDate() <= 5,
    date.getDate() === 5 && date.getDay() === saturday,
    date.getDate() === 5 && date.getDay() === sunday,
    date.getDate() === 6 && date.getDay() === sunday,
    date.getDate() === 6 && date.getDay() === monday,
    date.getDate() === 7 && date.getDay() === monday,
  ];

  if (rules.includes(true)) {
    return 2;
  }

  return 1;
}
