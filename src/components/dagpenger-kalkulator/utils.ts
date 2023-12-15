import { subMonths } from "date-fns";

export function toKR(kr: number, locale?: string) {
  if (locale === "en") {
    return Math.round(kr).toLocaleString("nb-NO") + " NOK";
  }

  return Math.round(kr).toLocaleString("nb-NO") + " kr";
}

export function getMonthsToSubtract(dateObject: Date): number {
  const [sunday, monday, saturday] = [0, 1, 6];
  const day = dateObject.getDay();
  const date = dateObject.getDate();

  const rules = [
    date <= 5,
    date === 5 && day === saturday,
    date === 5 && day === sunday,
    date === 6 && day === sunday,
    date === 6 && day === monday,
    date === 7 && day === monday,
  ];

  if (rules.includes(true)) {
    return 2;
  }

  return 1;
}
