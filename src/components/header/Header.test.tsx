import React from "react";
import { getByText, render } from "@testing-library/react";
import { Header } from "./Header";

describe("header modul", () => {
  test("greier å rendre modul", () => {
    const { getByText } = render(<Header />);
    expect(getByText(/pengestøtte/i)).toBeInTheDocument();
  });
  test("inneholder ikon", () => {});
  test("inneholder sistoppdatert", () => {});
  test("inneholder tittel", () => {});
  test("inneholder undertittel", () => {});
});
