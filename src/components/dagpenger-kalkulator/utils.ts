import { getYear, addDays, subDays, getMonth, getDate } from "date-fns";

export function toKR(kr: number, locale?: string) {
  if (locale === "en") {
    return Math.round(kr).toLocaleString("nb-NO") + " NOK";
  }

  return Math.round(kr).toLocaleString("nb-NO") + " kr";
}

function finnPaskeSondag(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const date = ((h + l - 7 * m + 114) % 31) + 1;

  const paskeSondag = new Date(`${year}-${month}-${date}`);

  return paskeSondag;
}

function hentFridager(year: number): Set<string> {
  const paskeSondag = finnPaskeSondag(year);

  const dates = [
    // 1. nyttårsdag
    new Date(`${year}-01-01`),
    // Søndag før påskeaften
    subDays(paskeSondag, 7),
    // Skjærtorsdag
    subDays(paskeSondag, 3),
    // Langfredag
    subDays(paskeSondag, 2),
    // 1. påskedag
    paskeSondag,
    addDays(paskeSondag, 1), // 2. påskedag
    // Kristi himmelfart
    addDays(paskeSondag, 39),
    // 1. pinsedag
    addDays(paskeSondag, 49),
    // 2. pinsedag
    addDays(paskeSondag, 50),
    // 1. mai
    new Date(`${year}-05-01`),
    // 17. mai
    new Date(`${year}-05-17`),
    // 1. juledag
    new Date(`${year}-12-25`),
    // 2. juledag
    new Date(`${year}-12-26`),
  ];

  const dateSet = new Set(dates.map((date) => `${getYear(date)}-${getMonth(date)}-${getDate(date)}`));

  return dateSet;
}

function erFridag(date: Date): boolean {
  const dateToCheck = `${getYear(date)}-${getMonth(date)}-${getDate(date)}`;
  return hentFridager(getYear(date)).has(dateToCheck);
}

export function getMonthsToSubtract(dateObject: Date): number {
  const [sunday, monday] = [0, 1];
  const day = dateObject.getDay();
  const date = dateObject.getDate();

  const rules = [
    date <= 5,
    date === 6 && day === sunday,
    date === 6 && day === monday,
    date === 7 && day === monday,
    date <= 7 && erFridag(dateObject),
  ];

  if (rules.includes(true)) {
    return 2;
  }

  return 1;
}

export function getBarneTillegg(date: Date) {
  // Barnetillegg per 2023 er 35 kr.
  // Det skal økes 1 kr per dag per barn fra 1.januar.
  // f.eks 2023 - 1998 = 35
  return getYear(date) - 1988;
}
