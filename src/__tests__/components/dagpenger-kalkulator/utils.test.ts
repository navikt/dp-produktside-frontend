import { getBarneTillegg, getMonthsToSubtract } from "../../../components/dagpenger-kalkulator/utils";

describe("5. er på hverdag (desember 2023)", () => {
  test("Før 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-12-01"));
    expect(monthsToSubtract).toBe(2);
  });

  test("På 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-12-05"));
    expect(monthsToSubtract).toBe(2);
  });

  test("Etter 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-12-06"));
    expect(monthsToSubtract).toBe(1);
  });
});

describe("5. er på lørdag (august 2023)", () => {
  test("Dagen før 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-08-04"));
    expect(monthsToSubtract).toBe(2);
  });

  test("På 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-08-05"));
    expect(monthsToSubtract).toBe(2);
  });

  test("Mandag etter 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-08-06"));
    expect(monthsToSubtract).toBe(2);
  });

  test("Tirsdag etter 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-08-07"));
    expect(monthsToSubtract).toBe(2);
  });

  test("Tirsdag etter 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-08-08"));
    expect(monthsToSubtract).toBe(1);
  });
});

describe("5. er på søndag (november 2023)", () => {
  test("Dagen før 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-11-04"));
    expect(monthsToSubtract).toBe(2);
  });

  test("På 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-11-05"));
    expect(monthsToSubtract).toBe(2);
  });

  test("Mandag etter 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-11-06"));
    expect(monthsToSubtract).toBe(2);
  });

  test("Tirsdag etter 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-11-7"));
    expect(monthsToSubtract).toBe(1);
  });
});

describe("Nytt år (januar 2024)", () => {
  test("Dagen før 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2024-01-04"));
    expect(monthsToSubtract).toBe(2);
  });

  test("På 5. (fredag)", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2024-01-05"));
    expect(monthsToSubtract).toBe(2);
  });

  test("Lørdag etter 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2024-01-06"));
    expect(monthsToSubtract).toBe(1);
  });
});

describe("Hent barnetillegg", () => {
  test("Barnetillegg for 2023 er 35kr", () => {
    const barnetillegg = getBarneTillegg(new Date("2023-01-01"));
    expect(barnetillegg).toBe(35);
  });

  test("Barnetillegg for 2024 er 35kr", () => {
    const barnetillegg = getBarneTillegg(new Date("2024-01-01"));
    expect(barnetillegg).toBe(36);
  });

  test("Barnetillegg for 2025 er 35kr", () => {
    const barnetillegg = getBarneTillegg(new Date("2025-01-01"));
    expect(barnetillegg).toBe(37);
  });
});
