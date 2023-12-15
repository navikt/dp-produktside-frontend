import { getMonthsToSubtract } from "../../../components/dagpenger-kalkulator/utils";

describe("5. er på hverdag", () => {
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

describe("5. er på lørdag", () => {
  test("Dagen før 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-08-04"));
    expect(monthsToSubtract).toBe(2);
  });

  test("På 5.", () => {
    const monthsToSubtract = getMonthsToSubtract(new Date("2023-08-05"));
    expect(monthsToSubtract).toBe(2);
  });

  test("Mandag etter 5. hei på deg", () => {
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

describe("5. er på søndag", () => {
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

describe("Nytt år", () => {
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
